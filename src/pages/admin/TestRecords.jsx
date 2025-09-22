"use client"

import { useState } from "react"
import { Eye, Download } from "lucide-react"
import TestAnalysisModal from "../../components/TestAnalysisModal"


const TestRecords = ({ testsData = [], loading = false, error = null }) => {
  const [selectedTest, setSelectedTest] = useState(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Sample data structure for demonstration
  const sampleTests = [
    {
      id: "01",
      name: "Data Structures & Algorithms",
      date: "2024-01-15",
      duration: "120 min",
      totalQuestions: 25,
      mcqQuestions: 15,
      codingQuestions: 10,
      totalStudents: 45,
      attemptedStudents: 42,
      avgScore: 78.5,
      maxScore: 100,
      students: [
        { admissionNo: "ADM001", name: "John Doe", mcqMarks: 28, codingMarks: 45, totalMarks: 73 },
        { admissionNo: "ADM002", name: "Jane Smith", mcqMarks: 32, codingMarks: 48, totalMarks: 80 },
        { admissionNo: "ADM003", name: "Mike Johnson", mcqMarks: 25, codingMarks: 42, totalMarks: 67 },
        
      ],
    },
    {
      id: "02",
      name: "Web Development Fundamentals",
      date: "2024-01-20",
      duration: "90 min",
      totalQuestions: 20,
      mcqQuestions: 12,
      codingQuestions: 8,
      totalStudents: 38,
      attemptedStudents: 35,
      avgScore: 82.3,
      maxScore: 100,
      students: [
        { admissionNo: "ADM001", name: "John Doe", mcqMarks: 30, codingMarks: 52, totalMarks: 82 },
        { admissionNo: "ADM004", name: "Sarah Wilson", mcqMarks: 35, codingMarks: 48, totalMarks: 83 },
      ],
    },
  ]

  const displayTests = testsData.length > 0 ? testsData : sampleTests

  const filteredTests = displayTests.filter(
    (test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewAnalysis = (test) => {
    setSelectedTest(test)
    setShowAnalysis(true)
  }

  const handleDownloadReport = (test) => {
    const csvContent = generateCSVReport(test)
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${test.name}_Report.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generateCSVReport = (test) => {
    const headers = ["Admission No", "Name", "MCQ Marks", "Coding Marks", "Total Marks", "Percentage"]
    const rows = test.students.map((student) => [
      student.admissionNo,
      student.name,
      student.mcqMarks,
      student.codingMarks,
      student.totalMarks,
      ((student.totalMarks / test.maxScore) * 100).toFixed(2) + "%",
    ])

    return [headers, ...rows].map((row) => row.join(",")).join("\n")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading tests...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Management</h1>

          {/* Search Bar */}
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search by test name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tests Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#235a81] text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white bg-[#235a81]">Test ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white bg-[#235a81]">Test Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white bg-[#235a81]">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white bg-[#235a81]">Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white bg-[#235a81]">Students</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white bg-[#235a81]">Avg Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white bg-[#235a81]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.map((test, index) => (
                  <tr key={test.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{test.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{test.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{test.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{test.duration}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {test.attemptedStudents}/{test.totalStudents}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{test.avgScore}%</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewAnalysis(test)}
                          className="flex items-center gap-1 px-3 py-1 bg-[#235a81] text-white rounded hover:bg-[#1d4d6e] cursor-pointer transition-colors"
                        >
                          <Eye size={16} />
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadReport(test)}
                          className="flex items-center gap-1 px-3 py-1 bg-green-800 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
                        >
                          <Download size={16} />
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analysis Modal */}
        <TestAnalysisModal test={selectedTest} isOpen={showAnalysis} onClose={() => setShowAnalysis(false)} />
      </div>
    </div>
  )
}

export default TestRecords
