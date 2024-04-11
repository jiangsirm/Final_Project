import { useState } from "react";

function AccountPage() {
    const[passwordsState, setPasswordsState] = useState(
        [
            {name: "apple", password: "abc"},
            {name: "apple1", password: "abc2"},
            {name: "apple2", password: "abc3"},
            {name: "apple3", password: "abc4"},
            {name: "apple4", password: "abc5"}
        ]
    );

    function infoBlock() {
        let info = []
        info.push(<div key={-1}>Name : Password</div>)
        for(let i = 0; i < passwordsState.length; i++) {
            info.push(<div key={i}>{passwordsState[i].name + ": " + passwordsState[i].password}</div>)
        }
        return info
    }

    return (<div>
        {infoBlock()}
    </div>)
}

export default AccountPage