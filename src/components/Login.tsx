import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'

const Login: React.FC = () => {
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<any>(null)

    const router = useRouter()

    const login = async (identifier: string, password: string) => {
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identifier, password }),
        })

        if (response.ok) {
            router.push('/views/home')
        } else {
            // Handle login errors
            setError('Invalid credentials')
        }
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        try {
            await login(identifier, password)
        } catch (error) {
            setError(error)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Email or Username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit">Login</button>
            </form>
            {error && <div className="text-danger">{error}</div>}
        </>
    )
}

export default Login
