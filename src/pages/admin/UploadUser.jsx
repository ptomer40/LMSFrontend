"use client"

import { useState } from "react"

export default function UploadUser() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      setUploadStatus("")
    }
  }

const handleUpload = async () => {
  if (!selectedFile) {
    setUploadStatus("⚠️ Please select a file first.");
    return;
  }

  setIsUploading(true);
  setUploadStatus("⏳ Uploading file...");

  try {
    const formData = new FormData();
    formData.append("file", selectedFile);


    const response = await fetch("http://localhost:8081/user/uploadUsers", {
      method: "POST",
      body: formData,
    });
     console.log(response)
    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const result = await response.json();

    
    let statusMsg = `✅ ${result.message}\n`;
    statusMsg += `Successfully Added: ${result.successfullyAddedCount}\n\n`;

    if (result.details && Array.isArray(result.details)) {
      statusMsg += "📋 Details:\n" + result.details.map(d => `- ${d}`).join("\n");
    }

    setUploadStatus(statusMsg);
    setSelectedFile(null);

    const fileInput = document.getElementById("file-input");
    if (fileInput) fileInput.value = "";

  } catch (error) {
    console.error("Upload error:", error);
    setUploadStatus("❌ Upload failed. Please try again.");
  } finally {
    setIsUploading(false);
  }
};



  return (
    <main className="min-h-fit bg-white p-6 rounded-xl">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#235a81] mb-4">Upload Users</h1>
        </div>

        {/* Description */}
        <p className="text-gray-900 mb-4">
          Upload an Excel file to register multiple users at once.
        </p>
        
        {/* File Input Section */}
        <div className="mb-6">
          <label className="block text-gray-900 text-sm mb-2">
            Select Excel File:
          </label>
          
          <input
            id="file-input"
            type="file"
            accept=".xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleFileSelect}
            className="block w-full text-sm rounded-lg text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 border border-gray-300 p-2"
          />
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full cursor-pointer rounded-lg bg-[#235a81] text-white py-3 px-4 font-medium  disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mb-6"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>

        {/* Upload Status Section */}
        <div className="border-t border-gray-300 pt-6">
          <h2 className="text-2xl font-bold text-[#235a81] mb-4">Upload Status</h2>
          
          <p className="text-gray-700 text-sm">
            {uploadStatus || "File upload status will be displayed here."}
          </p>
        </div>
      </div>
    </main>
  )
}