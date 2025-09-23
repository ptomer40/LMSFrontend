import { useState } from "react";
import { FileText, Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = "Username is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const data = new FormData();
    data.append("mobile", formData.username);
    data.append("password", formData.password);

    try {
      const response = await fetch("http://localhost:8081/admin/authenticate", {
        method: "POST",
        body: data,
        credentials: "include",
      });

      const result = await response.json();
      console.log("Server response:", result);
      setLoading(false);

      if (response.ok) {
        const name=result.name;
        const username=result.username;
        const isAdmin = result.isadmin === "true"; // convert string to boolean
        const privileges = result.privileges.split(","); // convert CSV string to array
         console.log(name+username+isAdmin+privileges);
      localStorage.setItem("role","ADMIN");
     sessionStorage.setItem("adminName", name);
  sessionStorage.setItem("adminUsername", username);
  sessionStorage.setItem("isAdmin", isAdmin); // will be stored as string "true"/"false"
  sessionStorage.setItem("privileges", JSON.stringify(privileges)); // store as JSON string


        window.location.href = result.redirect; // redirect
      } else {
        alert(result.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex flex-col items-center justify-center">
          <div className="spinner border-4 border-gray-200 border-t-blue-600 rounded-full w-10 h-10 animate-spin mb-3"></div>
          <p className="text-gray-700 font-medium">Authenticating...</p>
        </div>
      )}

      <div className="w-full max-w-md z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Enter admin credentials to proceed</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="admin123"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                  errors.username ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                    errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105 hover:from-blue-700 hover:to-purple-700"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Logging In...
                </>
              ) : (
                "Login as Admin"
              )}
            </button>
          </form>

          {/* Switch to user login */}
          <div className="text-center mt-4">
            <a href="/login" className="text-blue-600 text-sm">
              Back to User Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
