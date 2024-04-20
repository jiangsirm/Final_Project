import { Outlet } from "react-router"
import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import { useNavigate } from 'react-router';
import { LogInContext } from './LoginProvider';

function NavBar() {
    const [login, setLoginTrue, setLoginFalse] = useContext(LogInContext)
    
    const navigate = useNavigate()
    const [navBarState, setNavBarState] = useState(
        <span>
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/register')}>Register</button>
        </span>
    )

    // function for rendering the page when logged in
    function onStart() {
        isLoggedIn()
    }

    async function logginOut() {
        try {
            const response = await axios.post("api/account/logout")
            setLoginFalse()
            // setLoggedInState(false)
            navigate('/login')
        } catch(error) {
            navigate('/welcome')
            console.log(e.message)
        }
    }

    // function to call whether the page is logged in
    // async function isLoggedIn() {
    //     try {
    //         const response = await axios.get('/api/account/loggedIn');
    //         if (response.data !== "Not logged in") {
    //             setLoggedInState(true)
    //         } else {
    //             setLoggedInState(false)
    //         }
    //     } catch (e) {
    //         navigate('/')
    //         console.log(e.message)
    //     }
    // }

    // useEffect(onStart, []);
    useEffect(getNavBarContent, [login])

    function getNavBarContent() {
        if (login) {
            setNavBarState(<span><button onClick={() => logginOut()}>Logout</button></span>)
        } else {
            setNavBarState(
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
                Here should be a NavBar
                {navBarState}
            </div>
            <Outlet/>
        </>

    )
}

export default NavBar