import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Header from '../components/header';
import { Link } from 'react-router-dom';
import ProfileDetail from '../components/profileDetail';
import {useHistory} from 'react-router-dom';
import "../styles/global.css";

export default function ProfileList(props) {
    const {profile, userProfile, setShowEditModal, handleFollow} = props;
    const history = useHistory();

    return (
        <>
            <Row>
                <Col>
                    <Header headerInfo={props.headerInfo} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Link to={`/profiles/${profile.user.username}`}>{profile.user.username}'s</Link> Followers:
                </Col>
            </Row>
            {props.followers.map(followerProfile => {
                return (
                    <Row className="top-pad-sm">
                        <Col>
                            <ProfileDetail
                                profile={followerProfile}
                                userProfile={userProfile}
                                setShowEditModal={setShowEditModal}
                                handleFollow={handleFollow}
                                key={profile.id}
                                onClick={() => history.push(`/profiles/${profile.user.username}`)}
                            />
                        </Col>
                    </Row>
                )
            })}
        </>
    )
}