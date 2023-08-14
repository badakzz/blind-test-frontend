import { render, screen, fireEvent } from '@testing-library/react'
import { Signup } from '../components'
import { isEmailValid, isPasswordValid } from '../utils/helpers'
import { Provider } from 'react-redux'
import store from '../store'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

describe('Data validation in Signup component', () => {
    it('validates email correctly', () => {
        expect(isEmailValid('test@example.com')).toBe(true)
        expect(isEmailValid('invalid-email')).toBe(false)
        expect(isEmailValid('')).toBe(false)
        expect(isEmailValid('test@.com')).toBe(false)
        expect(isEmailValid('test@site')).toBe(false)
        expect(isEmailValid('test@site.com.')).toBe(false)
        expect(isEmailValid('test@site..com')).toBe(false)
    })

    it('validates password correctly', () => {
        expect(isPasswordValid('ValidPassword123!')).toBe(true)
        expect(isPasswordValid('short')).toBe(false)
        expect(isPasswordValid('NoSpecialChar1')).toBe(false)
        expect(isPasswordValid('nouppercase!')).toBe(false)
        expect(isPasswordValid('NOLOWERCASE!')).toBe(false)
        expect(isPasswordValid('NoNumber!')).toBe(false)
        expect(isPasswordValid('12345678Aa!')).toBe(false)
        expect(isPasswordValid('')).toBe(false)
    })

    const invalidEmailCases = [
        { value: 'invalid-email' },
        { value: 'test@.com' },
        { value: 'test@site' },
        { value: 'test@site.com.' },
        { value: 'test@site..com' },
    ]

    invalidEmailCases.forEach((testCase) => {
        it(`shows error message for invalid email': ${testCase.value}`, () => {
            render(
                <Provider store={store}>
                    <BrowserRouter>
                        <Signup />
                    </BrowserRouter>
                </Provider>
            )
            const emailInput = screen.getByLabelText('Email:')
            userEvent.type(emailInput, testCase.value)
            fireEvent.blur(emailInput)
            expect(
                screen.getByText('Please enter a valid email')
            ).toBeInTheDocument()
            const submitButton = screen.getByRole('button', { name: /signup/i })
            expect(submitButton).toBeDisabled()
        })
    })

    const invalidPasswordCases = [
        {
            value: 'short',
            isValid: false,
            message:
                'Password must be at least 12 characters long, include at least one lowercase letter, one uppercase letter, one number, and one special character',
        },
        {
            value: 'NoSpecialChar1',
            isValid: false,
            message:
                'Password must be at least 12 characters long, include at least one lowercase letter, one uppercase letter, one number, and one special character',
        },
        {
            value: 'nouppercase!',
            isValid: false,
            message:
                'Password must be at least 12 characters long, include at least one lowercase letter, one uppercase letter, one number, and one special character',
        },
        {
            value: 'NOLOWERCASE!',
            isValid: false,
            message:
                'Password must be at least 12 characters long, include at least one lowercase letter, one uppercase letter, one number, and one special character',
        },
        {
            value: 'NoNumber!',
            isValid: false,
            message:
                'Password must be at least 12 characters long, include at least one lowercase letter, one uppercase letter, one number, and one special character',
        },
        {
            value: '12345678Aa!',
            isValid: false,
            message:
                'Password must be at least 12 characters long, include at least one lowercase letter, one uppercase letter, one number, and one special character',
        },
    ]

    invalidPasswordCases.forEach((testCase) => {
        it(`validates password: ${testCase.value}`, () => {
            render(
                <Provider store={store}>
                    <BrowserRouter>
                        <Signup />
                    </BrowserRouter>
                </Provider>
            )
            const passwordInput = screen.getByLabelText('Password:')
            userEvent.type(passwordInput, testCase.value)
            fireEvent.blur(passwordInput)
            expect(screen.getByText(testCase.message)).toBeInTheDocument()
            const submitButton = screen.getByRole('button', { name: /signup/i })
            expect(submitButton).toBeDisabled()
        })
    })

    it("doesn't show error message for valid email and password and submit is enabled", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Signup />
                </BrowserRouter>
            </Provider>
        )
        const emailInput = screen.getByLabelText('Email:')
        userEvent.type(emailInput, 'test@example.com')
        const passwordInput = screen.getByLabelText('Password:')
        userEvent.type(passwordInput, 'ValidPassword123!')
        fireEvent.blur(passwordInput)
        expect(
            screen.queryByText('Please enter a valid email')
        ).not.toBeInTheDocument()
        expect(
            screen.queryByText(
                'Password must be at least 12 characters long, include at least one lowercase letter, one uppercase letter, one number, and one special character'
            )
        ).not.toBeInTheDocument()

        const submitButton = screen.getByRole('button', {
            name: /signup/i,
        })
        expect(submitButton.getAttribute('disabled')).toBe('')
    })

    it("doesn't show error message empty password and email but submit is disabled", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Signup />
                </BrowserRouter>
            </Provider>
        )
        const emailInput = screen.getByLabelText('Email:')
        userEvent.type(emailInput, '')
        const passwordInput = screen.getByLabelText('Password:')
        userEvent.type(passwordInput, '')
        fireEvent.blur(passwordInput)
        expect(
            screen.queryByText('Please enter a valid email')
        ).not.toBeInTheDocument()
        expect(
            screen.queryByText(
                'Password must be at least 12 characters long, include at least one lowercase letter, one uppercase letter, one number, and one special character'
            )
        ).not.toBeInTheDocument()

        const submitButton = screen.getByRole('button', {
            name: /signup/i,
        })
        expect(submitButton).toBeDisabled()
    })
})
