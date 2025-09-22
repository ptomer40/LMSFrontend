"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, Eye, LogOut, Blocks, Ban } from "lucide-react"

export default function LiveUsersPage() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  
  const fetchActiveUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch("http://localhost:8081/admin/activeUsers")
      if (!res.ok) throw new Error("Failed to fetch active users")
      const data = await res.json()
      console.log("Active users:", data)
      setUsers(data)
    } catch (error) {
      console.error("Error fetching active users:", error)
    } finally {
      setLoading(false)
    }
  }

  
  useEffect(() => {
    fetchActiveUsers()
    const interval = setInterval(fetchActiveUsers, 10000) // 🔄 auto-refresh every 10s
    return () => clearInterval(interval)
  }, [])

  
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => u.userId?.toLowerCase().includes(q)) // ✅ depends on your UserSessionInfo JSON
  }, [users, search])

  const activeCount = useMemo(() => users.length, [users])

  // Block user API
  const handleBlockUser = async (id) => {
    try {
      const res = await fetch(`http://localhost:8081/admin/blockUser/${id}`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("Failed to block user")
      alert(`User ${id} blocked successfully!`)
      fetchActiveUsers() // refresh list
    } catch (error) {
      console.error("Error blocking user:", error)
      alert("Failed to block user")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#235a81] mx-auto mb-4"></div>
          <p className="text-gray-600">Fetching Live users...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 ">
      <section className="mx-auto max-w-7xl rounded-2xl border-2 border-gray-200 bg-white p-4 md:p-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-[#235a81] text-pretty">Live Users</h1>

          {/* Search by User ID */}
          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user ID"
              className="w-full rounded-md border border-gray-300 bg-[#c9e2f0] pl-9 pr-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#235a81] focus:border-[#235a81]"
              aria-label="Search by user ID"
            />
          </div>
        </div>

        {/* Meta */}
        <p className="mt-4 text-sm text-gray-700">
          Active Users Count: <span className="font-semibold">{activeCount}</span>
        </p>

        {/* Table with exactly three columns */}
        <div className="mt-4 overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#235a81] text-white">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                  User ID
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                  Login Time
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500">
                    No live users found.
                  </td>
                </tr>
              )}

              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{u.admissionNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{u.loginTime}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex items-center gap-1 rounded-md border border-red-300 px-2.5 py-1.5 text-sm text-red-700 hover:bg-gray-100"
                        title="View"
                        aria-label={`View ${u.id}`}
                        onClick={() => handleBlockUser(u.id)}
                      >
                        <Ban size={16} />
                        Block
                      </button>
                     
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </section>
    </main>
  )
}
