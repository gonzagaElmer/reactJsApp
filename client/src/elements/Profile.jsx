import React from 'react'
import { Link } from 'react-router-dom'
import NavBar from './NavBar'
import { LS_ADMIN_ID } from '../config/constants';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
    const mAdminId = localStorage.getItem(LS_ADMIN_ID);
    const [adminData, setAdminData] = useState([])
    const [showAdminPass, setShowAdminPass] = useState(false)

    function handlePassShow() {
        setShowAdminPass(!showAdminPass)
    }

    useEffect(() => {
        axios.get(`/get_admin/${mAdminId}`)
        .then((res) => {
            if (res.data.error !== undefined) {
                alert(res.data.error)
            } else {
                setAdminData(res.data)
            }
        })
        .catch((err) => {
            console.log(err)
        })
    })

    return (
        <div className='row justify-content-center m-4'>
            <div className='col-md-12 col-lg-10 col-xxl-8'>
                <NavBar/>

                <hr></hr>
                <div className="card mt-3">
                    <div className="card-body shadow">
                        <h5>Account Information</h5>
                        <hr></hr>
                        {
                            Array.isArray(adminData) && adminData.map((admin) => {
                                return (
                                    <div className='row'>
                                        <div className='col-2'>
                                            <p>Admin ID : </p>
                                            <p>Name : </p>
                                            <p>Email : </p>
                                            <p>Password : </p>
                                        </div>
                                        <div className='col-10'>
                                            <p>{admin['id']}</p>
                                            <p>{admin['name']}</p>
                                            <p>{admin['email']}</p>
                                            <p className="d-flex justify-content-between">
                                                { showAdminPass ? admin['password'] : "*".repeat(admin['password'].length) }
											    <button onClick={handlePassShow} className='ms-auto btn btn-secondary'> {showAdminPass ? 'Hide' : 'Show'} Password</button>
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile