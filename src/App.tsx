import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home, Login, Signup } from './components'
import { Layout } from './components'

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </Layout>
    )
}

export default App
