import { useState, useEffect } from "react";
import axios from 'axios'

function AccountPage() {
    const[passwordsState, setPasswordsState] = useState([]);
    const[sharedPasswordState, setSharedPasswordState] = useState([]);
    const[currentOwnerState, setCurrentOwnerState] = useState('');
    const[newPasswordNameState, setNewPasswordNameState] = useState('');
    const[newPasswordValueState, setNewPasswordValueState] = useState('');
    const[errorMsgState, setErrorMsgState] = useState('');

    const[passwordVisibleState, setPasswordVisibleState] = useState([])
    const[sharedVisibleState, setSharedVisibleState] = useState([])

    const[clipMessageState, setClipMessageState] = useState({message: "", index: -1, shared: undefined})

    //function for copy to clip board
    function copyToClipBoard(shared, index) {
        try {
            if (shared) {
                navigator.clipboard.writeText(sharedPasswordState[index].passwordValue)
            } else {
                navigator.clipboard.writeText(passwordsState[index].passwordValue)
            }
        } catch(error) {
            console.log(error.message)
        }
        setClipMessageState({message:"Copied!", index: index, shared: shared})
        setTimeout(() => {
            setClipMessageState({message: "", index: -1, shared: undefined});
        }, 1000);
    }

    // utility function for checking blank input
    function isBlank(str) {
        return !str || /^\s*&/.test(str);
    }

    // hide and show function for visibility
    // via changing the type of the input box as password or text
    function doHide(shared, index) {
        if(shared) {
            const arr = [...sharedVisibleState]
            arr[index] = arr[index] === "password" ? "text": "password"
            setSharedVisibleState(arr)
        } else {
            const arr = [...passwordVisibleState]
            arr[index] = arr[index] === "password" ? "text": "password"
            setPasswordVisibleState(arr)
        }
    }

    // function for creating new password
    // would return several error message
    async function onCreate() {
        if (isBlank(currentOwnerState)) {
            setErrorMsgState("Please select a valid account first!")
            return
        }

        if (isBlank(newPasswordNameState)) {
            setErrorMsgState("Please enter a non-blank password name!")
            return
        }

        if (isBlank(newPasswordValueState)) {
            setErrorMsgState("Please select a non-blank password!")
            return
        }

        try {
            const shared = await axios.post("/api/password", {
                ownerAccount: currentOwnerState,
                passwordName: newPasswordNameState.trim(),
                passwordValue: newPasswordValueState.trim(),
            });
            setNewPasswordNameState('');
            setNewPasswordValueState('')
            onSubmit(currentOwnerState)
        } catch(error) {
            setErrorMsgState(error.response.data);
        }
    }

    // function for deleting corresponding records
    async function onDelete(passwordId) {
        try {
            await axios.delete('/api/password/' + passwordId)
            onSubmit(currentOwnerState)
        } catch(error) {
            setErrorMsgState(error.response.data);
        }
    }

    // function for selecting a Account
    function onSubmit() {
        if (isBlank(currentOwnerState)) {
            setErrorMsgState("The input for account name should not be blank")
            return
        }
        getSharedPassword(currentOwnerState.trim())
        getMyPassword(currentOwnerState.trim())
        setErrorMsgState('')
    }

    // make api call to both Account api and Password Api to get a full list of shared password
    async function getSharedPassword(ownerAccount) {
        try {
            const shared = await axios.get("api/account/" + ownerAccount);
            let result = []
            for (let i = 0; i < shared.data.sharedWithMe.length; i++) {
                let myPassword = await axios.get("/api/password/" + shared.data.sharedWithMe[i]);
                result = result.concat(myPassword.data);
            }
            setCurrentOwnerState(ownerAccount);
            setSharedPasswordState(result);
            setSharedVisibleState(new Array(result.length).fill("password"))
        } catch(error) {
            setPasswordsState([])
            setSharedPasswordState([])
            setCurrentOwnerState('')
            setErrorMsgState(error.response.data);
        }
    }

    // make an api call to get one's own passwords
    async function getMyPassword(ownerAccount) {
        try {
            const myPassword = await axios.get("/api/password/" + ownerAccount);
            setCurrentOwnerState(ownerAccount);
            setPasswordsState(myPassword.data);
            setPasswordVisibleState(new Array(myPassword.data.length).fill("password"))
        } catch(error) {
            setErrorMsgState(error.response.data);
        }
    }

    // function for update field of owner
    function updateOwnerName(event) {
        setCurrentOwnerState(event.target.value);
    }

    // function for update field of password name
    function updateNewPasswordName(event) {
        setNewPasswordNameState(event.target.value);
    }

    // function for update field of password value
    function updateNewPasswordValue(event) {
        setNewPasswordValueState(event.target.value);
    }

    // react component showing all shared passwords
    function sharedPassword() {
        let info = []
        info.push(<div key={-1}>User: Name : Password: Created</div>)
        for(let i = 0; i < sharedPasswordState.length; i++) {
            const created = new Date(sharedPasswordState[i].created)
            info.push(
                <div className="SharedPasswordRowContainer" key={i}>
                    {sharedPasswordState[i].ownerAccount + ": " + 
                    sharedPasswordState[i].passwordName + ": "} 
                    <input readOnly type={sharedVisibleState[i]} value={sharedPasswordState[i].passwordValue}></input>
                    <button onClick={() => doHide(true, i)}>{sharedVisibleState[i] === "password"? "Show": "Hide"}</button>
                    {created.getDate().toString() + "/" +
                    (created.getMonth() + 1).toString() + "/" +
                    created.getFullYear().toString() + " " +
                    created.getHours().toString()+ ":" +
                    created.getMinutes().toString()+ ":" +
                    created.getSeconds().toString()}
                    <button onClick={() => copyToClipBoard(true, i)}>Copy</button>
                    {clipMessageState.index === i && clipMessageState.shared === true ? clipMessageState.message: ""}
                </div>
            )
        }
        return <div className="SharedPasswordContainer">{info}</div>
    }


    // react component showing all passwords of an account owner
    function myPassword() {
        let info = []
        info.push(<div key={-1}>Name : Password: Created</div>)
        for(let i = 0; i < passwordsState.length; i++) {
            const created = new Date(passwordsState[i].created)
            info.push(
                <div className="PasswordRowContainer" key={i}>
                    {passwordsState[i].passwordName + ": "} 
                    <input readOnly type={passwordVisibleState[i]} value={passwordsState[i].passwordValue}></input>
                    <button onClick={() => doHide(false, i)}>{passwordVisibleState[i] === "password"? "Show": "Hide"}</button>
                    {created.getDate().toString() + "/" +
                    (created.getMonth() + 1).toString() + "/" +
                    created.getFullYear().toString() + " " +
                    created.getHours().toString()+ ":" +
                    created.getMinutes().toString()+ ":" +
                    created.getSeconds().toString()}
                    <button onClick={() => copyToClipBoard(false, i)}>Copy</button>
                    <button onClick={() => onDelete(passwordsState[i]._id)}>Delete</button>
                    {clipMessageState.index === i && clipMessageState.shared === false ? clipMessageState.message: ""}
                </div>
            )
        }
        return <div className="PasswordContainer">{info}</div>
    }

    return (
        <div>
            <div>
                <label htmlFor="ownerInput">Account Name:</label><input id="ownerInput" value={currentOwnerState} onInput={(event) => updateOwnerName(event)}></input>
                <button onClick={() => onSubmit()}>Submit</button>
                <div>{errorMsgState}</div>
            </div>
            <div>My Password:</div>
            {myPassword()}
            <div>Shared Password</div>
            {sharedPassword()}
            <div>Add new Password: </div>
            <div>
                <label htmlFor="passwordName">Password Name:</label>
                <input id="passwordName" value={newPasswordNameState} onInput={(event) => updateNewPasswordName(event)}></input>
                <label htmlFor="passwordValue">Password:</label>
                <input id="passwordValue" value={newPasswordValueState} onInput={(event) => updateNewPasswordValue(event)}></input>
                <button onClick={() => onCreate()}>Create</button>
            </div>
        </div>
    )
}

export default AccountPage