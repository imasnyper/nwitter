import React, { useState } from 'react'

export default function Test(props) {
    const [test, setTest] = useState("some test")
    return <p>Test working: {test}</p>
}