"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { quizConfig } from "@/config/quizConfig";
import { Play } from "lucide-react";

export default function Playingquiz({ quiz }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const groups = Array.isArray(quiz) ? quiz : [];
  const ITEMS_PER_PAGE = 20;

  const safe = (v) => (typeof v === "string" ? v : "");
  const lc = (v) => safe(v).toLowerCase();
  const unique = (arr) => Array.from(new Set(arr.filter(Boolean)));

  const perQSeconds = Number(quizConfig?.perQuestionTime ?? 60);
  const ptsPerQ = Number(quizConfig?.pointsPerQuestion ?? 5);

  //setting points
  let points;
  if (session?.user?.membership === "Free plan") {
    points = quizConfig.constantNumberofQuestions * quizConfig.perQuestionPoint;
  }
  if (session?.user?.membership === "Basic Pack") {
    points =
      quizConfig.constantNumberofQuestions * quizConfig.basicPointPerQuestion;
  }
  if (session?.user?.membership === "Premium Pack") {
    points =
      quizConfig.constantNumberofQuestions * quizConfig.premiumPointPerQuestion;
  }
  if (session?.user?.membership === "Pro Pack") {
    points =
      quizConfig.constantNumberofQuestions * quizConfig.proPointPerQuestion;
  }

  // 1) Flatten to rows = one card per (subcategory, level)
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

  // 2) Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

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

  // 3) Stable sort for display: subcategory A→Z, then level order (Beginner, Intermediate, Advanced)
  const levelOrder = { Beginner: 0, Intermediate: 1, Advanced: 2 };
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const subCmp = safe(a.subcategory).localeCompare(safe(b.subcategory));
      if (subCmp !== 0) return subCmp;
      const la = levelOrder[a.level] ?? 99;
      const lb = levelOrder[b.level] ?? 99;
      return la - lb;
    });
  }, [filtered]);

  // 4) Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageRows = sorted.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  // 5) Start button: track loading for THIS row only
  const [loadingKey, setLoadingKey] = useState(null);

  async function startFnc(row) {
    // Require auth
    if (status !== "authenticated" || !session?.user?._id) {
      router.push("/login");
      return;
    }

    const key = `${row.subcategory}__${row.level}`;
    setLoadingKey(key);

    // safer id
    const rid = `${Date.now()}${Math.floor(Math.random() * 1e9)}`;

    // keep payload short & predictable for route param
    const firstCategory = row.categories[0] || "General";
    const uniqueID = `${rid}-${row.subcategory}-${firstCategory}-${row.level}-${session.user._id}`;
    



    // navigate
    router.push(`/playingQuiz/${encodeURIComponent(uniqueID)}`);
  }

  // 6) Dropdown option lists
  const allSubcategories = useMemo(
    () => unique(rows.map((r) => r.subcategory)).sort(),
    [rows]
  );
  const allCategories = useMemo(
    () => unique(rows.flatMap((r) => r.categories)).sort(),
    [rows]
  );
  const allLevels = useMemo(() => unique(rows.map((r) => r.level)), [rows]);

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
      {sorted.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No quizzes match your filters.
        </div>
      )}

      {/* Cards: one per (subcategory, level) */}
      <div>
        {pageRows.map((r, i) => {
          const key = `${r.subcategory}__${r.level}`;
          const isLoading = loadingKey === key;
          return (
            <div
              key={`${key}__${i}`}
              className="border border-gray-200 rounded-md p-5 mt-5 shadow-sm hover:bg-gray-50"
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
                      <span>{r.minutes.toFixed(0)} mins</span>
                    </div>
                    <span>
                      {quizConfig.constantNumberofQuestions} questions
                    </span>
                    <span className="font-medium">
                      +{" "}
                      {points +
                        {
                          [quizConfig.levels[0]]:
                            quizConfig.extraPointsBeginner *
                            quizConfig.perQuestionPoint,
                          [quizConfig.levels[1]]:
                            quizConfig.extraPointsIntermediate *
                            quizConfig.perQuestionPoint,
                          [quizConfig.levels[2]]:
                            quizConfig.extraPointsAdvanced *
                            quizConfig.perQuestionPoint,
                        }[r.level]}{" "}
                      pts
                    </span>
                  </div>
                </div>

                <button
                  aria-label="Start quiz"
                  disabled={isLoading}
                  onClick={() => startFnc(r)}
                  className={`px-4 py-2 gap-2 flex rounded-md text-white ${
                    isLoading
                      ? "bg-black/70 cursor-not-allowed"
                      : "bg-black hover:opacity-90"
                  }`}
                >
                  {isLoading ? (
                    <span className="border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Start
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {sorted.length > 0 && totalPages > 1 && (
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
