import React, {useEffect, useState} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import NavBar from './NavBar'
import { PAGE_FROM, ACTIVE_TAB, DEACTIVATED_TAB, AXIOS_ERR_MSG } from '../../config/constants'

function Read() {
	const [data, setData] = useState([])
	const {id} = useParams()
	const navigate = useNavigate()

	useEffect(() => {
		axios.get(`/get_student/${id}`)
		.then((res) => {
			console.log(res.data)
			setData(res.data)
		})
		.catch((err) => {
			alert(AXIOS_ERR_MSG)
			console.log(err)
		})
	})

	function handleBackClick() {
		var pageFrom = localStorage.getItem(PAGE_FROM)
		if (pageFrom === ACTIVE_TAB) {
			navigate('/')
		} else if (pageFrom === DEACTIVATED_TAB) {
			navigate('/deactivated')
		}
	}

  return (
	<div className='row justify-content-center m-4'>
        <div className='col-md-12 col-lg-10 col-xxl-8'>
			<NavBar/>

			<hr></hr>
			<div className='card p-4 mt-2'>
				<h3 className='d-flex justify-content-between'>Student Info</h3>
				{
					Array.isArray(data) && data.map((student) => {
						return(
							<table className='table table-condensed mt-2'>
								<thead>
									<th colSpan={2}></th>
								</thead>
								<tbody>
									<tr>
										<td>Img: </td>
										<td>{student['img']}</td>
									</tr>
									<tr>
										<td>ID: </td>
										<td>{student['id']}</td>
									</tr>
									<tr>
										<td>Name: </td>
										<td>{student['name']}</td>
									</tr>
									<tr>
										<td>Email: </td>
										<td>{student['email']}</td>
									</tr>
									<tr>
										<td>Gender: </td>
										<td>{student['gender']}</td>
									</tr>
									<tr>
										<td>Age: </td>
										<td>{student['age']}</td>
									</tr>
									<tr >
										<td>Password: </td>
										<td>{"*".repeat(student['password'].length)}</td>
									</tr>
									<tr >
										<td>Status: </td>
										<td>{ (student['is_active'] === 1) ? "Active" : "Inactive" }</td>
									</tr>
								</tbody>
							</table>
						)
					})
				}

				{/* buttons */}
				<div className="d-grid gap-2 d-md-flex justify-content-md-end mt-2">
					<Link to={`/edit/${id}`} className='btn btn-primary'>Edit Info</Link>
					<button onClick={() => {handleBackClick()}} className='btn btn-secondary mx-2'>Back</button>
				</div>
            </div>
        </div>
    </div>
  )
}

export default Read