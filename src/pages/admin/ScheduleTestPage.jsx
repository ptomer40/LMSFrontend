"use client"

import { useState, useEffect } from "react"
import { Calendar, ChevronDown } from "lucide-react"

export default function ScheduleTestPage() {
  const [testTitle, setTestTitle] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [activeTab, setActiveTab] = useState("coding") // For switching between question types in UI

    // Available questions from API
  const [availableCodingQuestions, setAvailableCodingQuestions] = useState([])
  const [availableMCQQuestions, setAvailableMCQQuestions] = useState([])

  // Separate state for selected questions
  const [selectedCodingQuestions, setSelectedCodingQuestions] = useState([])
  const [selectedMCQQuestions, setSelectedMCQQuestions] = useState([])

  // Loading & error state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

    // Fetch data from APIs
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        setError("")

        const [codingRes, mcqRes] = await Promise.all([
          fetch("http://localhost:8081/admin/questions"),
          fetch("http://localhost:8081/api/question-mcq"),
        ])

        if (!codingRes.ok || !mcqRes.ok) {
          throw new Error("Failed to fetch questions")
        }

        const codingData = await codingRes.json()
        const mcqData = await mcqRes.json()

        console.log("Coding Questions:", codingData)
        console.log("MCQ Questions:", mcqData)

        setAvailableCodingQuestions(codingData)
        setAvailableMCQQuestions(mcqData)
      } catch (err) {
        setError(err.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  // Get current available questions based on active tab
  const getCurrentAvailableQuestions = () => {
    return activeTab === "coding" ? availableCodingQuestions : availableMCQQuestions
  }


  const handleAddQuestion = (questionId, questionType) => {
    let questionToAdd

    if (questionType === "coding") {
      questionToAdd = availableCodingQuestions.find((q) => q.id === questionId)
      if (questionToAdd) {
        setAvailableCodingQuestions((prev) => prev.filter((q) => q.id !== questionId))
        setSelectedCodingQuestions((prev) => [...prev, questionToAdd])
      }
    } else {
      questionToAdd = availableMCQQuestions.find((q) => q.id === questionId)
      if (questionToAdd) {
        setAvailableMCQQuestions((prev) => prev.filter((q) => q.id !== questionId))
        setSelectedMCQQuestions((prev) => [...prev, questionToAdd])
      }
    }
  }

  const handleRemoveQuestion = (questionId, questionType) => {
    if (questionType === "coding") {
      const questionToRemove = selectedCodingQuestions.find((q) => q.id === questionId)
      if (questionToRemove) {
        setAvailableCodingQuestions((prev) => [...prev, questionToRemove].sort((a, b) => a.id - b.id))
        setSelectedCodingQuestions((prev) => prev.filter((q) => q.id !== questionId))
      }
    } else {
      const questionToRemove = selectedMCQQuestions.find((q) => q.id === questionId)
      if (questionToRemove) {
        setAvailableMCQQuestions((prev) => [...prev, questionToRemove].sort((a, b) => a.id - b.id))
        setSelectedMCQQuestions((prev) => prev.filter((q) => q.id !== questionId))
      }
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    // Clear difficulty filter when switching tabs
    setDifficulty("")
  }

 const handleScheduleTest = async () => {
  const testData = {
    title: testTitle,
    startTime: startTime,
    endTime: endTime,
    questionIds: selectedCodingQuestions.map(q => q.id),
    mcqQuestionIds: selectedMCQQuestions.map(q => q.id)
  }

  try {
    const response = await fetch("http://localhost:8081/admin/scheduleTest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    const result = await response.text;
    console.log("Test Scheduled Successfully:", result)
    alert("✅ Test Scheduled Successfully!")

    // Clear form after scheduling
    setTestTitle("")
    setStartTime("")
    setEndTime("")
    setDifficulty("")
    setSelectedCodingQuestions([])
    setSelectedMCQQuestions([])

  } catch (error) {
    console.error("Failed to schedule test:", error)
    alert(`❌ Failed to schedule test: ${error.message}`)
  }
}


  // Filter available questions based on selected difficulty and active tab
  const filteredAvailableQuestions = difficulty
    ? getCurrentAvailableQuestions().filter((q) => q.level.toLowerCase() === difficulty.toLowerCase())
    : getCurrentAvailableQuestions()


    const inputClasses =
    "flex h-10 w-full rounded-md border border-gray-300 bg-[#ebf6fc] px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#235a81] focus:border-[#235a81] disabled:cursor-not-allowed disabled:opacity-50"
    const textareaClasses =
    "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-[#ebf6fc] px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#235a81] focus:border-[#235a81] disabled:cursor-not-allowed disabled:opacity-50"

    if (loading) return <div className="p-6 text-center">Loading questions...</div>
  if (error) return <div className="p-6 text-center text-red-600">Error: {error}</div>

  return (
    <div className="grid gap-6">
      <div className=" p-4 bg-gray-50 min-h-screen  border-2 border-gray-200  rounded-2xl">
        <h1 className="text-2xl font-bold mb-6 text-[#235a81]">Schedule Test</h1>
        <div className="space-y-6 mb-8">
          {/* Test Title */}
          <div>
            <label htmlFor="test-title" className="block text-sm font-medium text-gray-700 mb-1">
              Test Title:
            </label>
            <input
              type="text"
              id="test-title"
              className={`w-full ${inputClasses}`}
              placeholder=""
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
            />
          </div>

          {/* Start Time */}
          <div>
            <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1">
              Start Time:
            </label>
            <div className="relative w-[12rem]" >
              <input
                type="datetime-local"
                id="start-time"
                className={`w-full ${inputClasses} pr-10`}
                placeholder="dd-mm-yyyy --:--"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-admin h-5 w-5" /> */}
            </div>
          </div>

          {/* End Time */}
          <div>
            <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1">
              End Time:
            </label>
            <div className="relative w-[12rem]">
              <input
                type="datetime-local"
                id="end-time"
                className={`w-full ${inputClasses} pr-10`}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
              {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-admin h-5 w-5" /> */}
            </div>
          </div>

          {/* Search Questions by Difficulty */}
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
              Search Questions by Difficulty:
            </label>
            <div className="relative " >
              <select
                id="difficulty"
                className="w-full px-3 py-2 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-admin bg-[#ebf6fc] pr-10"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-admin h-5 w-5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Question Type Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleTabChange("coding")}
                className={`py-2 px-1 border-b-2  text-md font-semibold outline-none ${
                  activeTab === "coding"
                    ? "border-[#235a81] text-[#235a81]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Coding Questions
              </button>
              <button
                onClick={() => handleTabChange("mcq")}
                className={`py-2 px-1 border-b-2 font-semibold text-md outline-none ${
                  activeTab === "mcq"
                    ? "border-[#235a81] text-[#235a81]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                MCQ Questions
              </button>
            </nav>
          </div>
        </div>

        {/* Available Questions Table */}
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Available {activeTab === "coding" ? "Coding" : "MCQ"} Questions
        </h2>
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 mb-8">
          <table className="min-w-full bg-white border-collapse">
            <thead>
              <tr className="bg-[#235a81] text-white text-left">
                <th className="py-3 px-4 border-b border-[#235a81] w-[8%]">ID</th>
                <th className="py-3 px-4 border-b border-[#235a81] w-[10%]">Level</th>
                <th className="py-3 px-4 border-b border-[#235a81] w-[40%]">Question Text</th>
                <th className="py-3 px-4 border-b border-[#235a81] w-[10%]">Marks</th>
                <th className="py-3 px-4 border-b border-[#235a81] w-[10%]">Language</th>
                <th className="py-3 px-4 border-b border-[#235a81] w-[12%]">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAvailableQuestions.length > 0 ? (
                filteredAvailableQuestions.map((question) => (
                  <tr key={question.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 align-top">{question.id}</td>
                    <td className="py-3 px-4 align-top">{question.level}</td>
                    <td className="py-3 px-4 align-top text-sm">{question.question_text}</td>
                    <td className="py-3 px-4 align-top">{question.marks}</td>
                    <td className="py-3 px-4 align-top">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          question.type === "coding" ? "bg-[#235a81] text-white" : "bg-[#235a81] text-white"
                        }`}
                      >
                        {question.language}
                      </span>
                    </td>
                    <td className="py-3 px-4 align-top">
                      <button
                        onClick={() => handleAddQuestion(question.id, activeTab)}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#235a81] opacity-96 hover:opacity-100 text-white px-3 py-1"
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    No available {activeTab} questions to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Selected Coding Questions Table */}
        {selectedCodingQuestions.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Selected Coding Questions
              <span className="text-sm font-normal text-gray-600 ml-2">
                ({selectedCodingQuestions.length} questions,{" "}
                {selectedCodingQuestions.reduce((sum, q) => sum + q.marks, 0)} marks)
              </span>
            </h2>
            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 mb-8">
              <table className="min-w-full bg-white border-collapse">
                <thead>
                  <tr className="bg-[#235a81] text-white text-left">
                    <th className="py-3 px-4 border-b border-[#235a81] w-[8%]">ID</th>
                    <th className="py-3 px-4 border-b border-[#235a81] w-[10%]">Level</th>
                    <th className="py-3 px-4 border-b border-[#235a81] w-[40%]">Question Text</th>
                    <th className="py-3 px-4 border-b border-[#235a81] w-[10%]">Marks</th>
                    <th className="py-3 px-4 border-b border-[#235a81] w-[10%]">Language</th>
                    <th className="py-3 px-4 border-b border-[#235a81] w-[12%]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCodingQuestions.map((question) => (
                    <tr key={question.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 align-top">{question.id}</td>
                      <td className="py-3 px-4 align-top">{question.level}</td>
                      <td className="py-3 px-4 align-top text-sm">{question.question_text}</td>
                      <td className="py-3 px-4 align-top">{question.marks}</td>
                      <td className="py-3 px-4 align-top">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-[#235a81] text-white">
                          {question.language}
                        </span>
                      </td>
                      <td className="py-3 px-4 align-top">
                        <button
                          onClick={() => handleRemoveQuestion(question.id, "coding")}
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 hover:bg-red-700 text-white px-3 py-1"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Selected MCQ Questions Table */}
        {selectedMCQQuestions.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Selected MCQ Questions
              <span className="text-sm font-normal text-gray-600 ml-2">
                ({selectedMCQQuestions.length} questions, {selectedMCQQuestions.reduce((sum, q) => sum + q.marks, 0)}{" "}
                marks)
              </span>
            </h2>
            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 mb-8">
              <table className="min-w-full bg-white border-collapse">
                <thead>
                  <tr className="bg-[#235a81] text-white text-left">
                    <th className="py-3 px-4 border-b border-[#235a81] w-[8%]">ID</th>
                    <th className="py-3 px-4 border-b border-[#235a81] w-[10%]">Level</th>
                    <th className="py-3 px-4 border-b border-[#235a81] w-[40%]">Question Text</th>
                    <th className="py-3 px-4 border-b border-[#235a81] w-[10%]">Marks</th>
                    <th className="py-3 px-4 border-b border-[#235a81] w-[10%]">Language</th>
                    <th className="py-3 px-4 border-b border-[#235a81] w-[12%]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMCQQuestions.map((question) => (
                    <tr key={question.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 align-top">{question.id}</td>
                      <td className="py-3 px-4 align-top">{question.level}</td>
                      <td className="py-3 px-4 align-top text-sm">{question.question_text}</td>
                      <td className="py-3 px-4 align-top">{question.marks}</td>
                      <td className="py-3 px-4 align-top">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-[#235a81] text-white">
                          {question.language}
                        </span>
                      </td>
                      <td className="py-3 px-4 align-top">
                        <button
                          onClick={() => handleRemoveQuestion(question.id, "mcq")}
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 hover:bg-red-700 text-white px-3 py-1"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* No Questions Selected Message */}
        {selectedCodingQuestions.length === 0 && selectedMCQQuestions.length === 0 && (
          <div className="bg-gray-50 rounded-lg p-8 text-center mb-8">
            <p className="text-gray-500">
              No questions selected yet. Use the tabs above to browse and add questions to your test.
            </p>
          </div>
        )}

        {/* Test Summary */}
        {(selectedCodingQuestions.length > 0 || selectedMCQQuestions.length > 0) && (
          <div className="bg-blue-50 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Test Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Total Questions:</span>
                <span className="ml-2 text-gray-800">
                  {selectedCodingQuestions.length + selectedMCQQuestions.length}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Coding Questions:</span>
                <span className="ml-2 text-gray-800">{selectedCodingQuestions.length}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">MCQ Questions:</span>
                <span className="ml-2 text-gray-800">{selectedMCQQuestions.length}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Total Marks:</span>
                <span className="ml-2 text-gray-800">
                  {selectedCodingQuestions.reduce((sum, q) => sum + q.marks, 0) +
                    selectedMCQQuestions.reduce((sum, q) => sum + q.marks, 0)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Test Button */}
        <div className="text-center">
          <button
            onClick={handleScheduleTest}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#235a81] opacity-93 hover:opacity-100 text-white py-3 px-8 w-full max-w-xs"
          >
            Schedule Test
          </button>
        </div>
      </div>
    </div>
  )
}
