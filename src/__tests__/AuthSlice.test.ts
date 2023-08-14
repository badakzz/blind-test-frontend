import { loginUser, signupUser } from '../store/authSlice'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import api from '../api'

jest.mock('../api')

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('signupUser action creator', () => {
    it('dispatches the correct actions on successful signup', async () => {
        const csrfToken = 'vLf6iElq-Dv6M-BQv30szIGywzqrIvBATSqE'
        const initialState = {
            csrf: {
                csrfToken,
                loading: false,
                error: null,
            },
        }

        api.post = jest.fn().mockResolvedValueOnce({
            data: {
                user: {
                    username: 'test',
                    email: 'test@example.com',
                    permissions: 1,
                    is_active: true,
                },
            },
        })

        const store = mockStore(initialState)

        await store.dispatch(
            signupUser({
                username: 'test',
                email: 'test@example.com',
                password: 'ValidPassword123!',
            })
        )

        const actions = store.getActions()
        expect(actions[0].type).toEqual('auth/signupUser/pending')
        expect(actions[1].type).toEqual('auth/signupUser/fulfilled')
        expect(actions[1].payload).toEqual({
            user: expect.objectContaining({
                username: 'test',
                email: 'test@example.com',
                permissions: 1,
                is_active: true,
            }),
        })
    })

    it('dispatches the correct actions on failed signup', async () => {
        const store = mockStore()

        api.post = jest.fn().mockResolvedValueOnce(new Error('Rejected'))

        await store.dispatch(
            signupUser({
                username: 'test',
                email: 'test@example.com',
                password: 'ValidPassword123!',
            })
        )

        const actions = store.getActions()
        expect(actions[0].type).toEqual('auth/signupUser/pending')
        expect(actions[1].type).toEqual('auth/signupUser/rejected')
        expect(actions[1].error.message).toEqual('Rejected')
    })

    it('dispatches the correct actions on successful login', async () => {
        const csrfToken = 'vLf6iElq-Dv6M-BQv30szIGywzqrIvBATSqE'
        const initialState = {
            csrf: {
                csrfToken,
                loading: false,
                error: null,
            },
        }

        const userResponse = {
            user: {
                username: 'test',
                email: 'test@example.com',
                permissions: 1,
                is_active: true,
            },
        }

        api.post = jest.fn().mockResolvedValueOnce({
            status: 200,
            data: userResponse,
        })

        api.get = jest.fn().mockResolvedValueOnce({ data: { csrfToken } })

        const store = mockStore(initialState)

        await store.dispatch(
            loginUser({
                email: 'test@example.com',
                password: 'ValidPassword123!',
            })
        )

        const actions = store.getActions()
        expect(actions[0].type).toEqual('auth/loginUser/pending')
        expect(actions[1].type).toEqual('auth/setUser')
        expect(actions[2].type).toEqual('auth/loginUser/fulfilled')
        expect(actions[2].payload.user).toEqual(
            expect.objectContaining({
                username: 'test',
                email: 'test@example.com',
                permissions: 1,
                isActive: true,
            })
        )
        expect(actions[2].payload.csrfToken).toEqual(csrfToken)
    })

    it('dispatches the correct actions on failed login', async () => {
        const store = mockStore()

        api.post = jest.fn().mockResolvedValueOnce(new Error('Rejected'))

        await store.dispatch(
            loginUser({
                email: 'test@example.com',
                password: 'ValidPassword123!',
            })
        )

        const actions = store.getActions()
        expect(actions[0].type).toEqual('auth/loginUser/pending')
        expect(actions[1].type).toEqual('auth/loginUser/rejected')
        expect(actions[1].error.message).toEqual('Rejected')
    })
})
