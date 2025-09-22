"use client"

import { useState } from "react"
import { PlusCircle, MinusCircle } from "lucide-react"

export function AddQuestionForm() {
  const [formData, setFormData] = useState({
    questionText: "",
    questionImage: null,
    questionOptions: ["", "", "", ""], // Start with 4 empty options
    questionAnswer: "",
    difficulty: "",
    marks: null,
    duration: null,
    negativeMarking: false,
    sType: "", // New field: subject type
    answerType: "single", // New field: answer type (default to single)
  })

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleNumberInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value ? Number.parseInt(value, 10) : null }))
  }

  const handleCheckboxChange = (e) => {
    const { checked } = e.target
    setFormData((prev) => ({ ...prev, negativeMarking: checked }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files ? e.target.files[0] : null
    setFormData((prev) => ({ ...prev, questionImage: file }))
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.questionOptions]
    newOptions[index] = value
    setFormData((prev) => ({ ...prev, questionOptions: newOptions }))
  }

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      questionOptions: [...prev.questionOptions, ""],
    }))
  }

  const removeOption = (index) => {
    const newOptions = formData.questionOptions.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, questionOptions: newOptions }))
  }

  const handleSubmit = async (e) => {
  e.preventDefault();

    // Validate that at least two options are provided
  if (formData.questionOptions.filter(Boolean).length < 2) {
    alert("Please provide at least two options.");
    return;
  }

  const payload = {
  question_text: formData.questionText,
  image: null, // Or S3 path after upload
  questionOptions: formData.questionOptions,
  qType: "MCQ",
  language: formData.sType,
  duration: formData.duration,
  answerType: formData.answerType,
  marks: formData.marks,
  level: formData.difficulty,
  question_answer: formData.questionAnswer,
  negativeMarking: formData.negativeMarking,
};

  try {
    const response = await fetch("http://localhost:8081/api/question-mcq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert("Question submitted successfully!");
      console.log("Question submitted:", payload);
      setFormData({ ...formData, questionText: "", questionOptions: ["", "", "", ""], questionAnswer: "", difficulty: "", marks: null, duration: null, negativeMarking: false, sType: "", answerType: "single" });
    } else {
      alert("Failed to submit question.");
    }
  } catch (err) {
    console.error("Error submitting question:", err);
    alert("Error submitting question");
  }
};


  const inputClasses =
    "flex h-10 w-full rounded-md border border-gray-300 bg-[#ebf6fc] px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#235a81] focus:border-[#235a81] disabled:cursor-not-allowed disabled:opacity-50"
  const textareaClasses =
    "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-[#ebf6fc] px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#235a81] focus:border-[#235a81] disabled:cursor-not-allowed disabled:opacity-50"
  const buttonClasses =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-[#235a81] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
  const radioCheckboxClasses = "h-4 w-4 border border-gray-300 text-[#235a81] focus:ring-[#235a81]"
  const labelClasses = "text-sm font-medium text-gray-700"

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="questionText" className={labelClasses}>
          Question Text:
        </label>
        <textarea
          id="questionText"
          placeholder="Enter your question here"
          value={formData.questionText}
          onChange={handleInputChange}
          rows={4}
          required
          className={textareaClasses}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="sType" className={labelClasses}>
          Subject Type:
        </label>
        <select
          id="sType"
          value={formData.sType}
          onChange={handleInputChange}
          className={`${inputClasses} appearance-none`}
          required
        >
          <option value="" disabled>
            Select subject type
          </option>
          <option value="React">React</option>
          <option value="Javascript">Javascript</option>
          <option value="C">C</option>
          <option value="C++">C++</option>
          <option value="Java">Java</option>
        </select>
      </div>

      <div className="grid gap-2">
        <label className={labelClasses}>Answer Type:</label>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="singleCorrect"
              name="answerType"
              value="radio"
              checked={formData.answerType === "radio"}
              onChange={(e) => setFormData((prev) => ({ ...prev, answerType: e.target.value }))}
              className={radioCheckboxClasses}
            />
            <label htmlFor="singleCorrect" className={labelClasses}>
              Single Correct
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="multiCorrect"
              name="answerType"
              value="checkbox"
              checked={formData.answerType === "checkbox"}
              onChange={(e) => setFormData((prev) => ({ ...prev, answerType: e.target.value }))}
              className={radioCheckboxClasses}
            />
            <label htmlFor="multiCorrect" className={labelClasses}>
              Multi Correct
            </label>
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="questionOptions" className={labelClasses}>
          Options:
        </label>
        {formData.questionOptions.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              id={`option-${index}`}
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
              className={inputClasses}
            />
            {formData.questionOptions.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(index)}
                className={`${buttonClasses} bg-transparent text-red-500 hover:bg-gray-100 p-2`}
              >
                <MinusCircle className="h-4 w-4" />
                <span className="sr-only">Remove option</span>
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addOption}
          className={`${buttonClasses} border border-gray-300 bg-white hover:bg-gray-100 w-fit text-gray-700`}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Option
        </button>
      </div>

      <div className="grid gap-2">
        <label htmlFor="questionAnswer" className={labelClasses}>
          Answer:
        </label>
        <input
          id="questionAnswer"
          placeholder="Enter the correct answer"
          value={formData.questionAnswer}
          onChange={handleInputChange}
          required
          className={inputClasses}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="difficulty" className={labelClasses}>
          Level:
        </label>
        <select
          id="difficulty"
          value={formData.difficulty}
          onChange={handleInputChange}
          className={`${inputClasses} appearance-none`}
        >
          <option value="" disabled>
            Select difficulty
          </option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="grid gap-2">
        <label htmlFor="marks" className={labelClasses}>
          Marks:
        </label>
        <input
          id="marks"
          type="number"
          placeholder="Enter marks (optional)"
          value={formData.marks === null ? "" : formData.marks}
          onChange={handleNumberInputChange}
          className={inputClasses}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="duration" className={labelClasses}>
          Duration (minutes):
        </label>
        <input
          id="duration"
          type="number"
          placeholder="Enter duration in minutes"
          value={formData.duration === null ? "" : formData.duration}
          onChange={handleNumberInputChange}
          className={inputClasses}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="questionImage" className={labelClasses}>
          Upload Image:
        </label>
        <input id="questionImage" type="file" onChange={handleFileChange} className={inputClasses} />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="negativeMarking"
          checked={formData.negativeMarking}
          onChange={handleCheckboxChange}
          className={radioCheckboxClasses}
        />
        <label htmlFor="negativeMarking" className={labelClasses}>
          Negative Marking
        </label>
      </div>

      <button type="submit" className={`${buttonClasses} bg-[#235a81] opacity-95 text-white hover:opacity-100 w-full`}>
        Add MCQ Question
      </button>
    </form>
  )
}
