import React from 'react';
import Header from './header';
import { Link } from 'react-router-dom';

export default function Followed(props) {
    console.log(props.following.edges)
    return (
        <>
            <Header headerInfo={props.headerInfo} />
            <p>Following:</p>
            <ul>{props.following.edges.map(profile => {
                console.log(profile.node)
                return <li key={profile.node.id}><Link to={`/profiles/${profile.node.user.username}`}>{profile.node.user.username}</Link></li>
            })}</ul>
            <p>Followers:</p>
            <ul>{props.followers.edges.map(profile => {
                return <li key={profile.id}><Link to={`/profiles/${profile.node.user.username}`}>{profile.node.user.username}</Link></li>
            })}</ul>
        </>
    )
}