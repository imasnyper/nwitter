import { useMutation } from '@apollo/client';
import React, { useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { COMPOSE_TWEET_MUTATION } from '../gql/tweets';
import TweetInput from './tweetInput';

export default function ComposeTweet(props) {
    const input = useRef(null);
    const [text, setText] = useState("");
    const [createTweet] = useMutation(COMPOSE_TWEET_MUTATION);

    // useEffect(() => {
    //     console.log(input.current)
    //     if(input.current) {
    //         input.current.focus()
    //     }
    // })

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
            <Form 
                onSubmit={e => {
                    e.preventDefault();
                    createTweet({variables: {text: input.current.value}});
                    props.setResendQuery(true)
                }}
            >
                <TweetInput input={input} setText={setText} validateForm={validateForm}/>
            </Form>
        </div>
    )
}