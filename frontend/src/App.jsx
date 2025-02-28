import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Logins/Admin/Login';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './Admin/Home/Home';
import UpcomingDrive from './Admin/UpcomingDrive/UpcomingDrive';
import StudentHome from './Student/pages/Home/StudentHome';
import StudentProfile from './Student/pages/StudentProfile/StudentProfile';
import StudentUpcomingDrives from './Student/pages/UpcomingDrives/StudentUpcomingDrives';
import Status from './Student/pages/Status/Status';
import StudentRecuiters from './Student/pages/Recuiters/StudentRecuiters';
import AdminRecruiters from './Admin/Recuiters/Recuiters';
import CompanyDetails from './Admin/Recuiters/CompanyDetails';
import AdminHome from './Admin/Home/AdminHome';
import AdminRegisterStudents from './Admin/AdminRegisterStudents/AdminRegisterStudents';
const App = () => {
  return (
    <div>
       <Routes>
              <Route path='/' element={<Login/>}/>
              <Route path='/student' element={<StudentHome/>}/>
              <Route path='/admin' element={<AdminHome/>}/>
              <Route path='/admin-upcoming-drives' element={<UpcomingDrive/>}/>
              <Route path='/student-profile' element={<StudentProfile/>}/>
              <Route path='/student-upcoming-drives' element={<StudentUpcomingDrives/>}/>
              <Route path='/status' element={<Status/>}/>
              <Route path='/recruiters' element={<StudentRecuiters/>}/>
              <Route path='/admin-recruiters' element={<AdminRecruiters/>}/>
              <Route path='/admin-registered-students' element={<AdminRegisterStudents/>}/>
              <Route path='/company/:companyName' element={<CompanyDetails/>}/>
        </Routes>
    </div>
  )
}

export default App;