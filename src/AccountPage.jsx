import { useState, useEffect } from "react";
import { useNavigate } from 'react-router';
import axios from 'axios'

function AccountPage() {
    const navigate = useNavigate()
    const[passwordsState, setPasswordsState] = useState([]);
    const[sharedPasswordState, setSharedPasswordState] = useState([]);
    const[currentOwnerState, setCurrentOwnerState] = useState('');

    const[newPasswordNameState, setNewPasswordNameState] = useState('');
    const[newPasswordValueState, setNewPasswordValueState] = useState('');
    const[errorMsgState, setErrorMsgState] = useState('');

    const[passwordVisibleState, setPasswordVisibleState] = useState([])
    const[sharedVisibleState, setSharedVisibleState] = useState([])

    const[clipMessageState, setClipMessageState] = useState({message: "", index: -1, shared: undefined})
    const[checkBoxState, setCheckBoxState] = useState({alphabet:false, numerals:false, symbols:false})

    const[passwordLengthState, setPasswordLengthState] = useState(4)

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

        try {
            const shared = await axios.post("/api/password", {
                ownerAccount: currentOwnerState,
                passwordName: newPasswordNameState.trim(),
                passwordValue: newPasswordValueState.trim(),
                requirements: checkBoxState,
                length:passwordLengthState
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
            setErrorMsgState("You are not logged in yet!")
            return
        }
        getSharedPassword(currentOwnerState.trim())
        getMyPassword(currentOwnerState.trim())
        setErrorMsgState('')
    }

    // function for rendering the page when logged in
    function onStart() {
        isLoggedIn()
            .then(() => {
                getSharedPassword(currentOwnerState.trim())
                getMyPassword(currentOwnerState.trim())
                setErrorMsgState('')
            })
    }

    async function isLoggedIn() {
        try {
          const response = await axios.get('/api/account/loggedIn');
          const ownerAccount = response.data.ownerAccount;
          setCurrentOwnerState(ownerAccount);
        } catch (e) {
          navigate('/')
        }
    }

    // make api call to both Account api and Password Api to get a full list of shared password
    async function getSharedPassword() {
        try {
            const shared = await axios.get("api/account/" + currentOwnerState);
            console.log(shared)
            let result = []
            for (let i = 0; i < shared.data.sharedWithMe.length; i++) {
                let myPassword = await axios.get("/api/password/" + shared.data.sharedWithMe[i]);
                result = result.concat(myPassword.data);
            }
            // setCurrentOwnerState(ownerAccount);
            setSharedPasswordState(result);
            setSharedVisibleState(new Array(result.length).fill("password"))
        } catch(error) {
            // setPasswordsState([])
            setSharedPasswordState([])
            // setCurrentOwnerState('')
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
        } catch(error) {
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
            [fieldName]:event.target.checked
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

    function passwordCreateBar() {
        return (
            <div className="passWordCreationToolBar">
                <label htmlFor="passwordName">Password Name:</label>
                <input id="passwordName" value={newPasswordNameState} onInput={(event) => updateNewPasswordName(event)}></input>
                <label htmlFor="passwordValue">Password:</label>
                <input id="passwordValue" value={newPasswordValueState} onInput={(event) => updateNewPasswordValue(event)}></input>
                <button onClick={() => onCreate()}>Create</button>
                <label htmlFor="alphabet">alphabet</label>
                <input type="checkbox" id="alphabet" value={checkBoxState.alphabet} onChange={(event) => updateCheckBox("alphabet", event)}></input>
                <label htmlFor="numeral">numeral</label>
                <input type="checkbox" id="numeral" value={checkBoxState.numerals} onInput={(event) => updateCheckBox("numerals", event)}></input>
                <label htmlFor="symbol">symbol</label>
                <input type="checkbox" id="symbol" value={checkBoxState.symbols} onInput={(event) => updateCheckBox("symbols", event)}></input>
                <label htmlFor="passWordLength">length</label>
                <input type="number" id="passWordLength" value={passwordLengthState} onChange={updatePasswordLength}></input>
            </div>
        )
    }

    function infoBlock() {
        return (
            <>
                <div>My Password:</div>
                {myPassword()}
                <div>Shared Password</div>
                {sharedPassword()}
                <div>Add new Password: </div>
                {passwordCreateBar()}
            </>
        )
    }

    useEffect(onStart, []);

    return (
        <div>
            <div>
                <div>{errorMsgState}</div>
            </div>
            {infoBlock()}
        </div>
    )
}

export default AccountPage