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

export function PaymentDonutChart({ transactions }) {
  const pending = transactions.filter((item) => item.paymentConfirmation === "Pending");
  const successful = transactions.filter((item) => item.paymentConfirmation === "Successful");
  const failed = transactions.filter((item) => item.paymentConfirmation === "Failed");

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
      const month = new Date(t.createdAt).toLocaleString("default", { month: "short" });
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

  const pending = paymentData.filter((t) => t.paymentConfirmation === "Pending");
  const successful = paymentData.filter((t) => t.paymentConfirmation === "Successful");
  const failed = paymentData.filter((t) => t.paymentConfirmation === "Failed");

  let activeList = paymentData;
  if (filter === "pending") activeList = pending;
  if (filter === "successful") activeList = successful;
  if (filter === "failed") activeList = failed;

  const itemsPerPage = 10;
  const totalPages = Math.ceil(activeList.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = activeList.slice(start, start + itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  // ✅ Handle status change
  const handleStatusChange = async (id, newStatus) => {
    // Optimistic UI update
    setPaymentData((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, paymentConfirmation: newStatus } : p
      )
    );
    const data = {
      confirmPaymentId: transactions._id,
      userDataId: transactions.userData._id,
      newStatus: newStatus
    }

    try {
      const res = await fetch("/api/updatePaymentStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to update payment status");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update status on server.");
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.paymentPage}>
        {/* Filter Tabs */}
        <div className={styles.filterTabs}>
          <button
            onClick={() => setFilter("all")}
            className={`${styles.filterTab} ${filter === "all" ? styles.filterTabActive : ""}`}
          >
            All ({paymentData.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`${styles.filterTab} ${filter === "pending" ? styles.filterTabActive : ""}`}
          >
            Pending ({pending.length})
          </button>
          <button
            onClick={() => setFilter("successful")}
            className={`${styles.filterTab} ${filter === "successful" ? styles.filterTabActive : ""}`}
          >
            Successful ({successful.length})
          </button>
          <button
            onClick={() => setFilter("failed")}
            className={`${styles.filterTab} ${filter === "failed" ? styles.filterTabActive : ""}`}
          >
            Failed ({failed.length})
          </button>
        </div>

        {/* Transactions Table */}
        <div className={styles.transactionsTable}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableTh}>Package</th>
                <th className={styles.tableTh}>User</th>
                <th className={styles.tableTh}>Amount</th>
                <th className={styles.tableTh}>Status</th>
                <th className={styles.tableTh}>Date</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {paginatedPayments.map((transaction, index) => (
                <tr key={index} className={styles.tableRow}>
                  <td className={styles.tableTd}>{transaction.packageName}</td>
                  <td className={styles.tableTd}>{transaction.userData?.fullname || "N/A"}</td>
                  <td className={styles.tableTd}>{transaction.price}</td>
                  <td className={styles.tableTd}>
                    <select
                      value={transaction.paymentConfirmation}
                      onChange={(e) =>
                        handleStatusChange(transaction._id, e.target.value)
                      }
                      className={`${styles.statusDropdown} ${styles[`status${transaction.paymentConfirmation}`]}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Successful">Successful</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </td>
                  <td className={styles.tableTd}>
                    {new Date(transaction.createdAt).toLocaleDateString()}
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
  const transactions = await ConfirmPayment.find({}).lean();

  return {
    props: {
      transactions: JSON.parse(JSON.stringify(transactions)),
    },
  };
}
