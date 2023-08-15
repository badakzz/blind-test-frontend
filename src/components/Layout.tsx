import React, { useEffect } from 'react'
import { Navbar, Nav, NavDropdown, Image } from 'react-bootstrap'
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
                className="text-center custom-navbar"
            >
                <Navbar.Brand
                    onClick={() => navigate('/')}
                    className="d-flex align-items-center justify-content-between text-black py-0 gap-3 custom-navbrand mr-5"
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
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse
                    id="responsive-navbar-nav"
                    className="justify-content-between custom-collapse"
                >
                    {user.user && (
                        <div className="d-flex align-items-center gap-5 flex-grow text-black custom-spacing-icon">
                            <Nav.Item
                                onClick={() => navigate('/chatroom')}
                                className="d-none d-lg-flex align-items-center gap-3"
                            >
                                <FaPlayCircle />
                                Play
                            </Nav.Item>
                        </div>
                    )}
                    {user && user.user && (
                        <NavDropdown
                            title={user?.user?.username}
                            id="collasible-nav-dropdown"
                            className="text-black nav-item d-none d-lg-block"
                        >
                            <NavDropdown.Item
                                onClick={() => navigate('/settings')}
                                className="text-black nav-item"
                            >
                                Settings
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            {user && user.user && (
                                <Nav.Item
                                    onClick={handleLogout}
                                    className="text-black logout-option"
                                >
                                    Logout
                                </Nav.Item>
                            )}
                            <NavDropdown.Divider />
                            {user && user.user?.permissions !== 2 && (
                                <NavDropdown.Item
                                    onClick={() => navigate('/getpremium')}
                                    className="text-black nav-item"
                                >
                                    Upgrade plan
                                </NavDropdown.Item>
                            )}
                        </NavDropdown>
                    )}
                    {user && user.user ? (
                        <Nav className="d-lg-none flex-grow text-black mr-5">
                            <Nav.Item
                                onClick={() => navigate('/settings')}
                                className="text-black nav-item"
                            >
                                Settings
                            </Nav.Item>
                            {user && user.user?.permissions !== 2 && (
                                <Nav.Item
                                    onClick={() => navigate('/getpremium')}
                                    className="text-black nav-item"
                                >
                                    Upgrade plan
                                </Nav.Item>
                            )}
                        </Nav>
                    ) : (
                        <>
                            <Nav.Item
                                onClick={() => navigate('/signup')}
                                className="flex-grow ml-1 text-black"
                            >
                                Signup
                            </Nav.Item>
                            <Nav className="text-black mr-5">
                                <Nav.Item
                                    onClick={() => navigate('/login')}
                                    className="ml-1 text-black"
                                >
                                    Login
                                </Nav.Item>
                            </Nav>
                        </>
                    )}
                    <Nav.Item
                        onClick={() => navigate('/roadmap')}
                        className="flex-grow ml-1 text-black"
                    >
                        Roadmap
                    </Nav.Item>
                    {user.user ? (
                        <Nav.Item onClick={handleLogout} className="text-black">
                            <div className="logout-group">
                                <FaSignOutAlt className="mr-2 logout-icon" />
                                Logout
                            </div>
                        </Nav.Item>
                    ) : (
                        <div className="d-flex gap-3 mx-5">
                            <></>
                            <></>
                        </div>
                    )}
                </Navbar.Collapse>
            </Navbar>
            {children}
        </>
    )
}

export default Layout
