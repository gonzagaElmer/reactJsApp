import React, { useRef, useState } from 'react'
import axios from 'axios'
import { AXIOS_ERR_MSG } from '../../config/constants';
import { DEFULT_STUDENT_PASS } from '../../config/constants'

function Create() {
    const closeButtonRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState('')
    const [imageFileName, setImageFileName] = useState('')
    const [values, setValues] = useState({
        cre_name: '',
        cre_email: '',
        cre_age: '',
        cre_gender: '',
    })

    const handleFileChange = (e) => {
        const fileName = e.target.files[0]
        setSelectedImage(fileName ? URL.createObjectURL(fileName) : '')
        setImageFileName(fileName ? fileName : '')
    }

    function handleSubmit(e) {
        e.preventDefault()

         
        if (imageFileName === undefined || imageFileName === '' || imageFileName.name === undefined) {
            alert('Please select a student photo')
            return
        }

        if (values.cre_name === "" || values.cre_email === "" || values.cre_gender === "" || values.cre_age === "") {
            alert('Please fill out the form properly.')
            return
        } 

        if (values.cre_age > 60) {
            alert("Student's age should not be more than 60.")
            return
        }

        var fData = new FormData()
        fData.append('name', values.cre_name)
        fData.append('email', values.cre_email)
        fData.append('gender', values.cre_gender)
        fData.append('age', values.cre_age)
        fData.append('password', DEFULT_STUDENT_PASS)
        fData.append('img', imageFileName.name)
        
        // console.log("== FormData contents:");
        // for (const [key, value] of fData.entries()) {
        //     console.log(`${key}: ${value}`);
        // }

        try {
            // send post request
            axios.post('/add_student', fData)
            .then((res) => {
                console.log(JSON.stringify(res))
                if (res.data.error !== undefined) {
                    alert(res.data.error)
                } else {
                    if (closeButtonRef.current) {
                        closeButtonRef.current.click();
                    }
                    alert(res.data.success)
                }
            })
            .catch((err) => {
                alert("Error[1]: " + AXIOS_ERR_MSG)
            })
        } catch(e) {
            alert("Error[2]: " + AXIOS_ERR_MSG)
        } 
    } 

  return (
    <div className='row justify-content-center my-4 mx-2'>
        <h3>Adding a Student</h3>

        <form onSubmit={handleSubmit} encType='multipart/form-data' >
            <div className='row my-3 px-1'>
                <div className='col-6'>
                    <label htmlFor='name'>Name</label>
                    <input type='text' name='name' className='form-control' required 
                        onChange={(e)=> setValues({...values, cre_name: e.target.value})} 
                    />
                </div>

                <div className='col-6'>
                    <label htmlFor='email'>Email</label>
                    <input type='email' name='email' className='form-control' required 
                        onChange={(e)=> setValues({...values, cre_email: e.target.value})} 
                    />
                </div>
            </div>

            <div className='row my-3 px-1'>
                <div className='col-6'>
                    <label htmlFor='gender'>Gender</label>
                    <select name='gender' className='form-select' required 
                        onChange={(e)=> setValues({...values, cre_gender: e.target.value})} 
                    >
                        <option value="">Select a gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <div className='col-6'>
                    <label htmlFor='age'>Age</label>
                    <input type='number' name='age' className='form-control' required 
                        onChange={(e)=> setValues({...values, cre_age: e.target.value})} 
                    />
                </div>
            </div>

            <div className='row my-3 px-1'>
                <div className='col-12'>
                    <input type="file" accept="image/*" name="file" onChange={handleFileChange} required/>
                    {
                        selectedImage && (
                            <img 
                                src={selectedImage}
                                width="auto"
                                height={150}
                                alt="Propic"
                                className="img img-thumbnail mt-2"/>
                        )
                    }
                </div>
            </div>

            {/* note */}
            <p className='text-muted text-center px-1 fst-italic fw-light'>IMPORTANT: The student's default password is: { DEFULT_STUDENT_PASS }</p>
            
            {/* buttons */}
            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                <button type='submit' className='btn btn-success mx-1'>Add Student</button>
                <button type="button" className="btn btn-secondary mx-1" ref={closeButtonRef}  data-bs-dismiss="modal">Cancel</button>
            </div>
        </form>
    </div>
  )
}

export default Create