import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LS_ADMIN_ID, LS_ADMIN_NAME, APP_NAME  } from '../config/constants';

function Login() {
    const navigate = useNavigate();
    const [loginValues, setLoginValues] = useState({
        loginVal_email: '',
        loginVal_password: ''
    })

    function handleLogin(e) {
        e.preventDefault()

        if (loginValues.loginVal_email === '' || loginValues.loginVal_password === '') {
            alert('Login credentials error. Please try again')
        } else {
            // send post request
            axios.post('/admin_login', loginValues)
            .then((res) => {
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
                alert('Error request: ' + err.data)
            })
        }
    }

    function saveLocalStorage(adminObj) {
        localStorage.setItem(LS_ADMIN_ID, adminObj.id)
        localStorage.setItem(LS_ADMIN_NAME, adminObj.name)
    }

    return (
        <div className='row justify-content-center m-4'>
            <div className='col-10 col-sm-6 col-lg-4 col-xl-3'>
                <h1 className='text-center'>{ APP_NAME }</h1>
                <div className='card px-4 pt-3 pb-2'>
                    <h3 className='text-center'>Login</h3>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email</label>
                            <input type="email" className="form-control mt-1" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="sample@gmail.com" required
                                onChange={ (e) => setLoginValues({ ...loginValues, loginVal_email: e.target.value}) }
                            />
                        </div>
                        <div className="form-group mt-2">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input type="password" className="form-control mt-1" id="exampleInputPassword1" placeholder="******" required
                                onChange={ (e) => setLoginValues({ ...loginValues, loginVal_password: e.target.value}) }
                            />
                        </div>

                        {/* button */}
                        <div className="d-grid gap-2 mt-4">
                            <button type="submit" className="btn btn-primary btn-block">Login</button>
                        </div>
                        {/* text */}
                        <div className="text-center mt-3">
                            <p>
                                Does'nt have an account? <Link to="/register" className='text-primary pt-0 mt-0'>Register</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login