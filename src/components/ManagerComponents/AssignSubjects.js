import React from 'react';
import {DataGrid} from '@material-ui/data-grid';
import {IconButton, Typography, Button} from '@material-ui/core';
import {Add} from '@material-ui/icons';
import axios from 'axios';
import {hostname} from '../../links';
import NoRowsOverlay from './NoRowsOverlay';

const classid = window.location.href.slice(-6)

const assignTeacher = (teacherid) => (event) => {
    axios.post(hostname + '/auth/admin/teaches/', {
        teacherid: teacherid,
        classid: classid,
    },
    {
        headers: {
            "x-auth-token": localStorage.getItem('admintoken')
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

const assignStudent = (usn) => (event) => {
    axios.post(hostname + '/auth/admin/attends/', {
        usn: usn,
        classid: classid,
    },
    {
        headers: {
            "x-auth-token": localStorage.getItem('admintoken')
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

const teacherColumns = [
    {
        field: '',
        headerName: 'Operations',
        width: 200,
        renderCell: (params) => (
            <>
                <IconButton onClick={assignTeacher(params.getValue('teacherid'))}>
                    <Add/>
                </IconButton>
            </>
        )
    },
    { field: 'id', headerName: 'S.No.', width: 100 },
    { field: 'teacherid', headerName: 'Teacher ID', width: 120,},
    { field: 'tname', headerName: 'Name', flex: 1,},
    { field: 'emailid', headerName: 'Email ID', flex: 1,},
]

const studentColumns = [
    {
        field: '',
        headerName: 'Operations',
        width: 200,
        renderCell: (params) => (
            <>
                <IconButton onClick={assignStudent(params.getValue('usn'))}>
                    <Add/>
                </IconButton>
            </>
        )
    },
    { field: 'id', headerName: 'S.No.', width: 100 },
    { field: 'usn', headerName: 'USN', width: 120,},
    { field: 'stname', headerName: 'Name', flex: 1,},
    { field: 'emailid', headerName: 'Email ID', flex: 1,},
    { field: 'yearno', headerName: 'Year', width: 70,},
    { field: 'semester', headerName: 'Semester', width: 100,},
    { field: 'sectionid', headerName: 'Section', width: 90},
]

export default function Students(props) {
    const [students, setStudents] = React.useState([]);
    const [teachers, setTeachers] = React.useState([]);

    const [loadingStudent, setLoadingStudent] = React.useState(true);
    const [loadingTeacher, setLoadingTeacher] = React.useState(true);

    React.useEffect(() => {
        axios.get(hostname + '/student/notassigned/' + classid)
        .then(res => {
            res.data.students.forEach((ele, index) => {
                ele.id = index + 1;
            })
            setStudents(res.data.students)
            setLoadingStudent(false)
        })
        .catch(err => {
            console.error(err)
        })
    },[])

    React.useEffect(() => {
        axios.get(hostname + '/teacher/notassigned/' + classid)
        .then(res => {
            res.data.teachers.forEach((ele, index) => {
                ele.id = index + 1;
            })
            setTeachers(res.data.teachers)
            setLoadingTeacher(false)
        })
        .catch(err => {
            console.error(err)
        })
    },[])
    return(
        <>
            <Button onClick={() => window.location.href = window.location.origin + '/#/admin/manage/'}>Back</Button>
            <Typography variant='h4' style={{textAlign: 'center'}}>Assign students</Typography>
            <br/>
            <div style={{height: '250px', width: '100%'}}>
                <DataGrid 
                    loading={loadingStudent} 
                    autoHeight 
                    autoPageSize 
                    components={{
                        noRowsOverlay: NoRowsOverlay,
                    }}
                    rows={students} 
                    columns={studentColumns} 
                    pageSize={12} 
                    disableSelectionOnClick/>
            </div>
            <br/>
            <Typography variant='h4' style={{textAlign: 'center'}}>Assign teachers</Typography>
            <br/>
            <div style={{height: '250px', width: '100%'}}>
                <DataGrid 
                    loading={loadingTeacher} 
                    autoHeight 
                    autoPageSize 
                    components={{
                        noRowsOverlay: NoRowsOverlay,
                    }}
                    rows={teachers} 
                    columns={teacherColumns} 
                    pageSize={12} 
                    disableSelectionOnClick/>
            </div>
        </>
    )
}