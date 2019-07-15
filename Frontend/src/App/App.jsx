import React from 'react';
import { Router, Route, Link, Switch } from 'react-router-dom';


import { history, Role } from '@/_helpers';
import { authenticationService } from '@/_services';
import { PrivateRoute, Header } from '@/_components';
import { HomePage } from '@/Pages/HomePage';
import { AdminPage } from '@/Pages/AdminPage';
import { LoginPage } from '@/Pages/LoginPage';
import { SignupPage } from '@/Pages/SignupPage';
import { ProfilePage } from '@/Pages/ProfilePage';
import { WelcomePage} from '@/Pages/WelcomePage';
import { CreateProfilePage} from '@/Pages/CreateProfilePage';
import { DocumentsPage} from '@/Pages/DocumentsPage';
import { DashboardPage} from '@/Pages/DashboardPage';

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
                    <div className="body">
                      <div className="container">
                          <Switch>
                              <Route exact path="/" component={WelcomePage} />
                              <Route path="/login" component={LoginPage} />
                              <Route path='/signup' component={SignupPage} />
                              <PrivateRoute exact path="/dashboard" component={DashboardPage} />
                              <PrivateRoute path="/admin" roles={[Role.Admin]} component={AdminPage} />
                              <PrivateRoute path='/createprofile' component={CreateProfilePage}/>
                              <PrivateRoute path='/documents' component={DocumentsPage}/>
                              <PrivateRoute path='/myprofile'component={ProfilePage}/>
                              <Route path='/welcomepage' component={WelcomePage}/>
                          </Switch>
                      </div>
                    </div>
                </div>
            </Router>
        );
    }
}

export { App };
