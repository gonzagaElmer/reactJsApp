import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Home from './elements/Home'
import Read from './elements/Read'
import Create from './elements/Create'
import Edit from './elements/Edit'
import Deactivated from './elements/Deactivated'
import Login from './elements/Login'
import Register from './elements/Register'
import Profile from './elements/Profile'

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
            </Routes>
        </BrowserRouter>
    )
}

export default App