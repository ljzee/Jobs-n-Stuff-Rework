import React from 'react';
import { Router, Route, Link } from 'react-router-dom';


import { history, Role } from '@/_helpers';
import { authenticationService } from '@/_services';
import { PrivateRoute, Header } from '@/_components';
import { HomePage } from '@/Pages/HomePage';
import { AdminPage } from '@/Pages/AdminPage';
import { LoginPage } from '@/Pages/LoginPage';
import { SignupPage } from '@/Pages/SignupPage';


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null,
            isAdmin: false
        };
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({
            currentUser: x,
            isAdmin: x && x.role === Role.Admin
        }));
    }

    logout() {
        authenticationService.logout();
        history.push('/login');
    }

    render() {
        const { currentUser, isAdmin } = this.state;
        return (
            <Router history={history}>
                <div>
                    <Header/>
                    <div className="jumbotron">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6 offset-md-3">
                                    <PrivateRoute exact path="/" component={HomePage} />
                                    <PrivateRoute path="/admin" roles={[Role.Admin]} component={AdminPage} />
                                    <Route path="/login" component={LoginPage} />
                                    <Route path='/signup' component={SignupPage} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Router>
        );
    }
}

export { App };
