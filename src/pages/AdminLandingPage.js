import React, {useState} from 'react';
import {Paper, Typography, Container, TextField, InputAdornment, IconButton, Snackbar, Backdrop, CircularProgress, Button, } from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import {Visibility, VisibilityOff} from '@material-ui/icons';
import {makeStyles} from '@material-ui/core/styles';
import {hostname} from '../links';
import axios from 'axios';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paper: {
        padding: theme.spacing(8),
    },
    img: {
        display: 'block',
        margin: 'auto',
        padding: theme.spacing(2),
    },
    backdrop: {
        zIndex: 100,
        color: '#fff',
    },
    button: {
        textTransform: 'inherit'
    },
    nextButton: {
        float: 'right',
        backgroundColor: theme.primaryColor.color,
        color: '#fff',
    },
    registerButton: {
        float: 'left',
        ...theme.primaryColor,
    },
    link: theme.link,
}))

export default function LandingPage() {
    const classes = useStyles();

    //Values for form
    const [values, setValues] = useState({
        username: "",
        password: "",
        usernameValid: true,
        passwordValid: true,
        showPassword: false,
        authFail: false,
        networkError: false,
        incorrectInfo: false,
    })

    //Backdrop state
    const [backdrop, setBackdrop] = React.useState(false)

    function validateValues(prop, value) {
        if (prop === "username") {
          const re = /^[A-Za-z0-9 ]+$/;
          return re.test(String(value).toLowerCase());
        } else {
          const re = /^.{8,}$/;
          return re.test(String(value).toLowerCase());
        }
      }
    
    // Handle changes on text and updates value
    const handleChange = (prop) => (event) => {
        setValues({
            ...values,
            [prop]: event.target.value,
            [prop + "Valid"]: validateValues(prop, event.target.value),
        });
    };

    const onSubmitSignIn = async (event) => {
    setBackdrop(true)
    if(values.usernameValid && values.passwordValid){
        try{
            const res = await axios.post(hostname + "/auth/admin/login", {
                adminuser: values.username,
                adminpass: values.password
            })
            if(res.data.ok === true && res.data.auth === true) {
                localStorage.setItem('admintoken', res.data.token)
                localStorage.setItem('adminuser', values.username)
                localStorage.setItem('isAdminAuthenticated', true)
                window.location.replace(window.location.origin + '/#/admin/manage')
            }
            else {
                setValues({...values, authFail: true})
                setBackdrop(false)
            }
        }
        catch(err){
        console.log(`Axios request failed: ${err}`)
        if(err.status === 401){
            setValues({...values, authFail: true})
            setBackdrop(false)
        }
        else {
            setValues({...values, networkError: true})
            setBackdrop(false)
        }
        }
    }
    else{
        setValues({
        ...values,
        incorrectInfo: !values.usernameValid && !values.passwordValid,
        })
        setBackdrop(false)
    }
    };

    // Handling show and hide password
    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    // So that the usual mouse down activity doesn't happen
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // Handle closing of snackbars
    const handleClose = (prop) => (event, reason) => {
        if(reason === 'clickaway')
            return;
        setValues({...values, [prop]:false})
    }
    return(
        <Container className={classes.root} maxWidth='md'>
            <Paper variant="outlined" className={classes.paper}>
                <img src={process.env.PUBLIC_URL + '/rvocms.png'} alt='RV OCMS logo' height='200px' className={classes.img}/>
                <Typography variant='h4' style={{textAlign: 'center'}}>Admin login</Typography>
                <br/>
                <div>
                    <TextField
                        id="username"
                        label="Username"
                        type="text"
                        placeholder="Enter your Username"
                        variant="outlined"
                        fullWidth
                        error={!values.usernameValid}
                        onChange={handleChange("username")}
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </div>
                <br />
                <div>
                    <TextField
                        id="standard-adornment-password"
                        label="Password"
                        placeholder="Enter your password"
                        error={!values.passwordValid}
                        InputLabelProps={{
                            shrink: true
                        }}
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                >
                                {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            )
                        }}
                        fullWidth
                        type={values.showPassword ? "text" : "password"}
                        value={values.password}
                        variant="outlined"
                        onChange={handleChange("password")}
                    />
                </div>
                <br/>
                <Snackbar open={values.incorrectInfo} autoHideDuration={6000} onClose={handleClose('incorrectInfo')}>
                    <Alert elevation={6} variant="filled" onClose={handleClose('incorrectInfo')} severity="error">Incorrect Information entered</Alert>
                </Snackbar>
                <Snackbar open={values.authFail} autoHideDuration={6000} onClose={handleClose('authFail')}>
                    <Alert elevation={6} variant="filled" onClose={handleClose('authFail')} severity="error">Invalid username or password</Alert>
                </Snackbar>
                <Snackbar open={values.networkError} autoHideDuration={6000} onClose={handleClose('networkError')}>
                    <Alert elevation={6} variant="filled" onClose={handleClose('networkError')} severity="error">Failed connecting to server</Alert>
                </Snackbar>
                <Backdrop className={classes.backdrop} open={backdrop}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <div>
                    <Button variant='contained' className={clsx(classes.nextButton, classes.button)} onClick={onSubmitSignIn}>
                        Submit
                    </Button>
                </div>
            </Paper>
        </Container>
    )
}