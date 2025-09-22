"use client"

import { useMemo, useState, useEffect } from "react"
import { Unlock, Search } from "lucide-react"

export default function BlockedUsersPage() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

    // pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // Fetch blocked users from backend
  useEffect(() => {
    fetch("http://localhost:8081/api/blocked-users", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching blocked users:", err)
        setLoading(false)
      })
  }, [])

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) =>
        u.admissionNumber?.toLowerCase().includes(q) ||
        u.name?.toLowerCase().includes(q) ||
        u.branch?.toLowerCase().includes(q) ||
        u.section?.toLowerCase().includes(q)
    )
  }, [users, search])

  const blockedCount = useMemo(() => users.length, [users])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  // Unblock user API call
  const handleUnblockUser = (blockedUserId) => {
    fetch(`http://localhost:8081/api/blocked-users/unblock/${blockedUserId}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          console.log("User unlocked successfully")
          // Refresh list after unblock
          setUsers((prev) =>
            prev.map((u) =>
              u.blockId === blockedUserId ? { ...u, status: "unlock" } : u
            )
          )
        } else {
          console.error("Failed to unblock user")
        }
      })
      .catch((err) => console.error("Unblock error:", err))
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="mx-auto max-w-7xl rounded-2xl border-2 border-gray-200 bg-white p-4 md:p-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-[#235a81] text-pretty">
            Blocked Users
          </h1>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by admission no, name, branch, section"
              className="w-full rounded-md border border-gray-300 bg-[#c9e2f0] pl-9 pr-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#235a81] focus:border-[#235a81]"
              aria-label="Search blocked users"
            />
          </div>
        </div>

        {/* Meta */}
        <p className="mt-4 text-sm text-gray-700">
          Blocked Users Count:{" "}
          <span className="font-semibold">{blockedCount}</span>
        </p>

        {/* Table */}
        <div className="mt-4 overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#235a81] text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Admission No.
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Branch
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Section
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Test ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Reason
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Blocked Time
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {loading && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    Loading blocked users...
                  </td>
                </tr>
              )}

              {!loading && paginatedUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No blocked users found.
                  </td>
                </tr>
              )}

              {/* {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No blocked users found.
                  </td>
                </tr>
              )} */}

              {/* {filteredUsers.map((user, index) => (
                <tr
                  // key={${user.blockId}-${index}}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {user.admissionNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {user.branch}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {user.section}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {user.testId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 max-w-xs">
                    <div className="truncate" title={user.reason}>
                      {user.reason}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        user.status === "unlock"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {user.blockDateAndTime}
                  </td>
                  <td className="px-4 py-3">
                    {user.status === "block" && (
                      <button
                        className="inline-flex items-center gap-1 rounded-md bg-[#235a81] px-3 py-1.5 text-sm text-white hover:bg-[#1e4a6f] focus:outline-none focus:ring-2 focus:ring-[#235a81] focus:ring-offset-1"
                        title="Unblock user"
                        // aria-label={Unblock ${user.name}}
                        onClick={() => handleUnblockUser(user.blockId)}
                      >
                        <Unlock size={16} />
                        Unblock
                      </button>
                    )}
                  </td>
                </tr>
              ))} */}
              {paginatedUsers.map((user, index) => (
                <tr key={`${user.blockId}-${index}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {user.admissionNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {user.branch}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {user.section}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {user.testId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 max-w-xs">
                    <div className="truncate" title={user.reason}>
                      {user.reason}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        user.status === "unlock"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {user.blockDateAndTime}
                  </td>
                  <td className="px-4 py-3">
                    {user.status === "block" && (
                      <button
                        className="inline-flex items-center gap-1 rounded-md bg-[#235a81] px-3 py-1.5 text-sm text-white hover:bg-[#1e4a6f] focus:outline-none focus:ring-2 focus:ring-[#235a81] focus:ring-offset-1"
                        title="Unblock user"
                        onClick={() => handleUnblockUser(user.blockId)}
                      >
                        <Unlock size={16} />
                        Unblock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="mt-4 flex justify-center items-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  )
}