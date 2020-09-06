import React, { useRef } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import FollowedTweets from '../components/followedTweets';
import Header from '../components/header';

export default function HomePage(props) {
    const containerRef = useRef(null);
    
    const headerInfo = {
        resendQuery: props.resendQuery, 
        setResendQuery: props.setResendQuery, 
        username: props.username, 
        handleLogout: props.handleLogout,
        handleTime: props.handleTime
    }

    return (
        <Container ref={containerRef} fluid>
            <Row>
                <Col xs={12}>
                    <Header headerInfo={headerInfo} />
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <FollowedTweets containerRef={containerRef} resendQuery={props.resendQuery} setResendQuery={props.setResendQuery}/>
                </Col>
            </Row>
        </Container>
    )
}
