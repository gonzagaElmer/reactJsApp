const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const path = require('path');
const { error } = require('console');

const app = express();
app.use(express.static(path.join(__dirname, "public")))
app.use(cors())
app.use(express.json())

const port = 3000

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "react_db"
})

app.listen(port, () => {
    console.log('listening to port ' + port);
})


// global variables
const mStudentDetailsTable = "student_details";
const mAdminDetailsTable = "admin_details"; 
const mOrderByDateASC = "ORDER BY add_date ASC";
const mSelectStudentQuery = "SELECT * FROM " + mStudentDetailsTable + " WHERE `is_active` = ? " + mOrderByDateASC;
const mActivateToggleSql =  "UPDATE " + mStudentDetailsTable + " SET `is_active` = ? WHERE  id = ?";
const mGetDetailsByEmailAndPass = "SELECT id, name, email FROM " + mAdminDetailsTable + " WHERE `email` = ? AND `password` = ?";
var mAdminDetails = {};
var mIsOnline = 0;
var mDefaultStudentPass = "admin@123"

// custom functions
function updateIsOnlineStatus(res) {
    console.log("mIsOnline = " + mIsOnline);
    var updateTimeStamp = (mIsOnline) ? ", `last_login_date` = ?" : ", `last_logout_date` = ?";
    var updateSql = "UPDATE " + mAdminDetailsTable + " SET `is_online` = ? " + updateTimeStamp + " WHERE  id = ?";
    const values = [
        mIsOnline,
        getCurrentTimestamp(),
        mAdminDetails.id
    ]
    var successMsg = (mIsOnline) ? "Hello, " + mAdminDetails.name + "!" : "Logged out successfuly!";
    var adminDetails = (mIsOnline) ? mAdminDetails : new Object;
    
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

// login
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
                    mAdminDetails = dbRes[0];
                    // log data
                    console.log("mAdminDetails: " + JSON.stringify(mAdminDetails));
                    if (mAdminDetails !== null) {
                        mIsOnline = 1;
                        updateIsOnlineStatus(res)
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

app.post("/admin_logout/:id", (req, res) => {
    mIsOnline = 0;
    updateIsOnlineStatus(res)
})

// register
app.post("/admin_register", (req, res) => {
    // check if email doesn't exist
    const isEmailExistQuery = "SELECT * FROM " + mAdminDetailsTable + " WHERE `email` = ?";
    const values = [
        req.body.email
    ]
    db.query(isEmailExistQuery, values, (dbErr, dbRes) => {
        if (dbErr) {
            return res.json({error: "Admin Registration email error. Please try again."})
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
    const registerSql = "INSERT INTO " + mAdminDetailsTable + " (`name`, `email`, `password`, `is_online`) VALUES (?, ?, ?, ?)";
    const saveVals = [
        req.body.name,
        req.body.email,
        req.body.password,
        "0"
    ]
    db.query(registerSql, saveVals, (dbErr, dbRes) => {
        if (dbErr) {
            return res.json({error: "Admin Registration saving error. Please try again."})
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
                            mAdminDetails = dbRes[0];
                            // log data
                            console.log("reg mAdminDetails: " + JSON.stringify(mAdminDetails));
                            if (mAdminDetails !== null) {
                                mIsOnline = 1;
                                updateIsOnlineStatus(res)
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
app.post('/add_student', (req, res) => {
    // check if student name and email already exist 
    const checkUserSql = "SELECT * FROM " + mStudentDetailsTable + " WHERE `email` = ? ";
    const checkVals = [
        req.body.cre_email
    ]
    db.query(checkUserSql, checkVals, (dbErr, dbRes) => {
        if (dbErr) {
            return res.json({error: "Adding student error. Please try again."})
        } else {
            if (dbRes.length > 0) {
                return res.json({error: "Student's Email already exist. Please use another email."});
            } else {
                // add student
                const addUserSql = "INSERT INTO " + mStudentDetailsTable + " (`name`, `email`, `password`, `age`, `gender`, `is_active`) VALUES (?, ?, ?, ?, ?, ?)";
                const values = [
                    req.body.cre_name,
                    req.body.cre_email,
                    mDefaultStudentPass,
                    req.body.cre_age,
                    req.body.cre_gender,
                    "1"
                ]
                db.query(addUserSql, values, (dbErr, dbRes) => {
                    if (dbErr) return res.json({error: "Error adding student. Errcode = " + err })
                    return res.json({success: "Student added Successfuly"});
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

app.get("/get_admin/:id", (req, res) => {
    const adminId = req.params.id
    const adminSql = "SELECT * FROM " + mAdminDetailsTable + " WHERE `id`=?";
    db.query(adminSql, [adminId], (dbErr, dbRes) => {
        if (dbErr) return res.json({error: "Error fetching Admin's details"})
            return res.json(dbRes)
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