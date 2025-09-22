"use client"

import React, { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"

export default function AdminHome() {
  const [liveAssessments, setLiveAssessments] = useState([])
  const [showAssignmentSection, setShowAssignmentSection] = useState(null)
  const [selectedBranch, setSelectedBranch] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
 const [branchSectionData, setBranchSectionData] = useState([])
  // const branches = [
  //   { id: "CSE", name: "Computer Science Engineering" },
  //   { id: "ECE", name: "Electronics & Communication" },
  //   { id: "ME", name: "Mechanical Engineering" },
  //   { id: "CE", name: "Civil Engineering" },
  //   { id: "IT", name: "Information Technology" },
  // ]

  // const sections = [
  //   { id: "A", name: "Section A" },
  //   { id: "B", name: "Section B" },
  //   { id: "C", name: "Section C" },
  // ]

// Fetch branches + sections from backend
  useEffect(() => {
    const fetchBranchSections = async () => {
      try {
        const res = await fetch("http://localhost:8081/admin/branchesSections")
        const data = await res.json();
        console.log(data);
   
        const formatted = data.map(([branch, section]) => ({ branch, section }))
        setBranchSectionData(formatted)
      } catch (err) {
        console.error("Error fetching branch-section data:", err)
      }
    }

    fetchBranchSections()
  }, [])

  // 🔹 Extract unique branches
  const branches = [...new Set(branchSectionData.map((item) => item.branch))]

  // 🔹 Extract sections for selected branch
  const sections = branchSectionData
    .filter((item) => item.branch === selectedBranch)
    .map((item) => item.section)


  // Fetch valid tests
  useEffect(() => {
    const fetchValidTests = async () => {
      try {
        const res = await fetch("http://localhost:8081/admin/validTests");
        const data = await res.json()

        const formattedTests = data.map((test) => ({
          id: test.id,
          name: test.title,
          startTime: new Date(test.startTime).toLocaleString(),
          endTime: new Date(test.endTime).toLocaleString(),
        }))

        setLiveAssessments(formattedTests)
      } catch (err) {
        console.error("Error fetching valid tests:", err)
      }
    }

    fetchValidTests()
  }, [])

  const handleAssignStudents = (assessmentId) => {
    if (showAssignmentSection === assessmentId) {
      setShowAssignmentSection(null)
    } else {
      setShowAssignmentSection(assessmentId)
      setSelectedBranch("")
      setSelectedSection("")
      setStudents([])
    }
  }

  const fetchStudents = async (testId) => {
    if (!selectedBranch || !selectedSection) return

    setLoading(true)
    try {
      const response = await fetch(
        `http://localhost:8081/admin/studentsbybranchandsection?branch=${selectedBranch}&section=${selectedSection}&testId=${testId}`,
      )
      const data = await response.json()

      setStudents(data) 
    } catch (error) {
      console.error("Error fetching students:", error)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedBranch && selectedSection && showAssignmentSection) {
      fetchStudents(showAssignmentSection)
    }
  }, [selectedBranch, selectedSection, showAssignmentSection])

  const toggleAttendance = async (admissionNumber, currentAttendance) => {
  const newAttendance = currentAttendance;
console.log(newAttendance);

  try {
    const url = `http://localhost:8081/admin/toggleStudentAttendance?testId=${showAssignmentSection}&admission_number=${admissionNumber}&attendance=${newAttendance}`

    await fetch(url, { method: "POST" })  // or GET if your backend expects that

    setStudents((prev) =>
      prev.map((student) =>
        student.admissionNumber === admissionNumber
          ? { ...student, attendance: newAttendance ==="Present"?"Absent":"Present"}
          : student,
      ),
    )
  } catch (error) {
    console.error("Error updating attendance:", error)
  }
}

  return (
    <>
      {liveAssessments.length > 0 ? (
        liveAssessments.map((assessment) => (
          <div key={assessment.id}>
            <div className="bg-white p-6 rounded-lg shadow-md w-full mx-auto mb-4">
              <div className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <h2 className="text-xl font-semibold text-[#235a81] mb-4">Live Assessments</h2>
                  <p className="text-sm text-gray-700">
                    • {assessment.id} {assessment.name} ({assessment.startTime} - {assessment.endTime})
                  </p>
                </div>
                <button
                  className="inline-flex bg-[#235a81] items-center justify-center whitespace-nowrap rounded-md text-sm font-medium text-white px-4 py-2"
                  onClick={() => handleAssignStudents(assessment.id)}
                >
                  {showAssignmentSection === assessment.id ? "Hide Assignment" : "Assign Students"}
                </button>
              </div>

              {showAssignmentSection === assessment.id && (
               <div className="p-6">
      <h2 className="text-xl font-semibold text-[#235a81] mb-4">Assign Students</h2>

      {/* Branch Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Branch</label>
        <div className="relative">
          <select
            value={selectedBranch}
            onChange={(e) => {
              setSelectedBranch(e.target.value)
              setSelectedSection("") // reset section when branch changes
            }}
            className="w-full p-3 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#235a81]"
          >
            <option value="">Choose Branch</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Section Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Section</label>
        <div className="relative">
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#235a81]"
            disabled={!selectedBranch}
          >
            <option value="">Choose Section</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  )
} 
              
            </div>

            {showAssignmentSection === assessment.id && students.length > 0 && !loading && (
              <div className="bg-white p-6 rounded-lg shadow-md w-full mx-auto mb-4">
                <h3 className="text-lg font-semibold text-[#235a81] mb-4">Student List</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-[#235a81]">
                        <th className="border border-gray-300 px-4 py-3 text-left font-medium text-white">
                          Admission No
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-medium text-white">Name</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-medium text-white">
                          Attendance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.admissionNumber} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3">{student.admissionNumber}</td>
                          <td className="border border-gray-300 px-4 py-3">{student.name}</td>
                          <td className="border border-gray-300 px-4 py-3 flex items-center justify-center">
                            <button
                              onClick={() => toggleAttendance(student.admissionNumber, student.attendance)}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                student.attendance === "Present"
                                  ? "bg-green-800 text-white hover:bg-green-600"
                                  : "bg-red-800 text-white hover:bg-red-600"
                              }`}
                            >
                              {student.attendance === "Present" ? "Present" : "Absent"}
                            </button>
                          </td>           
             </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No live assessments available.</p>
      )}
    </>
  )
}