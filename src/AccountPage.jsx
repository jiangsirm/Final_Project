import { useState, useEffect } from "react";
import { useNavigate } from 'react-router';
import axios from 'axios'
import "./css/AccountPage.css"
import "./css/ShareRequest.css"
import "./css/MyPassword.css"
import "./css/PasswordCreateBar.css"
import "./css/PendingShare.css"
import "./css/SharedPassword.css"
import "./css/MyPassword.css"
import "./css/Info-Block.css"
import "./css/EditBar.css"
function AccountPage() {
    // states for currentOwner, password of the owner and the shared passwords
    const navigate = useNavigate()
    const [passwordsState, setPasswordsState] = useState([]);
    const [sharedPasswordState, setSharedPasswordState] = useState([]);
    const [currentOwnerState, setCurrentOwnerState] = useState('');

    // states for inputs for password creation, check box, and password length
    const [newPasswordNameState, setNewPasswordNameState] = useState('');
    const [newPasswordValueState, setNewPasswordValueState] = useState('');
    const [passwordLengthState, setPasswordLengthState] = useState(4)
    const [checkBoxState, setCheckBoxState] = useState({ alphabet: false, numerals: false, symbols: false })

    // states for visibility of passwords
    const [passwordVisibleState, setPasswordVisibleState] = useState([])
    const [sharedVisibleState, setSharedVisibleState] = useState([])

    // states for editing existing password
    const [editState, setEditState] = useState(-1)
    const [editContentState, setEditContentState] = useState({
        passwordId: '',
        passwordName: '',
        passwordValue: ''
    })

    // states for display pending accounts who wants to share password with you
    const [pendingState, setPendingState] = useState([])

    // state for sharing password with other accounts
    const [toShareState, setToShareState] = useState('')
    const [shareMessageState, setShareMessageState] = useState('')

    // states for displaying "copied" for copying to clip
    const [clipMessageState, setClipMessageState] = useState({ message: "", index: -1, shared: undefined })

    // states for error message
    const [errorMsgState, setErrorMsgState] = useState('');


    //function for copy to clip board
    function copyToClipBoard(shared, index) {
        try {
            if (shared) {
                navigator.clipboard.writeText(sharedPasswordState[index].passwordValue)
            } else {
                navigator.clipboard.writeText(passwordsState[index].passwordValue)
            }
        } catch (error) {
            console.log(error.message)
        }
        setClipMessageState({ message: "Copied!", index: index, shared: shared })
        setTimeout(() => {
            setClipMessageState({ message: "", index: -1, shared: undefined });
        }, 2000);
    }

    // utility function for checking blank input
    function isBlank(str) {
        return !str || /^\s*&/.test(str);
    }

    // hide and show function for visibility
    // via changing the type of the input box as password or text
    function doHide(shared, index) {
        if (shared) {
            const arr = [...sharedVisibleState]
            arr[index] = arr[index] === "password" ? "text" : "password"
            setSharedVisibleState(arr)
        } else {
            const arr = [...passwordVisibleState]
            arr[index] = arr[index] === "password" ? "text" : "password"
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

        try {
            const shared = await axios.post("/api/password", {
                ownerAccount: currentOwnerState,
                passwordName: newPasswordNameState.trim(),
                passwordValue: newPasswordValueState.trim(),
                requirements: checkBoxState,
                length: passwordLengthState
            });
            setNewPasswordNameState('');
            setNewPasswordValueState('')
            onSubmit(currentOwnerState)
        } catch (error) {
            setErrorMsgState("Password Name Info already exists");
        }
    }

    // function for deleting corresponding records
    async function onDelete(passwordId) {
        try {
            await axios.delete('/api/password/' + passwordId)
            onSubmit(currentOwnerState)
        } catch (error) {
            setErrorMsgState(error.response.data);
        }
    }

    // function for set editing bar state
    async function onEdit(passwordId, index) {
        // console.log(pendingState)
        if (editState !== -1 && editState === index) {
            setEditState(-1)
            setEditContentState({
                passwordId: '',
                passwordName: '',
                passwordValue: ''
            })
        } else {
            setEditState(index)
            setEditContentState({
                passwordId: passwordId,
                passwordName: passwordsState[index].passwordName,
                passwordValue: passwordsState[index].passwordValue
            })
        }
    }

    // function for update/editing password
    async function onUpdate(passwordId) {
        try {
            await axios.put('/api/password/' + passwordId, {
                ownerAccount: currentOwnerState,
                passwordName: editContentState.passwordName,
                passwordValue: editContentState.passwordValue
            })
            setEditState(-1)
            setEditContentState({
                passwordId: '',
                passwordName: '',
                passwordValue: ''
            })
            onSubmit(currentOwnerState)
        } catch (error) {
            setErrorMsgState("Password Name already exists");
        }
    }

    // function for accept a pending request to share
    async function onAccept(index) {
        // console.log(currentOwnerState)
        try {
            const sharerName = currentOwnerState
            const shareeName = pendingState[index]
            await axios.put('/api/account/pending', {
                sharer: sharerName,
                sharee: shareeName,
                action: 'remove'
            })
            await axios.put('/api/account/shared', {
                sharer: sharerName,
                sharee: shareeName,
                action: 'add'
            })
            onSubmit(currentOwnerState)
        } catch (error) {
            setErrorMsgState(error.response.data);
        }
    }

    // function for accept a pending request to share
    async function onDecline(index) {
        // console.log(currentOwnerState)
        try {
            const sharerName = currentOwnerState
            const shareeName = pendingState[index]
            await axios.put('/api/account/pending', {
                sharer: sharerName,
                sharee: shareeName,
                action: 'remove'
            })
            onSubmit(currentOwnerState)
        } catch (error) {
            setErrorMsgState(error.response.data);
        }
    }

    // function of sending share request to others
    async function onSend() {
        try {
            const sharerName = toShareState;
            const shareeName = currentOwnerState;
            await axios.put('/api/account/pending', {
                sharer: sharerName,
                sharee: shareeName,
                action: 'add'
            })
            onSubmit(currentOwnerState)
            setToShareState('')
            setShareMessageState('Request sent!')
            setTimeout(() => {
                setShareMessageState('')
            }, 1000);
        } catch (error) {
            setErrorMsgState(error.response.data)
        }
    }

    // function for rendering the account page
    function onSubmit() {
        if (isBlank(currentOwnerState)) {
            setErrorMsgState("You are not logged in yet!")
            return
        }
        getSharedPassword(currentOwnerState.trim())
        getMyPassword(currentOwnerState.trim())
        getPendingList()
        setErrorMsgState('')
    }

    // function for rendering the page on logged in
    function onStart() {
        isLoggedIn()
            .then(() => {
                getSharedPassword(currentOwnerState.trim())
                getMyPassword(currentOwnerState.trim())
                getPendingList()
                setErrorMsgState('')
            })
    }

    // function used together with above function to log in
    async function isLoggedIn() {
        try {
            const response = await axios.get('/api/account/loggedIn');
            const ownerAccount = response.data.ownerAccount;
            setCurrentOwnerState(ownerAccount);
        } catch (e) {
            setTimeout(() => {
                navigate('/login');
            }, 1000); // 1000 milliseconds = 1 secondnavigate('/login')
        }
    }

    // function to getting pending requests
    async function getPendingList() {
        try {
            const response = await axios.get("api/account/" + currentOwnerState)
            // console.log(response.data.pendingSharee)
            setPendingState([...response.data.pendingSharee])

        } catch (error) {
            setErrorMsgState(error.message)
        }
    }

    // make api call to both Account api and Password Api to get a full list of shared password
    async function getSharedPassword() {
        try {
            const shared = await axios.get("api/account/" + currentOwnerState);
            // console.log(shared)
            let result = []
            for (let i = 0; i < shared.data.sharedWithMe.length; i++) {
                let myPassword = await axios.get("/api/password/" + shared.data.sharedWithMe[i]);
                result = result.concat(myPassword.data);
            }

            setSharedPasswordState(result);
            setSharedVisibleState(new Array(result.length).fill("password"))
        } catch (error) {
            setSharedPasswordState([])
            setErrorMsgState("When retriving shared account: " + error.message);
        }
    }

    // make an api call to get one's own passwords
    async function getMyPassword() {
        try {
            const myPassword = await axios.get("/api/password/");
            // setCurrentOwnerState(ownerAccount);
            setPasswordsState(myPassword.data);
            setPasswordVisibleState(new Array(myPassword.data.length).fill("password"))
        } catch (error) {
            setErrorMsgState(error.response.data);
        }
    }

    // function for update field of password name
    function updateNewPasswordName(event) {
        setNewPasswordNameState(event.target.value.replace(/\s/g, ''));
    }

    // function for update field of password value
    function updateNewPasswordValue(event) {
        setNewPasswordValueState(event.target.value.replace(/\s/g, ''));
    }

    // function for updating checkBox
    function updateCheckBox(fieldName, event) {
        setCheckBoxState({
            ...checkBoxState,
            [fieldName]: event.target.checked
        })
        // console.log(event.target.checked)
    }

    // functon for updating the password length
    function updatePasswordLength(event) {
        const length = parseInt(event.target.value);
        if (isNaN(length)) {
            setPasswordLengthState(4);
        } else if (length < 4) {
            setPasswordLengthState(4);
        } else if (length > 50) {
            setPasswordLengthState(50);
        } else {
            setPasswordLengthState(length);
        }
    }

    // function for updating checkBox
    function updateEditContent(fieldName, event) {
        setEditContentState({
            ...editContentState,
            [fieldName]: event.target.value
        })
        // console.log(event.target.value)
    }

    // function to update field for entering account to share password with
    function updateToShare(event) {
        setToShareState(event.target.value.replace(/\s/g, ''));
    }

    // react component for sharing account with others
    function shareRequest() {
        return (
            <div className="ShareRequest-Container">
                <h1 className="title">Send Share Request</h1>
                <label htmlFor="sharerAccountName">Account Name:</label>
                <input id="sharerAccountName" value={toShareState} onInput={(event) => updateToShare(event)}></input>
                <button className="send-request-btn" onClick={() => onSend()}>Send Request</button>
                <span>{shareMessageState}</span>
            </div>
        )
    }

    // react component showing all pending Sharers
    function pendingSharer() {
        let info = []
        if (pendingState.length === 0) {
            info.push(<div key={-1}>There is no pending request now!</div>)
        }
        for (let i = 0; i < pendingState.length; i++) {
            info.push(
                <div className="PendingSharerRowContainer" key={i}>
                    {pendingState[i] + " would like to share password"}
                    <button onClick={() => onAccept(i)}>Accept</button>
                    <button onClick={() => onDecline(i)}>Decline</button>
                </div>
            )
        }
        return <div className="PendingSharerContainer">
            <h1>Pending Request: </h1>
            <div className="PendingSharerContainerInner">
                {info}
            </div>
        </div>
    }

    // react component showing all shared passwords
    function sharedPassword() {
        let info = []
        info.push(<div className="columnTitle" key={-1}>
        <span>Here stores shared passwords</span>
    </div>)
        for (let i = 0; i < sharedPasswordState.length; i++) {
            const created = new Date(sharedPasswordState[i].created)
            info.push(
                <div className="SharedPasswordRowContainer" key={i}>
                    {sharedPasswordState[i].ownerAccount + ": " +
                        sharedPasswordState[i].passwordName + ": "}
                    <input readOnly type={sharedVisibleState[i]} value={sharedPasswordState[i].passwordValue}></input>
                    <button className = "visibale-btn" onClick={() => doHide(true, i)}>{sharedVisibleState[i] === "password" ? 
                    (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-off">
                            <path d="M6 6L18 18M6 18L18 6" />
                        </svg>

                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                            <path d="M12 4C6.48 4 2 12 2 12s4.48 8 10 8 10-8 10-8-4.48-8-10-8zm0 13c-2.33 0-4.43-1.18-6-3 1.57-1.82 3.67-3 6-3s4.43 1.18 6 3c-1.57 1.82-3.67 3-6 3z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    )}</button>
                    {created.getDate().toString() + "/" +
                        (created.getMonth() + 1).toString() + "/" +
                        created.getFullYear().toString() + " " +
                        created.getHours().toString() + ":" +
                        created.getMinutes().toString() + ":" +
                        created.getSeconds().toString()}
                    <button className="btn" onClick={() => copyToClipBoard(true, i)}>Copy</button>
                   <div className="pop-out">
                   {clipMessageState.index === i && clipMessageState.shared === true ? clipMessageState.message : ""}
                   </div>
                </div>
            )
        }
        return <div className="SharedPasswordContainer">
            <h1 className="columnTitle">Shared Password:</h1>
            <div className="SharedPasswordContainer-inner">
                {info}
            </div>
            
        </div>
    }

    // react component for edit tool bar
    function editBar() {
        return (
            <div className="edit-bar-container">
                <h1 className="title"> Edit Bar</h1>
                <div className="edit-box">
                    <label htmlFor="passwordNameEdit">AccountName:</label>
                    <input id="passwordNameEdit" value={editContentState.passwordName} onInput={(event) => updateEditContent('passwordName', event)}></input>
                    <label htmlFor="passwordValueEdit">Password:</label>
                    <input id="passwordValueEdit" value={editContentState.passwordValue} onInput={(event) => updateEditContent('passwordValue', event)}></input>
                    <button className="update-btn" onClick={() => onUpdate(editContentState.passwordId)}>Update</button>
                </div>
            </div>
        )
    }

    // react component showing all passwords of an account owner
    function myPassword() {
        let info = []
        info.push(<div className="columnTitle" key={-1}>
            <span>Here stores your passwords</span>
        </div>)
        for (let i = 0; i < passwordsState.length; i++) {
            const created = new Date(passwordsState[i].created)
            info.push(
                <>
                    <div className="PasswordRowContainer" key={i}>

                        {passwordsState[i].passwordName + ": "}
                        <input readOnly type={passwordVisibleState[i]} value={passwordsState[i].passwordValue}></input>
                        <button className="visibale-btn" onClick={() => doHide(false, i)}>
                            {passwordVisibleState[i] === "password" ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-off">
                                    <path d="M6 6L18 18M6 18L18 6" />
                                </svg>

                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                                    <path d="M12 4C6.48 4 2 12 2 12s4.48 8 10 8 10-8 10-8-4.48-8-10-8zm0 13c-2.33 0-4.43-1.18-6-3 1.57-1.82 3.67-3 6-3s4.43 1.18 6 3c-1.57 1.82-3.67 3-6 3z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}</button>
                        {created.getDate().toString() + "/" +
                            (created.getMonth() + 1).toString() + "/" +
                            created.getFullYear().toString() + " " +
                            created.getHours().toString() + ":" +
                            created.getMinutes().toString() + ":" +
                            created.getSeconds().toString()}
                        <button className="btn" onClick={() => copyToClipBoard(false, i)}>Copy</button>
                        <button className="btn" onClick={() => onDelete(passwordsState[i]._id)}>Delete</button>
                        <button className="btn" onClick={() => onEdit(passwordsState[i]._id, i)}>Edit</button>
                        <div className="pop-out">{clipMessageState.index === i && clipMessageState.shared === false ? clipMessageState.message : ""}</div>

                    </div>
                    <div>{editState === i ? editBar() : ""}</div>
                </>

            )
        }
        return <div className="PasswordContainer">
            <h1 className="title">My Password</h1>
            <div className="PasswordContainer-inner">
                {info}
            </div>
        </div>
    }

    // component for password creation bar 
    function passwordCreateBar() {
        return (
            <div className="passWordCreationToolBar">
                <h1 className="title">Add new Password </h1>
                <div className='tool-box'>
                    <label htmlFor="passwordName">Password Name:</label>
                    <input id="passwordName" value={newPasswordNameState} onInput={(event) => updateNewPasswordName(event)}></input>
                    <label htmlFor="passwordValue">Password:</label>
                    <input id="passwordValue" value={newPasswordValueState} onInput={(event) => updateNewPasswordValue(event)}></input>
                </div>
                <div className="options-list">
                    <div className="option-item">
                        <label htmlFor="alphabet">alphabet</label>
                        <input type="checkbox" id="alphabet" value={checkBoxState.alphabet} onChange={(event) => updateCheckBox("alphabet", event)} />
                    </div>
                    <div className="option-item">
                        <label htmlFor="numeral">numeral</label>
                        <input type="checkbox" id="numeral" value={checkBoxState.numerals} onChange={(event) => updateCheckBox("numerals", event)} />
                    </div>
                    <div className="option-item">
                        <label htmlFor="symbol"> symbol </label>
                        <input type="checkbox" id="symbol" value={checkBoxState.symbols} onChange={(event) => updateCheckBox("symbols", event)} />
                    </div>
                    <div className="option-item">
                        <label htmlFor="passWordLength">length</label>
                        <input type="number" id="passWordLength" value={passwordLengthState} onChange={updatePasswordLength} />
                    </div>
                </div>
                <button className="submit-btn" onClick={() => onCreate()}>Create</button>
            </div>
        )
    }

    // component for integrated block
    function infoBlock() {
        return (
            <>
                <div className="info-Block">
                    <div className="container-main">

                        <div className="top">{pendingSharer()}</div>

                        <div className="middle">
                            <div className="left">
                                {shareRequest()}
                            </div>
                            <div className="right">
                                {passwordCreateBar()}
                            </div>

                        </div>

                        <div className="bottom">
                            {myPassword()}
                        </div>
                        <div className="end">
                            {sharedPassword()}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    useEffect(onStart, []);
    useEffect(() => {
        setTimeout(() => {
            setErrorMsgState('');
        }, 5000);
    }, [errorMsgState])

    if (!currentOwnerState) {
        return (
            <div className="login-container">
                <div className="loading-container">
                    <div>
                        You are not loged In
                    </div>
                    <div>
                        Redireact to Login Page....
                    </div>

                </div>
            </div>
        )
    }
    return (
        <div className="accountPage-container">
            <div className="error-container">
                    <h1 className='msg'>{errorMsgState}</h1>
                </div>
            {infoBlock()}
        </div>
    )
}

export default AccountPage