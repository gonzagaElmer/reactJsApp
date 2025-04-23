import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Home from './elements/Admin/Home'
import Read from './elements/Admin/Read'
import Edit from './elements/Admin/Edit'
import Create from './elements/Admin/Create'
import Deactivated from './elements/Admin/Deactivated'
import Login from './elements/Login'
import Register from './elements/Register'
import Profile from './elements/Admin/Profile'
import ChangePass from './elements/Admin/ChangePass'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={ <Login/> }/>
                <Route path='/register' element={ <Register/> }/>
                <Route path='/' element={ <Home/> }/>
                <Route path='/create' element={ <Create/> }/>
                <Route path='/read/:id' element={ <Read/> }/>
                <Route path='/edit/:id' element={ <Edit/> }/>
                <Route path='/deactivated' element={ <Deactivated/> }/>
                <Route path='/profile' element={ <Profile/> }/>
                <Route path='/changepass/:id' element={ <ChangePass/> }/>
            </Routes>
        </BrowserRouter>
    )
}

export default App