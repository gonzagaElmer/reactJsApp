import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { PAGE_FROM, PROFILE_PAGE, AXIOS_ERR_MSG, MIN_PASS_COUNT } from '../../config/constants'
import NavBar from './NavBar'

function ChangePass() {
    const navigate = useNavigate()
    const {id} = useParams()
    const [data, setData] = useState({
        password: '',
        confirmPassword: ''
    })

    useEffect(() => {
        axios.get(`/get_admin/${id}`)
        .then((res) => {
            setData(res.data);
        })
        .catch((err) => {
            alert("Error: " + err)
        })
    }, [id])

    function handleBackClick() {
		if (window.confirm("Discard changing your password?")) {
            if (localStorage.getItem(PAGE_FROM) === PROFILE_PAGE) {
                navigate('/profile')
            }
        }
    }

    function handleChangePass(e) {
        e.preventDefault()

        var newPass = data[0].password;
        var confirmPassword = data[0].confirmPassword

        if (newPass.trim() === "" || confirmPassword === "") {
            alert("Invalid password inputted. Please try again.")
        } else if (newPass !== confirmPassword) {
            alert("Passwords does'nt match. Please try again.")
        } else {
            if (newPass.length < MIN_PASS_COUNT) {
                alert("Password must be more than " + MIN_PASS_COUNT + " characters.")
            } else {
                // update db
                axios.post(`/edit_admin/${id}`, data[0])
                .then((res) => {
                    console.log("edit_admin thenRes:" + JSON.stringify(res))
                    if (res.data.error !== undefined) {
                        alert(res.data.err)
                    } else {
                        alert(res.data.success)
                        navigate('/profile')
                    }
                })
                .catch((err) => {
                    alert(AXIOS_ERR_MSG)
                    console.log(err)
                })
            }
        }
    }

    
    return (
        <div className='row justify-content-center m-4'>
            <div className='col-md-12 col-lg-10 col-xxl-8'>
                <NavBar/>
                
                <hr></hr>
                <div className="card mt-3">
                    <div className="card-body shadow">
                        <h5 className='ms-2 mb-3'>Change Password</h5>
                        {
                            Array.isArray(data) && data.map((adminArr) => {
                                return (
                                    <form onSubmit={handleChangePass} key={adminArr.id}>
                                        <div className='row px-2'>
                                            <div className='col-6'>
                                                <label htmlFor='password'>New Password</label>
                                                <input type='password' name='password' className='form-control mt-2' required
                                                    onChange={(e)=> setData( [{...data[0], password: e.target.value}] )}  placeholder={"*".repeat(MIN_PASS_COUNT)}/>
                                            </div>

                                            <div className='col-6'>
                                                <label htmlFor='confirmPassword'>Confirm Password</label>
                                                <input type='password' name='confirmPassword' className='form-control mt-2' required
                                                    onChange={(e)=> setData( [{...data[0], confirmPassword: e.target.value}] )} placeholder={"*".repeat(MIN_PASS_COUNT)}/>
                                            </div>
                                        </div>
                                        
                                        {/* buttons */}
                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                            <button type='submit' className='btn btn-primary mx-1'>Change Password</button>
                                            <button onClick={() => {handleBackClick()}} className='btn btn-secondary mx-1'>Cancel</button>
                                        </div>
                                    </form>
                                )

                            })
                        }
                  </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePass