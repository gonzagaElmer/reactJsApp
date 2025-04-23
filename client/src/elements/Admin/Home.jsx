import React, {useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button } from 'bootstrap'
import NavBar from './NavBar'
import Create from './Create'
import Read from './Read' 
import HomeTabs from './HomeTabs'
import { PAGE_FROM, ACTIVE_TAB } from '../../config/constants'

function Home() {
  const [data, setData] = useState([])
  const navigate = useNavigate()
  var counter = 1;

  useEffect(() => {
    axios.get(`/students`)
    .then((res) => {
      setData(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
  })

  function handleDeactivate(id) {
    axios
    .post(`/deactivate_id/${id}`)
    .then((res) =>  {
    //   console.log("elms" + res.data)
    })
    .catch((err) => {
    //   console.log("elms" + err.data)
    })
  }

  function handleStudent(id, action) {
	localStorage.setItem(PAGE_FROM, ACTIVE_TAB)
	if (action == "view") {
		navigate("/read/" + id)
	} else if (action == "edit") {
		navigate("/edit/" + id)
	}
  }

  return (  
    <div className='row justify-content-center m-4'>
     	<div className='col-md-12 col-lg-10 col-xxl-8'>
			<NavBar/>

			<div className="card mt-3">
				<HomeTabs currentTab= {ACTIVE_TAB} />

				<div className="card-body">
					<p className="card-text">Students who have ID's and access to the School premises.</p>


					{/* add a student button */}
					<button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addStudentModal">
						Add a student
					</button>
					<div className="modal fade" id="addStudentModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="addStudentModalLabel" aria-hidden="true">
						<div className="modal-dialog">
							<div className="modal-content">
								<Create/>
							</div>
						</div>
					</div>

					<hr></hr>

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
								( 
								data.map((student) => {
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
										<td><Link className='btn btn-secondary' onClick={() => handleDeactivate(student.id)}>Deactivate</Link></td>
									</tr>
									)
								})
								) : (
								<tr>
									<td colSpan={7} className='text-center text-danger'>No active student.</td>
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

export default Home