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

    React.useEffect(() => {
        if(!loggedIn) {
            window.location.replace(window.location.origin + '/#/')
        }
    })

    const [classrooms, setClassrooms] = React.useState([])

    React.useEffect(() => {
        axios.get(hostname + '/' + localStorage.getItem('usertype') + '/email/' + localStorage.getItem('emailid'))
        .then(res => {
            localStorage.setItem('userDetails', JSON.stringify(res.data[localStorage.getItem('usertype')]))
        })
        .catch(err => {
            console.error(err)
        })
    },[])

    React.useEffect(() => {
        axios.get(hostname + '/' + localStorage.getItem('usertype') + '/subjects/' + JSON.parse(localStorage.getItem('userDetails')).usn)
        .then(res => {
            setClassrooms(res.data.results)
        }) 
    })
    return(
        <Container maxWidth='xl' className={classes.root}>
            {
                classrooms.length !==0?(
                    <Grid container spacing={2}>
                        {
                            classrooms.map(classroom => (
                                <Grid key={classroom.name} item xs={12} sm={6} md={4} lg={3}>
                                    <ClassCard class={classroom}/>
                                </Grid>
                            ))
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