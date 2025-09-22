import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Test from '../pages/user/Test'
import Profile from '../pages/user/Profile'
import UserLayout from '../layouts/UserLayout';
import StudentDashboard from '../pages/user/StudentDashboard';
import ExamInterface from '../pages/user/ExamInterface';
import Login from '../pages/Login'
import CodingExamInterface from '../pages/user/CodingExamInterface';

function UserRoutes() {
  return (
    <Routes>
      <Route path='/login' element={<Login/>} />
      <Route index element={<Navigate to="login" replace />} />
      <Route path="/" element={<UserLayout />}>
      
        {/*  Default route when visiting user */}
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="tests" element={<Test />} />
        <Route path="profile" element={<Profile />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="mcq-test" element={<ExamInterface />} />
        <Route path="coding-test" element={<CodingExamInterface/>} />
      </Route>
    </Routes>
  )
}

export default UserRoutes
