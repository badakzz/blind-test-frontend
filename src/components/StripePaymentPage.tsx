import { loadStripe } from '@stripe/stripe-js'
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { AuthState, authActions } from '../store/authSlice'
import { CSSProperties, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { User } from '../utils/types'
import { Button, Container, Form } from 'react-bootstrap'

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)

const CheckoutForm = () => {
    const [error, setError] = useState<string>('')
    const stripe = useStripe()
    const elements = useElements()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const authUser = useSelector((state: RootState) => state.auth) as AuthState
    const user = authUser.user

    const csrfToken = useSelector((state: RootState) => state.csrf.csrfToken)

    useEffect(() => {
        if (!user) {
            return navigate('/')
        }
    }, [user])

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const paymentIntentRes = await api.post(
                `${process.env.REACT_APP_SERVER_DOMAIN}/api/v1/payment_intents`,
                {
                    amount: 500,
                    currency: 'eur',
                },
                {
                    withCredentials: true,
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                    },
                }
            )

            const stripePaymentIntentId =
                paymentIntentRes.data.stripe_payment_intent_id
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
            })

            if (!error) {
                const confirmPaymentRes = await api.post(
                    `${process.env.REACT_APP_SERVER_DOMAIN}/api/v1/confirm_payment`,
                    {
                        payment_method: paymentMethod.id,
                        stripe_payment_intent_id: stripePaymentIntentId,
                        user_id: user.userId,
                    },
                    {
                        withCredentials: true,
                        headers: {
                            'X-CSRF-TOKEN': csrfToken,
                        },
                    }
                )

                if (confirmPaymentRes.status === 200) {
                    const updatedUser = confirmPaymentRes.data
                    const formattedUser: User = {
                        userId: updatedUser.user_id,
                        username: updatedUser.username,
                        email: updatedUser.email,
                        permissions: updatedUser.permissions,
                        isActive: updatedUser.is_active,
                    }
                    dispatch(authActions.setUser(formattedUser))

                    return navigate('/')
                } else {
                    setError('Payment failed.')
                }
            } else {
                setError('Payment failed.')
                console.error('Payment method creation failed:', error)
            }
        } catch (error) {
            setError('Payment failed.')
            console.error(error)
        }
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center flex-column mt-5 p-5"
            style={styles.container}
        >
            <div className="checkout-form">
                <Form onSubmit={handleSubmit}>
                    <h4>Get premium</h4>
                    <div className="stripe-input">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }}
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={!stripe}
                        className="stripe-button"
                    >
                        Pay
                    </Button>
                </Form>
                {error && <div className="text-red">{error}</div>}
            </div>
        </Container>
    )
}

const StripePaymentPage = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    )
}

const styles: { [key: string]: CSSProperties } = {
    container: {
        minHeight: '25rem',
    },
}

export default StripePaymentPage
