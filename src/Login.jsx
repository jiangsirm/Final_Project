import axios from 'axios';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { LogInContext } from './LoginProvider';

function Login() {
    const navigate = useNavigate()

    const [login, setLoginTrue, setLoginFalse] = useContext(LogInContext)

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
            navigate('/account');
            setLoginTrue()
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

    return(
        <div>
            <span>This is the Login Page. Alex will change it later. Josh Here.</span>
            <div>
                <h1>Login Page</h1>
                {errorMsgState && <h1> {errorMsgState} </h1>}
                <div>
                    <div>
                        <label htmlFor='account'>Acconut:</label> <input id="account" value={accountState} onInput={(event) => updateAccount(event)}/>
                    </div>
                    <div>
                        <label htmlFor='password'>Password:</label> <input type={passwordVisibleState ? "text" : 'password'} id="password" value={passwordState} onInput={(event) => updatePassword(event)}/>
                        <button onClick={changeVisibility}>{passwordVisibleState ? "Hide" : "Show"}</button>
                    </div>
                    <div>
                        <button onClick={() => onSubmit()}>Submit</button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Login