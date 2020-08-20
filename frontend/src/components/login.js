import React, { useState } from 'react'

export default function Login(props) {
    const [password, setPassword] = useState("")
    const { setRefreshTokenObject, username } = props

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
            // credentials: "same-origin",
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        })
            .then(response => response.json())
            .then(data => {
                // setAuthToken(data.token);
                // setUsername(data.username);
                // setTokenExpiryTime(data.tokenExpiryTime);
                // setRefreshToken(data.refresh_token)
                setRefreshTokenObject({
                    authToken: data.token,
                    username: data.username,
                    tokenExpiryTime: data.tokenExpiryTime,
                    refreshToken: data.refresh_token
                })
            })
    }

    const handleInput = e => {
        setRefreshTokenObject({
            authToken: "",
            username: e.target.value,
            tokenExpiryTime: 999,
            refreshToken: ""
        })
    }

    return (
        <div className="login">
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" autoFocus onChange={handleInput}></input>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" onChange={e => setPassword(e.target.value)}></input>
                <button disabled={!validateForm()} type="submit">Login</button>
            </form>
        </div>
    )
}