import React, { useEffect } from 'react'
import { Navbar, Nav, NavDropdown, Image } from 'react-bootstrap'
import { FaSignOutAlt, FaPlayCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { logoutUser } from '../store/authSlice'
import { AuthState } from '../store/authSlice'
import logo from '../logo.png'
import '../App.css'
import { useToast } from '../utils/hooks'

type Props = {
    children?: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.auth) as AuthState

    const navigate = useNavigate()
    const { showToast } = useToast()

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser() as any)
        } catch (error) {
            showToast({ message: error })
        }
    }

    useEffect(() => {
        if (!user) navigate('/')
    })

    const isLoggedIn = user.user && user.user.permissions !== 0
    const isGuest = user.user && user.user.permissions === 0
    const isLoggedInAndNotPremium = user.user && user.user.permissions === 2

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
                    {(isLoggedIn || isGuest) && (
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
                    {isLoggedIn && (
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
                            <Nav.Item
                                onClick={handleLogout}
                                className="text-black logout-option"
                            >
                                Logout
                            </Nav.Item>
                            <NavDropdown.Divider />
                            {isLoggedInAndNotPremium && (
                                <NavDropdown.Item
                                    onClick={() => navigate('/getpremium')}
                                    className="text-black nav-item"
                                >
                                    Upgrade plan
                                </NavDropdown.Item>
                            )}
                        </NavDropdown>
                    )}
                    {isLoggedIn && (
                        <Nav className="d-lg-none flex-grow text-black mr-5">
                            <Nav.Item
                                onClick={() => navigate('/settings')}
                                className="text-black nav-item"
                            >
                                Settings
                            </Nav.Item>
                            {isLoggedInAndNotPremium && (
                                <Nav.Item
                                    onClick={() => navigate('/getpremium')}
                                    className="text-black nav-item"
                                >
                                    Upgrade plan
                                </Nav.Item>
                            )}
                        </Nav>
                    )}
                    {(!isLoggedIn || isGuest) && (
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
                    {isLoggedIn ? (
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
