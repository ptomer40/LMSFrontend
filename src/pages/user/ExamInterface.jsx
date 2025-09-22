"use client"

import { useState, useEffect } from "react"
import { useLocation,useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, Clock, AlertTriangle } from "lucide-react"

const ExamInterface = () => {
  const location = useLocation()
  const {test,admissionNumber} = location.state || [];
  console.log("hiii"+admissionNumber)
  console.log(test);
 useEffect(() => {
    console.log(test);
  }, [test]);
  // Extract mcqQuestions safely
  const mcqQuestions = test?.mcqQuestions || [];
 

  // Initialize questions from mcqQuestions instead of API
  const [questions, setQuestions] = useState(mcqQuestions)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [markedForReview, setMarkedForReview] = useState(new Set())
  const [timeRemaining, setTimeRemaining] = useState(59 * 60) // 59 minutes in seconds
 console.log("question text:")
  console.log(questions)
  // session management
const navigate=useNavigate();
useEffect(() => {
  
    if (!admissionNumber || admissionNumber.trim() === "") {
      navigate("/logout");
    
  }
}, [admissionNumber, navigate]);
  

// Timer effect (same as before)
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setTimeRemaining((prev) => {
  //       if (prev <= 0) {
  //         clearInterval(timer)
  //         return 0
  //       }
  //       return prev - 1
  //     })
  //   }, 1000)

  //   return () => clearInterval(timer)
  // }, [])

  const currentQuestion = questions[currentQuestionIndex] || null

  if (!test) {
    return (
      <div className="p-10 text-center text-lg font-medium text-red-600">
        No test data found. Please start the test from the instructions page.
      </div>
    )
  }

  if (!currentQuestion) {
    return <div className="p-10 text-center text-lg font-medium">Loading Questions...</div>
  }

  // Helper functions - same as your original code, just without the API fetching

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes} Minutes ${remainingSeconds} Seconds`
  }

  const handleAnswerSelect = (selectedOption) => {
    const questionId = currentQuestion.id

    setMarkedForReview((prev) => {
      const updated = new Set(prev)
      updated.delete(questionId)
      return updated
    })

    if (currentQuestion.answerType === "radio") {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: selectedOption,
      }))
    } else {
      setAnswers((prev) => {
        const currentAnswers = prev[questionId] || []
        const newAnswers = currentAnswers.includes(selectedOption)
          ? currentAnswers.filter((ans) => ans !== selectedOption)
          : [...currentAnswers, selectedOption]

        return {
          ...prev,
          [questionId]: newAnswers,
        }
      })
    }
  }

  const handleSaveAndNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handleMarkForReview = () => {
    setMarkedForReview((prev) => new Set([...prev, currentQuestion.id]))

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handleQuestionNavigation = (questionIndex) => {
    setCurrentQuestionIndex(questionIndex)
  }

  const getQuestionStatus = (questionIndex) => {
    const question = questions[questionIndex]
    const isAnswered =
      answers[question.id] &&
      (Array.isArray(answers[question.id]) ? answers[question.id].length > 0 : answers[question.id])
    const isMarkedForReview = markedForReview.has(question.id)
    const isCurrent = questionIndex === currentQuestionIndex

    if (isAnswered && isMarkedForReview) {
      return "bg-orange-500 text-white"
    } else if (isAnswered) {
      return "bg-green-500 text-white"
    } else if (isMarkedForReview) {
      return "bg-yellow-500 text-white"
    } else if (isCurrent) {
      return "bg-red-500 text-white"
    }
    return "bg-purple-600 text-white"
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).filter((questionId) => {
      const answer = answers[questionId]
      return Array.isArray(answer) ? answer.length > 0 : answer
    }).length
  }

  const isOptionSelected = (option) => {
    const questionId = currentQuestion.id
    const ans = answers[questionId]
    return Array.isArray(ans) ? ans.includes(option) : ans === option
  }

  const handleSubmitTest = () => {
    const confirmed = window.confirm("Are you sure you want to submit the test?")
    if (confirmed) {
      console.log("Test submitted with answers:", answers)
      alert("Test submitted successfully!")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          {admissionNumber}
          <div className="flex items-center space-x-6">
            <div className="text-gray-700 font-medium">Question No. {currentQuestion.id}</div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleMarkForReview}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              Mark for Review & Next
            </button>
            <button
              onClick={handleSaveAndNext}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Save & Next
            </button>
            <button
              onClick={handleSubmitTest}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Total Questions Answered:{" "}
            <span className="font-bold text-orange-600">{getAnsweredCount()}</span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-red-600 font-bold">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeRemaining)}</span>
            </div>

            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Report</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
          {/* Part Tabs */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 text-white text-sm font-medium rounded bg-purple-600 hover:opacity-90 transition-opacity">
                Part A
              </span>
            </div>
          </div>

          {/* Subject */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-md font-semibold text-gray-600">React Js</span>
              <div className="flex space-x-1">
                <button
                  onClick={() => currentQuestionIndex > 0 && setCurrentQuestionIndex((prev) => prev - 1)}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    currentQuestionIndex < questions.length - 1 && setCurrentQuestionIndex((prev) => prev + 1)
                  }
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Question Navigation Grid */}
          <div className="p-4">
            <div className="grid grid-cols-5 gap-2 mb-4">
              {questions.map((question, index) => (
                <button
                  key={question.id}
                  onClick={() => handleQuestionNavigation(index)}
                  className={`w-10 h-10 text-sm font-medium rounded transition-colors ${getQuestionStatus(
                    index
                  )} hover:opacity-80`}
                >
                  {question.id}
                </button>
              ))}
            </div>
          </div>

          {/* Analysis Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-100 p-3 rounded">
              <h3 className="font-medium text-gray-800 mb-2">PART-A Analysis</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Answered</span>
                  <span className="bg-yellow-400 px-2 py-1 rounded text-xs font-bold">{getAnsweredCount()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Not Answered</span>
                  <span className="bg-yellow-400 px-2 py-1 rounded text-xs font-bold">
                    {questions.length - getAnsweredCount()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Marked for Review</span>
                  <span className="bg-yellow-400 px-2 py-1 rounded text-xs font-bold">{markedForReview.size}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Question */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-6">{currentQuestion.question_text}</h2>

              {/* Reference Figure (if exists) */}
              {currentQuestion.questionImage && (
                <div className="mb-6 flex justify-center">
                  <img src={currentQuestion.questionImage} alt="Question" className="border rounded w-40 h-40" />
                </div>
              )}

              {/* Answer Options */}
              <div className="space-y-4">
                {currentQuestion.questionOptions.map((opt, i) => (
                  <label
                    key={i}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isOptionSelected(opt) ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-4 w-full">
                      <input
                        type={currentQuestion.answerType === "radio" ? "radio" : "checkbox"}
                        name={`question-${currentQuestion.id}`}
                        value={opt}
                        checked={isOptionSelected(opt)}
                        onChange={() => handleAnswerSelect(opt)}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="font-medium text-gray-700">
                        {String.fromCharCode(65 + i)}. {opt}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* NAVIGATION */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => currentQuestionIndex > 0 && setCurrentQuestionIndex((p) => p - 1)}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => currentQuestionIndex < questions.length - 1 && setCurrentQuestionIndex((p) => p + 1)}
                disabled={currentQuestionIndex === questions.length - 1}
                className="px-6 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamInterface
