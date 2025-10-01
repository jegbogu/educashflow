import DashboardLayout from "@/components/admin/layout";
import styles from "@/styles/payment.module.css";
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
} from "recharts";

const transactions = [
  {
    id: "TXN12345678",
    user: "Alice Smith",
    amount: "$10.00",
    status: "Pending",
    method: "Credit Card",
    date: "26/09/2025",
  },
  {
    id: "TXN12345678",
    user: "Bob Johnson",
    amount: "$10.00",
    status: "Successful",
    method: "PayPal",
    date: "26/09/2025",
  },
  {
    id: "TXN12345678",
    user: "Eran Gique",
    amount: "$10.00",
    status: "Failed",
    method: "Wallet",
    date: "26/09/2025",
  },
  {
    id: "TXN12345678",
    user: "Alice Smith",
    amount: "$10.00",
    status: "Failed",
    method: "Credit Card",
    date: "26/09/2025",
  },
  {
    id: "TXN12345678",
    user: "Bob Johnson",
    amount: "$10.00",
    status: "Successful",
    method: "PayPal",
    date: "26/09/2025",
  },
  {
    id: "TXN12345678",
    user: "Eran Gique",
    amount: "$20.00",
    status: "Pending",
    method: "Wallet",
    date: "26/09/2025",
  },
  {
    id: "TXN12345678",
    user: "Diego Creed",
    amount: "$10.00",
    status: "Successful",
    method: "PayPal",
    date: "26/09/2025",
  },
  {
    id: "TXN12345678",
    user: "Alice Smith",
    amount: "$10.00",
    status: "Pending",
    method: "Credit Card",
    date: "26/09/2025",
  },
  {
    id: "TXN12345678",
    user: "Eran Gique",
    amount: "$10.00",
    status: "Successful",
    method: "PayPal",
    date: "26/09/2025",
  },
  {
    id: "TXN12345678",
    user: "Alice Smith",
    amount: "$20.00",
    status: "Successful",
    method: "PayPal",
    date: "26/09/2025",
  },
];

const pending = transactions.filter((item) => item.status == "Pending");
const successful = transactions.filter((item) => item.status == "Successful");
const failed = transactions.filter((item) => item.status == "Failed");

const data = [
  { name: "Successful", value: successful.length },
  { name: "Failed", value: failed.length },
  { name: "Pending", value: pending.length },
];

const COLORS = ["#10b981", "#ef4444", "#3b82f6"];

export function PaymentDonutChart() {
  return (
    <PieChart width={300} height={300}>
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
  );
}

export function RevenueLineChart({ transactions }) {
  function getMonthlyRevenue(transactions) {
    const revenueByMonth = {};

    transactions.forEach((t) => {
      const month = t.date.slice(3, 10); // e.g. "09/2025"
      const amount = parseFloat(t.amount.replace("$", "")) || 0;
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
    <LineChart width={500} height={300} data={revenueData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="total" stroke="#3b82f6" />
    </LineChart>
  );
}

export default function PaymentPage() {
  const [filter, setFilter] = useState("all");

  let activeList = transactions;
  if (filter === "pending") activeList = pending;
  if (filter === "successful") activeList = successful;
  if (filter === "failed") activeList = failed;

  return (
    <DashboardLayout>
      <div className={styles.paymentPage}>
        {/* Filter Tabs */}
        <div className={styles.filterTabs}>
          <button
            onClick={() => setFilter("all")}
            className={`${styles.filterTab} ${
              filter === "all" ? styles.filterTabActive : ""
            }`}
          >
            All ({transactions.length})
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

        {/* Transactions Table */}
        <div className={styles.transactionsTable}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableTh}>Transaction ID</th>
                <th className={styles.tableTh}>User</th>
                <th className={styles.tableTh}>Amount</th>
                <th className={styles.tableTh}>Status</th>
                <th className={styles.tableTh}>Payment Method</th>
                <th className={styles.tableTh}>Date</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {activeList.map((transaction, index) => (
                <tr key={index} className={styles.tableRow}>
                  <td className={styles.tableTd}>{transaction.id}</td>
                  <td className={styles.tableTd}>{transaction.user}</td>
                  <td className={styles.tableTd}>{transaction.amount}</td>
                  <td className={styles.tableTd}>
                    <span
                      className={`${styles.statusBadge} ${
                        styles[`status${transaction.status}`]
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className={styles.tableTd}>{transaction.method}</td>
                  <td className={styles.tableTd}>{transaction.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Analytics Cards */}
        <div className={styles.analyticsGrid}>
          {/* Payment Analytics */}
          <div className={styles.analyticsCard}>
            <h3 className={styles.analyticsTitle}>Payment Analytics</h3>
            <div className={styles.analyticsContent}>
              <div className={styles.analyticsStats}>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Total Transactions</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Successful Payment</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Failed Payment</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Pending Payment</div>
                </div>
              </div>
              <div className={styles.chartContainer}>
                <div className={styles.donutChart}>
                  <PaymentDonutChart />
                </div>
                
              </div>
            </div>
          </div>

          {/* Revenue Insights */}
          <div className={styles.analyticsCard}>
            <h3 className={styles.analyticsTitle}>Revenue Insights</h3>
            <div className={styles.analyticsContent}>
              <div className={styles.revenueStats}>
                <div className={styles.revenueItem}>
                  <div className={styles.revenueLabel}>Total Revenue</div>
                  <div className={styles.revenueValue}>$3,000</div>
                </div>
                <div className={styles.revenueItem}>
                  <div className={styles.revenueLabel}>
                    Revenue For This Month
                  </div>
                  <div className={styles.revenueValue}>$1,500</div>
                </div>
                <div className={styles.revenueItem}>
                  <div className={styles.revenueLabel}>
                    Highest Payment Method
                  </div>
                  <div className={styles.revenueValue}>PayPal</div>
                </div>
              </div>
              <div className={styles.chartContainer}>
                <RevenueLineChart transactions={transactions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
