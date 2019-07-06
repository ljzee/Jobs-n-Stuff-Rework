import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {Link} from 'react-router-dom';

import { authenticationService } from '@/_services';



class WelcomePage extends React.Component {
    constructor(props) {
        super(props);

        // redirect to home if already logged in
        if (authenticationService.currentUserValue) {
            this.props.history.push('/');
        }
    }


    render() {
        return (
          <div>
          </div>
        )
    }
}

export { WelcomePage };
