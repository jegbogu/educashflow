import { Filter, Search, Upload, Plus, Edit, Trash2 } from "lucide-react";
import styles from "@/styles/builder.module.css";
import DashboardLayout from "@/components/admin/layout";
import { useState } from "react";
import { quizConfig } from "@/config/quizConfig";
import CreateQuizModal from "@/components/admin/createNewQuiz";
 
import Pagination from "@/components/utils/pagination";
import QuestionModal from "@/components/admin/quizModal";
import DeleteItemModal from "@/components/admin/deleteuestion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
 import { useSession } from "next-auth/react";
 import { useEffect } from "react";
import connectDB from "@/utils/connectmongo";
import Quiz from "@/model/quizCreation";
import Spinner from "@/components/icons/spinner";
 

 

export default function QuizBuilderPage(props) {
   
  const usersData = props.usersData
   const { data: session, status } = useSession();
    const userData = session?.user;
  const [questions, setQuestions] = useState(props.quizzes.reverse());
  const router = useRouter()
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
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);





  // Handle redirects in useEffect
    useEffect(() => {
      if (status === "authenticated" && session?.user.role !== "admin") {
        router.replace("/adminlogin");
      } else if (status === "unauthenticated") {
        router.replace("/adminlogin");
      }
    }, [status, session, router]);
  
    // Show loading state while session is being checked
    if (status === "loading") {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-3xl font-bold">
            <Spinner className="w-12 h-12" />
          </div>
        </div>
      );
    }
  
    // If user is not allowed, return null to prevent flashing content
    if (status !== "authenticated" || session?.user.role !== "admin") {
      return null;
    }

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




  const selectAll = () => setSelected(filteredQuestions.map((u) => u._id));
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
console.log("paginatedQuestions", paginatedQuestions)
  // // Open for adding new
  // const handleAddQuestion = () => {
  //   setSelectedQuestion(null);
  //   setShowModal(true);
  // };

  // Open for editing
  const handleEditQuestion = (question) => {
    
    setSelectedQuestion(question);
    setShowModal(true);
  };

  const handleDeleteQuestion = (question) => {
    setShowDeleteModal(true);
    setSelectedQuestion(question);
  };

  // Save or update question
  const handleSaveQuestion = (data) => {
    
    setShowModal(false);
  };

  // Delete
  const deleteQuestion = async (id) => {
    
    try {
      const response = await fetch(`/api/deleteQuestion/${id}`,{
      method:'DELETE',
       
    });
    const res = await response.json()
    if(!response.ok){
      alert(res.message || "Something went wrong")
    }else{
      alert(res.message)
      router.reload("/adminbuilder")
    }

    setShowDeleteModal(false);
      
    } catch (error) {
      console.error(error)
    }
    

  };

  // Bulk delete
  const bulkDelete = async () => {
    
const bulkDeleteItems = {
  data: selected
}

 
  try {
      const response = await fetch('/api/deleteItems',{
      method:'post',
      body: JSON.stringify(bulkDeleteItems),
      headers:{
        "Content-Type":"application/json"
      }
       
    });
    const res = await response.json()
    if(!response.ok){
      alert(res.message || "Something went wrong")
    }else{
      alert(res.message)
      router.reload("/adminbuilder")
    }

    setShowDeleteModal(false);
      
    } catch (error) {
      console.error(error)
    }

   
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
            {selected.length > 0 && (
              <div className={styles.bulkActions}>
                <button
                  onClick={bulkDelete}
                  className={cn(styles.bulkBtn, styles.bulkBtnDelete)}
                >
                  Delete Selected
                </button>
                <button
                  onClick={deselectAll}
                  className={cn(styles.bulkBtn, styles.bulkBtnClear)}
                >
                  Clear Selection
                </button>
              </div>
            )}
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
          <div className="border p-5 rounded-xl">
            <span className="font-bold text-orange-700">Current Total Question: </span><span>{filteredQuestions.length}</span>
          </div>
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
                  <th className={styles.tableTh}>Created Date</th>
                  <th className={styles.tableTh}>Questions</th>
                  <th className={styles.tableTh}>Category</th>
                  <th className={styles.tableTh}>Subcategory</th>
                  <th className={styles.tableTh}>Actions</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {paginatedQuestions.reverse().map((question) => (
                  <tr key={question.id} className={styles.tableRow}>

                    <td className={styles.tableTd}>
                      <input
                        type="checkbox"
                        checked={selected.includes(question._id)}
                        onChange={() => toggleSelect(question._id)}
                      />
                    </td>
                    <td className={styles.tableTd}>{question.createdAt}</td>
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
                          onClick={() => handleEditQuestion(question)}
                          className={`${styles.actionBtn} ${styles.editBtn}`}
                        >
                          <Edit className={styles.actionIcon} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question)}
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
      {showModal && (
        <QuestionModal
          question={selectedQuestion}
          onSave={handleSaveQuestion}
          onClose={() => {
            setShowModal(false);
            setSelectedQuestion(null);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteItemModal
          item={selectedQuestion}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedQuestion(null);
          }}
          onConfirm={deleteQuestion}
        />
      )}
    </DashboardLayout>
  );
}

export async function getServerSideProps(){
  await connectDB()

  const quizzes = await Quiz.find({}).lean()
  return{
    props:{
      quizzes:JSON.parse(JSON.stringify(quizzes))
    }
  }

}
