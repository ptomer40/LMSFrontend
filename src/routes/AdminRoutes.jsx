import { Routes, Route, Navigate } from "react-router-dom"
import AdminLayout from "../layouts/AdminLayout"
import AdminHome from "../pages/admin/AdminHome"
import AddQuestionPage from "../pages/admin/AddQuestionPage"
import ManageQuestion from "../pages/admin/ManageQuestion"
import ScheduleTestPage from "../pages/admin/ScheduleTestPage"
import CreateUserPage from "../pages/admin/CreateUserPage"
import LiveUsersPage from "../components/LiveUsersPage"
import TestRecords from "../pages/admin/TestRecords"
import BlockedUsersPage from "../pages/admin/BlockUserPage"
import UploadUser from "../pages/admin/UploadUser"
import ManageUsers from "../pages/admin/ManageUsers"
import AdminDashboard from "../pages/admin/AdminDashboard"
import AdminLogin from "../pages/admin/AdminLogin"
import Logout from "../components/Logout"


const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/home" />} />
        <Route path="home" element={<AdminDashboard />} />
        <Route path="add-question" element={<AddQuestionPage />} />
        <Route path="manage-questions" element={<ManageQuestion />} />
        <Route path="schedule-test" element={<ScheduleTestPage />} />
        <Route path="create-user" element={<CreateUserPage />} />
        <Route path="live-users" element={<LiveUsersPage/>}/>
        <Route path="test-records" element={<TestRecords/>} />
        <Route path="blocked-users" element={<BlockedUsersPage/>} />
        <Route path="set-assessment-live" element={<AdminHome/>} />
        <Route path="upload-users" element={<UploadUser/>} />
        <Route path="manage-users" element={<ManageUsers/>} />
        
        {/* Future: add more admin routes here */}
      </Route>
      <Route path='admin-login' element={<AdminLogin/>} /> 
      <Route path='logout' element={<Logout/>} />
    </Routes>
  )
}

export default AdminRoutes
