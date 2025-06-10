import React, {useEffect, useState} from 'react'
import { useParams, useNavigate} from 'react-router-dom'
import axios from 'axios'
import NavBar from './NavBar'
import { PAGE_FROM, ACTIVE_TAB, DEACTIVATED_TAB, AXIOS_ERR_MSG, MIN_PASS_COUNT} from '../../config/constants'

function Edit() {
	const {id} = useParams()
	const navigate = useNavigate()
	const [selectedImage, setSelectedImage] = useState('')
	const [data, setData] = useState({
		img: '',
		name: '',
		email: '',
		age: '',
		gender: '',
		password: '',
		confirmPass: ''
	})
	
	useEffect(() => {
		axios.get(`/get_student/${id}`)
		.then((res) => {
			setData(res.data)
		})
		.catch((err) => {
			alert("An error occured")
		})
	}, [id])

    const handleFileChange = (e) => {
        const fileName = e.target.files[0]
        setSelectedImage(fileName ? URL.createObjectURL(fileName) : '')
    }

	function handleBackClick() {
		var pageFrom = localStorage.getItem(PAGE_FROM)
		if (window.confirm("Are you sure to cancel editing?")) {
			if (pageFrom === ACTIVE_TAB) {
				navigate('/')
			} else if (pageFrom === DEACTIVATED_TAB){
				navigate('/deactivated')
			}
		}
	}

  	function handleSubmit(e) {
		e.preventDefault()
		console.log("editStud data[0] = " + JSON.stringify(data[0]))
		var inputPass = data[0].password
		var inputConfirmPass = data[0].confirmPass

		if (inputPass === "" || inputConfirmPass === "" || inputPass.trim() === "" || inputConfirmPass.trim() === "") {
			alert("Please make sure to update the student's password properly.")
		} else if (inputPass !== inputConfirmPass) {
			alert("Inputted passwords don't match. Please try again.")
		} else {
			if (inputPass.length < MIN_PASS_COUNT) {
				alert("Password must be more than " + MIN_PASS_COUNT + " characters.")
			} else {
				// update db
				axios.post(`/edit_student/${id}`, data[0])
				.then((res) => {
					if (window.confirm("Updated Successfully! Do you want to leave this page?")) {
						navigate('/')
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
		Array.isArray(data) && data.map((studentArr) => {
			return(
				<div className='row justify-content-center m-4'>
					<div className='col-md-12 col-lg-10 col-xxl-8'>
						<NavBar/>
						<hr></hr>
						<div className='card p-4 mt-2'>
							<h5>Student ID : {id}</h5>
							<form onSubmit={handleSubmit} key={studentArr.id}  encType='multipart/form-data' >
								
								<div className='col-12'>
									<input type="file" accept="image/*" name="img" onChange={handleFileChange} required/>
									{
										studentArr.img && (
											<img 
                                				src={selectedImage == false ? studentArr.img : selectedImage}
												style={{ height: '220px', width: 'auto' }}
                                				alt="Student img"
												className="img img-thumbnail mt-2"/>
										)
									}
								</div>

								<div className='row my-3'>
									<div className='col-6'>
										<label htmlFor='name'>Name</label>
										<input type='text' name='name' className='form-control mt-2' required 
											onChange={(e)=> setData( [{...data[0], name: e.target.value}] )} value={studentArr.name}/>
									</div>

									<div className='col-6'>
										<label htmlFor='email'>Email</label>
										<input type='email' name='email' className='form-control mt-2' required 
											onChange={(e)=> setData( [{...data[0], email: e.target.value}] )} value={studentArr.email}/>
									</div>
								</div>

								<div className='row my-3'>
									<div className='col-6'>
										<label htmlFor='gender'>Gender</label>
										<select name='gender' className='form-select mt-2' required 
											onChange={(e)=> setData( [{...data[0], gender: e.target.value}] )} value={studentArr.gender}>
											<option value="">Select a gender</option>
											<option value="Male">Male</option>
											<option value="Female">Female</option>
										</select>
									</div>

									<div className='col-6'>
										<label htmlFor='age'>Age</label>
										<input type='number' name='age' className='form-control mt-2' required 
											onChange={(e)=> setData( [{...data[0], age: e.target.value}] )}  value={studentArr.age}/>
									</div>
								</div>

								<div className='row my-3'>
									<div className='col-6'>
										<label htmlFor='password'>New Password</label>
										<input type='password' name='password' className='form-control mt-2' required 
											onChange={(e)=> setData( [{...data[0], password: e.target.value}] )} placeholder={"*".repeat(MIN_PASS_COUNT)}/>
									</div>

									<div className='col-6'>
										<label htmlFor='confirmPass'>Confirm Password</label>
										<input type='password' name='confirmPass' className='form-control mt-2' required 
											onChange={(e)=> setData( [{...data[0], confirmPass: e.target.value}] )} placeholder={"*".repeat(MIN_PASS_COUNT)}/>
									</div>
								</div>
								
								{/* buttons */}
								<div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
									<button type='submit' className='btn btn-primary'>Edit Student</button>
									<button onClick={() => {handleBackClick()}} className='btn btn-secondary mx-2'>Cancel</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)
		})
	)}

export default Edit