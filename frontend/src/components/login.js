import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

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
                    graphqlID: data.graphql_id,
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
        <Container fluid>
            <table style={{height: "100vh", width: "100%"}}>
                <tbody>
                    <tr >
                        <td style={{width: "50%"}} class="align-middle">
                            {/* <Card style={{width: "36rem", margin: "0 auto"}}className=""> */}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group>
                                        <Form.Label>Username:</Form.Label>
                                        <Form.Control type="text" id="username" name="username" autoFocus onChange={handleInput}></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Password:</Form.Label>
                                        <Form.Control type="password" id="password" name="password" onChange={e => setPassword(e.target.value)}></Form.Control>
                                    </Form.Group>
                                    <Button disabled={!validateForm()} type="submit">Login</Button>
                                </Form>
                            {/* </Card> */}
                        </td>
                        <td style={{width: "50%"}} class="align-middle">
                            Log in to Nwitter
                        </td>
                    </tr>
                </tbody>
            </table>
        </Container>
    )
}