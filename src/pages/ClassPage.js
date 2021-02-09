import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {AppBar, Backdrop, Button, CircularProgress, Container, Dialog, DialogActions, DialogTitle, DialogContent, 
    Fab, IconButton, Paper, Tab, Tabs, TextField, Tooltip, Typography} from '@material-ui/core';
import {Add, Delete, GetApp} from '@material-ui/icons';
import {useParams} from 'react-router-dom';
import AppBarWidget from '../components/AppBarWidget';
import axios from 'axios';
import {hostname} from '../links';
import clsx from 'clsx';
import EventsCalendar from '../components/Calendar';

const useStyles = makeStyles(theme => ({
    root: {
        ...theme.page,
    },
    paper: {
        padding: theme.spacing(4),
        marginBottom: theme.spacing(4),
        whiteSpace: 'pre-wrap',
    },
    titlePaper: {
        minHeight: 150,
    },
    fab: {
        position: 'absolute',
        zIndex: 100,
        right: theme.spacing(4),
        bottom: theme.spacing(4),
    },
    fields: {
        padding: theme.spacing(2),
    },
    agendaCalendar: {
        padding: theme.spacing(4),
        position: 'relative',
        top: theme.spacing(16),
        left: theme.spacing(4),
        minHeight: '200px',
        float: 'left',
    }
}))

