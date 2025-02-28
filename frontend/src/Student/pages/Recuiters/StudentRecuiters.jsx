import Student from '../../Student'
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const StudentRecuiters = () => {
  const [companyLogos, setCompanyLogos] = useState([]);

  useEffect(() => {
    const fetchCompanyLogos = async () => {
      try {
        const response = await axios.get("http://localhost:3001/admin-recruiters");
        setCompanyLogos(response.data.companies);
      } catch (error) {
        console.error("Error fetching companies:", error.response ? error.response.data : error.message);
      }
    };
    fetchCompanyLogos();
  }, []);

  return (
    <div>
        <>
        <Student/>
        <h2>Recruiters Details</h2>
        <div className="student-recruiters">
      <h2>🏢 Our Recruiters</h2>

      <div className="company-logos">
        {companyLogos.length > 0 ? (
          companyLogos.map((company) => (
            <div key={company.companyName} className="company-logo">
              <Link to={`/company/${company.companyName}`} state={{ company }}>
                <img
                  src={`http://localhost:3001/uploads/${company.logo}`}
                  alt={company.companyName}
                  className="company-img"
                />
              </Link>
              <p className="company-name">{company.companyName}</p>
            </div>
          ))
        ) : (
          <p>No company logos available</p>
        )}
      </div>
    </div>
        </>
    </div>
  )
}
export default StudentRecuiters;

