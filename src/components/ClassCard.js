import React from 'react';
import {Card, CardContent, Typography, } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 450,
        transition: 'boxShadow 0.5s ease-in',
        '&:hover': {
            boxShadow: '0 1px 2px 0 rgba(60,64,67,0.302), 0 2px 6px 2px rgba(60,64,67,0.149)',
            cursor: 'pointer',
        }
    },
}))

export default function ClassCard(props) {
    const classes = useStyles();
    let history = useHistory();
    return(
        <Card variant="outlined" className={classes.root} onDoubleClick={() => history.push('/class/'+props.class.cid)}>
            <CardContent>
                <Typography variant='h5' noWrap>
                    {props.class.name}
                </Typography>
                <Typography variant='p'>
                    {props.class.section}
                </Typography>
                <br/>
                <Typography variant='p'>
                    {props.class.teacher}
                </Typography>
            </CardContent>
        </Card>
    )
}