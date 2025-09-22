"use client"

import { useState } from "react"
import { AddQuestionForm } from "../../components/AddQuestionForm"
import QuestionForm from "../../components/QuestionForm"


export default function AddQuestionPage() {
  const [questionType, setQuestionType] = useState("mcq")

  const inputClasses =
    "flex h-10 w-full rounded-md border border-gray-300 bg-[#c9e2f0] px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#235a81] focus:border-[#235a81] disabled:cursor-not-allowed disabled:opacity-50"
  const textareaClasses =
    "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-[#c9e2f0] px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#235a81] focus:border-[#235a81] disabled:cursor-not-allowed disabled:opacity-50"
  const buttonClasses =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-[#235a81] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 border-2 border-gray-200  rounded-2xl">
      <h1 className="text-2xl font-bold text-[#235a81]">Add Question</h1>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-700">Question Type:</label>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="mcq"
              name="questionType"
              value="mcq"
              checked={questionType === "mcq"}
              onChange={() => setQuestionType("mcq")}
              className="h-4 w-4 border border-gray-300 text-[#235a81] focus:ring-[#235a81]"
            />
            <label htmlFor="mcq" className="text-sm font-medium text-gray-700">
              MCQ Question
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="coding"
              name="questionType"
              value="coding"
              checked={questionType === "coding"}
              onChange={() => setQuestionType("coding")}
              className="h-4 w-4 border border-gray-300 text-[#235a81] focus:ring-[#235a81]"
            />
            <label htmlFor="coding" className="text-sm font-medium text-gray-700">
              Coding Question
            </label>
          </div>
        </div>
      </div>

      {questionType === "mcq" ? (
        <AddQuestionForm />
      ) : (
        <QuestionForm/>
      )}
    </div>
  )
}
