import { useMutation } from "@apollo/client";
import React, { useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { RETWEET_TWEET_MUTATION } from '../gql/tweets';

export default function RetweetModal(props) {
    const { tweet } =  props;
    const [ retweetTweet, {error} ] = useMutation(RETWEET_TWEET_MUTATION)
    const input = useRef(null)
    console.log(props)

    const handleSubmit = e => {
        e.preventDefault()
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
            <Modal.Body>
                <Form onSubmit={e => handleSubmit(e)}>
                    <Form.Control ref={input} type="text" />
                    <Button variant="primary" type="submit">
                        Retweet <span role="img" aria-label="bird">🐦</span>
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}