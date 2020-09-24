import React from 'react';
import FourZeroFour from '../pages/fourZeroFour';
import HomePage from '../pages/homePage';
import Login from '../pages/login';
import Profile from '../pages/profile';
import Signup from '../pages/signup';
import TweetPage from '../pages/tweetPage';
import Test from '../components/test';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

export default function RoutingComponent(props) {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    {props.authToken === ""         ? 
                        <Redirect to="/login" />    : 
                        <HomePage 
                            username={props.username} 
                            authToken={props.authToken} 
                            handleLogout={props.handleLogout} 
                            resendQuery={props.resendQuery}
                            setResendQuery={props.setResendQuery}
                        />
                    }
                </Route>
                <Route path="/profiles/:username">
                    {props.authToken === ""         ?
                        <Redirect to="/login" />    :
                        <Profile 
                            username={props.username}
                            handleLogout={props.handleLogout}
                            resendQuery={props.resendQuery}
                            setResendQuery={props.setResendQuery}
                        />
                    }
                </Route>
                <Route path="/tweet/:id">
                    {props.authToken === ""         ?
                        <Redirect to="/login" />    :
                        <TweetPage 
                            username={props.username}
                            handleLogout={props.handleLogout}
                            resendQuery={props.resendQuery}
                            setResendQuery={props.setResendQuery}
                        />
                    }
                </Route>
                <Route path="/login">
                <Login 
                    setRefreshTokenObject={props.setRefreshTokenObject}
                    username={props.username}
                />
                </Route>
                <Route path="/signup">
                    <Signup authToken={props.authToken} setRefreshTokenObject={props.setRefreshTokenObject}/>
                </Route>
                <Route path="/test">
                    <Test />
                </Route>
                <Route path="*">
                    <FourZeroFour />
                </Route>
            </Switch>
        </Router>
    )
}