import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import styles from "@/styles/utils.module.css";

export default function Pagination({
  currentPage = 1,
  totalPages,
  onPageChange,
}) {
  const [page, setPage] = useState(currentPage);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      onPageChange?.(newPage);
    }
  };

  const getPages = () => {
    const pages = [];

    if (totalPages <= 7) {
      // Show all if not too many
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always include first page
      pages.push(1);

      // Left ellipsis
      if (page > 3) pages.push("...");

      // Middle pages around current
      for (let i = page - 1; i <= page + 1; i++) {
        if (i > 1 && i < totalPages) pages.push(i);
      }

      // Right ellipsis
      if (page < totalPages - 2) pages.push("...");

      // Always include last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles.paginationBtn}
        disabled={page === 1}
        onClick={() => changePage(page - 1)}
      >
        <ChevronLeft className={styles.paginationIcon} />
        Back
      </button>

      <div className={styles.pageNumbers}>
        {getPages().map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} className={styles.ellipsis}>
              ...
            </span>
          ) : (
            <button
              key={p}
              className={`${styles.pageNumber} ${
                page === p ? styles.pageActive : ""
              }`}
              onClick={() => changePage(p)}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        className={styles.paginationBtn}
        disabled={page === totalPages}
        onClick={() => changePage(page + 1)}
      >
        Next
        <ChevronRight className={styles.paginationIcon} />
      </button>
    </div>
  );
}
