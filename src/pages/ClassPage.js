import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Container, Paper, Typography} from '@material-ui/core';
import {useParams} from 'react-router-dom';
import AppBarWidget from '../components/AppBarWidget';
import {classrooms} from '../fakeData';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
    root: {
        ...theme.page,
    },
    paper: {
        padding: theme.spacing(4),
        marginBottom: theme.spacing(4),
        whiteSpace: 'pre-wrap',
    },
    titlePaper: {
        minHeight: 150,
    }
}))

export default function ClassPage(props) {
    const classes = useStyles();
    let {cid} = useParams();
    const classroom = classrooms[cid-1];
    let toDisplay = [
        {
            type: 'material',
            name: 'Unit 1',
        },
        {
            type: 'announcement',
            text: `Hello,\n\nCIE 2 will be held from 21st December 2020`,
        }
    ];
    return(
        <>
            <AppBarWidget/>
            <Container maxWidth='md' className={classes.root}>
                <Paper elevation={4} className={clsx(classes.paper, classes.titlePaper)}>
                    <Typography variant='h4'>
                        <b>{classroom.name}</b>
                    </Typography>
                    <Typography>
                        {classroom.section}
                    </Typography>
                    <Typography>
                        {classroom.teacher}
                    </Typography>
                </Paper>
                {
                    (Array.isArray(toDisplay) && toDisplay.length!==0)?
                    (
                        <>
                        {
                            toDisplay.map(disp => {
                                if(disp.type === 'material') {
                                    return(
                                        <Paper variant="outlined" className={classes.paper}>
                                            <Typography variant='h5'>
                                                {disp.name}
                                            </Typography>
                                            <br/>
                                            <a href='/NPS_T2_Q1.pdf' target='_blank' download>NPS_T2_Q1</a>
                                        </Paper>
                                    )
                                }
                                else {
                                    return(
                                        <Paper variant='outlined' className={classes.paper}>
                                            <Typography variant='span'>
                                                {disp.text}
                                            </Typography>
                                        </Paper>
                                    )
                                }
                            })
                        }
                        </>
                    )
                    :
                    (
                        <Paper variant="outlined" className={classes.paper} style={{textAlign: 'center'}}>
                            <Typography variant='h5'>
                                Nothing to display here
                            </Typography>
                        </Paper>
                    ) 
                }
            </Container>
        </>
    )
}