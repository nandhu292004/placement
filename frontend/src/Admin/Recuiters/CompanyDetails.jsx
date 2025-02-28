import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Home from "../Home/Home";
import './CompanyDetails.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CompanyDetails = () => {
  const location = useLocation();
  const company = location.state?.company;

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: "Students Placed",
      data: [],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    }],
  });

  const [selectedYear, setSelectedYear] = useState(null);
  const [studentDetails, setStudentDetails] = useState([]);

  if (!company) {
    return <p className="error-message">Company not found</p>;
  }

  // ✅ Ensure skillSets, localBranches, and roles are arrays
  const parseData = (data) => {
    try {
      return Array.isArray(data) ? data : JSON.parse(data || "[]");
    } catch (error) {
      console.error("Error parsing data:", data, error);
      return [];
    }
  };

  const skillSetsArray = parseData(company.skillSets);
  const localBranchesArray = parseData(company.localBranches);
  const rolesArray = parseData(company.roles);

  console.log("Company Data:", company);
  console.log("Parsed Skill Sets:", skillSetsArray);
  console.log("Parsed Local Branches:", localBranchesArray);
  console.log("Parsed Roles:", rolesArray);

  // Fetch placement data from placed_student table
  useEffect(() => {
    const fetchPlacementData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/placed-student?companyName=${company.companyName}`);
        const fetchedData = response.data || [];

        const years = [...new Set(fetchedData.map((item) => item.year))];
        const studentsPlaced = years.map(year =>
          fetchedData.filter(item => item.year === year).reduce((sum, item) => sum + item.student_count, 0)
        );

        setChartData({
          labels: years,
          datasets: [{
            label: "Students Placed",
            data: studentsPlaced,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1
          }]
        });
      } catch (error) {
        console.error("Error fetching placement data:", error.message);
      }
    };

    fetchPlacementData();
  }, [company.companyName]);

  // ✅ Fetch student details when a bar is clicked
  const handleBarClick = async (event, elements) => {
    if (!elements.length) return;
    const clickedIndex = elements[0].index;
    const year = chartData.labels[clickedIndex];

    setSelectedYear(year);
    setStudentDetails([]);

    try {
      const response = await axios.get(`http://localhost:3001/student-details?companyName=${company.companyName}&year=${year}`);
      setStudentDetails(response.data || []);
    } catch (error) {
      console.error("Error fetching student details:", error.message);
    }
  };

  useEffect(() => {
    if (company && company.logo) {
      console.log("Logo URL:", `http://localhost:3001/${company.logo}`);
    } else {
      console.log("No logo found in company data.");
    }
  }, [company]);

  return (
    <>
      <Home/>
      <div className="company-details-container">
      <div className="company-header">
        <h2>{company.companyName}</h2>
      </div>

      <div className="company-info">
        <div className="company-description">
          <p><strong>Description: </strong>{company.description}</p>
        </div>
        <p><strong>Objective: </strong>{company.objective}</p>
        <p><strong>CEO:</strong> {company.ceo}</p>
        <p><strong>Location:</strong> {company.location}</p>

        {/* ✅ Skill Sets */}
        <p><strong>Skill Sets:</strong>
          {skillSetsArray.length > 0 ? (
            <ul className="company-list">
              {skillSetsArray.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          ) : "N/A"}
        </p>

        {/* ✅ Local Branches */}
        <p><strong>Local Branches:</strong>
          {localBranchesArray.length > 0 ? (
            <ul className="company-list">
              {localBranchesArray.map((branch, index) => (
                <li key={index}>{branch}</li>
              ))}
            </ul>
          ) : "N/A"}
        </p>

        {/* ✅ Roles */}
        <p><strong>Roles:</strong>
          {rolesArray.length > 0 ? (
            <ul className="company-list">
              {rolesArray.map((role, index) => (
                <li key={index}>{role}</li>
              ))}
            </ul>
          ) : "N/A"}
        </p>

        <p><strong>Package:</strong> {company.package || "N/A"}</p>
      </div>

      {/* ✅ Company Logo */}
      <div className="company-logo">
        {company.logo ? (
          <img src={`http://localhost:3001/${company.logo}`} alt={company.companyName} />
        ) : (
          <p>No logo available</p>
        )}
      </div>

      {/* ✅ Placement Graph */}
      <div className="chart-container">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            onClick: handleBarClick,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Placement Trends Over the Years" },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { stepSize: 1, precision: 0 },
              },
              x: { ticks: { autoSkip: false }, grid: { offset: true } },
            },
            elements: {
              bar: { barThickness: 20, maxBarThickness: 40 },
            },
          }}
          height={500}
        />
      </div>

      {/* ✅ Student Details Table */}
      {selectedYear && studentDetails.length > 0 && (
        <div className="student-details">
          <h3>Student Details for {company.companyName} ({selectedYear})</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Reg No</th>
                <th>Role</th>
                <th>Package (LPA)</th>
              </tr>
            </thead>
            <tbody>
              {studentDetails.map((student, index) => (
                <tr key={index}>
                  <td>{student.name}</td>
                  <td>{student.regno}</td>
                  <td>{student.role}</td>
                  <td>₹{student.package} LPA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
};

export default CompanyDetails;
