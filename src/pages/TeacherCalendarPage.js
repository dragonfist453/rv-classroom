import { Container } from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router-dom';
import Calendar from '../components/Calendar';
import { hostname } from '../links';

export default function CalendarPage(props) {
    const {teacherid} = useParams()
    return(
        <Container>
            <Calendar
                defaultView="week"
                height={70}
                width={100}
                padding={80}
                eventsurl={hostname + '/event/teacher/' + teacherid}
            />
        </Container>
    )
}