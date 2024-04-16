import { useState } from "react";
import axios from 'axios'

function AccountPage() {
    const[passwordsState, setPasswordsState] = useState([]);
    const[sharedPasswordState, setSharedPasswordState] = useState([]);
    const[currentOwnerState, SetCurrentOwnerState] = useState("");
    const[errorMsgState, setErrorMsgState] = useState('');

    function onSubmit(info) {
        getSharedPassword(info)
        getMyPassword(info)
    }

    async function getSharedPassword(ownerAccount) {
        try {
            const shared = await axios.get("api/account/" + ownerAccount);
            // console.log(shared)
            // console.log(shared.data)
            let result = []
            for (let i = 0; i < shared.data.sharedWithMe.length; i++) {
                // console.log(shared.data.sharedWithMe[i]);
                let myPassword = await axios.get("/api/password/" + shared.data.sharedWithMe[i]);
                // console.log(myPassword)
                result = result.concat(myPassword.data);
                // console.log(result);
            }
            SetCurrentOwnerState(ownerAccount);
            setSharedPasswordState(result);
        } catch(error) {
            setErrorMsgState(error.response.data);
        }
    }

    async function getMyPassword(ownerAccount) {
        try {
            const myPassword = await axios.get("/api/password/" + ownerAccount);
            // console.log(ownerAccount)
            // console.log(myPassword)
            SetCurrentOwnerState(ownerAccount);
            setPasswordsState(myPassword.data);
        } catch(error) {
            setErrorMsgState(error.response.data);
        }
    }

    function updateOwnerName(event) {
        SetCurrentOwnerState(event.target.value);
    }

    function sharedPassword() {
        let info = []
        info.push(<div key={-1}>User: Name : Password</div>)
        for(let i = 0; i < sharedPasswordState.length; i++) {
            info.push(<div className="SharedPasswordRowContainer" key={i}>{sharedPasswordState[i].ownerAccount + ": "+ sharedPasswordState[i].passwordName + ": " + sharedPasswordState[i].passwordValue}</div>)
        }
        return <div className="SharedPasswordContainer">{info}</div>
    }

    function myPassword() {
        let info = []
        info.push(<div key={-1}>Name : Password</div>)
        for(let i = 0; i < passwordsState.length; i++) {
            info.push(<div className="PasswordRowContainer" key={i}>{passwordsState[i].passwordName + ": " + passwordsState[i].passwordValue}</div>)
        }
        return <div className="PasswordContainer">{info}</div>
    }

    return (
        <div>
            <div>
                <label>Account Name:</label><input value={currentOwnerState} onInput={(event) => updateOwnerName(event)}></input>
                <button onClick={() => onSubmit(currentOwnerState)}>Submit</button>
                <div>{errorMsgState}</div>
            </div>
            <div>My Password</div>
            {myPassword()}
            <div>Shared Password</div>
            {sharedPassword()}
        </div>
    )
}

export default AccountPage