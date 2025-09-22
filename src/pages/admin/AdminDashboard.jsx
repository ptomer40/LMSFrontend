"use client"

import { useState, useMemo,useEffect } from "react"
import { Search, Download, BarChart3, TrendingUp, Users, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function AdminDashboard({ testsData = [], studentsData = [], loading = false, error = null }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [currentTestPage, setCurrentTestPage] = useState(1)
  const [currentStudentPage, setCurrentStudentPage] = useState(1)
  const [username,setusername]=useState();
  const itemsPerPage = 10
const navigate=useNavigate();

useEffect(() => {
  const name = sessionStorage.getItem("adminName");
  const username = sessionStorage.getItem("adminUsername");
  const isAdmin = sessionStorage.getItem("isAdmin") === "true";
  const privileges = JSON.parse(sessionStorage.getItem("privileges") || "[]");

  console.log({ name, username, isAdmin, privileges });
   
  if (!username || username.trim() === "") {
    navigate("/logout");
  } else {
    setusername(username);
    // Set other state here if needed
  }
}, [navigate]);


  const overallStats = useMemo(() => {
    if (!testsData.length) return { totalScheduled: 0, totalCompleted: 0, avgAttendance: 0, overallAvgScore: 0 }

    const completedTests = testsData.filter((test) => test.status === "completed")
    const totalScheduled = testsData.length
    const totalCompleted = completedTests.length

    const avgAttendance =
      completedTests.length > 0
        ? completedTests.reduce((sum, test) => sum + (test.attendedStudents / test.totalStudents) * 100, 0) /
          completedTests.length
        : 0

    const overallAvgScore =
      completedTests.length > 0
        ? completedTests.reduce((sum, test) => sum + test.avgScore, 0) / completedTests.length
        : 0

    return {
      totalScheduled,
      totalCompleted,
      avgAttendance: avgAttendance.toFixed(1),
      overallAvgScore: overallAvgScore.toFixed(1),
    }
  }, [testsData])

  const filteredTests = useMemo(() => {
    if (!searchTerm.trim()) return testsData
    const term = searchTerm.toLowerCase()

    return testsData.filter((test) => {
      if (filterType === "testId") return test.id.toLowerCase().includes(term)
      return test.id.toLowerCase().includes(term) || test.title.toLowerCase().includes(term)
    })
  }, [testsData, searchTerm, filterType])

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return studentsData
    const term = searchTerm.toLowerCase()

    return studentsData.filter((student) => {
      if (filterType === "admissionNo") return student.admissionNo.toLowerCase().includes(term)
      return student.admissionNo.toLowerCase().includes(term) || student.name.toLowerCase().includes(term)
    })
  }, [studentsData, searchTerm, filterType])

  const paginatedTests = useMemo(() => {
    const startIndex = (currentTestPage - 1) * itemsPerPage
    return filteredTests.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredTests, currentTestPage])

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentStudentPage - 1) * itemsPerPage
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredStudents, currentStudentPage])

  const totalTestPages = Math.ceil(filteredTests.length / itemsPerPage)
  const totalStudentPages = Math.ceil(filteredStudents.length / itemsPerPage)

  const chartData = useMemo(() => {
    return testsData
      .filter((test) => test.status === "completed")
      .slice(0, 10)
      .map((test) => ({
        testId: test.id,
        attendance: ((test.attendedStudents / test.totalStudents) * 100).toFixed(1),
        avgScore: test.avgScore,
      }))
  }, [testsData])

  const handleDownloadReport = async (testId) => {
    try {
      const test = testsData.find((t) => t.id === testId)
      if (test) {
        const reportData = {
          testId: test.id,
          title: test.title,
          date: test.scheduledDate,
          attendance: `${test.attendedStudents}/${test.totalStudents}`,
          avgScore: test.avgScore,
          generatedAt: new Date().toISOString(),
        }

        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `test-report-${testId}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Failed to download report:", error)
    }
  }

  const getConsistencyColor = (consistency) => {
    switch (consistency) {
      case "High":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const PaginationControls = ({ currentPage, totalPages, onPageChange, label }) => (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-gray-700">
        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, label === "tests" ? filteredTests.length : filteredStudents.length)} of{" "}
        {label === "tests" ? filteredTests.length : filteredStudents.length} {label}
      </p>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )

  const inputClasses =
    "flex h-10 w-full rounded-md border border-gray-300 bg-[#ebf6fc] px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#235a81] focus:border-[#235a81]"

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        
        <div className="mx-auto max-w-7xl">
          
          <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border-2 border-red-200 bg-white p-6 shadow-sm">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 ">
        {username}
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header */}
      
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-[#235a81]">Performance Analytics Dashboard</h1>

            {/* Search and Filter */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="rounded-md border border-gray-300 bg-[#ebf6fc] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#235a81]"
                >
                  <option value="all">All</option>
                  <option value="testId">Test ID</option>
                  <option value="admissionNo">Admission No</option>
                </select>
              </div>
              <div className="relative w-full md:w-80">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search by ${filterType === "testId" ? "test ID" : filterType === "admissionNo" ? "admission number" : "test ID or admission number"}`}
                  className={`${inputClasses} pl-9`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tests Scheduled</p>
                <p className="text-2xl font-bold text-[#235a81]">{overallStats.totalScheduled}</p>
              </div>
              <Calendar className="h-8 w-8 text-[#235a81]" />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tests Completed</p>
                <p className="text-2xl font-bold text-green-600">{overallStats.totalCompleted}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Attendance</p>
                <p className="text-2xl font-bold text-blue-600">{overallStats.avgAttendance}%</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Avg Score</p>
                <p className="text-2xl font-bold text-purple-600">{overallStats.overallAvgScore}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Test Performance Overview (Last 10 Tests)</h2>
          {chartData.length > 0 ? (
            <div className="h-64 flex items-end justify-center space-x-4 bg-gray-50 rounded-lg p-4">
              {chartData.map((data) => (
                <div key={data.testId} className="flex flex-col items-center space-y-2">
                  <div className="flex space-x-1">
                    <div
                      className="w-8 bg-blue-500 rounded-t"
                      style={{ height: `${(data.attendance / 100) * 150}px` }}
                      title={`Attendance: ${data.attendance}%`}
                    ></div>
                    <div
                      className="w-8 bg-green-500 rounded-t"
                      style={{ height: `${(data.avgScore / 100) * 150}px` }}
                      title={`Avg Score: ${data.avgScore}%`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 transform -rotate-45">{data.testId}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">No completed tests available for chart</p>
            </div>
          )}
          <div className="flex justify-center mt-4 space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Attendance %</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Average Score %</span>
            </div>
          </div>
        </div>

        {/* Test Analysis Table */}
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Analysis</h2>
          <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr className="text-white text-left" style={{ backgroundColor: "#235a81" }}>
                  <th className="py-3 px-4 border-b" style={{ borderColor: "#235a81", color: "white" }}>
                    Test ID
                  </th>
                  <th className="py-3 px-4 border-b" style={{ borderColor: "#235a81", color: "white" }}>
                    Test Title
                  </th>
                  <th className="py-3 px-4 border-b" style={{ borderColor: "#235a81", color: "white" }}>
                    Date
                  </th>
                  <th className="py-3 px-4 border-b" style={{ borderColor: "#235a81", color: "white" }}>
                    Attendance
                  </th>
                  <th className="py-3 px-4 border-b" style={{ borderColor: "#235a81", color: "white" }}>
                    Avg Score
                  </th>
                  <th className="py-3 px-4 border-b" style={{ borderColor: "#235a81", color: "white" }}>
                    Status
                  </th>
                  <th className="py-3 px-4 border-b" style={{ borderColor: "#235a81", color: "white" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedTests.length > 0 ? (
                  paginatedTests.map((test) => (
                    <tr key={test.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">{test.id}</td>
                      <td className="py-3 px-4">{test.title}</td>
                      <td className="py-3 px-4">{test.scheduledDate}</td>
                      <td className="py-3 px-4">
                        <span className="text-sm">
                          {test.attendedStudents}/{test.totalStudents}
                          <span className="text-gray-500 ml-1">
                            ({((test.attendedStudents / test.totalStudents) * 100).toFixed(1)}%)
                          </span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            test.avgScore >= 80
                              ? "bg-green-100 text-green-800"
                              : test.avgScore >= 60
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {test.status === "completed" ? `${test.avgScore}%` : "N/A"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            test.status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {test.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDownloadReport(test.id)}
                          disabled={test.status !== "completed"}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-[#235a81] bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Download size={14} />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      No tests found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <PaginationControls
            currentPage={currentTestPage}
            totalPages={totalTestPages}
            onPageChange={setCurrentTestPage}
            label="tests"
          />
        </div>

        {/* Student Performance Table */}
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Performance & Consistency</h2>
          <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr className="text-white text-left" style={{ backgroundColor: "#235a81" }}>
                  <th className="py-3 px-4 border-b" style={{ borderColor: "#235a81", color: "white" }}>
                    Admission No
                  </th>
                  <th className="py-3 px-4 border-b" style={{ borderColor: "#235a81", color: "white" }}>
                    Student Name
                  </th>
                  <th className="py-3 px-4 border-b" style={{ borderColor: "#235a81", color: "white" }}>
                    Tests Attended
                  </th>
                  <th className="py-3 px-4 border-b" style={{ borderColor: "#235a81", color: "white" }}>
                    Avg Score
                  </th>
                  <th className="py-3 px-4 border-b" style={{ borderColor: "#235a81", color: "white" }}>
                    Consistency
                  </th>
                  <th className="py-3 px-4 border-b" style={{ borderColor: "#235a81", color: "white" }}>
                    Last Test Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student) => (
                    <tr key={student.admissionNo} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{student.admissionNo}</td>
                      <td className="py-3 px-4">{student.name}</td>
                      <td className="py-3 px-4">
                        {student.testsAttended}/{student.totalTests}
                        <span className="text-gray-500 ml-1">
                          ({((student.testsAttended / student.totalTests) * 100).toFixed(0)}%)
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            student.avgScore >= 80
                              ? "bg-green-100 text-green-800"
                              : student.avgScore >= 60
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.avgScore.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getConsistencyColor(student.consistency)}`}
                        >
                          {student.consistency}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">{student.lastTestScore}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      No students found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <PaginationControls
            currentPage={currentStudentPage}
            totalPages={totalStudentPages}
            onPageChange={setCurrentStudentPage}
            label="students"
          />
        </div>
      </div>
    </div>
  )
}
