import React, { useEffect } from 'react'
import { Navbar, Container, Nav, NavDropdown, Image } from 'react-bootstrap'
import { FaSignOutAlt, FaPlayCircle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { logoutUser } from '../store/authSlice'
import { AuthState } from '../store/authSlice'
import logo from '../logo.png'
import '../App.css'

type Props = {
    children?: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.auth) as AuthState
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser() as any)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (!user) navigate('/')
    })

    return (
        <>
            <Navbar
                collapseOnSelect
                expand="lg"
                className="align-items-center justify-content-center text-center custom-navbar"
            >
                <Navbar.Brand
                    as={Link}
                    to="/"
                    className="d-flex align-items-center text-black mr-5 py-0"
                >
                    <Image
                        src={logo}
                        width="80"
                        height="80"
                        className="d-inline-block align-top mr-2"
                        alt="Logo"
                    />
                    <span className="d-none d-lg-inline-block">Blind Test</span>
                </Navbar.Brand>

                <Nav.Link
                    as={Link}
                    to="/"
                    className="text-black mr-5 hover-green custom-spacing-icon"
                >
                    <FaPlayCircle className="mr-3" />
                    Play
                </Nav.Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    {user?.user ? (
                        <Nav className="me-auto text-black">
                            <NavDropdown
                                title={user?.user.username}
                                id="collasible-nav-dropdown"
                                className="text-black hover-green"
                            >
                                <NavDropdown.Item
                                    to="#action/3.1"
                                    className="text-black hover-green"
                                >
                                    Settings
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    onClick={handleLogout}
                                    className="text-black hover-green"
                                >
                                    Logout
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item
                                    to="#action/3.3"
                                    className="text-black hover-green"
                                >
                                    Upgrade plan
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    ) : (
                        <Nav className="text-black mr-5">
                            <Nav.Item>
                                <Nav.Link
                                    as={Link}
                                    to="/login"
                                    className="ml-1 text-black hover-green"
                                >
                                    Login
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    )}
                    {user.user && (
                        <Nav className="text-black">
                            <Nav.Item>
                                <Nav.Link
                                    onClick={handleLogout}
                                    className="ml-1 text-black hover-green"
                                >
                                    <FaSignOutAlt className="mr-2" />
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
