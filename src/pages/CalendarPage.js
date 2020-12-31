import { Container, Dialog, DialogTitle, DialogActions, DialogContent, TextField, Button } from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router-dom';
import Calendar from '../components/Calendar';
import { hostname } from '../links';
import axios from 'axios';

export default function CalendarPage(props) {
    const {sectionid} = useParams()

    const [values, setValues] = React.useState({
        usn: JSON.parse(localStorage.getItem('userDetails')).usn,
        eventid: '',
        fback: '',
    })
    const handleChange = (prop) => (event) => {
        setValues({
            ...values,
            [prop]: event.target.value
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        axios.post(hostname + '/student/feedback', values, {
            headers: {
                'x-auth-token': localStorage.getItem('atoken')
            }
        })
        .then(res => {
            console.log(res.data)
            window.location.reload()
        })
        .catch(err => {
            console.error(err)
        })
    }

    const [openDialog, setOpenDialog] = React.useState(false)
    const feedbackOpen = (eventid) => {
        setValues({...values, eventid: eventid})
        setOpenDialog(true)
    } 
    const feedbackClose = () => {
        setOpenDialog(false)
    }
    return(
        <Container>
            <Calendar
                defaultView="week"
                height={70}
                width={100}
                padding={80}
                eventsurl={hostname + '/event/timetable/' + sectionid}
                feedbackForm={feedbackOpen}
            />
            <Dialog open={openDialog} onClose={feedbackClose}>
                <DialogTitle>Submit feedback</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <div style={{padding: 16}}>
                            <TextField
                                id="fback"
                                label="Feedback"
                                type="text"
                                placeholder="Enter feedback for the class"
                                value={values.fback}
                                onChange={handleChange('fback')}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={feedbackClose} color="primary">
                            Cancel
                        </Button>
                        <Button type="submit" color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Container>
    )
}