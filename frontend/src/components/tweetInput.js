import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default function TweetInput(props) {
    return (
        <Form.Group as={Row}>
            <Col xs={10}>
                <Form.Control ref={props.input} onChange={e => props.setText(e.target.value)} type="text" placeholder="Tweet something!"></Form.Control>
            </Col>
            <Col xs={2}>
                <Button block variant="primary" disabled={!props.validateForm()} type="submit">Tweet <span role="img" aria-label="bird">🐦</span></Button>
            </Col>
        </Form.Group>
    )
}