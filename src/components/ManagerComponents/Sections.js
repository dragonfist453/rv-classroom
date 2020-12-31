import React from 'react';
import {DataGrid} from '@material-ui/data-grid';
import {IconButton, } from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import axios from 'axios';
import {hostname} from '../../links';
import NoRowsOverlay from './NoRowsOverlay';
import { Route } from 'react-router-dom';
import AddEvents from './Events';

const deleteSection = (sectionid) => (event) => {
    axios.delete(hostname + '/auth/admin/timetable/' + sectionid, {
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

const sectionColumns = [
    {
        field: '',
        headerName: 'Operations',
        width: 200,
        renderCell: (params) => (
            <>
                <IconButton onClick={deleteSection(params.getValue('sectionid'))}>
                    <Delete/>
                </IconButton>
            </>
        )
    },
    { field: 'id', headerName: 'S.No.', flex: 1 },
    { field: 'sectionid', headerName: 'Section', flex: 1,},
    { field: 'yearno', headerName: 'Year', flex: 1,},
    { field: 'semester', headerName: 'Semester', flex: 1,},
]

const handleRowClick = (params) => {
    window.location.href = window.location.origin + '/#/admin/manage/timetable/' + params.getValue('sectionid')
}

export default function Sections(props) {
    const [sections, setSections] = React.useState([]);
    const {deptid} = props;

    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        axios.get(hostname + '/section/dept/' + deptid)
        .then(res => {
            res.data.sections.forEach((ele, index) => {
                ele.id = index + 1;
            })
            setSections(res.data.sections)
            setLoading(false)
        })
        .catch(err => {
            console.error(err)
        })
    },[deptid])

    return(
        <>
            <Route exact path='/admin/manage'>
                <div style={{minHeight: '20px'}}>
                    <DataGrid 
                        loading={loading} 
                        autoHeight 
                        autoPageSize 
                        components={{
                            noRowsOverlay: NoRowsOverlay,
                        }}
                        rows={sections} 
                        columns={sectionColumns} 
                        onRowClick={handleRowClick}
                        pageSize={12} 
                        disableSelectionOnClick/>
                </div>
            </Route>
            <Route path='/admin/manage/timetable/:sectionid'>
                <AddEvents />
            </Route>
        </>
    )
}