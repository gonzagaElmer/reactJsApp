import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { LS_ADMIN_ID, LS_ADMIN_NAME, LS_ADMIN_EMAIL, APP_NAME  } from '../config/constants';

function Register() {
    const navigate = useNavigate();
    const [regValues, setRegValues] = useState({
        name: "",
        email: "",
        password: "",
        confirm_password: ""
    })

    function handleRegister(e) {
        e.preventDefault();

        if (regValues.name == "" || regValues.email == "" || regValues.password == "" || regValues.confirm_password == "") {
            alert('Please fill out the form properly.')
        } else if (regValues.password !== regValues.confirm_password) {
            alert('Passwords are not similar. Please try again.')
        } else {
            axios.post('/admin_register', regValues)
            .then((res) => {
                localStorage.setItem("admin_name", null);
                console.log("resJson = " + JSON.stringify(res))
                console.log("res.data.success = " + res.data.success)
                if (res.data.success !== undefined) {
                    if (res.data.adminData !== undefined) {
                        var resAdminObject = res.data.adminData;
                        saveLocalStorage(resAdminObject)
                        navigate('/')
                    } else {
                        alert("No admin data.")
                    }
                } else {
                    alert(res.data.error)
                }
            })
            .catch((err) => {
                alert('Error request: ' + err.error)
            })
        }
    }

    function saveLocalStorage(adminObj) {
        localStorage.setItem(LS_ADMIN_ID, adminObj.id)
        localStorage.setItem(LS_ADMIN_NAME, adminObj.name)
        localStorage.setItem(LS_ADMIN_EMAIL, adminObj.email)
    }

    return (
        <div className='row justify-content-center m-4'>
                <div className='col-10 col-sm-6 col-lg-4 col-xl-3'>
                    <h1 className='text-center'>{ APP_NAME }</h1>
                    <div className='card px-4 pt-3 pb-2'>
                        <h3 className='text-center'>Registration</h3>

                        <form onSubmit={handleRegister}>
                            <div className="form-group">
                                <label htmlFor="regName">Name</label>
                                <input type="text" className="form-control mt-1" name="regName" placeholder="Name" required
                                    onChange={(e) => setRegValues({...regValues, name: e.target.value}) }
                                />
                            </div>
                            <div className="form-group mt-2">
                                <label htmlFor="regEmail">Email</label>
                                <input type="email" className="form-control mt-1" name="regEmail" placeholder="sample@gmail.com" required
                                    onChange={(e) =>  setRegValues({...regValues, email: e.target.value}) }    
                                />
                            </div>
                            <div className="form-group mt-2">
                                <label htmlFor="regPass">Password</label>
                                <input type="password" className="form-control mt-1" name="regPass" placeholder="Password" required
                                    onChange={(e) =>  setRegValues({...regValues, password: e.target.value}) }    
                                />
                            </div>
                            <div className="form-group mt-2">
                                <label htmlFor="regConfirmPass">Confirm Password</label>
                                <input type="password" className="form-control mt-1" name="regConfirmPass" placeholder="Confirm Password" required
                                    onChange={(e) =>  setRegValues({...regValues, confirm_password: e.target.value}) }    
                                />
                            </div>
                            <div className="d-grid gap-2 mt-4">
                                <button type="submit" className="btn btn-primary btn-block">Register</button>
                            </div>
                            <div className="text-center mt-3">
                                <p>
                                    Already have an account? <Link to="/login" className='text-primary pt-0 mt-0'>Login</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    )
}

export default Register