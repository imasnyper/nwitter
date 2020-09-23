import { useMutation } from "@apollo/client";
import React, { useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { RETWEET_TWEET_MUTATION } from '../gql/tweets';

export default function RetweetModal(props) {
    const { tweet } =  props;
    const [ retweetTweet, {error} ] = useMutation(RETWEET_TWEET_MUTATION, 
        {onError: () => {console.log(error)}}
    )
    const input = useRef(null)

    const handleSubmit = () => {
        console.log("handling submit")
        retweetTweet({variables: {id: tweet.id, text: input.current.value}})
        props.setShowModal(false)
        props.setResendQuery(true)
    }

    return (
        <Modal 
            {...props}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Retweet
                </Modal.Title>
            </Modal.Header>
            <Modal.Body xs={12}>
                <Form.Group as={Row} onSubmit={e => handleSubmit(e)}>
                    <Col xs={8}>
                        <Form.Control ref={input} type="text" />
                    </Col>
                    <Col xs={4}>
                        <Button xs={12} variant="primary" onClick={handleSubmit}>
                            Retweet <span role="img" aria-label="bird">🐦</span>
                        </Button>
                    </Col>
                </Form.Group>
            </Modal.Body>
        </Modal>
    )
}