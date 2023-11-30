import React, { useRef, useState } from "react"
import './login.css'
import { Container } from "react-bootstrap"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"

const Login = () => {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login, } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)


    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setError("")
            setLoading(true)

            await login(emailRef.current.value, passwordRef.current.value)

            navigate('/mystorage')
        }
        catch (err) {
            setError("Failed to log in!")
        }

        setLoading(false)
    }

    return (
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
        >
            <div className="w-100" style={{ maxWidth: "400px" }}>
                <Card style={{borderRadius: 10}}>
                    <Card.Body>
                        <h2 className="text-center mb-4">Log In</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="email" style={{marginBottom: 10}}>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required />
                            </Form.Group>
                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef} required />
                            </Form.Group>
                            <Button disabled={loading} className="w-100 loginBtn" type="submit" style={{fontWeight: 500}}>
                                Log In
                            </Button>
                        </Form>
                        <div className="w-100 text-center mt-3">
                            <Link to="/forgot-password" style={{fontWeight: 500, color: '#61b5ec'}}>Forgot Password?</Link>
                        </div>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2" style={{fontWeight: 500}}>
                    Need an account? <Link to="/register" style={{color: '#61b5ec'}}>Sign Up</Link>
                </div>
            </div>
        </Container>
    )
}

export default Login
