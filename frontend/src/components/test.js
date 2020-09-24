import React, { useState } from 'react';
import DatePicker from 'react-date-picker';

export default function Test(props) {
    const [date, setDate] = useState(new Date());

    return (<><DatePicker selected={date} onChange={date => setDate(new Date(date))} /></>)
}