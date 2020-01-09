import React from 'react';
import { Redirect } from 'react-router-dom';
import {
    Button,
    Form,
    Grid,
    Header,
    Image,
    Message,
    Segment
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../../../assets/img/logo.png';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            redirectToMain: false,
            loading: false,
            errorMessage: null,
            jwt_token: props.cookies.get('jwt')
                ? props.cookies.get('jwt').split(' ')[0]
                : null,
            user_id: props.cookies.get('jwt')
                ? props.cookies.get('jwt').split(' ')[1]
                : null
        };
    }

    componentDidMount() {
        if (this.state.jwt_token) {
            this.setState({ redirectToMain: true });
        } else {
            this.setState({ redirectToMain: false });
        }
    }

    login = async e => {
        e.preventDefault();
        const email = this.state.email;
        const password = this.state.password;
        let loading = true;
        let errorMessage = null;
        this.setState({ loading });

        try {
            const res = await axios({
                method: 'POST',
                url: '/api/v1/users/login',
                data: {
                    email,
                    password
                },
                withCredentials: true
            });
            console.log(res);
            if (res && res.data && res.data.status === 'success') {
                loading = false;
                window.location.assign('/');
            }
        } catch (err) {
            loading = false;
            errorMessage = err.response
                ? err.response.data.message
                : 'Le serveur est en panne, veuillez réessayer ulterieurement.';
        }

        this.setState({
            loading,
            errorMessage
        });
    };

    emailHandler = e => {
        const email = e.target.value;
        this.setState({ email });
    };

    passwordHandler = e => {
        const password = e.target.value;
        this.setState({ password });
    };

    render() {
        return !this.state.redirectToMain ? (
            <Grid
                textAlign="center"
                style={{ height: '100vh' }}
                verticalAlign="middle"
            >
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header
                        as="h2"
                        style={{ color: '#083B66' }}
                        textAlign="center"
                    >
                        <Image src={logo} /> Se connecter à votre compte
                    </Header>
                    <Form
                        size="large"
                        loading={this.state.loading}
                        error={this.state.errorMessage ? true : false}
                    >
                        <Segment stacked>
                            <Form.Input
                                fluid
                                icon="mail"
                                iconPosition="left"
                                placeholder="E-mail"
                                onChange={this.emailHandler}
                                value={this.state.email}
                            />

                            <Form.Input
                                fluid
                                icon="lock"
                                iconPosition="left"
                                placeholder="Mot de passe"
                                type="password"
                                onChange={this.passwordHandler}
                                value={this.state.password}
                            />

                            <Message
                                error
                                header="Action Interdite"
                                content={this.state.errorMessage}
                            />

                            <Button
                                onClick={this.login}
                                color="teal"
                                fluid
                                size="large"
                            >
                                Se connecter
                            </Button>
                        </Segment>
                    </Form>
                    <Message>
                        Nouveau ici? &nbsp;{' '}
                        <Link to="/register">S'enregistrer</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        ) : (
            <Redirect to="/" />
        );
    }
}

export default Login;
