import React, { useRef, useState } from 'react'
import axios from 'axios'
import { AXIOS_ERR_MSG } from '../../config/constants';
import { DEFULT_STUDENT_PASS } from '../../config/constants'

function Create() {
    const closeButtonRef = useRef(null);
    const [values, setValues] = useState({
        cre_name: '',
        cre_email: '',
        cre_age: '',
        cre_gender: '',
        cre_password: '',
        cre_confirm_password: ''
    })

    function handleSubmit(e) {
        e.preventDefault()

        if (values.cre_name === "" || values.cre_email === "" || values.cre_age === "") {
            alert('Please fill out the form properly.')
        } else {
            // send post request
            axios.post('/add_student', values)
            .then((res) => {
                console.log(JSON.stringify(res))
                if (res.data.error !== undefined) {
                    console.log("if")
                    alert(res.data.error)
                } else {
                    console.log("else")
                    if (closeButtonRef.current) {
                        closeButtonRef.current.click();
                    }
                    alert(res.data.success)
                }
                console.log("out")
            })
            .catch((err) => {
                alert(AXIOS_ERR_MSG)
                console.log(err)
            })
        }
    } 

  return (
    <div className='row justify-content-center my-4 mx-2'>
        <h3>Adding a Student</h3>

        <form onSubmit={handleSubmit}>
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
            
            <p className='text-danger text-center px-1'>NOTE: The student's default password is: { DEFULT_STUDENT_PASS }</p>
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