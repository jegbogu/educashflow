import { useMemo, useState } from "react";
import { quizConfig } from "../../config/quizConfig ";
import { Play } from "lucide-react";

/**
 * Input shape (from your GSSP concat or grouped build):
 * quiz: Array<{
 *   subcategory: string,
 *   quizzes: Array<{
 *     id: string,
 *     category: string,
 *     question: string,
 *     options: string[],
 *     correctAnswer: number,
 *     level: "Beginner" | "Intermediate" | "Advanced" | string,
 *     createdAt: string
 *   }>
 * }>
 */

export default function Playingquiz({ quiz }) {
  const groups = Array.isArray(quiz) ? quiz : [];
  const ITEMS_PER_PAGE = 20;

  const safe = (v) => (typeof v === "string" ? v : "");
  const lc = (v) => safe(v).toLowerCase();
  const unique = (arr) => Array.from(new Set(arr.filter(Boolean)));

  const perQSeconds = Number(quizConfig?.perQuestionTime ?? 60);
  const ptsPerQ = Number(quizConfig?.pointsPerQuestion ?? 5);

  // 1) Flatten into rows: one row per (subcategory, level)
  //    Each row summarizes quizzes of that subcategory at a specific level.
  const rows = useMemo(() => {
    const out = [];
    for (const g of groups) {
      const sub = safe(g.subcategory);
      const byLevel = new Map();
      for (const q of g.quizzes || []) {
        const lvl = safe(q.level);
        if (!byLevel.has(lvl)) byLevel.set(lvl, []);
        byLevel.get(lvl).push(q);
      }
      for (const [lvl, list] of byLevel.entries()) {
        const categories = unique(list.map((z) => safe(z.category)));
        const count = list.length;
        out.push({
          subcategory: sub,
          level: lvl,
          categories,
          count,
          minutes: (count * perQSeconds) / 60,
          points: count * ptsPerQ,
        });
      }
    }
    return out;
  }, [groups, perQSeconds, ptsPerQ]);

  // 2) Build dropdown options from rows
  const allSubcategories = useMemo(
    () => unique(rows.map((r) => r.subcategory)).sort(),
    [rows]
  );
  const allCategories = useMemo(
    () => unique(rows.flatMap((r) => r.categories)).sort(),
    [rows]
  );
  const allLevels = useMemo(() => unique(rows.map((r) => r.level)), [rows]);

  // 3) UI state
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  // 4) Filter rows
  const filtered = useMemo(() => {
    const q = lc(search);
    return rows.filter((r) => {
      const matchesSearch =
        lc(r.subcategory).includes(q) ||
        r.categories.some((c) => lc(c).includes(q));

      const matchesSub = subCategoryFilter
        ? r.subcategory === subCategoryFilter
        : true;
      const matchesCat = categoryFilter
        ? r.categories.includes(categoryFilter)
        : true;
      const matchesLvl = levelFilter ? r.level === levelFilter : true;

      return matchesSearch && matchesSub && matchesCat && matchesLvl;
    });
  }, [rows, search, categoryFilter, subCategoryFilter, levelFilter]);

  // 5) Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageRows = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > maxVisible + 1) pages.push("…");
      const s = Math.max(2, currentPage - 1);
      const e = Math.min(totalPages - 1, currentPage + 1);
      for (let i = s; i <= e; i++) pages.push(i);
      if (currentPage < totalPages - maxVisible) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  };

  const levelBadgeClass = (lvl) =>
    lvl === "Beginner"
      ? "bg-green-100 text-green-800"
      : lvl === "Intermediate"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-5 mt-5">
        <input
          type="text"
          placeholder="Search by category or subcategory"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-md px-3 py-2 w-64"
        />

        <select
          value={subCategoryFilter}
          onChange={(e) => {
            setSubCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-md px-3 py-2"
        >
          <option value="">All Subcategories</option>
          {allSubcategories.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-md px-3 py-2"
        >
          <option value="">All Categories</option>
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={levelFilter}
          onChange={(e) => {
            setLevelFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-md px-3 py-2"
        >
          <option value="">All Levels</option>
          {allLevels.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No quizzes match your filters.
        </div>
      )}

      {/* Cards: one per (subcategory, level) */}
      <div>
        {pageRows.sort().map((r, i) => (
          <div
            key={`${r.subcategory}__${r.level}__${i}`}
            className="border border-gray-200 rounded-md p-5 mt-5 shadow-sm"
          >
            <div className="flex justify-between items-center max-sm:flex-col max-sm:items-start gap-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{r.subcategory}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded ${levelBadgeClass(
                      r.level
                    )}`}
                  >
                    {r.level}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <img
                      src="brain-illustration-1-svgrepo-com.svg"
                      className="w-4 h-4"
                      alt=""
                    />
                    <span>{r.categories.join(", ") || "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src="time-past-svgrepo-com.svg"
                      className="w-4 h-4"
                      alt=""
                    />
                    <span>{r.minutes.toFixed(2)} mins</span>
                  </div>
                  <span>{r.count} questions</span>
                  <span className="font-medium">+{r.points} pts</span>
                </div>
              </div>

              <button className="px-4 py-2 gap-2 flex rounded-md bg-black text-white hover:opacity-90">
                <Play /> Start
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Prev
          </button>

          {getPageNumbers().map((p, idx) =>
            p === "…" ? (
              <span key={`ellipsis-${idx}`} className="px-3 py-1 text-gray-500">
                …
              </span>
            ) : (
              <button
                key={`page-${p}`}
                onClick={() => handlePageChange(p)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === p
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
