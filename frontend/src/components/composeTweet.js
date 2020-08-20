import React, { useRef, useState, useEffect } from 'react';
import { COMPOSE_TWEET_MUTATION } from '../gql/tweets'
import { useMutation } from '@apollo/client'

export default function ComposeTweet(props) {
    const input = useRef(null);
    const [text, setText] = useState("");
    const [createTweet, { data }] = useMutation(COMPOSE_TWEET_MUTATION);

    useEffect(() => {
        if(props.resendQuery) {
            input.current.value = ""
        }
    }, [input, props])

    function validateForm() {
        return text.length > 0;
    }

    return (
        <div>
            <form 
                onSubmit={e => {
                    e.preventDefault();
                    createTweet({variables: {text: input.current.value}});
                    props.setResendQuery(true)

                }}
            >
                <input ref={input} onChange={e => setText(e.target.value)} type="text"></input>
                <button disabled={!validateForm()} type="submit">Tweet <span role="img" aria-label="bird">🐦</span></button>
            </form>
        </div>
    )
}