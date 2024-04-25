import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { LogInContext } from './LoginProvider';
import "./css/Login.css"
function Login() {
    const navigate = useNavigate()

    const { login, setLoginTrue, setLoginFalse, setNavAccountState } = useContext(LogInContext)

    const [accountState, setAccountState] = useState('');
    const [passwordState, setPasswordState] = useState('');
    const [errorMsgState, setErrorMsgState] = useState('');
    const [passwordVisibleState, setPasswordVisibleState] = useState(false)

    // utility function for checking blank input
    function isBlank(str) {
        return !str || /^\s*&/.test(str);
    }

    async function onSubmit() {
        setErrorMsgState('');
        if (isBlank(passwordState)) {
            setErrorMsgState("password should not be Blank!");
            return
        }

        if (isBlank(accountState)) {
            setErrorMsgState("Account name should not be Blank!");
            return
        }

        try {
            await axios.post('/api/account/login', {
                ownerAccount: accountState,
                ownerPassword: passwordState
            });

            // jump to account after submit
            setTimeout(() => {
                navigate('/account');
            }, 1000);
            setLoginTrue()
            setNavAccountState(accountState)

        } catch (error) {
            setErrorMsgState(error.response.data);
            setLoginFalse()
        }
    }

    function updateAccount(event) {
        setAccountState(event.target.value.replace(/\s/g, ''));
    }

    function updatePassword(event) {
        setPasswordState(event.target.value.replace(/\s/g, ''));
    }

    function changeVisibility() {
        setPasswordVisibleState(!passwordVisibleState)
    }

    useEffect(() => {
        if (login.loginState) {
            
            setTimeout(() => {
                navigate('/account');
            }, 1000); // 1000 milliseconds = 1 secondnavigate('/login')
        }
    }, [])

    if (login.loginState){
        return(
            <div className="login-container">
            <div className="loading-container">
                Loging In ...        
            </div>
            </div>
        )
    }

    return (
        <div className='login-container'>
            {errorMsgState && (
                <div className="error-container">
                    <h1 className='msg'>{errorMsgState}</h1>
                </div>
            )}
            <div className='login-box'>
                <h1> Login Page</h1>
                <div>
                    <div className='account-container'>
                        <label htmlFor='account'>Username:</label> <input id="account" value={accountState} onInput={(event) => updateAccount(event)} />
                    </div>
                    <div className='password-container'>
                        <label htmlFor='password'>Password:</label> <input type={passwordVisibleState ? "text" : 'password'} id="password" value={passwordState} onInput={(event) => updatePassword(event)} />
                        <button className='visibility-btn' onClick={changeVisibility}>
                            {passwordVisibleState ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-off">
                                    <path d="M6 6L18 18M6 18L18 6" />
                                </svg>

                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                                    <path d="M12 4C6.48 4 2 12 2 12s4.48 8 10 8 10-8 10-8-4.48-8-10-8zm0 13c-2.33 0-4.43-1.18-6-3 1.57-1.82 3.67-3 6-3s4.43 1.18 6 3c-1.57 1.82-3.67 3-6 3z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className="sumbit-container">
                        <button className="submit-btn" onClick={() => onSubmit()}>Log In</button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Login