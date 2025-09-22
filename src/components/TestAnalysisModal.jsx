"use client"

import { X, Users, TrendingUp, Award } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const TestAnalysisModal = ({ test, isOpen, onClose }) => {
  if (!isOpen || !test) return null

  const getAnalysisChartData = (test) => {
    const scoreRanges = [
      { range: "90-100", count: 0, color: "#22c55e" },
      { range: "80-89", count: 0, color: "#3b82f6" },
      { range: "70-79", count: 0, color: "#f59e0b" },
      { range: "60-69", count: 0, color: "#ef4444" },
    //   { range: "Below 60", count: 0, color: "#6b7280" },
    ]

    test.students.forEach((student) => {
      const percentage = (student.totalMarks / test.maxScore) * 100
      if (percentage >= 90) scoreRanges[0].count++
      else if (percentage >= 80) scoreRanges[1].count++
      else if (percentage >= 70) scoreRanges[2].count++
      else if (percentage >= 60) scoreRanges[3].count++
      else scoreRanges[4].count++
    })

    return scoreRanges
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    onClick={onClose}>
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto no-scrollbar"
      onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Test Analysis: {test.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="text-blue-600" size={24} />
                <div>
                  <p className="text-sm text-gray-600">Students Attempted</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {test.attemptedStudents}/{test.totalStudents}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-green-600" size={24} />
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-green-600">{test.avgScore}%</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center gap-3">
                <Award className="text-purple-600" size={24} />
                <div>
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {((test.attemptedStudents / test.totalStudents) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Score Distribution Bar Chart */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Score Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getAnalysisChartData(test)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Score Distribution Pie Chart */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getAnalysisChartData(test)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ range, count }) => `${range}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {getAnalysisChartData(test).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Student Performance Table */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Student Performance Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-[#235a81] text-white">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white bg-[#235a81]">Admission No</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white bg-[#235a81]">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white bg-[#235a81]">MCQ Marks</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white bg-[#235a81]">Coding Marks</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white bg-[#235a81]">Total Marks</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white bg-[#235a81]">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {test.students.map((student, index) => (
                    <tr key={student.admissionNo} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="px-4 py-3 text-sm font-medium">{student.admissionNo}</td>
                      <td className="px-4 py-3 text-sm">{student.name}</td>
                      <td className="px-4 py-3 text-sm">{student.mcqMarks}</td>
                      <td className="px-4 py-3 text-sm">{student.codingMarks}</td>
                      <td className="px-4 py-3 text-sm font-medium">{student.totalMarks}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            (student.totalMarks / test.maxScore) * 100 >= 80
                              ? "bg-green-100 text-green-800"
                              : (student.totalMarks / test.maxScore) * 100 >= 60
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {((student.totalMarks / test.maxScore) * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestAnalysisModal
