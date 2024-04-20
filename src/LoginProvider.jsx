import React, { useEffect } from "react";
import { useState, createContext } from "react";

export const LogInContext = createContext();

export default function LoginProvider(props) {
    
    const [login, setLogin] = useState(localStorage.getItem('myLoginState') === 'true')

    useEffect(() => {
        localStorage.setItem('myLoginState', login);
      }, [login]);

    const setLoginTrue = () => {
        setLogin(true)
    };

    const setLoginFalse = () => {
        setLogin(false)
    };

    return (
        <LogInContext.Provider value={[login, setLoginTrue, setLoginFalse]}>
            {props.children}
        </LogInContext.Provider>
    )
}