import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { Home } from '../components'
import store from '../store'
import { createMemoryHistory } from 'history'
import { Router as CustomRouter } from 'react-router-dom'
import axios from 'axios'

jest.mock('../api', () => {
    const originalModule = jest.requireActual('../api')

    return {
        __esModule: true, // this property makes it work
        ...originalModule,
        default: {
            interceptors: originalModule.default.interceptors,
            baseURL: originalModule.default.baseURL,
            post: jest.fn((url) => {
                switch (url) {
                    case `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/auth/login`:
                        return Promise.resolve({
                            status: 200,
                            data: {
                                user: {
                                    /* your user data here */
                                },
                            },
                        })
                    case `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/auth/signup`:
                        // Return whatever you want here
                        break
                    // Add more cases for other endpoints
                    default:
                        throw new Error(`Unhandled request to ${url}`)
                }
            }),
            get: jest.fn((url) => {
                switch (url) {
                    case `${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/auth/csrf`:
                        return Promise.resolve({
                            // your CSRF response here
                        })
                    // Add more cases for other endpoints
                    default:
                        throw new Error(`Unhandled request to ${url}`)
                }
            }),
        },
    }
})

// store.dispatch({
//     type: 'auth/setUser',
//     payload: { user: null },
// })

it('renders correctly for guest users', () => {
    render(
        <Provider store={store}>
            <Router>
                <Home />
            </Router>
        </Provider>
    )
    screen.debug()
    expect(
        screen.getByText(
            'Play Blind-Test with your friends using Spotify playlist!'
        )
    ).toBeInTheDocument()
    expect(
        screen.getByText(
            'Welcome to our Blind-Test game! In order to play, you will need to log in first. After that, create a game and start inviting your friends!'
        )
    ).toBeInTheDocument()

    expect(screen.getByText('Already have an account?')).toBeInTheDocument()
    expect(screen.getByText('Log in')).toBeInTheDocument()
    expect(screen.getByText('Not a member?')).toBeInTheDocument()
    expect(screen.getByText('Sign up')).toBeInTheDocument()
    expect(
        screen.getByText(
            'Bored of using the same playlists over and over again? For 5€, unlock the premium membership for life, and start browsing to Spotify, select and play with any playlist you want!'
        )
    ).toBeInTheDocument()
    expect(screen.getByText('Support us!')).toBeInTheDocument()

    const playButton = screen.getByRole('button', { name: /play/i })
    expect(playButton).toBeInTheDocument()

    const getPremiumButton = screen.getByRole('button', {
        name: /get premium/i,
    })
    expect(getPremiumButton).toBeInTheDocument()
})

// store.dispatch({
//     type: 'auth/setUser',
//     payload: { user: { permissions: 1 } },
// })

// it('renders correctly for authenticated users', () => {
//     render(
//         <Provider store={store}>
//             <Router>
//                 <Home />
//             </Router>
//         </Provider>
//     )

//     expect(
//         screen.queryByText('Already have an account?')
//     ).not.toBeInTheDocument()
//     expect(screen.queryByText('Log in')).not.toBeInTheDocument()
//     expect(screen.queryByText('Not a member?')).not.toBeInTheDocument()
//     expect(screen.queryByText('Sign up')).not.toBeInTheDocument()
//     expect(
//         screen.getByText(
//             'Bored of using the same playlists over and over again? For 5€, unlock the premium membership for life, and start browsing to Spotify, select and play with any playlist you want!'
//         )
//     ).toBeInTheDocument()
//     expect(screen.getByText('Support us!')).toBeInTheDocument()
// })

// Mocking the state to simulate a premium user
// store.dispatch({
//     type: 'auth/setUser',
//     payload: { user: { permissions: 2 } },
// })

// it('renders correctly for premium users', () => {
//     render(
//         <Provider store={store}>
//             <Router>
//                 <Home />
//             </Router>
//         </Provider>
//     )

//     expect(screen.getByText('Thank you for supporting us!')).toBeInTheDocument()
//     expect(
//         screen.getByText(
//             'You will now have access to the all the Spotify playlists you want in your games, enjoy!'
//         )
//     ).toBeInTheDocument()
//     expect(screen.queryByText('Support us!')).not.toBeInTheDocument() // should not exist for premium users
//     expect(
//         screen.queryByText(
//             'Bored of using the same playlists over and over again? For 5€, unlock the premium membership for life, and start browsing to Spotify, select and play with any playlist you want!'
//         )
//     ).not.toBeInTheDocument() // should not exist for premium users
//     const getPremiumButton = screen.getByRole('button', {
//         name: /get premium/i,
//     })
//     expect(getPremiumButton).not.toBeInTheDocument()
// })

// it('navigates correctly on button clicks', () => {
//     const history = createMemoryHistory()
//     render(
//         <Provider store={store}>
//             {/* @ts-ignore */}
//             <CustomRouter history={history}>
//                 <Home />
//             </CustomRouter>
//         </Provider>
//     )

//     fireEvent.click(screen.getByText('Play'))
//     expect(history.location.pathname).toBe('/chatroom')

//     fireEvent.click(screen.getByText('Get premium'))
//     expect(history.location.pathname).toBe('/getpremium')
// })
