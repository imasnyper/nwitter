import React from 'react';
import Retweet from '../components/retweet';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_RETWEET } from '../gql/tweets';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Header from '../components/header';

export default function ReweetPage(props) {
    const id = useParams()
    const { data, loading, error } = useQuery(GET_RETWEET, {variables: {id: id.id}})

    const headerInfo = {
        resendQuery: props.resendQuery, 
        setResendQuery: props.setResendQuery, 
        username: props.username, 
        handleLogout: props.handleLogout,
        handleTime: props.handleTime
    }

    if(loading) return <p>Loading... <span role="img" aria-label="hourglass">⌛</span></p>
    if(error) return <p>Error <span role="img" aria-label="crying">😭</span></p>

    const retweet = data.getRetweet
    console.log(data)

    return (
        <Container fluid>
            <Row>
                <Col xs={12}>
                    <Header headerInfo={headerInfo} />
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Retweet setResendQuery={props.setResendQuery} retweet={retweet} />
                </Col>
            </Row>
        </Container>
    )
}