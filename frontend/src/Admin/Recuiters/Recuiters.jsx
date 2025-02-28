import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import './Recuiters.css';
import Home from '../Home/Home';
// import "../../../styles/adminrecruiters.css";
// import '../../../styles/companyDetails.css';

const AdminRecruiters = () => {
  const [companyData, setCompanyData] = useState({
    companyName: '',
    description: '',
    ceo: '',
    location: '',
    logo: null,
    skillSets: [],
    localBranches: [],
    roles: [],
    package: '',
    objective: ''
  });

  const [companyLogos, setCompanyLogos] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Fetch company logos when the component mounts
  useEffect(() => {
    const fetchCompanyLogos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/companies');
        console.log(response.data);
        setCompanyLogos(response.data.companies);
      } catch (error) {
        console.error('Error fetching companies:', error.response ? error.response.data : error.message);
      }
    };

    fetchCompanyLogos();
  }, []);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData({ ...companyData, [name]: value });
  };

  // Handle file input change for the logo
  const handleFileChange = (e) => {
    setCompanyData({ ...companyData, logo: e.target.files[0] });
  };

  // Handle adding items to arrays (Skill Sets, Local Branches, Roles)
  const handleArrayChange = (field, e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      const newValue = e.target.value.trim();
      
      if (newValue) {
        setCompanyData((prevState) => ({
          ...prevState,
          [field]: [...prevState[field].filter(Boolean), newValue], // Remove empty values and add new one
        }));
        console.log(`Updated ${field}:`, [...companyData[field], newValue]); // Debugging
        e.target.value = ""; // Clear input field after adding
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure no empty values are stored
    const finalData = {
      ...companyData,
      skillSets: companyData.skillSets.filter(item => item.trim() !== ""),
      localBranches: companyData.localBranches.filter(item => item.trim() !== ""),
      roles: companyData.roles.filter(item => item.trim() !== "")
    };

    console.log("Final Submitting Data:", finalData); // Debugging

    const formData = new FormData();
    formData.append('companyName', finalData.companyName);
    formData.append('description', finalData.description);
    formData.append('ceo', finalData.ceo);
    formData.append('location', finalData.location);
    formData.append('logo', finalData.logo);
    formData.append('skillSets', JSON.stringify(finalData.skillSets));
    formData.append('localBranches', JSON.stringify(finalData.localBranches));
    formData.append('roles', JSON.stringify(finalData.roles));
    formData.append('package', finalData.package);
    formData.append('objective', finalData.objective);

    try {
      const response = await axios.post('http://localhost:3001/add-company', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Company added:', response.data);

      // Refresh company logos list after adding a new company
      setCompanyLogos((prevLogos) => [...prevLogos, response.data.company]);

      // Reset form fields
      setCompanyData({
        companyName: '',
        description: '',
        ceo: '',
        location: '',
        logo: null,
        skillSets: [],
        localBranches: [],
        roles: [],
        package: '',
        objective: ''
      });
    } catch (error) {
      console.error('Error adding company:', error.response ? error.response.data : error.message);
    }
  };

  // Toggle the form visibility
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <>
    <Home/>
    <div>
      <button onClick={toggleForm} style={{ marginBottom: '20px' }}>
        {showForm ? 'Hide' : 'Add Recruiters'}
      </button>

      {showForm && (
        <div>
          <h2>Add Recruiters</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="companyName" placeholder="Company Name" value={companyData.companyName} onChange={handleChange} />
            <input type="text" name="description" placeholder="Description" value={companyData.description} onChange={handleChange} />
            <input type="text" name="ceo" placeholder="CEO" value={companyData.ceo} onChange={handleChange} />
            <input type="text" name="location" placeholder="Location" value={companyData.location} onChange={handleChange} />
            <input type="text" name="package" placeholder="Package" value={companyData.package} onChange={handleChange} />
            <input type="text" name="objective" placeholder="Objective" value={companyData.objective} onChange={handleChange} />
            <input type="file" name="logo" onChange={handleFileChange} />

            {/* Array Inputs */}
            <input type="text" placeholder="Skill Set (Press Enter to add)" onKeyDown={(e) => handleArrayChange('skillSets', e)} />
            <input type="text" placeholder="Local Branch (Press Enter to add)" onKeyDown={(e) => handleArrayChange('localBranches', e)} />
            <input type="text" placeholder="Role (Press Enter to add)" onKeyDown={(e) => handleArrayChange('roles', e)} />

            <button type="submit">Add Company</button>
          </form>
        </div>
      )}

      <h3>Recruiters</h3>
      <div className="company-logo-matrix">
      {Array.isArray(companyLogos) && companyLogos.length > 0 ? (
  companyLogos.map((company, index) => 
    company && company.companyName && company.logo ? ( // Ensure company object is valid
      <div key={index} className="company-logo">
        <Link to={`/company/${company.companyName}`} state={{ company }}>
          <img 
            src={`http://localhost:3001/uploads/${company.logo}`} 
            alt={company.companyName} 
            style={{ width: '100px', height: 'auto', margin: '10px', cursor: 'pointer' }} 
          />
        </Link>
      </div>
    ) : null
  )
) : (
  <p>No company logos available</p>
)}

      </div>
    </div>
    </>
  );
};

export default AdminRecruiters;