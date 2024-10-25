import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Home from './elements/Home'
import Read from './elements/Read'
import Create from './elements/Create'
import Edit from './elements/Edit'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={ <Home/> }/>
                <Route path='/create' element={ <Create/> }/>
                <Route path='/read/:id' element={ <Read/> }/>
                <Route path='/edit/:id' element={ <Edit/> }/>
            </Routes>
        </BrowserRouter>
    )
}

export default App