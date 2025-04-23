import React from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import { LS_ADMIN_ID, PAGE_FROM, PROFILE_PAGE } from '../../config/constants';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
    const mAdminId = localStorage.getItem(LS_ADMIN_ID);
    const [adminData, setAdminData] = useState([])
    const [showAdminPass, setShowAdminPass] = useState(false)
    const navigate = useNavigate()

    function handlePassShow() {
        setShowAdminPass(!showAdminPass)
    }

    function changePassword() {
        localStorage.setItem(PAGE_FROM, PROFILE_PAGE)
        navigate('/changepass/' + mAdminId)
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
                        {
                            Array.isArray(adminData) && adminData.map((admin) => {
                                return (
                                    <div className='row' key={admin.id}>
                                        <h5 className='ms-2 mb-3'>Account Information</h5>
                                        <div className='col-4 col-md-2'>
                                            <p className='ps-3'>ID: </p>
                                            <p className='ps-3'>Name: </p>
                                            <p className='ps-3'>Email: </p>
                                            <p className='ps-3'>Password: </p>
                                        </div>
                                        <div className='col-8 cold-md-10'>
                                            <p>{admin['id']}</p>
                                            <p>{admin['name']}</p>
                                            <p>{admin['email']}</p>
                                            <div className="d-flex justify-content-md-between">
                                                { showAdminPass ? admin['password'] : "*".repeat(admin['password'].length) }
                                                <p className='ms-4'>
                                                    <span onClick={handlePassShow} className={`ms-auto mx-1 btn btn-info border rounded py-1 px-2 ${showAdminPass ? 'text-dark' : 'text-white'}`}> {showAdminPass ? 'Hide' : 'Show'}</span>
                                                    <span onClick={changePassword} className='ms-auto mx-1 btn btn-primary text-white border rounded py-1 px-2'> Change</span>
                                                </p>
                                            </div>
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