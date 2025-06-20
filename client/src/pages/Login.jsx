import {useEffect, useState} from 'react'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = () => {

    }
  return (
    <div>
        <h1>Login</h1>
        <form method='post'>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" onClick={handleLogin}>Login</button>
        </form>
    </div>
  )
}

export default Login