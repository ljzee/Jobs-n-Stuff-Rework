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
import { PageNotFound} from '@/Pages/PageNotFound';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null,
        };
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({
            currentUser: x,
        }));
    }

    render() {
        const { currentUser } = this.state;
        return (
            <Router history={history}>
                <div>
                    <Header currentUser={currentUser}/>
                    <div className="body">
                      <div className="container">
                          <Switch>
                              <Route exact path="/" component={WelcomePage} />
                              <Route path="/login" component={LoginPage} />
                              <Route path='/signup' component={SignupPage} />
                              <PrivateRoute exact path="/dashboard" component={DashboardPage} />
                              <PrivateRoute path='/createprofile' component={CreateProfilePage}/>
                              <PrivateRoute path='/documents' component={DocumentsPage}/>
                              <PrivateRoute path='/myprofile'component={ProfilePage}/>
                              <Route component={PageNotFound}/>
                          </Switch>
                      </div>
                    </div>
                </div>
            </Router>
        );
    }
}

//<PrivateRoute path="/admin" roles={[Role.Admin]} component={AdminPage} />

export { App };
