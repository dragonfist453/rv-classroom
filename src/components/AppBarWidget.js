import React from 'react';
import {AppBar, Toolbar, Typography, useScrollTrigger, IconButton} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {Menu} from '@material-ui/icons';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    appbar: theme.appbar,
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
        <React.Fragment>
            <ElevationScroll {...props}>
                <AppBar className={classes.appbar}>
                    <Toolbar>
                        {/*Change this stuff for putting stuff into appbar*/}
                        <IconButton>
                            <Menu/>
                        </IconButton>
                        <Link to={loggedIn?'/user':'/'} style={{display: 'contents', textDecoration: 'none', color: 'black'}}>
                            <div style={{display: 'contents'}}>
                                <img src={process.env.PUBLIC_URL + '/rvce.png'} alt='RVCE logo' height="50px"/>
                                <Typography variant="h6"> Classroom</Typography>
                            </div>
                        </Link>
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
        </React.Fragment>
    )
}