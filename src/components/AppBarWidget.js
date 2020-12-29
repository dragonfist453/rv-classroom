import React from 'react';
import {AppBar, Toolbar, Typography, useScrollTrigger, IconButton} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {Event, Menu} from '@material-ui/icons';
import { Link } from 'react-router-dom';

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
    return(
        <div className={classes.root}>
            <ElevationScroll {...props}>
                <AppBar className={classes.appbar}>
                    <Toolbar>
                        <div className={classes.brand}>
                            <IconButton>
                                <Menu/>
                            </IconButton>
                            <Link to={loggedIn?'/user':'/'} style={{display: 'contents', textDecoration: 'none', color: 'black'}}>
                                <div style={{display: 'contents'}}>
                                    <img src={process.env.PUBLIC_URL + '/rvce.png'} alt='RVCE logo' height="50px"/>
                                    <Typography variant="h6"> Classroom</Typography>
                                </div>
                            </Link>
                        </div>
                        <div className={classes.icons}>
                            <Link to='/calendar' className={classes.icon}>
                                <IconButton>
                                    <Event/>
                                </IconButton>
                            </Link>
                        </div>
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
        </div>
    )
}