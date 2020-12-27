import { Container } from '@material-ui/core';
import React from 'react';
import Calendar from '../components/Calendar';

export default function CalendarPage(props) {
    return(
        <Container>
            <Calendar
                defaultView="week"
                height={70}
                width={100}
            />
        </Container>
    )
}