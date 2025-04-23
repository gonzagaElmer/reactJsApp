import React, {useEffect, useState} from 'react'
import { useParams, useNavigate} from 'react-router-dom'
import axios from 'axios'
import NavBar from './NavBar'
import { PAGE_FROM, ACTIVE_TAB, DEACTIVATED_TAB } from '../config/constants'

function Edit() {
	const [data, setData] = useState({
		name: '',
		email: '',
		age: '',
		gender: '',
		password: '',
		confrimPass: ''
	})
	const {id} = useParams()
	const navigate = useNavigate()
	
	useEffect(() => {
		axios
		.get(`/get_student/${id}`)
		.then((res) => {
			setData(res.data)
		})
		.catch((err) => {
			console.log(err)
		})
	}, [id])


	function handleBackClick() {
		var pageFrom = localStorage.getItem(PAGE_FROM)
		if (pageFrom === ACTIVE_TAB) {
			navigate('/')
		} else if (pageFrom === DEACTIVATED_TAB){
			navigate('/deactivated')
		}
	}

  	function handleSubmit(e) {
		e.preventDefault()
		var inputPass = data[0].password
		var inputConfirmPass = data[0].confirmPass

		if (inputPass == "" || inputConfirmPass == "" || inputPass.trim() == "" || inputConfirmPass.trim() == "") {
			alert("Please make sure to update the student's password properly.")
		} else if (inputPass != inputConfirmPass) {
			alert("Inputted passwords don't match. Please try again.")
		} else {
			// update db
			axios.post(`/edit_user/${id}`, data[0])
			.then((res) => {
				if (window.confirm("Updated successfully. Do you want to leave this page?")) {
					navigate('/')
				}
			})
			.catch((err) => {
				alert('An error occured. Please try again.')
				console.log(err)
			})
		}
  	} 

	return (
        <div className='row justify-content-center m-4'>
			<div className='col-md-12 col-lg-10 col-xxl-8'>
				<NavBar/>
				<hr></hr>
				<div className='card p-4 mt-2'>
					<h5>Student ID : {id}</h5>
					{
					Array.isArray(data) && data.map((student) => {
						return(
						<form onSubmit={handleSubmit} key={student.id}>
							<div className='row my-3'>
								<div className='col-6'>
									<label htmlFor='name'>Name</label>
									<input type='text' name='name' className='form-control' required onChange={(e)=> setData( [{...data[0], name: e.target.value}] )} value={student.name}/>
								</div>

								<div className='col-6'>
									<label htmlFor='email'>Email</label>
									<input type='email' name='email' className='form-control' required onChange={(e)=> setData( [{...data[0], email: e.target.value}] )} value={student.email}/>
								</div>
							</div>

							<div className='row my-3'>
								<div className='col-6'>
									<label htmlFor='gender'>Gender</label>
									<select name='gender' className='form-select' required onChange={(e)=> setData( [{...data[0], gender: e.target.value}] )} value={student.gender}>
										<option value="">Select a gender</option>
										<option value="Male">Male</option>
										<option value="Female">Female</option>
									</select>
								</div>

								<div className='col-6'>
									<label htmlFor='age'>Age</label>
									<input type='number' name='age' className='form-control' required onChange={(e)=> setData( [{...data[0], age: e.target.value}] )}  value={student.age}/>
								</div>
							</div>

							<div className='row my-3'>
								<div className='col-6'>
									<label htmlFor='password'>Password</label>
									<input type='password' name='password' className='form-control' required onChange={(e)=> setData( [{...data[0], password: e.target.value}] )}  placeholder={"*".repeat(student.password.length)}/>
								</div>

								<div className='col-6'>
									<label htmlFor='confirmPass'>Confirm Password</label>
									<input type='password' name='confirmPass' className='form-control' required onChange={(e)=> setData( [{...data[0], confirmPass: e.target.value}] )}  placeholder={"*".repeat(student.password.length)}/>
								</div>
							</div>
							
							{/* buttons */}
							<div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
								<button type='submit' className='btn btn-primary'>Edit Student</button>
								<button onClick={() => {handleBackClick()}} className='btn btn-secondary mx-2'>Cancel</button>
							</div>
						</form>
						)
					})
					}
				</div>
			</div>
		</div>
	)}

export default Edit