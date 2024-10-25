import React, { useState } from 'react'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'

function Create() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        age: '',
        gender: ''
    })

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault()

        axios.post('/add_user', values)
        .then((res) => {
            alert('Added successfully')
            navigate('/')
        })
        .catch((err) => {
            alert('Error: [' +err+ '] occured. Please try again.')
        })
    } 

  return (
    <div className='container mt-4'>
        <div className='row justify-content-center'>
            <div className='col-10'>
                <Link to='/'>&larr; Back to Home</Link>
                <div className=' card p-4 mt-4'>
                    <h3>Adding a Student</h3>
                    <form onSubmit={handleSubmit}>
                        <div className='form-group my-3'>
                            <label htmlFor='name'>Name</label>
                            <input type='text' name='name' className='form-control' required onChange={(e)=> setValues({...values, name: e.target.value})} />
                        </div>
                        <div className='form-group my-3'>
                            <label htmlFor='email'>Email</label>
                            <input type='email' name='email' className='form-control' required onChange={(e)=> setValues({...values, email: e.target.value})} />
                        </div>
                        <div className='form-group my-3'>
                            <label htmlFor='gender'>Gender</label>
                            <input type='text' name='gender' className='form-control' required onChange={(e)=> setValues({...values, gender: e.target.value})} />
                        </div>
                        <div className='form-group my-3'>
                            <label htmlFor='age'>Age</label>
                            <input type='number' name='age' className='form-control' required onChange={(e)=> setValues({...values, age: e.target.value})} />
                        </div>
                        <div className='form-group my-3'>
                            <button type='submit' className='btn btn-success'>Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Create