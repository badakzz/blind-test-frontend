import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Home } from '../components'
import { useNavigate, BrowserRouter as Router } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../store/authSlice'
import csrfReducer from '../store/csrfSlice'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}))

const renderWithStore = (ui, initialState) => {
    const store = configureStore({
        reducer: {
            auth: authReducer,
            csrf: csrfReducer,
        },
        preloadedState: initialState,
    })

    return render(
        <Provider store={store}>
            <Router>{ui}</Router>
        </Provider>
    )
}

describe('Integration tests on homepage', () => {
    let navigate: jest.Mock

    beforeEach(() => {
        navigate = jest.fn()
        ;(useNavigate as jest.Mock).mockReturnValue(navigate)
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('renders correctly for guest users', () => {
        renderWithStore(<Home />, { auth: { user: null } })

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

        fireEvent.click(playButton)
        expect(navigate).toHaveBeenCalledWith('/login')

        navigate.mockReset()

        fireEvent.click(getPremiumButton)
        expect(navigate).toHaveBeenCalledWith('/login')
    })

    it('renders correctly for authenticated users', () => {
        renderWithStore(<Home />, { auth: { user: { permissions: 1 } } })

        expect(
            screen.queryByText('Already have an account?')
        ).not.toBeInTheDocument()
        expect(screen.queryByText('Log in')).not.toBeInTheDocument()
        expect(screen.queryByText('Not a member?')).not.toBeInTheDocument()
        expect(screen.queryByText('Sign up')).not.toBeInTheDocument()
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

        fireEvent.click(playButton)
        expect(navigate).toHaveBeenCalledWith('/chatroom')

        navigate.mockReset()

        fireEvent.click(getPremiumButton)
        expect(navigate).toHaveBeenCalledWith('/getpremium')
    })

    it('renders correctly for premium users', () => {
        renderWithStore(<Home />, { auth: { user: { permissions: 2 } } })

        expect(
            screen.getByText('Thank you for supporting us!')
        ).toBeInTheDocument()
        expect(
            screen.getByText(
                "You've now gained access to the all the Spotify playlists you want in your games, enjoy!"
            )
        ).toBeInTheDocument()
        expect(screen.queryByText('Support us!')).not.toBeInTheDocument()
        expect(
            screen.queryByText(
                'Bored of using the same playlists over and over again? For 5€, unlock the premium membership for life, and start browsing to Spotify, select and play with any playlist you want!'
            )
        ).not.toBeInTheDocument()

        const playButton = screen.getByRole('button', { name: /play/i })
        expect(playButton).toBeInTheDocument()

        fireEvent.click(playButton)
        expect(navigate).toHaveBeenCalledWith('/chatroom')

        navigate.mockReset()

        const getPremiumButton = screen.queryByRole('button', {
            name: /get premium/i,
        })
        expect(getPremiumButton).not.toBeInTheDocument()
    })
})
