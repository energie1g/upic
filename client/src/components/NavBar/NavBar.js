import React from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
import axios from 'axios';
import { NavLink as RRNavLink } from 'react-router-dom';
import Logo from './Logo/Logo';
import { IoIosAddCircleOutline, IoMdLogOut } from 'react-icons/io';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            jwt_token: props.cookies.get('jwt')
                ? props.cookies.get('jwt').split(' ')[0]
                : null,
            user_id: props.cookies.get('jwt')
                ? props.cookies.get('jwt').split(' ')[1]
                : null,
            loggenIn: false
        };
    }

    componentDidMount() {
        let loggenIn = this.state.jwt_token ? true : false;
        this.setState({ loggenIn });
    }

    toggle = () => {
        const isOpen = this.state.isOpen;
        this.setState({ isOpen: !isOpen });
    };

    logOut = async () => {
        try {
            const logout = await axios({
                method: 'GET',
                url: '/api/v1/users/logout',
                withCredentials: true
            });

            if (logout.data.status === 'success') window.location.assign('/');
        } catch (error) {}
    };

    styleDec = {
        border: '1px solid black'
    };

    render() {
        return (
            <div>
                <Navbar color="faded" light expand="md">
                    <NavbarBrand
                        tag={RRNavLink}
                        exact
                        to="/"
                        activeClassName="active"
                    >
                        <Logo />
                    </NavbarBrand>
                    {this.state.loggenIn ? (
                        <>
                            <NavbarToggler onClick={this.toggle} />
                            <Collapse isOpen={this.state.isOpen} navbar>
                                <Nav className="ml-auto" navbar>
                                    <NavItem>
                                        <NavLink
                                            tag={RRNavLink}
                                            exact
                                            to="/upload"
                                        >
                                            <IoIosAddCircleOutline /> Upload
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            tag={RRNavLink}
                                            exact
                                            to={`/users/${this.state.user_id}`}
                                        >
                                            Compte
                                        </NavLink>
                                    </NavItem>
                                    <NavItem
                                        style={{ cursor: 'pointer' }}
                                        onClick={this.logOut}
                                    >
                                        <NavLink>
                                            <IoMdLogOut /> Déconnexion
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </Collapse>
                        </>
                    ) : null}
                </Navbar>
            </div>
        );
    }
}

export default NavBar;
