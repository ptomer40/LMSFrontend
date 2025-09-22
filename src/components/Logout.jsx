import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Call the backend logout endpoint
    fetch("http://localhost:8081/logout", {
      method: "GET",
      credentials: "include", // Include session cookie
    })
      .then((res) => {
        if (res.ok) {
          //console.log("Session invalidated successfully");
          console.log(res);
        } else {
          console.error("Logout failed");
        }
      })
      .catch((error) => console.error("Logout error:", error))
      .finally(() => {
        // After logout, redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login"); // Or your login route
        }, 2000);
      });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">You have been logged out.</h2>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
};

export default Logout;
