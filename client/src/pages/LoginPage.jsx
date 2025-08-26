import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { gql, useMutation } from "@apollo/client"
import { LOGIN } from '../graphql/mutations/mutations'


function LoginPage() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const [login, { data, loading, error }] = useMutation(LOGIN, {
        onCompleted: (data) => {
            navigate('/dashboard')
        }
    })
    const handleLogin = (e) => {
        e.preventDefault()
        if (!email || !password) {
            alert("Email and password are required")
            return
        }
        login({
            variables: {
                email: email,
                password: password
            }
        }).catch(err => {
            console.error("Error logging in:", err)
            alert("Error logging in. Please try again.")
        })
    }

  return (
    <div>
        <form method="post" onSubmit={handleLogin}>
            <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
            <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /> <br />
            <button type="submit">Login</button>
        </form>
        <div>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
        </div>
    </div>
  )
}

export default LoginPage