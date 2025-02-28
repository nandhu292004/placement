import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Student from '../../Student';
import './StudentUpcomingDrives.css';

const StudentUpcomingDrives = () => {
  const [drives, setDrives] = useState([]);
  const [registeredDrives, setRegisteredDrives] = useState([]); // Stores registered company names
  const studentRegNo = localStorage.getItem('username'); // Get regno from localStorage

  useEffect(() => {
    fetchUpcomingDrives();
    fetchRegisteredDrives(); // Fetch the student's already registered drives
  }, []);

  // Fetch all upcoming drives
  const fetchUpcomingDrives = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/student-upcoming-drives');
      setDrives(response.data);
    } catch (error) {
      console.error('Error fetching upcoming drives:', error);
    }
  };

  // Fetch the drives the student has already registered for
  const fetchRegisteredDrives = async () => {
    if (!studentRegNo) return;

    try {
      const response = await axios.get(`http://localhost:3001/api/registered-drives/${studentRegNo}`);
      const registeredCompanies = response.data.map(item => item.company_name);
      setRegisteredDrives(registeredCompanies);
    } catch (error) {
      console.error('Error fetching registered drives:', error);
    }
  };

  // Handle student registration
  const handleRegister = async (driveId, companyName) => {
    if (!studentRegNo) {
      alert("Student registration number not found. Please log in.");
      return;
    }

    // Check if the student is already registered for this company
    if (registeredDrives.includes(companyName)) {
      alert(`You have already registered for ${companyName}`);
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/register-drive", {
        drive_id: driveId,
        regno: studentRegNo,
        company_name: companyName,
        register: "Yes",
      });

      alert(`Successfully registered for ${companyName}`);
      fetchRegisteredDrives(); // Refresh the registered list
    } catch (error) {
      console.error("Error registering for drive:", error);
    }
  };

  return (
    <>
      <Student />
      <div className="student-upcomingdrive">
        <h1 className="title">Upcoming Drives</h1>
        <div className="drives-container">
          {drives.map((drive) => (
            <div key={drive.id} className="drive-card">
              {drive.post && (
                <img
                  src={`http://localhost:3001/uploads/${drive.post}`}
                  alt="Company Post"
                  className="company-logo"
                />
              )}
              <p><strong>Company:</strong> {drive.company_name}</p>
              <p><strong>Eligibility:</strong> {drive.eligibility}</p>
              <p><strong>Date:</strong> {new Date(drive.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {drive.time}</p>
              <p><strong>Venue:</strong> {drive.venue}</p>
              <p><strong>Role:</strong> {drive.role}</p>
              <p><strong>Salary:</strong> {drive.salary}</p>

              <button
                className="register-btn"
                onClick={() => handleRegister(drive.id, drive.company_name)}
                disabled={registeredDrives.includes(drive.company_name)}
              >
                {registeredDrives.includes(drive.company_name) ? "Registered" : "Register"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StudentUpcomingDrives;
