import { signupUser } from '../store/authSlice'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import axios from 'axios'
import api from '../api'
import csrfReducer, { getCSRFToken } from '../store/csrfSlice'
import { createSlice, createAsyncThunk, configureStore } from '@reduxjs/toolkit'

jest.mock('../api')

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('signupUser action creator', () => {
    it('dispatches the correct actions on successful signup', async () => {
        // Set up initial state
        const csrfToken = 'vLf6iElq-Dv6M-BQv30szIGywzqrIvBATSqE'
        const initialState = {
            csrf: {
                csrfToken,
                loading: false,
                error: null,
            },
            // Include other initial states like auth if needed
        }

        // Mock api.post
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

        // Create a store with initial state
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
})
