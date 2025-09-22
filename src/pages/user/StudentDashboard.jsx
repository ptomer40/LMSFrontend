"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  FileText,
  Clock,
  Calendar,
  Timer,
  FileQuestion,
  Code,
  CheckCircle,
} from "lucide-react"
import TestInstruction from "../../components/TestInstruction"

const StudentDashboard = () => {
  const [currentView, setCurrentView] = useState("dashboard")
  const [selectedTest, setSelectedTest] = useState(null)
  const [pendingTests, setPendingTests] = useState([])
const [dashboardData, setDashboardData] = useState(null); // store complete data
const [admissionNumber,setAdmissionNumber]=useState(null);
const [loading, setLoading] = useState(true); //for complete load then go to next useEffect
  const summaryStats = [
    {
      number: 3,
      label: "Pending Tests",
      icon: Clock,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      borderColor: "border-yellow-200",
    },
    {
      number: 1,
      label: "Completed",
      icon: CheckCircle,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      number: 4,
      label: "Total Assigned",
      icon: FileText,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
  ]


  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch("http://localhost:8081/dashboard", {
          credentials: "include", // in case you use session
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch pending tests")
        }

        const data = await response.json()
        console.log("Dashboard Data:", data)
         setDashboardData(data);//hold complete data
         console.log(data.admissionNumber);
         setAdmissionNumber(data.admissionNumber);
        setPendingTests(data.tests || []) //hold only test data
      } catch (err) {
        console.error("Error fetching tests:", err)
      }
      finally {
      setLoading(false); // <-- Done loading
    }
    }

    fetchTests()
  }, [])


  
// maintaining session
  const navigate=useNavigate();
useEffect(() => {
  if (!loading) {
    if (!admissionNumber || admissionNumber.trim() === "") {
      navigate("/logout");
    }
  }
}, [loading, admissionNumber, navigate]);

  const handleStartTest = (test) => {
    setSelectedTest(test)
    setCurrentView("instructions")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedTest(null)
  }

  const handleStartSection = (section) => {
    console.log(`Starting ${section} section for test:`, selectedTest.title)
    // This will be implemented later for actual test sections
  }

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 p-4">
        {currentView === "dashboard" ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome, {dashboardData?.name}({dashboardData?.admissionNumber})
              </h1>
              <p className="text-gray-600">
                Here are your assigned tests. Complete them before the due date
                to maintain your progress.
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {summaryStats.map((stat, index) => (
                <div
                  key={index}
                  className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-6`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.number}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {stat.label}
                      </p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Pending Tests */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Pending Tests
              </h2>

              <div className="space-y-4">
                {pendingTests.map((test) => (
                  <div
                    key={test.testId}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Clock className="w-5 h-5 text-yellow-600" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {test.title}
                          </h3>
                          <span className="px-3 py-1 bg-[#235a81] text-white text-xs font-medium rounded-full">
                            Pending
                          </span>
                        </div>

                        {/* Coding Questions */}
                        {test.questions && test.questions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-semibold text-gray-700 mb-1">
                              Coding Questions:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                              {test.questions.map((q) => (
                                <li
                                  key={q.id}
                                  className="text-sm text-gray-600"
                                >
                                  {q.level
                                    ? `${q.level.charAt(0).toUpperCase()}${q.level.slice(1)}`
                                    : "Unknown"}{" "}
                                  - ID: {q.id}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* MCQ Questions */}
                        {test.mcqQuestions &&
                          test.mcqQuestions.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm font-semibold text-gray-700 mb-1">
                                MCQ Questions:
                              </p>
                              <ul className="list-disc list-inside space-y-1">
                                {test.mcqQuestions.map((mcq) => (
                                  <li
                                    key={mcq.id}
                                    className="text-sm text-gray-600"
                                  >
                                    ID: {mcq.id}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>

                      <button
                        onClick={() => handleStartTest(test)}
                        className="ml-6 px-6 py-2 bg-[#235a81] text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        Start Test
                      </button>
                    </div>
                  </div>
                ))}

                {pendingTests.length === 0 && (
                  <p className="text-gray-500 text-center">
                    No active tests available.
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <TestInstruction
            test={selectedTest}
            admissionNumber={admissionNumber}
            onBack={handleBackToDashboard}
            onStartSection={handleStartSection}
          />
        )}
      </div>
    </div>
  )
}

export default StudentDashboard
