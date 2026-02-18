import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const LandingPage = () => {
    const navigate = useNavigate();
    const [signupForm, setSignupForm] = useState({
        username:"",
        password:""
    })
    const [signinForm, setSigninForm] = useState({
        username:"",
        password:""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const {name, value} = e.target
        setSignupForm((prev) => {
            return{
            ...prev,
            [name]: value
        }})
    }

    const handleChangeSignin = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const {name, value} = e.target
        setSigninForm((prev) => {
            return{
            ...prev,
            [name]: value
        }})
    }

    const handleSubmit = async () => {
        const response = await fetch("http://localhost:3000/signup", {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify(signupForm)
        });
        const data = await response.json();
        
        console.log("user", data.response.id);
    }

    const handleSubmitsignin = async () => {
        const response = await fetch("http://localhost:3000/signin", {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            credentials: "include",
            body: JSON.stringify(signinForm)
        });
        const data = await response.json();
        console.log("data", data);
        localStorage.setItem("user", data.response.id)
        navigate("/dashboard")
    }

  return (
    <div>
        <div>
            <p>Signup</p>
            <input onChange={(e) => handleChange(e)} value={signupForm.username} name="username" placeholder="username"/>
            <input onChange={(e) => handleChange(e)} value={signupForm.password} name="password" placeholder="password"/>
            <button onClick={handleSubmit}>Signup</button>
        </div>

        <div>
            <p>Signin</p>
            <input onChange={(e) => handleChangeSignin(e)} value={signinForm.username} name="username" placeholder="username"/>
            <input onChange={(e) => handleChangeSignin(e)} value={signinForm.password} name="password" placeholder="password"/>
            <button onClick={handleSubmitsignin}>Signin</button>
        </div>
    </div>
  )
}

export default LandingPage