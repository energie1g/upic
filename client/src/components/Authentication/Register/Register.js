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
import axios from 'axios';
import { Link } from 'react-router-dom';
import logo from '../../../assets/img/logo.png';

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            nom: '',
            passwordR: '',
            redirectToMain: false,
            loading: false,
            errorMessage: '',
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

    register = async e => {
        e.preventDefault();
        const email = this.state.email;
        const password = this.state.password;
        const passwordR = this.state.passwordR;
        const nom = this.state.nom;

        let loading = true;
        let errorMessage = '';
        this.setState({ loading });

        try {
            const res = await axios({
                method: 'POST',
                //127.0.0.1
                url: '/api/v1/users/signup',
                data: {
                    nom,
                    email,
                    password,
                    confirmPassword: passwordR,
                    // localhost
                    photo: '/uploads/unknown.png'
                },
                withCredentials: true
            });

            if (res && res.data && res.data.status === 'success') {
                loading = false;
                window.location.assign('/');
            }
        } catch (err) {
            loading = false;
            let messages = [];
            if (err.response) {
                messages = Object.values(err.response.data.message.errors);
                messages.forEach(el => (errorMessage += el.message + '. '));
            } else {
                errorMessage =
                    'Le serveur est en panne, veuillez réessayer ulterieurement.';
            }
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

    passwordRHandler = e => {
        const passwordR = e.target.value;
        this.setState({ passwordR });
    };

    nomHandler = e => {
        const nom = e.target.value;
        this.setState({ nom });
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
                        <Image src={logo} /> Créer un nouveau compte
                    </Header>
                    <Form
                        size="large"
                        loading={this.state.loading}
                        error={this.state.errorMessage ? true : false}
                    >
                        <Segment stacked>
                            <Form.Input
                                fluid
                                icon="user"
                                iconPosition="left"
                                placeholder="Nom"
                                onChange={this.nomHandler}
                                value={this.state.nom}
                            />

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
                            <Form.Input
                                fluid
                                icon="lock"
                                iconPosition="left"
                                placeholder="Répéter le mot de passe"
                                type="password"
                                onChange={this.passwordRHandler}
                                value={this.state.passwordR}
                            />
                            <Message
                                error
                                header="Action Interdite"
                                content={
                                    this.state.errorMessage.length === 0
                                        ? ' '
                                        : this.state.errorMessage
                                }
                            />

                            <Button
                                onClick={this.register}
                                color="teal"
                                fluid
                                size="large"
                            >
                                S'enregistrer
                            </Button>
                        </Segment>
                    </Form>
                    <Message>
                        Déjà membre? &nbsp;{' '}
                        <Link to="/login">Se connecter</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        ) : (
            <Redirect to="/" />
        );
    }
}

export default Register;
