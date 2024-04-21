import { Outlet } from "react-router"
import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import { useNavigate } from 'react-router';
import { LogInContext } from './LoginProvider';

function NavBar() {
    const {login, setLoginTrue, setLoginFalse, setNavAccountState, resetAccountState} = useContext(LogInContext)
    
    const navigate = useNavigate()

    async function logginOut() {
        try {
            const response = await axios.post("api/account/logout")
            setLoginFalse()
            resetAccountState()
            navigate('/login')
        } catch(error) {
            navigate('/welcome')
            console.log(e.message)
        }
    }
    
    function NavBarContent() {
        if (login.loginState) {
            return <span>{"Hello " + login.accountState + " !"}<button onClick={() => logginOut()}>Logout</button></span>
        } else {
            return (
                <span>
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/register')}>Register</button>
                </span>
            )
        }
    }

    return (
        <>
            <div>
                Here should be a NavBar &nbsp;
                {NavBarContent()}
            </div>
            <Outlet/>
        </>

    )
}

export default NavBar