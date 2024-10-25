const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const path = require('path')

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

app.get("/students", (req, res) => {
    const sql = "SELECT * FROM student_details";
    db.query(sql, (err, result) => {
        if (err) return res.json({ message: "Error fetching students."})
        return res.json(result);
    })
})

app.post('/add_user', (req, res) => {
    sql = "INSERT INTO student_details (`name`, `email`, `password`, `age`, `gender`) VALUES (?, ?, ?, ?, ?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.age,
        req.body.gender
    ]
    console.log(sql);
    db.query(sql, values, (err, result) => {
        if (err) return res.json({message: "Error adding student."})
        return res.json({success: "Student added Successfuly"});
    })                                                                                                                                                                                                                                                                                                                                                                                                        
})