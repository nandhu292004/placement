import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import AdminLogin from './components/Logins/Admin/adminLogin';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AdminLogin/>} />
      </Routes>
    </Router>
  )
}

export default App