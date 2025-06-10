const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const path = require('path');
const { error } = require('console');
const multer = require('multer');
const fs = require('fs');
const bcrypt = require('bcryptjs'); // For password hashing

const app = express();
app.use(cors())
app.use(express.json())

const mPort = 3000 // same with "../client/package.json"
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "react_db"
})

app.listen(mPort, () => {
    console.log('listening to port ' + mPort);
})

const UPLOAD_DIR = path.join(__dirname, 'uploads');
// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

const mStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR)
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
         
    }
})

const mUpload =  multer({
    storage: mStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only images (jpeg, jpg, png, gif) are allowed!'));
        }
    }
});

app.use('/uploads', express.static(UPLOAD_DIR));

// ================================================================================================
// ================================== CUSTOM functions/variables ==================================
// ================================================================================================

const mStudentDetailsTable = "student_details";
const mAdminDetailsTable = "admin_details"; 
const mOrderByDateASC = "ORDER BY add_date ASC";
const mSelectStudentQuery = "SELECT * FROM " + mStudentDetailsTable + " WHERE `is_active` = ? " + mOrderByDateASC;
const mActivateToggleSql =  "UPDATE " + mStudentDetailsTable + " SET `is_active` = ? WHERE  id = ?";
const mGetDetailsByEmailAndPass = "SELECT id, name, email FROM " + mAdminDetailsTable + " WHERE `email` = ? AND `password` = ?";
var mAdminDetailsObj = {};
var mIsOnline = 0;

function updateAdminOnlineStatus(res) {
    console.log("mIsOnline = " + mIsOnline);
    var updateLoginTimeStamp = (mIsOnline) ? ", `online_date` = ?" : ", `offline_date` = ?";
    var updateSql = "UPDATE " + mAdminDetailsTable + " SET `is_online` = ? " + updateLoginTimeStamp + " WHERE  id = ?";
    const values = [
        mIsOnline,
        getCurrentTimestamp(),
        mAdminDetailsObj.id
    ]
    var successMsg = (mIsOnline) ? "Hello, " + mAdminDetailsObj.name + "!" : "Logged out successfuly!";
    var adminDetails = (mIsOnline) ? mAdminDetailsObj : new Object;
    
    db.query(updateSql, values, (dbErr, dbRes) => {
        if (dbErr) return res.json({error: "Login credentials invalid. Please try again."})
        return res.json({success: successMsg, adminData: adminDetails});
    }) 
}

function getCurrentTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


// ================================================================================================
// ===================================== ADMIN urls start =========================================
// ================================================================================================

// admin login
app.post("/admin_login", (req, res) => {
    // get admin_id by email and password
    const loginValues = [
        req.body.loginVal_email,
        req.body.loginVal_password
    ]

    db.query(mGetDetailsByEmailAndPass, loginValues, (dbErr, dbRes) => {
        if (dbErr) {
            return res.json({ error: "Login error. Errcode: " + dbErr });
        } else {
            if (dbRes != null) {
                try {
                    mAdminDetailsObj = dbRes[0];
                    // log data
                    if (mAdminDetailsObj !== null) {
                        mIsOnline = 1;
                        updateAdminOnlineStatus(res)
                    }
                } catch(e) {
                    return res.json({ error: "Invalid credentials error[2]. Please try again!"});
                }
            } else {
                return res.json({ error: "Invalid credentials. Please try again!"});
            }
        }
    })
})

// admin logout
app.post("/admin_logout/:id", (req, res) => {
    mIsOnline = 0;
    updateAdminOnlineStatus(res)
})

// admin register
app.post("/admin_register", (req, res) => {
    // check if email doesn't exist
    const isEmailExistQuery = "SELECT * FROM " + mAdminDetailsTable + " WHERE `email` = ?";
    const values = [
        req.body.email
    ]
    db.query(isEmailExistQuery, values, (dbErr, dbRes) => {
        if (dbErr) {
            return res.json({error: "Admin Email registration " + dbErr + " Please try again."})
        } else {
            if (dbRes.length > 0) {
                return res.json({error: "Admin Email already exist. Please use another email."});
            } else {
                registerAdminAccount(req, res)
            }
        }
    })
})

function registerAdminAccount(req, res) {
    // insert to db
    const registerSql = "INSERT INTO " + mAdminDetailsTable + " (`name`, `email`, `password`, `is_online`, `online_date`, `offline_date`) VALUES (?, ?, ?, ?, ?, ?)";
    const saveVals = [
        req.body.name,
        req.body.email,
        req.body.password,
        "0",
        getCurrentTimestamp(),
        ""
    ]
    db.query(registerSql, saveVals, (dbErr, dbRes) => {
        if (dbErr) {
            return res.json({error: "Admin Registration saving " + dbErr + " Please try again. " })
        } else {
            // get the admin ID and details from db
            const adminIdVals = [
                req.body.email,
                req.body.password
            ]

            db.query(mGetDetailsByEmailAndPass, adminIdVals, (dbErr, dbRes) => {
                if (dbErr) {
                    return res.json({ error: "Admin Registration saving error[2]. Please try again."});
                } else {
                    if (dbRes != 0) {
                        try {
                            mAdminDetailsObj = dbRes[0];
                            // log data
                            if (mAdminDetailsObj !== null) {
                                mIsOnline = 1;
                                updateAdminOnlineStatus(res)
                            }
                        } catch(e) {
                            return res.json({ error: "Admin Registration saving error[4]. Please try again."});
                        }
                    } else {
                        return res.json({ error: "Admin Registration saving error[3]. Please try again."});
                    }
                }
            })
        }
    })  
}

