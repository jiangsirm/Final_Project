import React, { useEffect } from "react";
import { useState, createContext } from "react";

export const LogInContext = createContext();

export default function LoginProvider(props) {
    
    const [login, setLogin] = useState({
        loginState: localStorage.getItem('myLoginState') === 'true',
        accountState: localStorage.getItem('myAccountState'),
    })

    useEffect(() => {
        localStorage.setItem('myLoginState', login.loginState);
        localStorage.setItem('myAccountState', login.accountState);
      }, [login]);

    const setLoginTrue = () => {
        setLogin((prevState) => ({
            ...prevState,
            loginState: true
        }))
    };

    const setLoginFalse = () => {
        setLogin((prevState) => ({
            ...prevState,
            loginState: false
        }))
    };

    const setNavAccountState = (account) => {
        setLogin((prevState) => ({
            ...prevState,
            accountState: account
        }))
    }

    const resetAccountState = () => {
        setLogin((prevState) => ({
            ...prevState,
            accountState: ""
        }))
    }

    return (
        <LogInContext.Provider value={{login, setLoginTrue, setLoginFalse, setNavAccountState, resetAccountState}}>
            {props.children}
        </LogInContext.Provider>
    )
}