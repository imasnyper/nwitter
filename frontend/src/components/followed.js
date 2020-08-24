import React from 'react';
import Header from './header';
import { Link } from 'react-router-dom';

export default function Followed(props) {
    return (
        <>
            <Header headerInfo={props.headerInfo} />
            <p>Following:</p>
            <ul>{props.following.map(profile => {
                console.log(profile.id)
                return <li key={profile.id}><Link to={`/profiles/${profile.user.username}`}>{profile.user.username}</Link></li>
            })}</ul>
            <p>Followers:</p>
            <ul>{props.followers.map(profile => {
                return <li key={profile.id}><Link to={`/profiles/${profile.user.username}`}>{profile.user.username}</Link></li>
            })}</ul>
        </>
    )
}