// admin read/show
app.get("/get_admin/:id", (req, res) => {
    const adminId = req.params.id
    const adminSql = "SELECT * FROM " + mAdminDetailsTable + " WHERE `id` = ?";
    db.query(adminSql, [ adminId ], (dbErr, dbRes) => {
        if (dbErr) return res.json({error: "Error fetching Admin's details"})
            return res.json(dbRes)
    })
})

// admin editing
app.post('/edit_admin/:id', (req, res) => {
    console.log("edit ")
    const adminId = req.params.id
    console.log("adminId = " + adminId)
    const updateAdminSql = "UPDATE " + mAdminDetailsTable + " SET `password` = ? WHERE id = ?";
    const updateAdminVal = [
        req.body.password,
        adminId
    ]
    console.log("updateAdminVal = " + updateAdminVal)
    db.query(updateAdminSql, updateAdminVal, (dbErr, dbRes) => {
        if (dbErr) return res.json( {error: "There's an error changing admin's password."} )
            return res.json({success: "Password changed succesfully."})
    })
})


// ================================================================================================
// =================================== STUDENT urls start =========================================
// ================================================================================================

// all active students
app.get("/students", (req, res) => {
    const status = [ "1" ]
    db.query(mSelectStudentQuery, status, (dbErr, dbRes) => {
        if (dbErr) return res.json({ error: "Error fetching students."})
        return res.json(dbRes);
    })
})

// all deactivated accounts
app.get("/deactivated", (req, res) => {
    const status = [ "0" ]
    db.query(mSelectStudentQuery, status, (err, result) => {
        if (err) return res.json({ error: "Error fetching students."})
            return res.json(result);
    })
})

// adding student
app.post('/add_student', mUpload.single('image'), async (req, res) => {
    // --- Hash Password ---
    let hashedPassword;
    try {
        const salt = await bcrypt.genSalt(10); // Generate a salt (cost factor 10)
        hashedPassword = await bcrypt.hash(req.body.password, salt); // Hash the password
    } catch (err) {
        console.error('Error hashing password:', err);
        fs.unlink(req.file.path, (err) => { // Delete file if password hashing fails
            if (err) console.error("Error deleting file:", err);
        });
        return res.json({error: "Error processing password."})
    }

    // check if student name and email already exist 
    const checkUserSql = "SELECT * FROM " + mStudentDetailsTable + " WHERE `email` = ? ";
    const checkIfExist = [
        req.body.name,
        req.body.email
    ]
    db.query(checkUserSql, checkIfExist, (dbErr, dbRes) => {
        if (dbErr) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting file[1] :", err);
            });
            return res.json({error: "Student's Email validation " + dbErr + ". Please try again."})
        } else {
            if (dbRes.length > 0) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Error deleting file[2] :", err);
                });
                return res.json({error: "Student's Email already exist. Please use another email."});
            } else {
                // add student
                const addUserSql = "INSERT INTO " + mStudentDetailsTable + " (`name`, `email`, `gender`, `age`, `img`, `password`, `is_active`) VALUES (?, ?, ?, ?, ?, ?, ?)";
                const values = [
                    req.body.name,
                    req.body.email,
                    req.body.gender,
                    req.body.age,
                    req.body.img,
                    req.body.password,
                    1
                ]
                db.query(addUserSql, values, (dbErr, dbRes) => {
                    if (dbErr) {
                        fs.unlink(req.file.path, (err) => {
                            if (err) console.error("Error deleting file[1] :", err);
                        });
                        return res.json({error: "Error adding student. Errcode = " + dbErr })
                    } else {
                        return res.json({success: "Student added Successfuly"});
                    }
                })  
            }
        }
    })                                                                                                                                                                                                                                                                                                                                                                                                      
})

// read/show student
app.get("/get_student/:id", (req, res) => {
    const studentId = req.params.id
    const studentSql = "SELECT * FROM " + mStudentDetailsTable + " WHERE `id` = ?";
    db.query(studentSql, [studentId], (dbErr, dbRes) => {
        if (dbErr) return res.json({ error: "Error fetching Student's details."})
        return res.json(dbRes);
    })
})

// editing student
app.post('/edit_user/:id', (req, res) => {
    const id = req.params.id
    const updateStudentSql = "UPDATE " + mStudentDetailsTable + " SET `name` = ?, `email` = ?, `password` = ?, `age` = ?, `gender` = ? WHERE  id = ?";
    const updateStudentVals = [
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.age,
        req.body.gender,
        id
    ]
    db.query(updateStudentSql, updateStudentVals, (dbErr, dbRes) => {
        if (dbErr) return res.json({error: "There's an error editing this student"})
        return res.json({success: "Student's info is updated Successfuly"});
    })                                                                                                                                                                                                                                                                                                                                                                                                        
})

// activating student
app.post('/activate_id/:id', (req, res) => {
    const activate = 1;
    const values = [
        activate,
        req.params.id
    ]
    db.query(mActivateToggleSql, values, (err, result) => {
        if (err) return res.json({error: "Error activating student. Errcode = " + err })
        return res.json({success: "Student activating Successfuly"});
    })                                                                                                                                                                                                                                                                                                                                                                                                        
})

// deactivating student
app.post('/deactivate_id/:id', (req, res) => {
    const deactivate = 0;
    const values = [
        deactivate,
        req.params.id
    ]
    db.query(mActivateToggleSql, values, (err, result) => {
        if (err) return res.json({error: "Error deactivating student. Errcode = " + err })
        return res.json({success: "Student deactivating Successfuly"});
    })                                                                                                                                                                                                                                                                                                                                                                                                        
})