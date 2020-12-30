import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container, TextField, } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    fields: {
        padding: theme.spacing(1),
    }
}))

export default function AddStudentForm(props) {
    const classes = useStyles();
    const {deptid, handleFormChange} = props;

    const [values, setValues] = React.useState({
        sectionid: '',
        yearno: '',
        semester: '',
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
                        id="sectionid"
                        label="Section"
                        type="text"
                        placeholder="Enter Section ID"
                        value={values.sectionid}
                        onChange={handleChange('sectionid')}
                    />
                </div>
                <div className={classes.fields}>
                    <TextField
                        id="yearno"
                        label="Year"
                        type="number"
                        placeholder="Enter year of the Section"
                        value={values.yearno}
                        onChange={handleChange('yearno')}
                    />
                </div>
                <div className={classes.fields}>
                    <TextField
                        id="semester"
                        label="Semester"
                        type="number"
                        placeholder="Enter semester of the Section"
                        value={values.semester}
                        onChange={handleChange('semester')}
                    />
                </div>
            </Container>
        </div>
    );
}
