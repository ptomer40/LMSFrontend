"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function QuestionForm() {
  const [formData, setFormData] = useState({
    language: "React", // Default language
    questionText: "",
    answer: "",
    level: "",
    marks: "",
    templateFunction: "",
  })

  const [selectedImage, setSelectedImage] = useState(null)
  const [testCases, setTestCases] = useState([])
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Available programming languages
  const languageOptions = [
    { value: "React", label: "React" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "Python", label: "Python" },
    { value: "Java", label: "Java" },
    { value: "C++", label: "C++" },
    { value: "HTML/CSS", label: "HTML/CSS" },
    { value: "Node.js", label: "Node.js" },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      console.log("Selected image:", file.name)
    }
  }

  const handleAddTestCase = () => {
    console.log("Add Test Case clicked")
    // In a real application, this would open a modal or navigate to a test case creation form
    alert("Add Test Case functionality - to be implemented")
  }

 const handleSubmit = async (e) => {
  e.preventDefault();

const submitData = {
  language: formData.language,
  question_text: formData.questionText,
  question_answer: formData.answer,
  level: formData.level,
  marks: formData.marks,
  templateFunction: formData.templateFunction
};

  if (selectedImage) {
    submitData.append("image", selectedImage);
  }

  try {
    const response = await fetch("http://localhost:8082/api/questions", {
      method: "POST",
      headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(submitData)
    
    });
    console.log(submitData);

    if (!response.ok) {
      throw new Error("Failed to save question");
    }

    setShowSuccessMessage(true);

    // Reset form after success
    setTimeout(() => {
      setShowSuccessMessage(false);
      setFormData({
        language: "React",
        questionText: "",
        answer: "",
        level: "",
        marks: "",
        templateFunction: "",
      });
      setSelectedImage(null);
      const fileInput = document.getElementById("image-upload");
      if (fileInput) fileInput.value = "";
    }, 2000);
  } catch (error) {
    console.error("Error saving question:", error);
    alert("Error saving question. Check console for details.");
  }
};


  const inputClasses =
    "flex h-10 w-full rounded-md border border-gray-300 bg-[#ebf6fc] px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#235a81] focus:border-[#235a81] disabled:cursor-not-allowed disabled:opacity-50"
    const textareaClasses =
    "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-[#ebf6fc] px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#235a81] focus:border-[#235a81] disabled:cursor-not-allowed disabled:opacity-50"

  return (
    <div className="grid gap-6">
      

      <div className="">
        <form onSubmit={handleSubmit}>
          {/* Select Language */}
          <div className="p-6 border-b border-gray-200">
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
              Select language:
            </label>
            <div className="relative">
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className={`block w-full ${inputClasses} pr-10 appearance-none`}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-admin h-5 w-5 pointer-events-none" />
            </div>
          </div>

          {/* Question Text */}
          <div className="p-6 border-b border-gray-200">
            <label htmlFor="questionText" className="block text-sm font-medium text-gray-700 mb-1">
              Question Text:
            </label>
            <textarea
              id="questionText"
              name="questionText"
              value={formData.questionText}
              onChange={handleInputChange}
              required
              rows={4}
              className={`block w-full ${textareaClasses} focus:ring-0 focus:border-transparent`}
              placeholder="Enter your question here..."
            />
          </div>

          {/* Answer */}
          <div className="p-6 border-b border-gray-200">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
              Answer:
            </label>
            <input
              type="text"
              id="answer"
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              required
              className={`block w-full ${inputClasses}`}
              placeholder="Enter the correct answer..."
            />
          </div>

          {/* Level */}
          <div className="p-6 border-b border-gray-200">
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
              Level:
            </label>
            <input
              type="text"
              id="level"
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              required
              className={`block w-full ${inputClasses}`}
              placeholder="e.g., easy, medium, hard"
            />
          </div>

          {/* Marks */}
          <div className="p-6 border-b border-gray-200">
            <label htmlFor="marks" className="block text-sm font-medium text-gray-700 mb-1">
              Marks:
            </label>
            <input
              type="number"
              id="marks"
              name="marks"
              value={formData.marks}
              onChange={handleInputChange}
              className={`block w-full ${inputClasses}`}
              placeholder="Enter marks (optional)"
              min="1"
            />
          </div>

          {/* Upload Image */}
          <div className="p-6 border-b border-gray-200">
            <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image:
            </label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="   block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#ebf6fc] file:text-gray-700 hover:file:opacity-100"
            />
            {selectedImage && <p className="mt-2 text-sm text-gray-600">Selected: {selectedImage.name}</p>}
          </div>

          {/* Code Template */}
          <div className="p-6">
            <label htmlFor="templateFunction" className="block text-sm font-medium text-gray-700 mb-1">
              Code Template:
            </label>
            <textarea
              id="templateFunction"
              name="templateFunction"
              value={formData.templateFunction}
              onChange={handleInputChange}
              rows={6}
              className={`block w-full ${textareaClasses}`}
              placeholder="Enter code template here..."
            />
          </div>

          {/* Action Buttons */}
          <div className="p-6 pt-0 space-y-4">
            <button
              type="button"
              onClick={handleAddTestCase}
              className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#235a81] opacity-92 hover:opacity-100 text-white px-4 py-2"
            >
              Add Test Case
            </button>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#235a81] opacity-92 hover:opacity-100 text-white px-4 py-2"
            >
              Add
            </button>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="p-6 pt-0 text-green-600 text-sm font-medium">Question added successfully!</div>
          )}
        </form>
      </div>
    </div>
  )
}
