import React from 'react'
import {makeStyles} from '@material-ui/core/styles';
import {Tabs,AppBar, Tab, Container, Typography, Paper, Toolbar, IconButton, Menu, MenuItem, CircularProgress, 
    Backdrop, Zoom, useTheme, Fab, Slide, Dialog, Button, Tooltip, DialogTitle, DialogContent,
    DialogActions,
    TextField} from '@material-ui/core';
import {AccountCircle, Add, } from '@material-ui/icons';
import {AddStudent, AddTeacher, ManageSections, ManageStudents, ManageTeachers, ManageSubjects, AddSubject, AddSection} from '../components/ManagerComponents';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {hostname} from '../links';

const useStyles = makeStyles((theme) => ({
    '@global': {
        '.MuiTabs-indicator': {
            top: 0,
        }
    },
    root: {
        paddingTop: 40,
        paddingBottom: 40,
    },
    paper: {
        flexGrow: 1,
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
    },
    leftStuff: {
        flexGrow:1,
        display: 'contents',
    },
    rightStuff: {
        flexGrow: 1,
    },
    rightIcons: {
        float: 'right',
    },
    fab: {
        position: 'absolute',
        zIndex: 100,
        right: theme.spacing(4),
        bottom: theme.spacing(4),
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    fields: {
        padding: theme.spacing(1),
    }
}))

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ManagerPage(props) {
    // Styles
    const classes = useStyles()

    // Data lazy loader state
    const [loaded, setLoaded] = React.useState(false);
    
    // Tab value
    const tabhistory = Number(localStorage.getItem('tabhistory'));
    const [value, setValue] = React.useState(tabhistory!== undefined?tabhistory:0);
    const handleChange = (event, newValue) => {
        localStorage.setItem('tabhistory', newValue);
        setValue(newValue);
    };

    React.useState(() => {
        setValue(tabhistory)
    },[tabhistory])

    // Values from forms
    const [values, setValues] = React.useState({})
    const handleFormChange = (newValues) => {
        setValues(newValues)
    }

    // Menu stuffs
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Auth stuffs
    const loggedIn = localStorage.getItem('isAdminAuthenticated') === 'true';
    const logout = () => {
        localStorage.removeItem('isAdminAuthenticated');
        localStorage.removeItem('admintoken');
        localStorage.removeItem('adminuser');
        window.location.replace(window.location.origin + '/#/admin');
    }
    React.useEffect(() => {
        if(!loggedIn) {
            window.location.replace(window.location.origin + '/#/admin')
        }
    })

    // Manage department to use the details for other operations
    const [department, setDepartment] = React.useState({});
    const handleDepartmentChange = (prop) => (event) => {
        setDepartment({
            ...department,
            [prop]: event.target.value
        })
    }
    React.useEffect(() => {
        axios.get(hostname + '/auth/department/' + localStorage.getItem('adminuser'), {
            headers: {
                "x-auth-token": localStorage.getItem('admintoken')
            }
        })
        .then(res => {
            setDepartment(res.data.dept);
            setLoaded(true)
        })
        .catch(err => {
            console.error(err)
            window.location.replace(window.location.origin + '/#/admin')
        })
    },[])
    const profileSubmit = (event) => {
        event.profileSubmit()
        axios.put(hostname + '/auth/department', department, {
            headers: {
                "x-auth-token": localStorage.getItem('admintoken')
            }
        })
        .then(res => {
            localStorage.setItem('adminuser',department.adminuser)
            window.location.reload()
        })
        .catch(err => {
            console.error(err)
        })
    }

    // What each tab shows
    const tabs = {
        0: <ManageStudents deptid={department.deptid}/>,
        1: <ManageTeachers deptid={department.deptid}/>,
        2: <ManageSections deptid={department.deptid}/>,
        3: <ManageSubjects deptid={department.deptid}/>
    }

    // Add functions
    const addStudent = (event) => {
        event.preventDefault()
        axios.post(hostname + '/auth/admin/student/', values, {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('admintoken')
            }
        })
        .then(() => {
            window.location.reload()
        })
        .catch(err => {
            console.error(err)
        })
    }
    const addTeacher = (event) => {
        event.preventDefault()
        axios.post(hostname + '/auth/admin/teacher/', values, {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('admintoken')
            }
        })
        .then(() => {
            window.location.reload()
        })
        .catch(err => {
            console.error(err)
        })
    }
    const addSection = (event) => {
        event.preventDefault()
        axios.post(hostname + '/auth/admin/timetable/', values, {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('admintoken')
            }
        })
        .then(() => {
            window.location.reload()
        })
        .catch(err => {
            console.error(err)
        })
    }
    const addSubject = (event) => {
        event.preventDefault()
        axios.post(hostname + '/auth/admin/classroom', values, {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('admintoken')
            }
        })
        .then(()=> {
            window.location.reload()
        })
        .catch(err => {
            console.error(err)
        })
    }

    // Fab for each tab
    const fabs = [
        {
            label: 'Add Students',
            color: 'primary',
        },
        {
            label: 'Add Teachers',
            color: 'secondary'
        },
        {
            label: 'Add Sections',
            color: 'primary'
        },
        {
            label: 'Add Subjects',
            color: 'secondary'
        },
    ]

    // Theme and transition durations
    const theme = useTheme();
    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    // General dialog initialisations for adding
    const [openDialog, setOpenDialog] = React.useState(false);
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // Dialog forms
    const forms = [
        <AddStudent handleFormChange={handleFormChange} deptid={department.deptid}/>,
        <AddTeacher handleFormChange={handleFormChange} deptid={department.deptid}/>,
        <AddSection handleFormChange={handleFormChange} deptid={department.deptid}/>,
        <AddSubject handleFormChange={handleFormChange}/>
    ]

    // Profile dialog stuff
    const [openProfileDialog, setOpenProfileDialog] = React.useState(false);
    const handleOpenProfileDialog = () => {
        setOpenProfileDialog(true)
    }
    const handleCloseProfileDialog = () => {
        setOpenProfileDialog(false)
    }
    return(
        <>
            {
                loaded?(
                    <div>
                        <AppBar position="static" color="default" style={{flexGrow: 1,}}>
                            <Toolbar>
                                <div className={classes.leftStuff}>
                                    <Link to='/' style={{display: 'contents', textDecoration: 'none', color: 'black'}}>
                                        <div style={{display: 'contents'}}>
                                            <img src={process.env.PUBLIC_URL + '/rvce.png'} alt='RVCE logo' height="50px"/>
                                            <Typography variant="h6"> Classroom</Typography>
                                        </div>
                                    </Link>
                                </div>
                                <div className={classes.rightStuff}>
                                    <div className={classes.rightIcons}>
                                        <Typography variant='inherit'>{'Welcome, '+ department.deptname + ' department!'}</Typography>
                                        <IconButton
                                            onClick={handleMenu}
                                            color="inherit"
                                        >
                                            <AccountCircle />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                            }}
                                            open={open}
                                            onClose={handleClose}
                                        >
                                            <MenuItem onClick={handleOpenProfileDialog}>My Department</MenuItem>
                                            <MenuItem onClick={logout}>Logout</MenuItem>
                                        </Menu>
                                    </div>
                                </div>
                            </Toolbar>
                        </AppBar>
                        <Container className={classes.root}>
                            {
                                tabs[value]
                            }
                        </Container>
                        <Dialog open={openDialog} onClose={handleCloseDialog} TransitionComponent={Transition}>
                            <DialogTitle>{['Add Students', 'Add Teachers', 'Add Sections', 'Add Subjects'][value]}</DialogTitle>
                            <form onSubmit={[addStudent, addTeacher, addSection, addSubject][value]}>
                                <DialogContent>
                                    {
                                        forms[value]
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
                        <Dialog open={openProfileDialog} onClose={handleCloseProfileDialog} TransitionComponent={Transition}>
                            <DialogTitle>Department profile</DialogTitle>
                            <form onSubmit={profileSubmit}>
                                <DialogContent>
                                    <div className={classes.fields}>
                                        <TextField
                                            id="deptname"
                                            label="Department name"
                                            type="text"
                                            value={department.deptname}
                                            onChange={handleDepartmentChange('deptname')}
                                        />
                                    </div>
                                    <div className={classes.fields}>
                                        <TextField
                                            id="adminuser"
                                            label="Admin user name"
                                            type="text"
                                            value={department.adminuser}
                                            onChange={handleDepartmentChange('adminuser')}
                                        />
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseProfileDialog} color="primary">
                                        Cancel
                                    </Button>
                                    <Button type="submit" color="primary">
                                        Submit
                                    </Button>
                                </DialogActions>
                            </form>
                        </Dialog>
                        {
                            fabs.map((fab, index) => (
                                <Zoom
                                key={fab.label}
                                in={value === index}
                                timeout={transitionDuration}
                                style={{
                                    transitionDelay: `${value === index ? transitionDuration.exit : 0}ms`,
                                }}
                                unmountOnExit
                                >
                                    <Tooltip title={fab.label}>
                                        <Fab aria-label={fab.label} onClick={handleOpenDialog} className={classes.fab} color={fab.color}>
                                            <Add/>
                                        </Fab>
                                    </Tooltip>
                                </Zoom>
                            ))
                        }
                        <footer>
                            <Paper square variant='outlined' className={classes.paper}>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    variant="fullWidth"
                                    indicatorColor="primary"
                                    textColor="primary"
                                >
                                    <Tab label="Manage Students" />
                                    <Tab label="Manage Teachers" />
                                    <Tab label="Manage Sections &amp; Events" />
                                    <Tab label="Manage Subjects" />
                                </Tabs>
                            </Paper>
                        </footer>
                    </div>
                )
                :
                (
                    <Backdrop open={loaded}>
                        <CircularProgress/>
                    </Backdrop>
                )
            }
        </>
    )
}