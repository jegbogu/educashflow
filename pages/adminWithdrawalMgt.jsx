import DashboardLayout from "@/components/admin/layout";
import Pagination from "@/components/utils/pagination";
import styles from "@/styles/payment.module.css";
import WithdrawalRequest from "@/model/withdrawalRequest";
import connectDB from "@/utils/connectmongo";
import { useState, useEffect } from "react";
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
  ArrowDownAZ,
  ArrowDownUp,
  ArrowUpAZ,
  Filter,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Spinner from "@/components/icons/spinner";
import { useRouter } from "next/router";

/* ============================= */
/*         DONUT CHART           */
/* ============================= */
function WithdrawalDonutChart({ transactions }) {
  const pending = transactions.filter(
    (item) => item.withdrawalConfirmation === "Pending"
  );
  const successful = transactions.filter(
    (item) => item.withdrawalConfirmation === "Successful"
  );
  const failed = transactions.filter(
    (item) => item.withdrawalConfirmation === "Failed"
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
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

/* ============================= */
/*         REVENUE CHART         */
/* ============================= */
function RevenueLineChart({ transactions }) {
  const revenueByMonth = {};

  transactions.forEach((t) => {
    if (!t.createdAt) return;
    const month = new Date(t.createdAt).toLocaleString("default", {
      month: "short",
    });

    const amount = Number(t.amount) || 0;
    if (!revenueByMonth[month]) revenueByMonth[month] = 0;
    revenueByMonth[month] += amount;
  });

  const revenueData = Object.entries(revenueByMonth).map(
    ([month, total]) => ({
      month,
      total,
    })
  );

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

/* ============================= */
/*         MAIN PAGE             */
/* ============================= */
export default function WithdrawalPage({ transactions }) {
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(transactions);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const router = useRouter();
  const { data: session, status } = useSession();

  /* ===== AUTH PROTECTION ===== */
  useEffect(() => {
    if (status === "authenticated" && session?.user.role !== "admin") {
      router.replace("/adminlogin");
    } else if (status === "unauthenticated") {
      router.replace("/adminlogin");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="w-12 h-12" />
      </div>
    );
  }

  if (status !== "authenticated" || session?.user.role !== "admin") {
    return null;
  }

  /* ============================= */
  /*       SEARCH + FILTER         */
  /* ============================= */

  const filteredBySearch = data.filter((item) =>
    [item.fullname, item.email, item.bankName]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const sorted = [...filteredBySearch].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];

    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const pending = sorted.filter(
    (item) => item.withdrawalConfirmation === "Pending"
  );
  const successful = sorted.filter(
    (item) => item.withdrawalConfirmation === "Successful"
  );
  const failed = sorted.filter(
    (item) => item.withdrawalConfirmation === "Failed"
  );

  let activeList = sorted;
  if (filter === "pending") activeList = pending;
  if (filter === "successful") activeList = successful;
  if (filter === "failed") activeList = failed;

  /* ============================= */
  /*           PAGINATION          */
  /* ============================= */

  const itemsPerPage = 10;
  const totalPages = Math.ceil(activeList.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = activeList.slice(start, start + itemsPerPage);

  /* ============================= */
  /*        UPDATE STATUS          */
  /* ============================= */

  const handleStatusChange = async (id, newStatus) => {
    // Optimistic UI
    setData((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, withdrawalConfirmation: newStatus }
          : item
      )
    );
console.log(id, newStatus)
    try {
      await fetch("/api/updateWithdrawalStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: id,
          newStatus,
        }),
      });
    } catch (error) {
      console.error(error);
      alert("Failed to update.");
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
      return <ArrowDownUp className="size-4" />;
    return sortConfig.direction === "asc" ? (
      <ArrowDownAZ className="size-4" />
    ) : (
      <ArrowUpAZ className="size-4" />
    );
  };

   return (
  <DashboardLayout>
    <div className="bg-[#f6f7fb] min-h-screen p-6">

      {/* ================= HEADER FILTER SECTION ================= */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Filter size={16} />
            <span>Filters:</span>
          </div>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-md border border-gray-200 bg-white text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right Side Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "successful", "failed"].map((type) => {
            const counts = {
              all: data.length,
              pending: pending.length,
              successful: successful.length,
              failed: failed.length,
            };

            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1 text-sm rounded-md border transition 
                  ${
                    filter === type
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)} (
                {counts[type]})
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TABLE CARD ================= */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th
                onClick={() => handleSort("fullname")}
                className="px-6 py-4 text-left cursor-pointer"
              >
                Fullname {renderSortIcon("fullname")}
              </th>
              <th
                onClick={() => handleSort("email")}
                className="px-6 py-4 text-left cursor-pointer"
              >
                Email {renderSortIcon("email")}
              </th>
              <th
                onClick={() => handleSort("bankName")}
                className="px-6 py-4 text-left cursor-pointer"
              >
                Bank {renderSortIcon("bankName")}
              </th>
              <th
                onClick={() => handleSort("accountNumber")}
                className="px-6 py-4 text-left cursor-pointer"
              >
                Account Number {renderSortIcon("accountNumber")}
              </th>
              <th
                onClick={() => handleSort("amount")}
                className="px-6 py-4 text-left cursor-pointer"
              >
                Amount {renderSortIcon("amount")}
              </th>
              <th className="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((item) => (
              <tr
                key={item._id}
                className="border-t border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-700">
                  {item.fullname}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {item.email}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {item.bankName}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {item.accountNumber}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-800">
                  ₦{item.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={item.withdrawalConfirmation}
                    onChange={(e) =>
                      handleStatusChange(item._id, e.target.value)
                    }
                    className={`px-3 py-1 rounded-md text-sm border outline-none
                      ${
                        item.withdrawalConfirmation === "Successful"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : item.withdrawalConfirmation === "Failed"
                          ? "bg-red-100 text-red-700 border-red-200"
                          : "bg-blue-100 text-blue-700 border-blue-200"
                      }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Successful">Successful</option>
                    <option value="Failed">Failed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="mt-6">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ================= ANALYTICS CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold mb-4 text-gray-700">
            Withdrawal Analytics
          </h3>
          <WithdrawalDonutChart transactions={data} />
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold mb-4 text-gray-700">
            Revenue Insights
          </h3>
          <RevenueLineChart transactions={data} />
        </div>
      </div>
    </div>
  </DashboardLayout>
);

}

/* ============================= */
/*       SERVER SIDE DATA        */
/* ============================= */

export async function getServerSideProps() {
  await connectDB();
  const trans = await WithdrawalRequest.find({}).lean();
  const transactions = trans.reverse();

  return {
    props: {
      transactions: JSON.parse(JSON.stringify(transactions)),
    },
  };
}
