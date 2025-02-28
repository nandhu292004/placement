import React, { useEffect, useState } from "react";
import Student from "../../Student";

const Status = () => {
  const [studentStatus, setStudentStatus] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Track search input

  useEffect(() => {
    // Read student status from localStorage
    const storedStatus = localStorage.getItem("studentStatus");
    if (storedStatus) {
      setStudentStatus(JSON.parse(storedStatus));
    }
  }, []);

  // Filter students based on search term
  const filteredStudents = studentStatus.filter((student) =>
    student.regno.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Student />
      <div className="status-dashboard">
        <h2>Student Status</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by Register Number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        {filteredStudents.length === 0 ? (
          <p>No shortlisted students found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Reg No</th>
                <th>Name</th>
                <th>Company</th>
                <th>Cleared Round</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={index}>
                  <td>{student.regno}</td>
                  <td>{student.name}</td>
                  <td>{student.company_name}</td>
                  <td>{student.cleared_round}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Status;
