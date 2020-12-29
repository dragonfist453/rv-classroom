import React from 'react';
import {DataGrid} from '@material-ui/data-grid';
import {IconButton, } from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import axios from 'axios';
import {hostname} from '../../links';
import NoRowsOverlay from './NoRowsOverlay';

const deleteStudent = (usn) => (event) => {
    axios.delete(hostname + '/auth/admin/student/' + usn, {
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

const studentColumns = [
    {
        field: '',
        headerName: 'Operations',
        width: 200,
        renderCell: (params) => (
            <>
                <IconButton onClick={deleteStudent(params.getValue('usn'))}>
                    <Delete/>
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
    const {deptid} = props;

    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        axios.get(hostname + '/student/dept/' + deptid)
        .then(res => {
            res.data.students.forEach((ele, index) => {
                ele.id = index + 1;
            })
            setStudents(res.data.students)
            setLoading(false)
        })
        .catch(err => {
            console.error(err)
        })
    },[deptid])
    return(
        <div style={{minHeight: '20px'}}>
            <DataGrid 
                loading={loading} 
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
    )
}