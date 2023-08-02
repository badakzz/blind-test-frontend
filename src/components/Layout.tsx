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
                    as={Link}
                    to="/"
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
                    <Nav.Link
                        as={Link}
                        to="/chatroom"
                        className="flex-grow text-black hover-green custom-spacing-icon"
                    >
                        {user?.user ? (
                            <div className="d-flex align-items-center gap-3">
                                <FaPlayCircle />
                                Play
                            </div>
                        ) : (
                            <Nav.Item>
                                <Nav.Link
                                    as={Link}
                                    to="/signup"
                                    className="ml-1 text-black hover-green"
                                >
                                    Signup
                                </Nav.Link>
                            </Nav.Item>
                        )}
                    </Nav.Link>
                    {user?.user ? (
                        <Nav className="flex-grow me-auto text-black mr-5 ">
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
                        <Nav className="flex-grow text-black mr-5">
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
                    <Nav.Link
                        as={Link}
                        to="/roadmap"
                        className="flex-grow ml-1 text-black hover-green"
                    >
                        Roadmap
                    </Nav.Link>
                </Navbar.Collapse>
                {user.user ? (
                    <Nav.Link
                        onClick={handleLogout}
                        className="text-black hover-green"
                    >
                        <div className="d-flex align-items-center gap-3 mx-5">
                            <FaSignOutAlt className="mr-2" />
                            Logout
                        </div>
                    </Nav.Link>
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
