import React from 'react';
import Tweet from '../components/tweet';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_TWEET } from '../gql/tweets';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Header from '../components/header';

export default function TweetPage(props) {
    const id = useParams()
    const { data, loading, error } = useQuery(GET_TWEET, {variables: {id: id.id}})

    const headerInfo = {
        resendQuery: props.resendQuery, 
        setResendQuery: props.setResendQuery, 
        username: props.username, 
        handleLogout: props.handleLogout,
        handleTime: props.handleTime
    }

    if(loading) return <p>Loading... <span role="img" aria-label="hourglass">⌛</span></p>
    if(error) return <p>Error <span role="img" aria-label="crying">😭</span></p>

    const tweet = data.getTweet

    return (
        <Container fluid>
            <Row>
                <Col xs={12}>
                    <Header headerInfo={headerInfo} />
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Tweet setResendQuery={props.setResendQuery} tweet={tweet} />
                </Col>
            </Row>
        </Container>
    )
}