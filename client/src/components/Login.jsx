import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { apiClient } from '../lib/apiClient';
import { useAuth } from '../context/context+reducer';




export default function Login() {

	const [email, setemail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const {state, dispatch} = useAuth();

	const validateLogin = () => {
		if (!email.length) {
		  toast.error("Email is required");
		  return false;
		}
		if (!password.length) {
		  toast.error("Password is required");
		  return false;
		}
		return true;
	  };

	  const handleLogin = async (e) => {
		e.preventDefault();
	  
		if (validateLogin()) {
		  try {
			const response = await apiClient.post(
			  "/signin",
			  { identity: email, password },
			  { withCredentials: true }
			);
	  
			console.log({ response });
	  
			if (response.data.id) {
			  // Dispatch login success action (assuming you have an action)
			  dispatch({ type: "LOGIN", payload: response.data });
				console.log(state.isAuthenticated);
			  // Navigate to the dashboard
			  navigate("/dashboard");
			}
		  } catch (error) {
			console.error("Login failed:", error.response?.data || error.message);
			alert("Login failed. Please check your credentials.");
		  }
		}
	  };
	  


	return (
		<div className="wrapper signIn">
			<div className="illustration">
				{/* <img src="https://source.unsplash.com/random" alt="illustration" /> */}
			</div>
			<div className="form">
				<div className="heading">LOGIN</div>
				<form>
					<div>
						<label htmlFor="name">E-mail</label>
						<input type="text" id="name" placeholder="Enter your name" onChange={(e) => setemail(e.target.value)}/>
					</div>
					<div>
						<label htmlFor="e-mail">Password</label>
						<input type="text" id="e-mail" placeholder="Enter you mail" onChange={(e) => setPassword(e.target.value)}/>
					</div>
					<button type="submit" onClick={handleLogin}>
						Submit
					</button>
				</form>
				<p>
					Don't have an account ? <Link to="/signup"> Sign Up </Link>
				</p>
			</div>
		</div>
	);
}
