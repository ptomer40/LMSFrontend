"use client"

import { useState } from "react"

export default function CreateUserPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [privileges, setPrivileges] = useState([])
  const [submissionSuccess, setSubmissionSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

   const privilegeOptions = [
    { value: "add-questions", label: "Add Questions" },
    { value: "manage-users", label: "Manage Users" },
    { value: "schedule-tests", label: "Schedule Tests" },
    { value: "view-statistics", label: "View Statistics" },
    { value: "full-admin", label: "Full Admin Access" },
    {value:"live-user", label:"Live Users"},
    {value:"blocked-user",label:"Blocked Users"},
    {value:"set-assessment-live", label:"Set Assessment Live"}
  ]

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setSubmissionSuccess(false);

  const formData = new URLSearchParams();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("mobile", contactNumber);

  privileges.forEach((priv) => {
    formData.append("privileges", priv);
  });

  
   const isMainAdmin = privileges[0] === "full-admin";
  formData.append("isMainAdmin", isMainAdmin.toString());
  // Optional: append isMainAdmin
  
  //formData.append("isMainAdmin", "false");

  try {
    const response = await fetch("http://localhost:8081/admin/createSubAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (response.ok) {
      setSubmissionSuccess(true);
      setName("");
      setEmail("");
      setPassword("");
      setContactNumber("");
      setPrivileges([]);
    } else {
      alert(data.message || "Failed to create sub-admin");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    alert("An unexpected error occurred");
  } finally {
    setLoading(false);
  }
};

const handlePrivilegesChange = (e) => {
    const selected = e.target.value
    if (selected && !privileges.includes(selected)) {
      setPrivileges((prev) => [...prev, selected])
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#235a81] mx-auto mb-4"></div>
          <p className="text-gray-600">Creating User...</p>
        </div>
      </div>
    )
  }

  return (
    <div className=" b min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 w-full mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-[#235a81]">Create User</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name:
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-v0-blue bg-gray-100"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John doe"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-v0-blue bg-gray-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-v0-blue bg-gray-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••"
              required
            />
          </div>

          {/* Contact Number */}
          <div>
            <label htmlFor="contact-number" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number:
            </label>
            <input
              type="text" // 
              id="contact-number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-v0-blue bg-gray-100"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="123-456-7890"
              required
            />
          </div>

         
         {/* Privileges Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Privileges:</label>
            <select
              id="privileges"
              name="privileges"
              onChange={handlePrivilegesChange}
              className="block w-full px-3 py-2 bg-gray-100 rounded-md text-gray-800 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#235a81] sm:text-sm"
            >
              <option value="">-- Select a privilege --</option>
              {privilegeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Show selected privileges below */}
            {privileges.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {privileges.map((priv) => {
                  const label = privilegeOptions.find((opt) => opt.value === priv)?.label || priv
                  return (
                    <span
                      key={priv}
                      className="inline-flex items-center rounded-full bg-[#e0f0fa] text-[#235a81] px-3 py-1 text-sm font-medium"
                    >
                      {label}
                    </span>
                  )
                })}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-[#235a81] opacity-95 hover:opacity-100 text-white font-semibold py-2 px-8 rounded-md text-lg w-full"
            >
              Create Sub-Admin
            </button>
          </div>

          {/* Success Message */}
          {submissionSuccess && (
            <div className="mt-4 text-center text-green-600 font-medium">Sub-admin created successfully!</div>
          )}
        </form>
      </div>
    </div>
  )
}
