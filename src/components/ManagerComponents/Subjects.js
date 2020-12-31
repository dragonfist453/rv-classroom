import React from 'react';
import {DataGrid} from '@material-ui/data-grid';
import {IconButton, } from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import axios from 'axios';
import {hostname} from '../../links';
import NoRowsOverlay from './NoRowsOverlay';
import {Route} from 'react-router-dom';
import AssignSubjects from './AssignSubjects';

const deleteSubject = (classid) => (event) => {
    axios.delete(hostname + '/auth/admin/classroom/' + classid, {
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

const subjectColumns = [
    {
        field: '',
        headerName: 'Operations',
        width: 200,
        renderCell: (params) => (
            <>
                <IconButton onClick={deleteSubject(params.getValue('classid'))}>
                    <Delete/>
                </IconButton>
            </>
        )
    },
    { field: 'id', headerName: 'S.No.', flex: 1 },
    { field: 'classid', headerName: 'Subject Code', flex: 1,},
    { field: 'classname', headerName: 'Subject Name', flex: 1, }
]

const handleRowClick = (params) => {
    window.location.href = window.location.origin + '/#/admin/manage/subject/' + params.getValue('classid')
}

export default function Subjects(props) {
    const [subjects, setSubjects] = React.useState([]);

    const [loading, setLoading] = React.useState(true);
    const {deptid} = props;

    React.useEffect(() => {
        axios.get(hostname + '/classroom/')
        .then(res => {
            res.data.classes.forEach((ele, index) => {
                ele.id = index + 1;
            })
            setSubjects(res.data.classes)
            setLoading(false)
        })
        .catch(err => {
            console.error(err)
        })
    },[])

    return(
        <div style={{minHeight: '20px'}}>
            <Route exact path='/admin/manage'>
                <DataGrid 
                    loading={loading} 
                    autoHeight 
                    autoPageSize 
                    components={{
                        noRowsOverlay: NoRowsOverlay,
                    }}
                    rows={subjects} 
                    columns={subjectColumns} 
                    onRowClick={handleRowClick}
                    pageSize={12} 
                    disableSelectionOnClick/>
            </Route>
            <Route path='/admin/manage/subject/:classid'>
                <AssignSubjects deptid={deptid}/>
            </Route>
        </div>
    )
}