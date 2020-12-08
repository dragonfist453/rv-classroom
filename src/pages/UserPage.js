import React from 'react';
import {Container, Grid, } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {classrooms} from '../fakeData';
import ClassCard from '../components/ClassCard';

const useStyles = makeStyles((theme) => ({
    root: {
        ...theme.page,
        minWidth: '100vh',
    },
}))

export default function UserPage() {
    const classes = useStyles();
    return(
        <Container maxWidth='xl' className={classes.root}>
            <Grid container row spacing={2}>
                {
                    classrooms.map(classroom => (
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <ClassCard class={classroom}/>
                        </Grid>
                    ))
                }
            </Grid>
        </Container>
    )
}