import React, { useState } from 'react'

export default function Login(props) {
    const [password, setPassword] = useState("")
    const { setAuthToken, setTokenExpiryTime, username, setUsername } = props

    function validateForm() {
        return username.length > 0 && password.length > 0
    }

    function handleSubmit(event) {
        event.preventDefault()
        fetch("http://localhost:8000/api-token-auth/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        })
            .then(response => response.json())
            .then(data => {
                setAuthToken(data.token);
                setUsername(data.username);
                setTokenExpiryTime(data.tokenExpiryTime);
            })
    }

    return (
        <div className="login">
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" autoFocus onChange={e => setUsername(e.target.value)}></input>
                <label htmlFor="username">Username:</label>
                <input type="password" id="password" name="password" onChange={e => setPassword(e.target.value)}></input>
                <button disabled={!validateForm()} type="submit">Login</button>
            </form>
        </div>
    )
}