import React, { ReactNode, useEffect } from 'react'
import { Navbar, Container, Nav, NavDropdown, Image } from 'react-bootstrap'
import { FaSignOutAlt, FaPlayCircle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { User } from '../../utils/types'
import { useAuth } from '../hooks/useAuth'

type Props = {
    children?: ReactNode
    title?: string
    user?: User
}

const Layout: React.FC<Props> = ({ children }) => {
    const navigate = useNavigate()
    const handleLogout = async () => {
        await fetch('/api/v1/auth/logout', {
            method: 'POST',
        })
        navigate('/')

        // If you need to destroy the session on the client-side or navigate to another page, do it here.
        // For example, using Router.push("/") to navigate to the home page.
    }
    const { user, logout } = useAuth()
    const imagePath = `../../public/logo.png`

    return (
        <>
            <Navbar
                collapseOnSelect
                expand="lg"
                bg="light"
                variant="light"
                className="align-items-center justify-content-center text-center"
            >
                <Navbar.Brand to="/">
                    <Image
                        src={imagePath}
                        width="80"
                        height="50"
                        className="d-inline-block align-top mr-2"
                        alt="Logo"
                    />
                    Blind Test
                </Navbar.Brand>
                <Nav.Link to="/">
                    <FaPlayCircle className="mr-2" />
                    Play
                </Nav.Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    {user?.user_name ? (
                        <Nav className="me-auto">
                            <NavDropdown
                                title={user.user_name}
                                id="collasible-nav-dropdown"
                            >
                                <NavDropdown.Item to="#action/3.1">
                                    Settings
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={handleLogout}>
                                    Logout
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item to="#action/3.3">
                                    Upgrade plan
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    ) : (
                        <Nav>
                            <Nav.Item>
                                <Nav.Link to="/login" className="ml-1">
                                    Login
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    )}
                    {user && (
                        <Nav>
                            <FaSignOutAlt />
                            <Nav.Item>
                                <Nav.Link
                                    onClick={handleLogout}
                                    className="ml-1"
                                >
                                    Logout
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Navbar>
            {children}
        </>
    )
}

export default Layout