export default function ClassPage(props) {
    const classes = useStyles();
    let {classid} = useParams();

    const usertype = localStorage.getItem('usertype');
    const isTeacher = usertype === 'teacher';
    
    const [classroom, setClassroom] = React.useState({})
    const [materials, setMaterials] = React.useState([])
    const [feedbacks, setFeedbacks] = React.useState([])
    const [announcements, setAnnouncements] = React.useState([])
    const [loaded, setLoaded] = React.useState(false)
    React.useEffect(() => {
        setLoaded(false)
        if(classid !== undefined) {
            axios.get(hostname + '/classroom/' + classid)
            .then(res => {
                setClassroom(res.data.classroom)
                setLoaded(true)
            })
            .catch(err => {
                console.error(err)
                setLoaded(false)
            })

            axios.get(hostname + '/material/class/' + classid)
            .then(res => {
                setMaterials(res.data.results)
            })
            .catch(err => {
                console.error(err)
            })

            axios.get(hostname + '/announcement/class/' + classid)
            .then(res => {
                setAnnouncements(res.data.results)
            })
            .catch(err => {
                console.error(err)
            })

            axios.get(hostname + '/feedback/' + classid)
            .then(res => {
                setFeedbacks(res.data.results)
                console.log(res.data.results)
            })
            .catch(err => {
                console.error(err)
            })
        }
    },[classid, usertype])

    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleMaterialDownload = (materialid, materialname,) => (event) => {
        event.preventDefault()
        axios.get(hostname + '/material/' + materialid)
        .then(res => {
            var blob = new Blob([res.data.file.data], {type: res.data.filetype});
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            var fileName = materialname;
            link.download = fileName;
            link.click();
        })
        .catch(err => {
            console.error(err)
        })
    }

    const [openDialog, setOpenDialog] = React.useState(false)
    const handleOpenDialog = () => {
        setOpenDialog(true)
    }
    const handleCloseDialog = () => {
        setOpenDialog(false)
    }

    const [materialValues, setMaterialValues] = React.useState({
        materialname: '',
        classid: classid,
        filetype: '',
        file: new Blob(),
    })
    const handleMaterialChange = (prop) => (event) => {
        setMaterialValues({
            ...materialValues,
            [prop]: event.target.value
        })
    }
    const handleFileChange = (event) => {
        let File = event.target.files[0]
        let reader = new FileReader()
        reader.readAsArrayBuffer(File)
        reader.onload = () => {
            setMaterialValues({...materialValues, filetype: File.type,file: {type: "Buffer", data: [...(new Uint8Array(reader.result))]}})
            console.log({type: "Buffer", data: [...(new Uint8Array(reader.result))]})
        }
    }

    const [announcementValues, setAnnouncementValues] = React.useState({
        classid: classid,
        announcement: '',
        dtime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    })
    const handleAnnouncementChange = (prop) => (event) => {
        setAnnouncementValues({
            ...announcementValues,
            [prop]: event.target.value
        })
    }

    const [feedbackValues, setFeedbackValues] = React.useState({
        classid: classid,
        feedback: '',
        ts: new Date().toISOString().slice(0, 19).replace('T', ' '),
    })

    const handleFeedbackChange = (prop) => (event) => {
        setFeedbackValues({
            ...feedbackValues,
            [prop]: event.target.value
        })
    }

    const addMaterial = (event) => {
        event.preventDefault()
        axios.post(hostname + '/material/', materialValues, {
            headers: {
                'x-auth-token': localStorage.getItem('atoken'),
            }
        })
        .then(res => {
            console.log(res.data.Response)
            window.location.reload()
        })
        .catch(err => {
            console.error(err)
        })
    }
    const addAnnouncement = (event) => {
        event.preventDefault()
        axios.post(hostname + '/announcement/', announcementValues, {
            headers: {
                'x-auth-token': localStorage.getItem('atoken')
            }
        })
        .then(res => {
            console.log(res.data)
            window.location.reload()
        })
    }
    const addFeedback = (event) => {
        event.preventDefault()
        axios.post(hostname + '/feedback/', feedbackValues)
        .then(res => {
            console.log(res.data)
            window.location.reload()
        })
    }
    const deleteMaterial = materialid => event => {
        axios.delete(hostname + '/material/' + materialid, {
            headers: {
                'x-auth-token': localStorage.getItem('atoken')
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
    const deleteAnnouncement = aid => event => {
        axios.delete(hostname + '/announcement/' + aid, {
            headers: {
                'x-auth-token': localStorage.getItem('atoken')
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
    return(
        <>
            <AppBarWidget/>
            {
                loaded?(
                <>
                    <Paper variant="outlined" className={classes.agendaCalendar}>
                        <Typography variant='h6'>Upcoming classes</Typography>
                        <br/>
                        <EventsCalendar
                        defaultView="agenda"
                        toolbar={false}
                        eventsurl={hostname + '/event/subject/' + classroom.classid}
                        />
                    </Paper>
                    <Container maxWidth='md' className={classes.root}>
                        <Paper elevation={4} className={clsx(classes.paper, classes.titlePaper)}>
                            <Typography variant='h4'>
                                <b>{classroom.classname}</b>
                            </Typography>
                            <Typography>
                                <b>{classroom.classid}</b>
                            </Typography>
                            <Typography>
                                {classroom.section}
                            </Typography>
                            <Typography>
                                {classroom.teacher}
                            </Typography>
                        </Paper>
                        <AppBar position='static' color='inherit'>
                            <Tabs value={value} onChange={handleChange} variant='fullWidth' textColor='primary' indicatorColor='primary'>
                                <Tab label="Materials"/>
                                <Tab label="Announcements"/>
                                <Tab label="Feedback"/>
                            </Tabs>
                        </AppBar>
                        {
                            [
                                (Array.isArray(materials) && materials.length!==0)?(
                                    <>
                                        {
                                            materials.map(material => (
                                                <Paper variant="outlined" className={classes.paper}>
                                                    <div style={{display: 'flex'}}>
                                                        <Typography variant='h5' style={{flexGrow: 1}}>
                                                            {material.materialname}
                                                        </Typography>
                                                        <IconButton style={{float: 'right'}} onClick={handleMaterialDownload(material.materialid, material.materialname)}>
                                                            <GetApp/>
                                                        </IconButton>
                                                        {isTeacher && (
                                                            <IconButton style={{float: 'right'}} onClick={deleteMaterial(material.materialid)}>
                                                                <Delete/>
                                                            </IconButton>
                                                        )}
                                                    </div>
                                                    <br/>
                                                </Paper>
                                            ))
                                        }
                                    </>
                                ):
                                (
                                    <Paper variant="outlined" className={classes.paper} style={{textAlign: 'center'}}>
                                        <Typography variant='h5'>
                                            Nothing to display here
                                        </Typography>
                                    </Paper>
                                ),
                                (Array.isArray(announcements) && announcements.length!==0)?(
                                    <>
                                        {
                                            announcements.map(announcement => (
                                                <Paper variant='outlined' className={classes.paper}>
                                                    <Typography variant='inherit' style={{flexGrow: 1}}>
                                                        {announcement.announcement}
                                                    </Typography>
                                                    {isTeacher && (
                                                        <IconButton style={{float: 'right'}} onClick={deleteAnnouncement(announcement.aid)}>
                                                            <Delete/>
                                                        </IconButton>
                                                    )}
                                                </Paper>
                                            ))
                                        }
                                    </>
                                ):
                                (
                                    <Paper variant="outlined" className={classes.paper} style={{textAlign: 'center'}}>
                                        <Typography variant='h5'>
                                            Nothing to display here
                                        </Typography>
                                    </Paper>
                                ),
                                (isTeacher ? (
                                    (Array.isArray(feedbacks) && feedbacks.length!==0)?(
                                        <>
                                            {
                                                feedbacks.map(feedback => (
                                                    <Paper variant='outlined' className={classes.paper}>
                                                        <Typography variant='inherit' style={{flexGrow: 1}}>
                                                            {feedback.fback}
                                                        </Typography>
                                                        {isTeacher && (
                                                            <div style={{float: 'right'}}>
                                                                {Date(feedback.ts)}
                                                            </div>
                                                        )}
                                                    </Paper>
                                                ))
                                            }
                                        </>
                                    ):
                                    (
                                        <Paper variant="outlined" className={classes.paper} style={{textAlign: 'center'}}>
                                            <Typography variant='h5'>
                                                Nothing to display here
                                            </Typography>
                                        </Paper>
                                    )
                                ):
                                (
                                    <Paper variant="outlined" className={classes.paper} style={{textAlign: 'center'}}>
                                        <Typography variant='h5'>
                                            Nothing to display here
                                        </Typography>
                                    </Paper>
                                ))
                            ][value]
                        }
                        {
                            (isTeacher)? (<Tooltip title={['Add Material', 'Add Announcement'][value]}>
                                <Fab aria-label={['Add Material', 'Add Announcement'][value]} onClick={handleOpenDialog} className={classes.fab} color='primary'>
                                    <Add/>
                                </Fab>
                            </Tooltip>)
                            :
                            (
                                <Tooltip title={'Add Feedback'}>
                                    <Fab aria-label={'Add Feedback'} onClick={handleOpenDialog} className={classes.fab} color='primary'>
                                        <Add/>
                                    </Fab>
                                </Tooltip>
                            )
                        }
                        <Dialog open={openDialog} onClose={handleCloseDialog}>
                            <DialogTitle>{['Add Material', 'Add Announcement', 'Add Feedback'][value]}</DialogTitle>
                            <form onSubmit={[addMaterial, addAnnouncement, addFeedback][value]}>
                                <DialogContent>
                                    {
                                        [
                                            (
                                                <div>
                                                    <div className={classes.fields}>
                                                        <TextField
                                                        id="materialname"
                                                        label="Material name"
                                                        type="text"
                                                        placeholder="Enter name of Material"
                                                        value={materialValues.materialname}
                                                        onChange={handleMaterialChange('materialname')}
                                                        />
                                                    </div>
                                                    <div className={classes.fields}>
                                                        <TextField
                                                        id="file"
                                                        label="Material file"
                                                        type="file"
                                                        placeholder="Upload Material"
                                                        onChange={handleFileChange}
                                                        />
                                                    </div>
                                                </div>
                                            ),
                                            (
                                                <div>
                                                    <div className={classes.fields}>
                                                        <TextField
                                                        id="announcement"
                                                        label="Announcement"
                                                        type="text"
                                                        multiline
                                                        placeholder="Enter announcement"
                                                        value={announcementValues.announcement}
                                                        onChange={handleAnnouncementChange('announcement')}
                                                        />
                                                    </div>
                                                </div>
                                            ),
                                            (
                                                <div>
                                                    <div className={classes.fields}>
                                                        <TextField
                                                        id="fback"
                                                        label="Feedback"
                                                        type="text"
                                                        placeholder="Enter feedback"
                                                        value={feedbackValues.fback}
                                                        multiline
                                                        onChange={handleFeedbackChange('fback')}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        ][value]
                                    }
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDialog} color="primary">
                                        Cancel
                                    </Button>
                                    <Button type="submit" color="primary">
                                        Submit
                                    </Button>
                                </DialogActions>
                            </form>
                        </Dialog>
                    </Container>
                </>
                )
                :
                (
                    <Backdrop open={!loaded}>
                        <CircularProgress />
                    </Backdrop>
                )
            }
        </>
    )
}