import React from 'react';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ComposeTweet from './composeTweet';
import { Link } from 'react-router-dom';

export default function Header(props) {
    return (
        <>
            <Row>
                <Col xs={10}>
                    <Link to='/'>Home</Link>
                </Col>
                <Col xs={2}>
                    <Nav variant="pills" className="justify-content-end">
                        <NavDropdown title={`Welcome ${props.headerInfo.username}`} id="nav-dropdown">
                            <NavDropdown.Item><Link to={`/profiles/${props.headerInfo.username}`}>Profile</Link></NavDropdown.Item>
                            <NavDropdown.Item onClick={props.headerInfo.handleLogout}>Logout</NavDropdown.Item>
                            <NavDropdown.Item onClick={props.headerInfo.handleTime}>Refresh Token</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Col>
            </Row>
            <Row className="text-center">
                <Col xs={12}>
                    <ComposeTweet resendQuery={props.headerInfo.resendQuery} setResendQuery={props.headerInfo.setResendQuery}/>
                </Col>
            </Row>
        </>
    )
}