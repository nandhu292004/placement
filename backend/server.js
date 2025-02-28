
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { connect } from 'http2';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL!');
  }
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE userName = ? AND password = ?";
  connection.query(query, [username, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length > 0) {
      const userRole = result[0].role;
      return res.json({ message: "Login successful", role: userRole });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }

  });
});

//upcoming drives
// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage });

app.post("/api/upcoming-drives", upload.single('post'), (req, res) => {
  const { company_name, eligibility, date, time, venue , role, salary} = req.body;
  const postFilePath = req.file ? req.file.filename : null;

  const query = `
    INSERT INTO upcomingdrives (post, company_name, eligibility, date, time, venue, role, salary)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(query, [postFilePath, company_name, eligibility, date, time, venue, role, salary], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(201).json({ message: "Upcoming drive added successfully!" });
  });
});
//fetch the upcoming details
app.get("/api/upcoming-drives", (req, res) => {
  const query = "SELECT * FROM upcomingdrives";
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(results);
  });
});
app.get("/api/student-upcoming-drives", (req, res) => {
  const query = "SELECT * FROM upcomingdrives";
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(results);
  });
});

//post company details
// app.post("/admin-recruiters", upload.single("logo"), (req, res) => {
//   const { companyName, description, ceo, location } = req.body;
//   const logo = req.file ? req.file.filename : null;

//   if (!companyName || !description || !ceo || !location || !logo) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   const query = "INSERT INTO companies (companyName, description, ceo, location, logo) VALUES (?, ?, ?, ?, ?)";
//   connection.query(query, [companyName, description, ceo, location, logo], (err, results) => {
//     if (err) {
//       console.error("Error adding company:", err);
//       return res.status(500).json({ message: "Error adding company." });
//     }
//     res.status(201).json({ message: "Company added successfully.", company: req.body });
//   });
// });

// app.get("/admin-recruiters", (req, res) => {
//   const query = "SELECT * FROM companies";
//   connection.query(query, (err, results) => {
//     if (err) {
//       console.error('Database Error:', err);
//       return res.status(500).json({ message: "Database error" });
//     }
//     res.status(200).json({ companies: results });
//   });
// });

// app.get("/company/:companyName", (req, res) => {
//   const query = "SELECT * FROM companies";
//   connection.query(query, (err, results) => {
//     if (err) {
//       console.error('Database Error:', err);
//       return res.status(500).json({ message: "Database error" });
//     }
//     res.status(200).json({ companies: results });
//   });
// });

// Routes
app.get("/companies", (req, res) => {
  connection.query("SELECT * FROM companies", (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching companies." });
    res.status(200).json({ companies: results });
  });
});

app.post("/add-company", upload.single("logo"), (req, res) => {
  try {
    console.log("Received Data:", req.body); // Debugging Log

    const { companyName, description, ceo, location, skillSets, localBranches, roles, salarypackage, objective } = req.body;
    const logo = req.file ? req.file.filename : null;

    // if (!companyName || !description || !ceo || !location || !logo || !salarypackage || !objective) {
    //   return res.status(400).json({ message: "All fields are required." });
    // }

    // Convert JSON strings to arrays safely
    const parseArray = (data) => {
      try {
        return data ? JSON.parse(data).filter(Boolean) : []; // Remove empty values
      } catch (error) {
        console.error(`Error parsing ${data}:, error`);
        return [];
      }
    };

    const skillSetsArray = parseArray(skillSets);
    const localBranchesArray = parseArray(localBranches);
    const rolesArray = parseArray(roles);

    console.log("Parsed Skill Sets:", skillSetsArray);
    console.log("Parsed Local Branches:", localBranchesArray);
    console.log("Parsed Roles:", rolesArray);

    connection.query(
      "INSERT INTO companies (companyName, description, ceo, location, logo, skillSets, localBranches, roles, package, objective) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        companyName,
        description,
        ceo,
        location,
        logo,
        JSON.stringify(skillSetsArray), // Store as JSON string
        JSON.stringify(localBranchesArray),
        JSON.stringify(rolesArray),
        salarypackage,
        objective,
      ],
      (err) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({ message: "Error adding company.", error: err });
        }
        res.status(201).json({ message: "Company added successfully." });
      }
    );
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal Server Error.", error });
  }
});


//add-placement
// app.post("/add-placement", upload.fields([{ name: 'questionBank', maxCount: 1 }, { name: 'feedbackForm', maxCount: 1 }]), (req, res) => {
//   const { companyName, year, studentsPlaced } = req.body;
//   const questionBank = req.files?.questionBank ? req.files.questionBank[0].filename : null;
//   const feedbackForm = req.files?.feedbackForm ? req.files.feedbackForm[0].filename : null;
//   if (!companyName || !year || isNaN(studentsPlaced) || studentsPlaced <= 0 || !questionBank || !feedbackForm) {
//     return res.status(400).json({ message: "All fields are required." });
//   }
//   connection.query("INSERT INTO placed_data (companyName, year, studentsPlaced, questionBank, feedbackForm) VALUES (?, ?, ?, ?, ?)",
//     [companyName, year, studentsPlaced, questionBank, feedbackForm],
//     (err) => {
//       if (err) return res.status(500).json({ message: "Error adding placement details." });
//       res.status(201).json({ message: "Placement details added successfully." });
//     }
//   );
// });
// app.get("/placement-data", (req, res) => {
//   const { companyName } = req.query; // Get companyName from query parameters
  
//   // Check if companyName is provided
//   if (!companyName) {
//     return res.status(400).json({ message: "Company name is required." });
//   }

//   // Query to fetch placement data for the specific company
//   connection.query("SELECT year, studentsPlaced FROM placed_data WHERE companyName = ? ORDER BY year DESC", [companyName], (err, results) => {
//     if (err) return res.status(500).json({ message: "Error fetching placement data." });
    
//     // If no data found for the company
//     if (results.length === 0) {
//       return res.status(404).json({ message: "No placement data found for the specified company." });
//     }

//     // Send the filtered placement data
//     res.status(200).json({ placementData: results });
//   });
// });

app.get("/companies/:companyName", (req, res) => {
  connection.query("SELECT * FROM companies WHERE companyName = ?", [req.params.companyName], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching company details." });
    if (results.length === 0) return res.status(404).json({ message: "Company not found." });
    res.status(200).json({ company: results[0] });
  });
});

app.post("/add-placement", upload.fields([{ name: 'questionBank', maxCount: 1 }, { name: 'feedbackForm', maxCount: 1 }]), (req, res) => {
  const { companyName, year, studentsPlaced } = req.body;
  const questionBank = req.files?.questionBank ? req.files.questionBank[0].filename : null;
  const feedbackForm = req.files?.feedbackForm ? req.files.feedbackForm[0].filename : null;

  if (!companyName || !year || isNaN(studentsPlaced) || studentsPlaced <= 0 || !questionBank || !feedbackForm) {
    return res.status(400).json({ message: "All fields are required." });
  }

  connection.query(
    "INSERT INTO placed_data (companyName, year, studentsPlaced, questionBank, feedbackForm) VALUES (?, ?, ?, ?, ?)",
    [companyName, year, studentsPlaced, questionBank, feedbackForm],
    (err) => {
      if (err) return res.status(500).json({ message: "Error adding placement details." });
      res.status(201).json({ message: "Placement details added successfully." });
    }
  );
});

app.get("/placed-student", (req, res) => {
  const { companyName } = req.query;
  connection.query(
    "SELECT year, COUNT(*) AS student_count FROM placed_student WHERE company_name = ? GROUP BY year ORDER BY year",
    [companyName],
    (err, result) => {
      if (err) {
        console.error("Error fetching placement data:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json(result);
    }
  );
});

// fetch the details for front page
app.get("/stats", (req, res) => {
  const query = `
    SELECT COUNT(*) AS total_students, AVG(package) AS avg_salary FROM placed_student;
  `;
  connection.query(query, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(result[0]);
    }
  });
});

app.get("/placed-student-companies", (req, res) => {
  connection.query("SELECT DISTINCT company_name FROM placed_student", (err, result) => {
    if (err) {
      console.error("Error fetching companies from placed_student:", err);
      return res.status(500).json({ error: err.message });
    }

    if (!result || result.length === 0) {
      console.warn("No companies found in placed_student table.");
      return res.json([]); // ✅ Return an empty array instead of an object
    }

    console.log("Companies API Response from placed_student:", result);
    res.json(result); // ✅ Return a direct array (Correct)
  });
});

app.get("/student-details", (req, res) => {
  const { companyName, year } = req.query;
  connection.query(
    "SELECT name, regno, role, package FROM placed_student WHERE company_name = ? AND year = ?",
    [companyName, year],
    (err, result) => {
      if (err) {
        console.error("Error fetching student details:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json(result);
    }
  );
});


// API to get student count per year for a selected company
app.get("/students-per-year", (req, res) => {
  const company = req.query.company;
  connection.query(
    "SELECT year, COUNT(*) AS student_count FROM placed_student WHERE company_name = ? GROUP BY year ORDER BY year",
    [company],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
});

// API to get student details for a selected year and company
app.get("/students-details", (req, res) => {
  const { company, year } = req.query;
  connection.query(
    "SELECT name, regno, role, package FROM placed_student WHERE company_name = ? AND year = ?",
    [company, year],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
})

app.get("/placed-students", (req, res) => {
  connection.query(
    "SELECT name, regno, company_name, role, package, year FROM placed_student",
    (err, result) => {
      if (err) {
        console.error("Error fetching placed students:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json(result);
    }
  );
});

app.get("/placed-students", (req, res) => {
  const { company } = req.query;
  let sql = "SELECT name, regno, company_name, role, package, year FROM placed_student";
  const params = [];

  if (company) {
    sql += " WHERE company_name = ?";
    params.push(company);
  }

  connection.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error fetching students:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// API to store placement details
app.post("/api/placed-students", (req, res) => {
  const { regno, name, company_name, role, salarypackage, year } = req.body;

  if (!regno || !name || !company_name || !role || !salarypackage || !year) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const sql = `
    INSERT INTO placed_student (regno, name, company_name, role, package, year)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(sql, [regno, name, company_name, role, salarypackage, year], (err, result) => {
    if (err) {
      console.error("Error inserting placement details:", err);
      return res.status(500).json({ error: "Failed to insert placement details." });
    }
    res.json({ message: "Placement details added successfully!" });
  });
});

