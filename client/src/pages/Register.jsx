import { useEffect, useState } from 'react'

function Register() {
  const [name, setName] = useState('')
  const [phno, setPhno] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleRegister = () => {

  }

    return (
    <div>
        <h1>Register</h1>
        <form method='post'>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Phone Number" value={phno} onChange={(e) => setPhno(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <button type="submit" onClick={handleRegister}>Register</button>
        </form>
    </div>
  )
}

export default Register