import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import NavBar from './NavBar'
import { PAGE_FROM, DEACTIVATED_TAB, AXIOS_ERR_MSG } from '../../config/constants'
import HomeTabs from './HomeTabs'

function Deactivated() {
    const [data, setData] = useState([])
    const navigate = useNavigate()
    var counter = 1;

    useEffect(() => {
        axios.get(`/deactivated`)
        .then((res) => {
            setData(res.data)
        })
        .catch((err) => {
            alert(AXIOS_ERR_MSG)
            console.log(err)
        })
    })

    function handleActivate(id) {
        axios
        .post(`/activate_id/${id}`)
        .then((res) => {
            // console.log("Activate")
        })
        .catch((err) => {
            // console.log("Activate Error")
            alert(AXIOS_ERR_MSG)
        })
    }

    
    function handleStudent(id, action) {
        localStorage.setItem(PAGE_FROM, DEACTIVATED_TAB)
        if (action === "view") {
            navigate("/read/" + id)
        } else if (action === "edit") {
            navigate("/edit/" + id)
        }
    }

    return (
        <div className='row justify-content-center m-4'>
            <div className='col-md-12 col-lg-10 col-xxl-8'>
			    <NavBar/>
                
			    <div className="card mt-3">
				    <HomeTabs currentTab= {DEACTIVATED_TAB} />

                    <div className="card-body">
                        {/* <h5 className="card-title">Current Active Students</h5> */}
                        <p className="card-text">Students who have returned their ID's and has no access to the School premises.</p>
                        
                        {/* table */}
                        
                        <div className='table-responsive'>
                            <table className='table table-condensed '>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Age</th>
                                    <th>Gender</th>
                                    <th colSpan={3}>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    Array.isArray(data) && data.length > 0 ? 
                                    ( data.map((student) => {
                                            return(
                                                <tr key={student.id}>
                                                    <td>{counter++}</td>
                                                    <td>{student.id}</td>
                                                    <td>{student.name}</td> 
                                                    <td>{student.email}</td>
                                                    <td>{student.age}</td>
                                                    <td>{student.gender}</td>

                                                    <td><button className='btn btn-info' onClick={() => {handleStudent(student.id, "view")} }>View</button></td>
                                                    <td><button className='btn btn-primary' onClick={() => {handleStudent(student.id, "edit")} }>Edit</button></td>
                                                    <td><Link className='btn btn-success' onClick={() => handleActivate(student.id) }>Activate</Link></td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className='text-center text-danger'>No deactivated student.</td>
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Deactivated