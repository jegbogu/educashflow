import {
  Filter,
  Search,
  Upload,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import styles from "@/styles/builder.module.css";
import DashboardLayout from "@/components/admin/layout";
import { useState } from "react";
import { quizConfig } from "@/config/quizConfig";
import CreateQuizModal from "@/components/admin/createNewQuiz";
import Pagination from "@/components/utils/pagination";

const initialQuestions = [
  {
    id: "001",
    question: "Who is the richest man in the World?",
    category: "Current Affairs",
    subcategory: "Economy",
    level: "Intermediate",
    completed: false,
    timeLimit: quizConfig.perQuestionTime,
    points:
      quizConfig.basicPointPerQuestion + quizConfig.extraPointsIntermediate,
  },
  {
    id: "002",
    question: "A child of a lion is called?",
    category: "Science",
    subcategory: "Biology",
    level: "Beginner",
    completed: true,
    timeLimit: quizConfig.perQuestionTime,
    points: quizConfig.basicPointPerQuestion + quizConfig.extraPointsBeginner,
  },
  {
    id: "003",
    question: "Who painted the Mona Lisa?",
    category: "History",
    subcategory: "Modern",
    level: "Intermediate",
    completed: false,
    timeLimit: quizConfig.perQuestionTime,
    points:
      quizConfig.basicPointPerQuestion + quizConfig.extraPointsIntermediate,
  },
  {
    id: "004",
    question: "What gas do humans exhale the most?",
    category: "Science",
    subcategory: "Biology",
    level: "Beginner",
    completed: false,
    timeLimit: quizConfig.perQuestionTime,
    points: quizConfig.basicPointPerQuestion + quizConfig.extraPointsBeginner,
  },
  {
    id: "005",
    question: "What is the formula for kinetic energy?",
    category: "Science",
    subcategory: "Physics",
    level: "Advanced",
    completed: false,
    timeLimit: quizConfig.perQuestionTime,
    points: quizConfig.basicPointPerQuestion + quizConfig.extraPointsAdvanced,
  },
  {
    id: "006",
    question: "What is the SI unit of force?",
    category: "Science",
    subcategory: "Physics",
    level: "Beginner",
    completed: false,
    timeLimit: quizConfig.perQuestionTime,
    points: quizConfig.basicPointPerQuestion + quizConfig.extraPointsBeginner,
  },
  {
    id: "007",
    question: "Who discovered penicillin?",
    category: "Science",
    subcategory: "Biology",
    level: "Intermediate",
    completed: false,
    timeLimit: quizConfig.perQuestionTime,
    points:
      quizConfig.basicPointPerQuestion + quizConfig.extraPointsIntermediate,
  },
  {
    id: "008",
    question: 'Who was known as the "Iron Lady"?',
    category: "History",
    subcategory: "Modern",
    level: "Intermediate",
    completed: false,
    timeLimit: quizConfig.perQuestionTime,
    points:
      quizConfig.basicPointPerQuestion + quizConfig.extraPointsIntermediate,
  },
  {
    id: "009",
    question: "In what year did World War II end?",
    category: "History",
    subcategory: "World Wars",
    level: "Advanced",
    completed: false,
    timeLimit: quizConfig.perQuestionTime,
    points: quizConfig.basicPointPerQuestion + quizConfig.extraPointsAdvanced,
  },
];

export default function QuizBuilderPage() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [filters, setFilters] = useState({
    month: "",
    year: "",
    status: "",
    level: "",
    category: "",
    subcategory: "",
  });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const itemsPerPage = 10;
  const [modalQuiz, setModalQuiz] = useState(false);

  // Filtering
  const filteredQuestions = questions
    .filter((q) => q.question.toLowerCase().includes(search.toLowerCase()))
    .filter((q) => (filters.category ? q.category === filters.category : true))
    .filter((q) =>
      filters.subcategory ? q.subcategory === filters.subcategory : true
    )
    .filter((q) => (filters.level ? q.level === filters.level : true));

  // Selection logic
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };
  const selectAll = () => setSelected(filteredQuestions.map((u) => u.id));
  const deselectAll = () => setSelected([]);
  const allSelected =
    filteredQuestions.length > 0 &&
    selected.length === filteredQuestions.length;

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(
    start,
    start + itemsPerPage
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout>
      <div className={styles.quizBuilderPage}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Quiz Builder</h1>
            <p className={styles.pageDescription}>
              Create and manage your quizzes
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.btnSecondary}
              onClick={() => setModalQuiz(true)}
            >
              <Upload className={styles.btnIcon} />
              Bulk Import
            </button>
            <button className={styles.btnPrimary}>
              <Plus className={styles.btnIcon} />
              Create New Quiz
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filtersSection}>
          <div className={styles.filtersLeft}>
            <div className={styles.filterGroup}>
              <Filter className={styles.filterIcon} />
              <span className={styles.filterLabel}>Filters:</span>
            </div>

            <div className={styles.searchFilter}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search"
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.filtersRight}>
            <select
              className={styles.filterSelect}
              value={filters.level}
              onChange={(e) =>
                setFilters({ ...filters, level: e.target.value })
              }
            >
              <option value="">Difficulty</option>
              {quizConfig.levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>

            <select
              className={styles.filterSelect}
              value={filters.category}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  category: e.target.value,
                  subcategory: "",
                })
              }
            >
              <option value="">Category</option>
              {quizConfig.categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            {filters.category && (
              <select
                className={styles.filterSelect}
                value={filters.subcategory || ""}
                onChange={(e) =>
                  setFilters({ ...filters, subcategory: e.target.value })
                }
              >
                <option value="">Subcategory</option>
                {quizConfig.categories
                  .find((cat) => cat.name === filters.category)
                  ?.subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
              </select>
            )}
          </div>
        </div>

        {/* Additional Filters */}
        {/* <div className={styles.additionalFilters}>
          
        </div> */}
        {modalQuiz && <CreateQuizModal onClose={() => setModalQuiz(false)} />}

        {/* Questions Table */}
        <div className={styles.questionsSection}>
          <h2 className={styles.sectionTitle}>Existing Questions</h2>

          <div className={styles.questionsTable}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableTh}>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) =>
                        e.target.checked ? selectAll() : deselectAll()
                      }
                    />
                  </th>
                  <th className={styles.tableTh}>Questions</th>
                  <th className={styles.tableTh}>Category</th>
                  <th className={styles.tableTh}>Subcategory</th>
                  <th className={styles.tableTh}>Actions</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {paginatedQuestions.map((question) => (
                  <tr key={question.id} className={styles.tableRow}>
                    <td className={styles.tableTd}>
                      <input
                        type="checkbox"
                        checked={selected.includes(question.id)}
                        onChange={() => toggleSelect(question.id)}
                      />
                    </td>
                    <td className={styles.tableTd}>
                      <div className={styles.questionCell}>
                        <span className={styles.questionText}>
                          {question.question}
                        </span>
                      </div>
                    </td>
                    <td className={styles.tableTd}>{question.category}</td>
                    <td className={styles.tableTd}>{question.subcategory}</td>
                    <td className={styles.tableTd}>
                      <div className={styles.actionButtons}>
                        <button
                          className={`${styles.actionBtn} ${styles.editBtn}`}
                        >
                          <Edit className={styles.actionIcon} />
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        >
                          <Trash2 className={styles.actionIcon} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={styles.paginationSection}>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
