import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container, TextField, } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    fields: {
        padding: theme.spacing(1),
    }
}))

export default function AddTeacherForm(props) {
    const classes = useStyles();
    const {deptid, handleFormChange} = props;

    const [values, setValues] = React.useState({
        teacherid: '',
        tname: '',
        emailid: '',
        pass: 'password',
        deptid: deptid,
    })

    const handleChange = (prop) => (event) => {
        setValues({
            ...values,
            [prop]: event.target.value,
        });
        handleFormChange({...values, [prop]: event.target.value})
    }

    return (
        <div>
            <Container>
                <div className={classes.fields}>
                    <TextField
                        id="teacherid"
                        label="Teacher ID"
                        type="text"
                        placeholder="Enter ID of Teacher"
                        value={values.teacherid}
                        onChange={handleChange('teacherid')}
                    />
                </div>
                <div className={classes.fields}>
                    <TextField
                        id="tname"
                        label="Teacher Name"
                        type="text"
                        placeholder="Enter name of Teacher"
                        value={values.tname}
                        onChange={handleChange('tname')}
                    />
                </div>
                <div className={classes.fields}>
                    <TextField
                        id="emailid"
                        label="Email ID"
                        type="email"
                        placeholder="Enter Email ID of Teacher"
                        value={values.emailid}
                        onChange={handleChange('emailid')}
                    />
                </div>
            </Container>
        </div>
    );
}
