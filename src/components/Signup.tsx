import Link from 'next/link'
import { Col, Container, Form, Row } from 'react-bootstrap'
import Button from './Button'
import { FaSave } from 'react-icons/fa'
import { Formik } from 'formik'
import router, { useRouter } from 'next/router'
import axios from 'axios'
// import {
//     isEmailValid,
//     isPasswordValid,
//     getPasswordRuleLabel,
// } from '../../../utils/helpers'
import { useState } from 'react'
import Layout from './Layout'

const Signup: React.FC = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const res = await fetch('/api/v1/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_name: username,
                email: email,
                password: password,
            }),
        })

        if (res.ok) {
            // Redirect to success page
            router.push('/views/home')
        } else {
            // Handle error
            const { message } = await res.json()
            alert(message)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button type="submit">Signup</button>
        </form>
    )
}

export default Signup
