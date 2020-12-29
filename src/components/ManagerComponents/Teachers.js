import React from 'react';
import {DataGrid} from '@material-ui/data-grid';
import {IconButton, } from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import axios from 'axios';
import {hostname} from '../../links';
import NoRowsOverlay from './NoRowsOverlay';

const deleteTeacher = (usn) => (event) => {
    axios.delete(hostname + '/auth/admin/teacher/' + usn, {
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
                <IconButton onClick={deleteTeacher(params.getValue('teacherid'))}>
                    <Delete/>
                </IconButton>
            </>
        )
    },
    { field: 'id', headerName: 'S.No.', width: 100 },
    { field: 'teacherid', headerName: 'Teacher ID', width: 120,},
    { field: 'tname', headerName: 'Name', flex: 1,},
    { field: 'emailid', headerName: 'Email ID', flex: 1,},
]

export default function Teachers(props) {
    const [teachers, setTeachers] = React.useState([]);
    const {deptid} = props;

    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        axios.get(hostname + '/teacher/dept/' + deptid)
        .then(res => {
            res.data.teachers.forEach((ele, index) => {
                ele.id = index + 1;
            })
            setTeachers(res.data.teachers)
            setLoading(false)
            console.log(res.data)
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
                rows={teachers} 
                columns={teacherColumns} 
                pageSize={12} 
                disableSelectionOnClick/>
        </div>
    )
}