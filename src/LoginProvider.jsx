import React, { useEffect } from "react";
import { useState, createContext } from "react";

export const LogInContext = createContext();

export default function LoginProvider(props) {
    const [login, setLogin] = useState(false)

    useEffect(() => {

    }, [])

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