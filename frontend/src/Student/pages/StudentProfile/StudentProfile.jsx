import React, { useState } from "react";
import axios from "axios";
import Student from "../../Student";
import './StudentProfile.css';

const StudentProfile = () => {
    const [formData, setFormData] = useState({
        regno: "",
        name: "",
        batch: "",
        hsc_percentage: "",
        sslc_percentage: "",
        sem1_cgpa: "",
        sem2_cgpa: "",
        sem3_cgpa: "",
        sem4_cgpa: "",
        sem5_cgpa: "",
        sem6_cgpa: "",
        sem7_cgpa: "",
        sem8_cgpa: "",
        history_of_arrear: "No",
        standing_arrear: "No",
        address: "",
        student_mobile: "",
        secondary_mobile: "",
        college_email: "",
        personal_email: "",
        aadhar_number: "",
        pancard_number: "",
        passport: "No"
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const phoneRegex = /^[6-9]\d{9}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const aadharRegex = /^\d{12}$/;
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

        if (!phoneRegex.test(formData.student_mobile)) {
            alert("Invalid Student Mobile Number");
            return false;
        }
        if (formData.secondary_mobile && !phoneRegex.test(formData.secondary_mobile)) {
            alert("Invalid Secondary Mobile Number");
            return false;
        }
        if (!emailRegex.test(formData.college_email) || !emailRegex.test(formData.personal_email)) {
            alert("Invalid Email Format");
            return false;
        }
        if (!aadharRegex.test(formData.aadhar_number)) {
            alert("Invalid Aadhar Number (12 digits required)");
            return false;
        }
        if (!panRegex.test(formData.pancard_number)) {
            alert("Invalid PAN Card Number");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post("http://localhost:3001/api/student-profile", formData);
            alert(response.data.message);
        } catch (error) {
            alert(error.response?.data?.message || "Error submitting form");
        }
    };

    return (
        <>
          <Student/>
          <div className="profile-container">
            <h2>Student Profile</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="regno" placeholder="Register Number" onChange={handleChange} required />
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                <input type="text" name="batch" placeholder="Batch" onChange={handleChange} required />
                <input type="number" step='0.01' name="hsc_percentage" placeholder="HSC Percentage" onChange={handleChange} required />
                <input type="number" step='0.01' name="sslc_percentage" placeholder="SSLC Percentage" onChange={handleChange} required />
                
                <input type="number" step='0.01' name="sem1_cgpa" placeholder="1st Sem CGPA" onChange={handleChange} required/>
                <input type="number" step='0.01' name="sem2_cgpa" placeholder="2nd Sem CGPA" onChange={handleChange} required/>
                <input type="number" step='0.01' name="sem3_cgpa" placeholder="3rd Sem CGPA" onChange={handleChange} required/>
                <input type="number" step='0.01' name="sem4_cgpa" placeholder="4th Sem CGPA" onChange={handleChange} required/>
                <input type="number" step='0.01' name="sem5_cgpa" placeholder="5th Sem CGPA" onChange={handleChange} />
                <input type="number" step='0.01' name="sem6_cgpa" placeholder="6th Sem CGPA" onChange={handleChange} />
                <input type="number" step='0.01' name="sem7_cgpa" placeholder="7th Sem CGPA" onChange={handleChange} />
                <input type="number" step='0.01' name="sem8_cgpa" placeholder="8th Sem CGPA" onChange={handleChange} />

                <label>History of Arrears:</label>
                <select name="history_of_arrear" onChange={handleChange}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>

                <label>Standing Arrears:</label>
                <select name="standing_arrear" onChange={handleChange}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>

                <textarea name="address" placeholder="Address" onChange={handleChange} required />

                <input type="text" name="student_mobile" placeholder="Student Mobile" onChange={handleChange} required />
                <input type="text" name="secondary_mobile" placeholder="Secondary Mobile" onChange={handleChange} />

                <input type="email" name="college_email" placeholder="College Email" onChange={handleChange} required />
                <input type="email" name="personal_email" placeholder="Personal Email" onChange={handleChange} required />

                <input type="text" name="aadhar_number" placeholder="Aadhar Number" onChange={handleChange} required />
                <input type="text" name="pancard_number" placeholder="PAN Card Number" onChange={handleChange} required />

                <label>Passport Available:</label>
                <select name="passport" onChange={handleChange}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>

                <button type="submit">Save Profile</button>
            </form>
        </div>
        </>
    );
};

export default StudentProfile;