//registerd-student

app.post('/api/register-student', (req, res) => {
  const { regno, company_name, register } = req.body;

  // Validate required fields
  if (!regno || !company_name || !register) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  // Ensure register value is either 'Yes' or 'No'
  if (!['Yes', 'No'].includes(register)) {
    return res.status(400).json({ message: 'Invalid register value. Use Yes or No.' });
  }

  const sql = `
    INSERT INTO registerd_student (regno, company_name, register)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE register = VALUES(register)
  `;

  connection.query(sql, [regno, company_name, register], (err, result) => {
    if (err) {
      console.error('Error inserting registration:', err);
      return res.status(500).json({ message: 'Error registering student.' });
    }
    res.status(200).json({ message: 'Registration successful!' });
  });
});


const formatValue = (value) => (value === "" ? null : value);

// API to Save Student Profile
app.post("/api/student-profile", (req, res) => {
  try {
    const {
      regno, name, batch, hsc_percentage, sslc_percentage,
      sem1_cgpa, sem2_cgpa, sem3_cgpa, sem4_cgpa, sem5_cgpa,
      sem6_cgpa, sem7_cgpa, sem8_cgpa, history_of_arrear, standing_arrear,
      address, student_mobile, secondary_mobile, college_email, personal_email,
      aadhar_number, pancard_number, passport
    } = req.body;

    const query = `
      INSERT INTO student_details (
        regno, name, batch, hsc_percentage, sslc_percentage, 
        sem1_cgpa, sem2_cgpa, sem3_cgpa, sem4_cgpa, sem5_cgpa, 
        sem6_cgpa, sem7_cgpa, sem8_cgpa, history_of_arrear, standing_arrear, 
        address, student_mobile, secondary_mobile, college_email, personal_email, 
        aadhar_number, pancard_number, passport
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        name=VALUES(name), batch=VALUES(batch), hsc_percentage=VALUES(hsc_percentage),
        sslc_percentage=VALUES(sslc_percentage), sem1_cgpa=VALUES(sem1_cgpa), sem2_cgpa=VALUES(sem2_cgpa), 
        sem3_cgpa=VALUES(sem3_cgpa), sem4_cgpa=VALUES(sem4_cgpa), sem5_cgpa=VALUES(sem5_cgpa),
        sem6_cgpa=VALUES(sem6_cgpa), sem7_cgpa=VALUES(sem7_cgpa), sem8_cgpa=VALUES(sem8_cgpa), 
        history_of_arrear=VALUES(history_of_arrear), standing_arrear=VALUES(standing_arrear),
        address=VALUES(address), student_mobile=VALUES(student_mobile), secondary_mobile=VALUES(secondary_mobile),
        college_email=VALUES(college_email), personal_email=VALUES(personal_email),
        aadhar_number=VALUES(aadhar_number), pancard_number=VALUES(pancard_number), passport=VALUES(passport)
    `;

    const values = [
      regno, name, batch, hsc_percentage, sslc_percentage,
      formatValue(sem1_cgpa), formatValue(sem2_cgpa), formatValue(sem3_cgpa), formatValue(sem4_cgpa), formatValue(sem5_cgpa),
      formatValue(sem6_cgpa), formatValue(sem7_cgpa), formatValue(sem8_cgpa), history_of_arrear, standing_arrear,
      address, student_mobile, secondary_mobile, college_email, personal_email,
      aadhar_number, pancard_number, passport
    ];

    connection.query(query, values, (err, result) => {
      if (err) {
        console.error("Error inserting/updating student profile:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Profile saved successfully!" });
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/api/register-drive", (req, res) => {
  const { drive_id, regno, company_name, register } = req.body;

  const query = `
    INSERT INTO registered_student (id, regno, company_name, register)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE register=VALUES(register)
  `;

  connection.query(query, [drive_id, regno, company_name, register], (err, result) => {
    if (err) {
      console.error("Error inserting into registered_student:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Drive registration updated successfully!" });
  });
});


app.get('/api/registered-drives/:regno', async (req, res) => {
  const { regno } = req.params;

  try {
    const sql = "SELECT company_name FROM registered_student WHERE regno = ?";
    const [results] = await connection.promise().query(sql, [regno]);

    res.json(results);
  } catch (error) {
    console.error("Error fetching registered drives:", error);
    res.status(500).json({ error: "Failed to fetch registered drives" });
  }
});


app.get("/api/admin-registered-students", (req, res) => {
  const query = `
    SELECT rs.id, rs.regno, sd.name, rs.company_name, sd.college_email,sd.batch, 
           sd.hsc_percentage, sd.sslc_percentage, sd.sem1_cgpa AS cgpa, 
           sd.history_of_arrear, sd.standing_arrear
    FROM registered_student rs
    JOIN student_details sd ON rs.regno = sd.regno
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching registered students:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

//send mail

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: "2212052@nec.edu.in",  // Replace with your Gmail
      pass: "iiov biog vknw nznn",  // Replace with your generated App Password
  },
});

app.post("/api/send-emails", async (req, res) => {
  const { students, round } = req.body;

  if (!students || students.length === 0) {
      return res.status(400).json({ error: "No students selected" });
  }

  try {
      for (const student of students) {
          const mailOptions = {
              from: "2212052@nec.edu.in",
              to: student.college_email,
              subject: `Shortlisted for Next Round (${round})`,
              text: `Dear ${student.name},\n\nCongratulations! You have been shortlisted for the next round (${round}). Please check further details with your placement officer.\n\nBest Regards,\nPlacement Cell`,
          };

          await transporter.sendMail(mailOptions);
      }

      res.json({ message: "Emails sent successfully!" });
  } catch (error) {
      console.error("Error sending emails:", error);
      res.status(500).json({ error: "Failed to send emails" });
  }
});
//delete unselected students
app.delete("/api/delete-unselected-students", (req, res) => {
  const selectedRegnos = req.body.selectedRegnos; // Array of selected students' regnos

  if (!selectedRegnos || !Array.isArray(selectedRegnos)) {
    return res.status(400).json({ error: "Invalid request. Selected students are required." });
  }

  const sql = `DELETE FROM registered_student WHERE regno NOT IN (?)`;

  connection.query(sql, [selectedRegnos], (err, result) => {
    if (err) {
      console.error("Error deleting unselected students:", err);
      return res.status(500).json({ error: "Failed to delete unselected students." });
    }

    res.json({ message: "Unselected students deleted successfully!" });
  });
});
//delete upcoming drives
app.delete('/api/upcoming-drives/:id', async (req, res) => {
  const { id } = req.params;

  try {
      await connection.promise().query('DELETE FROM upcomingdrives WHERE id = ?', [id]);
      res.status(200).send({ message: 'Drive deleted successfully' });
  } catch (error) {
      console.error('Error deleting drive:', error);
      res.status(500).send({ message: 'Error deleting drive' });
  }
});



app.listen(3001, () => console.log("Server running on port 3001"));

