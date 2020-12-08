import React from 'react';
import './App.css';
import {ThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import { Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UserPage from './pages/UserPage';
import AdminLandingPage from './pages/AdminLandingPage';
import AppBarWidget from './components/AppBarWidget';

const theme = createMuiTheme({
  body: {
    backgroundColor: '#FFFFFF',
  },
  appbar: {
    backgroundColor: '#FFFFFF',
    color: '#111111',
    borderBottom: '.0625rem solid #e0e0e0',
  },
  link: {
    textDecoration: 'none',
  },
  primaryColor: {
    color: '#1a73e8',
  },
  page: {
    paddingTop: 100,
  },
});

function App() {
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Route exact path='/'>
          <LandingPage/>
        </Route>
        <Route exact path='/admin'>
          <AdminLandingPage/>
        </Route>
        <Route path='/user'>
          <AppBarWidget/>
          <UserPage/>
        </Route>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;