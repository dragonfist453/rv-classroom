import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container, TextField, } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    fields: {
        padding: theme.spacing(1),
    }
}))

export default function AddSubjectForm(props) {
    const classes = useStyles();
    const {handleFormChange} = props;

    const [values, setValues] = React.useState({
        classid: '',
        classname: '',
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
                        id="classid"
                        label="Subject Code"
                        type="text"
                        placeholder="Enter Code of the Subject"
                        value={values.classid}
                        onChange={handleChange('classid')}
                    />
                </div>
                <div className={classes.fields}>
                    <TextField
                        id="classname"
                        label="Subject name"
                        type="text"
                        placeholder="Enter name of Subject"
                        value={values.classname}
                        onChange={handleChange('classname')}
                    />
                </div>
            </Container>
        </div>
    );
}
