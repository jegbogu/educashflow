import DashboardLayout from "@/components/admin/layout";
import Pagination from "@/components/utils/pagination";
import styles from "@/styles/payment.module.css";
import ConfirmPayment from "@/model/confirmPayment";
import connectDB from "@/utils/connectmongo";
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  AArrowDown,
  AArrowUp,
  ArrowDownAZ,
  ArrowDownUp,
  ArrowUpAZ,
  Filter,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Spinner from "@/components/icons/spinner";
import { useRouter } from "next/router";

export function PaymentDonutChart({ transactions }) {
  const pending = transactions.filter(
    (item) => item.paymentConfirmation === "Pending"
  );
  const successful = transactions.filter(
    (item) => item.paymentConfirmation === "Successful"
  );
  const failed = transactions.filter(
    (item) => item.paymentConfirmation === "Failed"
  );

  const data = [
    { name: "Successful", value: successful.length },
    { name: "Failed", value: failed.length },
    { name: "Pending", value: pending.length },
  ];

  const COLORS = ["#10b981", "#ef4444", "#3b82f6"];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RevenueLineChart({ transactions }) {
  function getMonthlyRevenue(transactions) {
    const revenueByMonth = {};

    transactions.forEach((t) => {
      const month = new Date(t.createdAt).toLocaleString("default", {
        month: "short",
      });
      const amount = parseFloat(t.price.replace("$", "")) || 0;
      if (!revenueByMonth[month]) revenueByMonth[month] = 0;
      revenueByMonth[month] += amount;
    });

    return Object.entries(revenueByMonth).map(([month, total]) => ({
      month,
      total,
    }));
  }

  const revenueData = getMonthlyRevenue(transactions);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={revenueData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total" stroke="#3b82f6" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function PaymentPage({ transactions }) {
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentData, setPaymentData] = useState(transactions);
  const [search, setSearch] = useState("");
const router = useRouter()
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

   
   const { data: session, status } = useSession();
   


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

  // Filter based on search input
  const filteredBySearch = paymentData.filter(
    (transaction) =>
      transaction.packageName.toLowerCase().includes(search.toLowerCase()) ||
      transaction.userData?.fullname
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  const sortedPayments = [...filteredBySearch].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];

    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const pending = sortedPayments.filter(
    (transaction) => transaction.paymentConfirmation === "Pending"
  );
  const successful = sortedPayments.filter(
    (transaction) => transaction.paymentConfirmation === "Successful"
  );
  const failed = sortedPayments.filter(
    (transaction) => transaction.paymentConfirmation === "Failed"
  );

  let activeList = sortedPayments;
  if (filter === "pending") activeList = pending;
  if (filter === "successful") activeList = successful;
  if (filter === "failed") activeList = failed;

  const itemsPerPage = 10;
  const totalPages = Math.ceil(activeList.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = activeList.slice(start, start + itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  // ✅ Handle status change
  const handleStatusChange = async (id, newStatus, userData, packageName) => {
    // Optimistic UI update
    setPaymentData((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, paymentConfirmation: newStatus } : p
      )
    );
    const data = {
      confirmPaymentId: id,
      userDataId: userData._id,
      packageName: packageName,
      newStatus: newStatus,
    };

    try {
      const res = await fetch("/api/updatePaymentStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Successfully Updated");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update status on server.");
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key)
      return (
        <span className={styles.sortIcon}>
          <ArrowDownUp className="size-4" />
        </span>
      ); // neutral
    if (sortConfig.direction === "asc")
      return (
        <span className={styles.sortIcon}>
          <ArrowDownAZ className="size-4" />
        </span>
      );
    return (
      <span className={styles.sortIcon}>
        <ArrowUpAZ className="size-4" />
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className={styles.paymentPage}>
        <div className={cn(styles.filtersSection)}>
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
          {/* Filter Tabs */}
          <div className={cn(styles.filterTabs, "max-sm:overflow-x-scroll")}>
            <button
              onClick={() => setFilter("all")}
              className={`${styles.filterTab} ${
                filter === "all" ? styles.filterTabActive : ""
              }`}
            >
              All ({paymentData.length})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`${styles.filterTab} ${
                filter === "pending" ? styles.filterTabActive : ""
              }`}
            >
              Pending ({pending.length})
            </button>
            <button
              onClick={() => setFilter("successful")}
              className={`${styles.filterTab} ${
                filter === "successful" ? styles.filterTabActive : ""
              }`}
            >
              Successful ({successful.length})
            </button>
            <button
              onClick={() => setFilter("failed")}
              className={`${styles.filterTab} ${
                filter === "failed" ? styles.filterTabActive : ""
              }`}
            >
              Failed ({failed.length})
            </button>
          </div>
        </div>
        {/* Transactions Table */}
        <div className={styles.transactionsTable}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th
                  onClick={() => handleSort("packageName")}
                  className={cn(styles.tableTh)}
                >
                  <span className="flex gap-2 items-center">
                    Package {renderSortIcon("packageName")}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("userData.fullname")}
                  className={cn(styles.tableTh)}
                >
                  <span className="flex gap-2 items-center">
                    User {renderSortIcon("userData.fullname")}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("price")}
                  className={cn(styles.tableTh)}
                >
                  <span className="flex gap-2 items-center">
                    Amount {renderSortIcon("price")}
                  </span>
                </th>
                <th className={cn(styles.tableTh)}>Status</th>
                <th
                  onClick={() => handleSort("createdAt")}
                  className={cn(styles.tableTh)}
                >
                  <span className="flex gap-2 items-center">
                    Date {renderSortIcon("createdAt")}
                  </span>
                </th>
              </tr>
            </thead>

            <tbody className={styles.tableBody}>
              {paginatedPayments.map((transaction, index) => (
                <tr key={index} className={styles.tableRow}>
                  <td className={styles.tableTd}>{transaction.packageName}</td>
                  <td className={cn(styles.tableTd, "capitalize")}>
                    {transaction.userData?.fullname || "N/A"}
                  </td>
                  <td className={styles.tableTd}>{transaction.price}</td>
                  <td className={styles.tableTd}>
                    <select
                      value={transaction.paymentConfirmation}
                      onChange={(e) =>
                        handleStatusChange(
                          transaction._id,
                          e.target.value,
                          transaction.userData,
                          transaction.packageName
                        )
                      }
                      className={`${styles.statusDropdown} ${
                        styles[`status${transaction.paymentConfirmation}`]
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Successful">Successful</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </td>
                  <td className={styles.tableTd}>
                    {new Date(transaction.createdAt).toLocaleDateString(
                      "en-GB"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.paginationSection}>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
        {/* Analytics */}
        <div className={styles.analyticsGrid}>
          <div className={styles.analyticsCard}>
            <h3 className={styles.analyticsTitle}>Payment Analytics</h3>
            <div className={styles.chartContainer}>
              <PaymentDonutChart transactions={paymentData} />
            </div>
          </div>
          <div className={styles.analyticsCard}>
            <h3 className={styles.analyticsTitle}>Revenue Insights</h3>
            <div className={styles.chartContainer}>
              <RevenueLineChart transactions={paymentData} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export async function getServerSideProps() {
  await connectDB();
  const trans = await ConfirmPayment.find({}).lean();
const transactions = trans.reverse()
  return {
    props: {
      transactions: JSON.parse(JSON.stringify(transactions)),
    },
  };
}
