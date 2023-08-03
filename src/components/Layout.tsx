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
                className="align-items-center justify-content-center text-center custom-navbar"
            >
                <Navbar.Brand
                    onClick={() => navigate('/')}
                    className="d-flex align-items-center justify-content-between text-black mx-5 px-3 py-0 gap-5"
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
                    className="d-flex mx-5 justify-content-between"
                >
                    {user?.user ? (
                        <Nav.Item
                            onClick={() => navigate('/chatroom')}
                            className="flex-grow text-black custom-spacing-icon"
                        >
                            <div className="d-flex align-items-center gap-3">
                                <FaPlayCircle />
                                Play
                            </div>
                        </Nav.Item>
                    ) : (
                        <Nav.Item
                            onClick={() => navigate('/signup')}
                            className="flex-grow ml-1 text-black"
                        >
                            Signup
                        </Nav.Item>
                    )}
                    {user?.user ? (
                        <Nav className="flex-grow me-auto text-black mr-5 ">
                            <NavDropdown
                                title={user?.user.username}
                                id="collasible-nav-dropdown"
                                className="text-black"
                            >
                                <NavDropdown.Item
                                    to="#action/3.1"
                                    className="text-black"
                                >
                                    Settings
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    onClick={handleLogout}
                                    className="text-black"
                                >
                                    Logout
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item
                                    onClick={() => navigate('/getpremium')}
                                    className="text-black"
                                >
                                    Upgrade plan
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    ) : (
                        <Nav className="flex-grow text-black mr-5">
                            <Nav.Item
                                onClick={() => navigate('/login')}
                                className="ml-1 text-black"
                            >
                                Login
                            </Nav.Item>
                        </Nav>
                    )}
                    <Nav.Item
                        onClick={() => navigate('/roadmap')}
                        className="flex-grow ml-1 text-black"
                    >
                        Roadmap
                    </Nav.Item>
                </Navbar.Collapse>
                {user.user ? (
                    <Nav.Item onClick={handleLogout} className="text-black">
                        <div className="d-flex align-items-center gap-3 mx-5">
                            <FaSignOutAlt className="mr-2" />
                            Logout
                        </div>
                    </Nav.Item>
                ) : (
                    <div className="d-flex gap-3 mx-5">
                        <></>
                        <></>
                    </div>
                )}
            </Navbar>
            {children}
        </>
    )
}

export default Layout
