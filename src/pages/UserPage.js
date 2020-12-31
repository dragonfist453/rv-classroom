import React from 'react';
import {Container, Grid, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import ClassCard from '../components/ClassCard';
import axios from 'axios';
import {hostname} from '../links';

const useStyles = makeStyles((theme) => ({
    root: {
        ...theme.page,
        minWidth: '100vh',
    },
}))

export default function UserPage() {
    const classes = useStyles();
    const loggedIn = localStorage.getItem('isAuthenticated') === 'true';
    const usertype = localStorage.getItem('usertype');

    React.useEffect(() => {
        if(!loggedIn) {
            window.location.replace(window.location.origin + '/#/')
        }
    })

    const [classrooms, setClassrooms] = React.useState([])

    const getClassroomLink = hostname + '/' + usertype + '/subjects/' + (JSON.parse(localStorage.getItem('userDetails')).usn || JSON.parse(localStorage.getItem('userDetails')).teacherid)

    React.useEffect(() => {
        axios.get(getClassroomLink)
        .then(res => {
            setClassrooms(res.data.results)
        }) 
    },[usertype, getClassroomLink])
    return(
        <Container maxWidth='xl' className={classes.root}>
            {
                classrooms.length !==0?(
                    <Grid container spacing={2}>
                        {
                            classrooms.map(classroom => {
                                return(
                                    <Grid key={classroom.classid} item xs={12} sm={6} md={4} lg={3}>
                                        <ClassCard class={classroom}/>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                )
                :
                (
                    <Typography variant='h4' style={{textAlign: 'center'}}>You haven't been assigned to any class</Typography>
                )
            }
        </Container>
    )
}