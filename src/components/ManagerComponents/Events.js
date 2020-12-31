import { Container, Button } from '@material-ui/core';
import React from 'react';
import Calendar from '../../components/Calendar';
import {hostname} from '../../links';
import {useParams} from 'react-router-dom'

export default function Events(props) {
    const {sectionid} = useParams()
    return(
        <Container>
            <Button onClick={() => window.location.href = window.location.origin + '/#/admin/manage/'}>Back</Button>
            <Calendar
                selectable={true}
                defaultView="week"
                height={70}
                width={100}
                padding={10}
                eventsurl={hostname + '/event/timetable/' + sectionid}
                sectionid={sectionid}
            />
        </Container>
    )
}