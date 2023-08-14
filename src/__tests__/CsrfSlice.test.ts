import { configureStore } from '@reduxjs/toolkit'
import api from '../api'
import csrfReducer, { getCSRFToken } from '../store/csrfSlice'

jest.mock('../api')

describe('csrfSlice', () => {
    const initialState = {
        loading: false,
        error: null,
        csrfToken: null,
    }

    it('should handle initial state', () => {
        expect(csrfReducer(undefined, { type: 'unknown' })).toEqual(
            initialState
        )
    })

    it('should handle getCSRFToken.pending', () => {
        const action = { type: getCSRFToken.pending.type }
        const state = csrfReducer(initialState, action)
        expect(state.loading).toBe(true)
    })

    it('should handle getCSRFToken.fulfilled', () => {
        const csrfToken = 'vLf6iElq-Dv6M-BQv30szIGywzqrIvBATSqE'
        const action = { type: getCSRFToken.fulfilled.type, payload: csrfToken }
        const state = csrfReducer(initialState, action)
        expect(state.loading).toBe(false)
        expect(state.csrfToken).toBe(csrfToken)
    })

    it('should handle getCSRFToken.rejected', () => {
        const error = 'Failed to retrieve CSRF token'
        const action = { type: getCSRFToken.rejected.type, payload: error }
        const state = csrfReducer(initialState, action)
        expect(state.loading).toBe(false)
        expect(state.error).toBe(error)
    })

    it('should fetch CSRF token successfully', async () => {
        const csrfToken = 'vLf6iElq-Dv6M-BQv30szIGywzqrIvBATSqE'
        ;(api.get as jest.Mock).mockResolvedValue({ data: { csrfToken } })

        const store = configureStore({ reducer: { csrf: csrfReducer } })
        await store.dispatch(getCSRFToken())

        const state = store.getState().csrf
        expect(state.csrfToken).toEqual(csrfToken)
        expect(state.loading).toBe(false)
        expect(state.error).toBe(null)
    })
})
