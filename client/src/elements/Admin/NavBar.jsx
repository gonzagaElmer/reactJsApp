import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, DropdownDivider } from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import { LS_ADMIN_ID, LS_ADMIN_NAME, APP_NAME, PAGE_FROM  } from '../../config/constants';
import { useEffect } from 'react';

function NavBar() {
	const navigate = useNavigate()
	const mAdminId = localStorage.getItem(LS_ADMIN_ID)
	const mAdminName = localStorage.getItem(LS_ADMIN_NAME)
	
	// force login
	useEffect(() => {
		if (mAdminId == null) {
			navigate('/login')
		}
	}, [navigate, mAdminId])

	// logout
	function handleLogout(e) {
		e.preventDefault()
		
		if (window.confirm("Are you sure to logout?")) {
			// post request
			axios.post(`/admin_logout/${mAdminId}`)
			.then((res) => {
				clearLocalStorage()
				navigate('/login')
			})
			.catch((err) => {
				alert(err.error);
			})
		}
	}

	function clearLocalStorage() {
		localStorage.removeItem(LS_ADMIN_ID)
		localStorage.removeItem(LS_ADMIN_NAME)
		localStorage.removeItem(PAGE_FROM)
	}

	return (
		<nav className="navbar border px-4 mb-2 d-flex justify-content-between align-items-center">
			<Link to="/" className="fs-4 navbar-brand">{APP_NAME}</Link>
			{/* <form className="d-flex" onSubmit={handleSearch()}>
				<input
					className="form-control mr-sm-2"
					type="search"
					placeholder="Edit text here..."
					aria-label="Search"
				/>
				<button className="btn btn-outline-success my-2 my-sm-0" type="submit">
					Search
				</button>
			</form> */}
			<Dropdown>
				<DropdownToggle className="btn btn-secondary">Admin {mAdminName}</DropdownToggle>
				<DropdownMenu>
				<DropdownItem>
					<Link to="/profile" className="text-dark text-decoration-none">
						Profile
					</Link>
				</DropdownItem>
				<DropdownDivider />
				<DropdownItem>
					<span onClick={handleLogout} className="text-danger text-underline" style={{ cursor: 'pointer' }}>
					Logout
					</span>
				</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</nav>
	)
	}

export default NavBar