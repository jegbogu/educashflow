import {
  Plus,
  Filter,
  Search,
  Pencil,
  Trash2,
  Ban,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import styles from "@/styles/users.module.css";
import DashboardLayout from "@/components/admin/layout";
import { cn } from "@/lib/utils";

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Pagination from "@/components/utils/pagination";
import UserForm from "@/components/admin/addOrEditUser";
import DeleteModal from "@/components/admin/deleteUser";
import BlockUserModal from "@/components/admin/blockUser";

const usersData = [
  {
    id: "001",
    name: "Alice Smith",
    email: "alice@example.com",
    status: "Active",
    type: "Premium",
  },
  {
    id: "002",
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "Active",
    type: "Regular",
  },
  {
    id: "003",
    name: "Charlie Brown",
    email: "charlie@example.com",
    status: "Blocked",
    type: "Premium",
  },
  {
    id: "004",
    name: "Diana Prince",
    email: "diana@example.com",
    status: "Active",
    type: "Regular",
  },
  {
    id: "005",
    name: "Ethan Hunt",
    email: "ethan@example.com",
    status: "Active",
    type: "Premium",
  },
  {
    id: "006",
    name: "Fiona Green",
    email: "fiona@example.com",
    status: "Blocked",
    type: "Regular",
  },
  {
    id: "007",
    name: "George Wilson",
    email: "george@example.com",
    status: "Active",
    type: "Premium",
  },
  {
    id: "008",
    name: "Hannah Davis",
    email: "hannah@example.com",
    status: "Active",
    type: "Regular",
  },
];

export default function UsersPage() {
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [users, setUsers] = useState(usersData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showBlock, setShowBlock] = useState(false);

  // Apply filters
  const filteredUsers = users
    .filter((user) => {
      return (
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    })
    .filter((user) => (statusFilter ? user.status === statusFilter : true))
    .filter((user) => (typeFilter ? user.type === typeFilter : true));

  // Toggle select user
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };
  const selectAll = () => setSelected(filteredUsers.map((u) => u.id));
  const deselectAll = () => setSelected([]);
  const allSelected =
    filteredUsers.length > 0 && selected.length === filteredUsers.length;

  // Bulk delete
  const bulkDelete = () => {
    setUsers((prev) => prev.filter((u) => !selected.includes(u.id)));
    setSelected([]);
  };

  // Delete single user
  const deleteUser = (user) => {
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    setShowDelete(false);
  };

  const toggleBlockUser = (user) => {
    if (user.status === "Blocked") {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: "Active" } : u))
      );
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: "Blocked" } : u))
      );
    }
    setShowBlock(false);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDelete(true);
  };

  // Add / Edit User
  const handleAddUser = () => {
    setSelectedUser(null); // new user
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleBlockUser = (user) => {
    setSelectedUser(user);
    setShowBlock(true);
  };

  const handleSaveUser = (userData) => {
    setUsers((prev) => {
      const existingIndex = prev.findIndex((u) => u.id === userData.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = userData;
        return updated;
      }
      return [...prev, { ...userData, id: crypto.randomUUID() }];
    });
    setShowModal(false);
  };

  // Analytics data
  const totalUsers = users.length;

  const activeUsers = users.filter((u) => u.status === "Active").length;
  const blockedUsers = users.filter((u) => u.status === "Blocked").length;
  const premiumUsers = users.filter((u) => u.type === "Premium").length;
  const regularUsers = users.filter((u) => u.type === "Regular").length;
  const itemsPerPage = 10;

  const pieData = [
    { name: "Premium", value: premiumUsers },
    { name: "Regular", value: regularUsers },
  ];
  const COLORS = ["#3b82f6", "#10b981"];

  const growthData = [
    { month: "Jan", users: 400 },
    { month: "Feb", users: 600 },
    { month: "Mar", users: 800 },
    { month: "Apr", users: 900 },
    { month: "May", users: 1200 },
  ];

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(start, start + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  // Stats

  return (
    <DashboardLayout>
      <div className={styles.usersPage}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Users</h1>
            <p className={styles.pageDescription}>
              Manage your users and their permissions
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.btnPrimary}
              onClick={() => handleAddUser()}
            >
              <Plus className={styles.btnIcon} />
              Add User
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
                placeholder="Search users..."
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
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete Selected
                </button>
                <button
                  onClick={deselectAll}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  Clear Selection
                </button>
              </div>
            )}
            <select
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </select>

            <select
              className={styles.filterSelect}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Premium">Premium</option>
              <option value="Regular">Regular</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className={styles.usersTableSection}>
          <div className={styles.usersTable}>
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
                  <th className={cn(styles.tableTh, "!text-left")}>User ID</th>
                  <th className={styles.tableTh}>User</th>
                  <th className={styles.tableTh}>Status</th>
                  <th className={styles.tableTh}>User Type</th>
                  <th className={styles.tableTh}>Actions</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {paginatedUsers.map((user, index) => (
                  <tr key={index} className={styles.tableRow}>
                    <td className={styles.tableTd}>
                      <input
                        type="checkbox"
                        checked={selected.includes(user.id)}
                        onChange={() => toggleSelect(user.id)}
                      />
                    </td>
                    <td className={cn(styles.tableTd, "!text-left")}>
                      {user.id.slice(0, 3)}...{user.id.slice(-3)}
                    </td>
                    <td className={styles.tableTd}>
                      <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>
                          <span className={styles.avatarFallback}>
                            {user.name.split(" ")[0].charAt(0)}
                            {user.name.split(" ")[1]?.charAt(0)}
                          </span>
                        </div>
                        <div className={styles.userDetails}>
                          <div className={styles.userName}>{user.name}</div>
                          <div className={styles.userEmail}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableTd}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[`status${user.status}`]
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className={styles.tableTd}>
                      <span
                        className={`${styles.typeBadge} ${
                          styles[`type${user.type}`]
                        }`}
                      >
                        {user.type}
                      </span>
                    </td>
                    <td className={styles.tableTd}>
                      <div className="relative">
                        {/* <button
                          className={styles.actionMenuBtn}
                          onClick={() => setShowBulkMenu(!showBulkMenu)}
                        ></button> */}
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => handleEditUser(user)}
                            className={styles.actionBtn}
                            title="Edit user"
                          >
                            <Pencil className={styles.actionIcon} />
                          </button>
                          <button
                            className={styles.actionBtn}
                            onClick={() => handleDeleteUser(user)}
                            title="Delete user"
                          >
                            <Trash2 className={styles.actionIcon} />
                          </button>
                          <button
                            className={styles.actionBtn}
                            title="Verify user"
                            onClick={() => handleBlockUser(user)}
                          >
                            <Ban className={styles.actionIcon} />
                          </button>
                        </div>

                        {showBulkMenu && (
                          <div className={styles.bulkActionsMenu}>
                            <button className={styles.menuItem}>
                              Edit User
                            </button>
                            <button className={styles.menuItem}>
                              View Profile
                            </button>
                            <button className={styles.menuItem}>
                              Block User
                            </button>
                            <button
                              className={`${styles.menuItem} text-red-600`}
                            >
                              Delete User
                            </button>
                            <div className={styles.menuDivider}></div>
                            <button className={styles.menuItem}>
                              Delete all
                            </button>
                            <button className={styles.menuItem}>
                              Select all
                            </button>
                            <button className={styles.menuItem}>
                              Deselect all
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Pagination */}
        <div className={styles.paginationSection}>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Analytics Cards */}
        <div className={styles.analyticsGrid}>
          {/* User Analytics */}
          <div className={styles.analyticsCard}>
            <h3 className={styles.analyticsTitle}>User Analytics</h3>
            <div className={styles.analyticsContent}>
              <div className={styles.userStats}>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Total Users</div>
                  <div className={styles.statValue}>{totalUsers}</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Active Users</div>
                  <div className={styles.statValue}>{activeUsers}</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Regular Users</div>
                  <div className={styles.statValue}>{ regularUsers}</div>
                </div>
              </div>
              <div className={styles.chartContainer}>
                <div className={styles.pieChart}>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* User Growth */}
          <div className={styles.analyticsCard}>
            <h3 className={styles.analyticsTitle}>User Analytics</h3>
            <div className={styles.analyticsContent}>
              <div className={styles.growthStats}>
                <div className={styles.growthItem}>
                  <div className={styles.growthLabel}>Most Active User</div>
                  <div className={styles.growthValue}>Alice Smith</div>
                </div>
                <div className={styles.growthItem}>
                  <div className={styles.growthLabel}>
                    Average Logins per hour
                  </div>
                  <div className={styles.growthValue}>5.3</div>
                </div>
                <div className={styles.growthItem}>
                  <div className={styles.growthLabel}>Retention Rate</div>
                  <div className={styles.growthValue}>78%</div>
                </div>
              </div>
              <div className={styles.chartContainer}>
                <div className={styles.growthChart}>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#10b981"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <UserForm
            formTitle={"add user"}
            onClose={() => setShowModal(false)}
            onSave={handleSaveUser}
            user={selectedUser}
          />
        </div>
      )}

      {showDelete && (
        <DeleteModal
          user={selectedUser}
          onClose={() => setShowDelete(false)}
          onConfirm={() => deleteUser(selectedUser)}
        />
      )}

      {showBlock && (
        <BlockUserModal
          user={selectedUser}
          onClose={() => setShowBlock(false)}
          onConfirm={() => toggleBlockUser(selectedUser)}
        />
      )}
    </DashboardLayout>
  );
}
