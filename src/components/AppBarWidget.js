import React from 'react';
import {AppBar, Toolbar, Typography, useScrollTrigger, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {Event, AccountCircle} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {hostname} from '../links';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    appbar: {
        ...theme.appbar,
    },
    brand: {
        flexGrow: 1,
        display: 'contents',
    },
    icons: {
        flexGrow: 1,
    },
    icon: {
        float: 'right',
    }
}))

function ElevationScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export default function AppBarWidget(props) {
    const classes = useStyles();
    let loggedIn = localStorage.getItem('isAuthenticated') === 'true';
    let userType = localStorage.getItem('usertype')
    let emailid = localStorage.getItem('emailid')

    const [passwordDetails, setPasswordDetails] = React.useState({
        oldpassword: '',
        newpassword: '',
        // newpasswordconfirm: '',
    })
    const handleChange = (prop) => (event) => {
        setPasswordDetails({
            ...passwordDetails,
            [prop]: event.target.value
        })
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

    //Logout
    const logout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('atoken');
        localStorage.removeItem('emailid')
        localStorage.removeItem('userDetails')
        window.location.replace(window.location.origin + '/#/');
    }

    // Profile dialog stuff
    const [openProfileDialog, setOpenProfileDialog] = React.useState(false);
    const handleOpenProfileDialog = () => {
        setOpenProfileDialog(true)
    }
    const handleCloseProfileDialog = () => {
        setOpenProfileDialog(false)
    }
    const profileSubmit = (event) => {
        event.preventDefault()
        axios.put(hostname + '/' + userType + '/login', {
            emailid: emailid,
            oldpassword: passwordDetails.oldpassword,
            newpassword: passwordDetails.newpassword,
        },{
            headers: {
                "x-auth-token": localStorage.getItem('atoken')
            }
        })
        .then(res => {
            if(res.data.ok) {
                window.location.reload()
            }
            else {
                console.error(res.data.msg)
            }
        })
        .catch(err => {
            console.error(err)
        })
    }   
    return(
        <div className={classes.root}>
            <ElevationScroll {...props}>
                <AppBar className={classes.appbar}>
                    <Toolbar>
                        <div className={classes.brand}>
                            <Link to={loggedIn?'/user':'/'} style={{display: 'contents', textDecoration: 'none', color: 'black'}}>
                                <div style={{display: 'contents'}}>
                                    <img src={process.env.PUBLIC_URL + '/rvce.png'} alt='RVCE logo' height="50px"/>
                                    <Typography variant="h6"> Classroom</Typography>
                                </div>
                            </Link>
                        </div>
                        <div className={classes.icons}>
                            <IconButton
                                onClick={handleMenu}
                                className={classes.icon}
                            >
                                <AccountCircle />
                            </IconButton>
                            <Link to='/calendar' className={classes.icon}>
                                <IconButton>
                                    <Event/>
                                </IconButton>
                            </Link>
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
                                <MenuItem onClick={handleOpenProfileDialog}>Change password</MenuItem>
                                <MenuItem onClick={logout}>Logout</MenuItem>
                            </Menu>
                            <Dialog open={openProfileDialog} onClose={handleCloseProfileDialog}>
                                <DialogTitle>Change Password</DialogTitle>
                                <form onSubmit={profileSubmit}>
                                    <DialogContent>
                                        <div className={classes.fields}>
                                            <TextField
                                                id="oldpassword"
                                                label="Old password"
                                                type="password"
                                                value={passwordDetails.oldpassword}
                                                onChange={handleChange('oldpassword')}
                                            />
                                        </div>
                                        <div className={classes.fields}>
                                            <TextField
                                                id="newpassword"
                                                label="New password"
                                                type="password"
                                                value={passwordDetails.newpassword}
                                                onChange={handleChange('newpassword')}
                                            />
                                        </div>
                                        {/* <div className={classes.fields}>
                                            <TextField
                                                id="newpasswordconfirm"
                                                label="Confirm new password"
                                                type="password"
                                                value={passwordDetails.newpasswordconfirm}
                                                onChange={handleChange('newpasswordconfirm')}
                                            />
                                        </div> */}
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
                        </div>
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
        </div>
    )
}