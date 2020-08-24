import React, { useState } from 'react';
import ComposeTweet from './composeTweet';
import FollowedTweets from './followedTweets';
import Header from './header'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown'

export default function Home(props) {
    
    const headerInfo = {
        resendQuery: props.resendQuery, 
        setResendQuery: props.setResendQuery, 
        username: props.username, 
        handleLogout: props.handleLogout,
        handleTime: props.handleTime
    }

    return (
        <Container fluid>
            <Row>
                <Col xs={12}>
                    <Header headerInfo={headerInfo} />
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <FollowedTweets resendQuery={props.resendQuery} setResendQuery={props.setResendQuery}/>
                </Col>
            </Row>
        </Container>
    )
}
