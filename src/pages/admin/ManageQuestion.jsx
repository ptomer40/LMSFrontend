"use client"

import { useState, useEffect } from "react"

export default function ManageQuestions() {
  const [selectedQuestionType, setSelectedQuestionType] = useState("coding")
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [editFormData, setEditFormData] = useState({})

  const [codingQuestions, setCodingQuestions] = useState([]);

  const [mcqQuestions, setMcqQuestions] = useState([]);
  const fetchCodingQuestions = async () => {
    const res = await fetch('http://localhost:8081/admin/questions')
    // console.log(res.json());
    if (!res.ok) throw new Error("Failed to fetch coding questions")
    return res.json();
  }
  const updateCodingQuestion = async (id, payload) => {
    const res = await fetch(`http://localhost:8081/admin/updatequestions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error("Failed to update coding question")
    return res.json()
  }
   const fetchMCQQuestions = async () => {
    const res = await fetch(`http://localhost:8081/api/question-mcq`)
    if (!res.ok) throw new Error("Failed to fetch MCQ questions")
    return res.json()
  }
  const updateMCQQuestion = async (id, payload) => {
    const res = await fetch(`http://localhost:8081/api/question-mcq/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error("Failed to update MCQ question")
    return res.json()
  }
   useEffect(() => {
    const loadQuestions = async () => {
      try {
        const codingData = await fetchCodingQuestions();
        console.log(codingData);
        setCodingQuestions(codingData)

        const mcqData = await fetchMCQQuestions()
        setMcqQuestions(mcqData)
      } catch (err) {
        console.error(err)
      }
    }
    loadQuestions()
  }, [])


 const handleEditClick = (question, type) => {
    setEditingQuestion({ ...question, type })
    setEditFormData(question)
  }

  // 🔹 Save edited question
  const handleSaveEdit = async () => {
    try {
      if (editingQuestion.type === "coding") {
        await updateCodingQuestion(editingQuestion.id, editFormData)
        setCodingQuestions((prev) =>
          prev.map((q) => (q.id === editingQuestion.id ? { ...editFormData } : q))
        )
      } else {
        await updateMCQQuestion(editingQuestion.id, editFormData)
        setMcqQuestions((prev) =>
          prev.map((q) => (q.id === editingQuestion.id ? { ...editFormData } : q))
        )
      }
      setEditingQuestion(null)
      setEditFormData({})
    } catch (err) {
      console.error("Error updating question:", err)
      alert("Failed to update question")
    }
  }

  const handleCancelEdit = () => {
    setEditingQuestion(null)
    setEditFormData({})
  }

  const handleInputChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...editFormData.questionOptions]
    newOptions[index] = value
    setEditFormData((prev) => ({ ...prev, questionOptions: newOptions }))
  }

  const renderCodingQuestionsTable = () => (
    <div className="overflow-x-auto shadow-md border border-gray-200">
      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr className="bg-[#235a81] text-white text-left">
            <th className="py-3 px-4 border-b border-gray-300 w-[8%]">Question ID</th>
            <th className="py-3 px-4 border-b border-gray-300 w-[35%]">Question Text</th>
            <th className="py-3 px-4 border-b border-gray-300 w-[35%]">Answer</th>
            <th className="py-3 px-4 border-b border-gray-300 w-[10%]">Level</th>
            <th className="py-3 px-4 border-b border-gray-300 w-[12%]">Action</th>
          </tr>
        </thead>
        <tbody>
          {codingQuestions.map((question) => (
            <tr key={question.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-3 px-4 align-top">{question.id}</td>
              <td className="py-3 px-4 align-centre text-sm max-w-xs no-scrollbar">
                {editingQuestion?.id === question.id && editingQuestion?.type === "coding" ? (
                  <textarea
                    value={editFormData.question_text || ""}
                    onChange={(e) => handleInputChange("question_text", e.target.value)}
                    className="w-full min-h-80 p-2 border border-gray-300 rounded text-sm"
                    placeholder="Enter question text..."
                  />
                ) : (
                  question.question_text
                )}
              </td>
              <td className="py-3 px-4 align-centre text-sm max-w-xs max-h-fit overflow-x-scroll">
                {editingQuestion?.id === question.id && editingQuestion?.type === "coding" ? (
                  <textarea
                    value={editFormData.question_answer || ""}
                    onChange={(e) => handleInputChange("question_answer", e.target.value)}
                    className="w-full min-h-80 p-2 border border-gray-300 rounded text-sm"
                    placeholder="Enter answer..."
                  />
                ) : (
                  <div className="">{question.question_answer}</div>
                )}
              </td>
              <td className="py-3 px-4 align-top">
                {editingQuestion?.id === question.id && editingQuestion?.type === "coding" ? (
                  <select
                    value={editFormData.level || ""}
                    onChange={(e) => handleInputChange("level", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                ) : (
                  question.level
                )}
              </td>
              <td className="py-3 px-4 align-top flex flex-col sm:flex-row gap-2">
                {editingQuestion?.id === question.id && editingQuestion?.type === "coding" ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditClick(question, "coding")}
                      className="bg-[#235a81] opacity-95 hover:opacity-100 text-white font-bold py-2 px-4 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm">
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderMCQQuestionsTable = () => (
    <div className="overflow-x-auto shadow-md border border-gray-200">
      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr className="bg-[#235a81] text-white text-left">
            <th className="py-3 px-4 border-b border-gray-300 w-[8%]">Question ID</th>
            <th className="py-3 px-4 border-b border-gray-300 w-[25%]">Question Text</th>
            <th className="py-3 px-4 border-b border-gray-300 w-[20%]">Options</th>
            <th className="py-3 px-4 border-b border-gray-300 w-[12%]">Correct Answer</th>
            <th className="py-3 px-4 border-b border-gray-300 w-[8%]">Level</th>
            <th className="py-3 px-4 border-b border-gray-300 w-[8%]">Marks</th>
            <th className="py-3 px-4 border-b border-gray-300 w-[7%]">Duration</th>
            <th className="py-3 px-4 border-b border-gray-300 w-[12%]">Action</th>
          </tr>
        </thead>
        <tbody>
          {mcqQuestions.map((question) => (
            <tr key={question.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-3 px-4 align-top">{question.id}</td>
              <td className="py-3 px-4 align-top text-md no-scrollbar">
                {editingQuestion?.id === question.id && editingQuestion?.type === "mcq" ? (
                  <textarea
                    value={editFormData.question_text || ""}
                    onChange={(e) => handleInputChange("question_text", e.target.value)}
                    className="w-full h-20 p-2 border border-gray-300 rounded text-sm"
                    placeholder="Enter question text..."
                  />
                ) : (
                  question.question_text
                )}
              </td>
              <td className="py-3 px-4 align-top text-sm">
                {editingQuestion?.id === question.id && editingQuestion?.type === "mcq" ? (
                  <div className="space-y-1">
                    {editFormData.questionOptions?.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                        placeholder={`Option ${index + 1}`}
                      />
                    ))}
                  </div>
                ) : (
                  <ul className="list-disc list-inside">
                    {question.questionOptions.map((option, index) => (
                      <li key={index} className="text-md">
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </td>
              <td className="py-3 px-4 align-top text-md font-semibold text-green-600">
                {editingQuestion?.id === question.id && editingQuestion?.type === "mcq" ? (
                  <input
                    type="text"
                    value={editFormData.question_answer || ""}
                    onChange={(e) => handleInputChange("question_answer", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-md"
                    placeholder="Correct answer..."
                  />
                ) : (
                  question.question_answer
                )}
              </td>
              <td className="py-3 px-4 align-top">
                {editingQuestion?.id === question.id && editingQuestion?.type === "mcq" ? (
                  <select
                    value={editFormData.level || ""}
                    onChange={(e) => handleInputChange("level", e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                ) : (
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      question.level === "Easy"
                        ? "bg-green-100 text-green-800"
                        : question.level === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {question.level}
                  </span>
                )}
              </td>
              <td className="py-3 px-4 align-top text-sm">
                {editingQuestion?.id === question.id && editingQuestion?.type === "mcq" ? (
                  <input
                    type="number"
                    value={editFormData.marks || ""}
                    onChange={(e) => handleInputChange("marks", Number.parseInt(e.target.value))}
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                    placeholder="Marks"
                  />
                ) : (
                  question.marks
                )}
              </td>
              <td className="py-3 px-4 align-top text-sm">
                {editingQuestion?.id === question.id && editingQuestion?.type === "mcq" ? (
                  <input
                    type="number"
                    value={editFormData.duration || ""}
                    onChange={(e) => handleInputChange("duration", Number.parseInt(e.target.value))}
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                    placeholder="Duration"
                  />
                ) : (
                  `${question.duration}s`
                )}
              </td>
              <td className="py-3 px-4 align-top flex flex-col sm:flex-row gap-2">
                {editingQuestion?.id === question.id && editingQuestion?.type === "mcq" ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditClick(question, "mcq")}
                      className="bg-[#235a81] opacity-95 hover:opacity-100 text-white font-bold py-2 px-4 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm">
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="p-4 min-h-screen rounded-2xl">
      <h1 className="text-2xl font-bold mb-6 text-[#235a81]">Manage Questions</h1>

      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-[#235a81] mb-3">Select Question Type</h3>
        <div className="flex gap-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="questionType"
              value="coding"
              checked={selectedQuestionType === "coding"}
              onChange={(e) => setSelectedQuestionType(e.target.value)}
              className="mr-2 w-4 h-4 text-[#235a81] focus:ring-[#235a81]"
            />
            <span className="text-gray-700 font-medium">Coding Questions</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="questionType"
              value="mcq"
              checked={selectedQuestionType === "mcq"}
              onChange={(e) => setSelectedQuestionType(e.target.value)}
              className="mr-2 w-4 h-4 text-[#235a81] focus:ring-[#235a81]"
            />
            <span className="text-gray-700 font-medium">MCQ Questions</span>
          </label>
        </div>
      </div>

      {selectedQuestionType === "coding" ? renderCodingQuestionsTable() : renderMCQQuestionsTable()}
    </div>
  )
}