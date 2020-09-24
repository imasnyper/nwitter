import React, { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { EDIT_PROFILE_MUTATION } from '../gql/profiles';
import DatePicker from 'react-date-picker';
import moment from 'moment';

export default function EditProfileModal(props) {
    const { profile } = props;
    const bioInput = useRef(null);
    const locationInput = useRef(null);
    const websiteInput = useRef(null);
    const [ bioValue, setBioValue ] = useState(profile.bio);
    const [ locationValue, setLocationValue ] = useState(profile.location);
    const [ websiteValue, setWebsiteValue ] = useState(profile.website);
    const [ editProfile, {error} ] = useMutation(EDIT_PROFILE_MUTATION, {onError: () => console.log(error)});
    const momentDate = moment(profile.birthday);
    const dateObj = new Date(momentDate.year(), momentDate.month(), momentDate.date());
    const [ birthday, setBirthday ] = useState(dateObj);

    const handleSubmit = e => {
        e.preventDefault()
        const newBirthday = `${birthday.getFullYear()}-${('0' + (birthday.getMonth() + 1)).slice(-2)}-${birthday.getDate()}`
        editProfile({
            variables: {
                bio: bioInput.current.value,
                location: locationInput.current.value,
                website: websiteInput.current.value,
                birthday: newBirthday,
            }
        })
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
                Edit Profile
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={e => handleSubmit(e)}>
                    <Form.Group as={Row}>
                        <Col>
                            <Form.Label>Bio:</Form.Label>
                        </Col>
                        <Col>
                            <Form.Control 
                                type="text" 
                                as="textarea" 
                                rows="3" 
                                ref={bioInput} 
                                value={bioValue} 
                                placeholder="Enter your bio." 
                                onChange={e => setBioValue(e.target.value)}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col>
                            <Form.Label>Location:</Form.Label>
                        </Col>
                        <Col>
                            <Form.Control 
                                ref={locationInput} 
                                value={locationValue} 
                                placeholder="Enter your bio."
                                onChange={e => setLocationValue(e.target.value)}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col>
                            <Form.Label>Website:</Form.Label>
                        </Col>
                        <Col>
                            <Form.Control 
                                ref={websiteInput} 
                                value={websiteValue} 
                                placeholder="Enter your bio." 
                                onChange={e => setWebsiteValue(e.target.value)}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col>
                            <Form.Label>Birthday:</Form.Label>
                        </Col>
                        <Col>
                            <DatePicker
                                value={birthday}
                                onChange={setBirthday}
                                format="y-MM-dd"
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group>
                        <Button type="submit">Save Changes</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    )
}