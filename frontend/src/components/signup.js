import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

export default function Signup(props) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const { authToken, setRefreshTokenObject } = props

    function validateForm() {
        return username.length > 0 && password1.length > 0 && password2.length > 0
    }

    function handleSubmit(event) {
        event.preventDefault()
        fetch("http://localhost:8000/signup/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": username,
                "email": email,
                "password1": password1,
                "password2": password2,
            })
        })
            .then(() => {
                fetch("http://localhost:8000/api-token-auth/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    // credentials: "same-origin",
                    body: JSON.stringify({
                        "username": username,
                        "password": password1
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
            })
    }

    if(authToken !== "") return <Redirect to="/" />

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
                                        <Form.Control type="text" id="username" name="username" autoFocus onChange={e => setUsername(e.target.value)}></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Email:</Form.Label>
                                        <Form.Control type="text" id="email" name="email" onChange={e => setEmail(e.target.value)}></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Password:</Form.Label>
                                        <Form.Control type="password" id="password1" name="password1" onChange={e => setPassword1(e.target.value)}></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Retype Password:</Form.Label>
                                        <Form.Control type="password" id="password2" name="password2" onChange={e => setPassword2(e.target.value)}></Form.Control>
                                    </Form.Group>
                                    <Button disabled={!validateForm()} type="submit">Create Account</Button>
                                    <Link to="/login">Have an account? Log In</Link>
                                </Form>
                            {/* </Card> */}
                        </td>
                        <td style={{width: "50%"}} class="align-middle">
                            Create new account for Nwitter
                        </td>
                    </tr>
                </tbody>
            </table>
        </Container>
    )
}