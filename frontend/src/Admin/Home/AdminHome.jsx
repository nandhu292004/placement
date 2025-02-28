import React, { useState, useEffect } from "react";
import './AdminHome.css';
import Home from "./Home";

const AdminHome = () => {
  const [stats, setStats] = useState({ total_students: 0, avg_salary: 0 });
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [studentDetails, setStudentDetails] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // ✅ Holds filtered data

  // Fetch placement stats
  useEffect(() => {
    fetch("http://localhost:3001/stats")
      .then((response) => response.json())
      .then((data) => {
        setStats({
          total_students: data.total_students || 0,
          avg_salary: parseFloat(data.avg_salary) || 0,
        });
      })
      .catch((error) => console.error("Error fetching stats:", error));
  }, []);

  // Fetch all placed students initially
  useEffect(() => {
    fetch("http://localhost:3001/placed-students") // ✅ Fetch all students initially
      .then((res) => res.json())
      .then((data) => {
        setStudentDetails(data);
        setFilteredData(data); // ✅ Initially set all data
      })
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  // Fetch unique company names
  useEffect(() => {
    fetch("http://localhost:3001/placed-student-companies") // ✅ Fetch companies from placed_student table
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCompanies(data.map(company => ({
            company_name: company.company_name || "Unnamed Company"
          })));
        } else {
          setCompanies([]);
        }
      })
      .catch((error) => setCompanies([]));
  }, []);

  // Handle dropdown selection
  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  // Filter students when "Filter" is clicked
  const handleSubmit = () => {
    console.log(`Filtering data for company: ${selectedCompany}`);

    if (!selectedCompany) {
      // ✅ Reset to all students if no selection
      setFilteredData(studentDetails);
      return;
    }

    // ✅ Filter locally instead of re-fetching from API
    const filteredResults = studentDetails.filter(student => student.company_name === selectedCompany);

    console.log("Filtered Data:", filteredResults);
    setFilteredData(filteredResults);
  };

  return (
    <>
      <Home/>
      <div className="home-container">
        {/* Statistics Section */}
        <div className="stats-container">
          <div className="stat-box">
            <h3>Students Placed</h3>
            <p>{stats.total_students}</p>
          </div>
          <div className="stat-box">
            <h3>Recruiters</h3>
            <p>3</p>
          </div>
          <div className="stat-box">
            <h3>Average Salary</h3>
            <p>₹{Number(stats.avg_salary).toFixed(2)} LPA</p>
          </div>
        </div>

        <h2 className="home-subheading">PLACEMENT CENTER</h2>
          <p className="home-text">
              Welcome to the Placement program of National Engineering College. This program consists of a 
              dedicated and efficient placement team of students and staff who function round the year to 
              ensure that students are placed in reputed companies across the country. Continuous placement 
              training is offered to equip students with communication, soft skills, confidence building, 
              interview skills, and test of reasoning by experts in the respective fields. Career development 
              programs are regularly conducted through accomplished resource persons across a broad spectrum 
              of industries.
          </p>

          <h2 className="home-subheading">Functions of Placement Centre</h2>
          <ul className="home-list">
              <li>To Organize On / Off campus Interviews for the final year students.</li>
              <li>To Promote Industry-Institute Interface activities.</li>
              <li>To Arrange Career / Personal Counselling sessions.</li>
              <li>To Organize Career Guidance sessions and Personality Development programs.</li>
              <li>To Organize Functional Skill Development Programs.</li>
              <li>To Organize Placement Training Programs like:
                  <ul>
                      <li>Aptitude programs</li>
                      <li>Life skills programs</li>
                      <li>Motivational sessions</li>
                      <li>Resume Writing</li>
                      <li>Group discussions</li>
                      <li>Mock Interviews</li>
                  </ul>
              </li>
          </ul>

        {/* Dropdown for selecting a company */}
        <div className="dropdown-container">
          <label>Select Company: </label>
          <select value={selectedCompany} onChange={handleCompanyChange}>
            <option value="">-- Show All Companies --</option>
            {companies.length > 0 &&
              companies.map((comp, index) => (
                <option key={index} value={comp.company_name}>
                  {comp.company_name}
                </option>
              ))}
          </select>
          <button className="submit-btn" onClick={handleSubmit}>Filter</button>
        </div>

        {/* Student Details Table */}
        {filteredData.length > 0 ? (
          <div className="student-details">
            <h3>Student Details {selectedCompany ? `for ${selectedCompany}` : "(All Companies)"}</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Reg No</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Package (LPA)</th>
                  <th>Year</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((student, index) => (
                  <tr key={index}>
                    <td>{student.name}</td>
                    <td>{student.regno}</td>
                    <td>{student.company_name}</td>
                    <td>{student.role}</td>
                    <td>₹{student.package} LPA</td>
                    <td>{student.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No students found for the selected company.</p>
        )}
      </div>
    </>
  );
};

export default AdminHome;