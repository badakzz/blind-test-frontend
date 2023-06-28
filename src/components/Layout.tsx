import React, { useEffect } from 'react'
import { Navbar, Nav, NavDropdown, Image } from 'react-bootstrap'
import { FaSignOutAlt, FaPlayCircle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { authActions, logoutUser } from '../store/authSlice'
import { User } from '../utils/types'
import Cookies from 'js-cookie'
import userEvent from '@testing-library/user-event'
import { AuthState } from '../store/authSlice'

type Props = {
    children?: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
    const dispatch = useDispatch()
    useEffect(() => {
        const token = Cookies.get(process.env.REACT_APP_JWT_COOKIE_NAME)
        if (token) {
            dispatch(authActions.storeToken({ token }))
        }

        // Load user data from localStorage
        let user = localStorage.getItem('user')
        if (user) {
            user = JSON.parse(user)
            dispatch(authActions.setUser(user))
        }
        console.log(user) // move the log here
    }, [dispatch])
    const user = useSelector((state: RootState) => state.auth) as AuthState

    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser() as any)
            Cookies.remove(process.env.REACT_APP_JWT_COOKIE_NAME) // Remove JWT cookie
            localStorage.removeItem('user') // Remove user from local storage
            navigate('/')
        } catch (error) {
            console.error(error)
        }
    }

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
                <Navbar.Brand as={Link} to="/">
                    <Image
                        src={imagePath}
                        width="80"
                        height="50"
                        className="d-inline-block align-top mr-2"
                        alt="Logo"
                    />
                    Blind Test
                </Navbar.Brand>
                <Nav.Link as={Link} to="/">
                    <FaPlayCircle className="mr-2" />
                    Play
                </Nav.Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    {user?.user ? (
                        <Nav className="me-auto">
                            <NavDropdown
                                title={user?.user.user_name}
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
                                <Nav.Link
                                    as={Link}
                                    to="/login"
                                    className="ml-1"
                                >
                                    Login
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    )}
                    {user.user && (
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
