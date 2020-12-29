import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container, TextField, FormControl, InputLabel, Select, Input} from '@material-ui/core';
import axios from 'axios';
import {hostname} from '../../links';

const useStyles = makeStyles(theme => ({
    fields: {
        padding: theme.spacing(1),
    }
}))

export default function AddStudentForm(props) {
    const classes = useStyles();
    const {deptid, handleFormChange} = props;

    const [values, setValues] = React.useState({
        usn: '',
        stname: '',
        emailid: '',
        yearno: '',
        semester: '',
        studentpass: 'password',
        deptid: deptid,
        sectionid: '1A',
    })

    const handleChange = (prop) => (event) => {
        setValues({
            ...values,
            [prop]: event.target.value,
        });
        handleFormChange({...values, [prop]: event.target.value})
    }

    const [sections, setSections] = React.useState([])

    React.useEffect(() => {
        axios.get(hostname + '/section/dept/' + deptid)
        .then(res => {
            setSections(res.data.sections)
            console.log(res.data.sections)
        })
        .catch(err => {
            console.error(err)
        })
    }, [deptid])

    return (
        <div>
            <Container>
                <div className={classes.fields}>
                    <TextField
                        id="usn"
                        label="USN"
                        type="text"
                        placeholder="Enter USN of Student"
                        value={values.usn}
                        onChange={handleChange('usn')}
                    />
                </div>
                <div className={classes.fields}>
                    <TextField
                        id="stname"
                        label="Student Name"
                        type="text"
                        placeholder="Enter name of Student"
                        value={values.stname}
                        onChange={handleChange('stname')}
                    />
                </div>
                <div className={classes.fields}>
                    <TextField
                        id="emailid"
                        label="Email ID"
                        type="email"
                        placeholder="Enter Email ID of Student"
                        value={values.emailid}
                        onChange={handleChange('emailid')}
                    />
                </div>
                <div className={classes.fields}>
                    <TextField
                        id="yearno"
                        label="Year"
                        type="number"
                        placeholder="Enter current year of Student"
                        value={values.yearno}
                        onChange={handleChange('yearno')}
                    />
                </div>
                <div className={classes.fields}>
                    <TextField
                        id="semester"
                        label="Semester"
                        type="number"
                        placeholder="Enter current semester of Student"
                        value={values.semester}
                        onChange={handleChange('semester')}
                    />
                </div>
                <div className={classes.fields}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="sectionid-input">Section</InputLabel>
                        <Select
                            native
                            value={values.sectionid}
                            style={{minWidth: 100}}
                            onChange={handleChange('sectionid')}
                            input={<Input id="sectionid-input" />}
                        >
                            {
                                sections.map(section => (
                                    <option value={section.sectionid}>{section.sectionid}</option>
                                ))
                            }
                        </Select>
                    </FormControl>
                </div>
            </Container>
        </div>
    );
}
