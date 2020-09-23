import React, { useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton';
import Row from 'react-bootstrap/Row';
import Tweets from '../components/tweets';
import Header from '../components/header';

export default function HomePage(props) {
    const containerRef = useRef(null);
    const [followedTweetsOnly, setFollowedTweetsOnly] = useState(true)
    
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
                <Col>
                    <ButtonGroup toggle>
                        <ToggleButton 
                            type="checkbox"
                            value="1"
                            checked={followedTweetsOnly}
                            onChange={e => setFollowedTweetsOnly(e.currentTarget.checked)}
                        >
                            {followedTweetsOnly ? `View All Tweets` : `View Followed Tweets`}
                        </ToggleButton>
                    </ButtonGroup>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Tweets 
                        containerRef={containerRef} 
                        resendQuery={props.resendQuery} 
                        setResendQuery={props.setResendQuery}
                        followedTweetsOnly={followedTweetsOnly}
                    />
                </Col>
            </Row>
        </Container>
    )
}
