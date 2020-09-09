import React from 'react';
import Toast from 'react-bootstrap/Toast';

export default function ErrorToast(props) {
    const error = props.error
    if(error) {
        console.log(error.graphQLErrors)
    }
    return (
        <Toast 
            style={{zIndex: 1000, position: "fixed", top: 10, right: 10}}
            onClose={() => props.setShow(false)} 
            show={props.show} 
            delay={5000} 
            autohide
        >
            <Toast.Header>
                <strong>Error</strong>
            </Toast.Header>
            <Toast.Body>
                {error && 
                    error.graphQLErrors.map(({ message }, i) => {
                        return <span key={i}>{message}</span>
                    })
                }
            </Toast.Body>
        </Toast>
    )
}