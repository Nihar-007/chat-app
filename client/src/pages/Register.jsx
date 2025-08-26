import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { CREATE_USER } from '../graphql/mutations/mutations'

function Register() {
  const [name, setName] = useState('')
  const [phno, setPhno] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const [confirmPassword, setConfirmPassword] = useState('')
  const [createUser, { data, loading, error }] = useMutation(CREATE_USER, {
    onCompleted: (data) => {
      navigate('/verify-email', {
        state: {
          name: name,
          phno: phno,
          email: email
        }
      })
    }
  })
  const handleRegister = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) { 
      alert("Passwords do not match")
      return
    }
    createUser({
      variables: {
        name: name,
        phno: phno,
        email: email,
        password: password
      }
    }).catch(err => {
      console.error("Error creating user:", err)
      alert("Error creating user. Please try again." + err)
    })
  }

    return (
    <div>
        <h1>Register</h1>
        <form method='post' onSubmit={handleRegister}>
            <input type="text" name="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /> <br />
            <input type="text" name="phno" placeholder="Phone Number" value={phno} onChange={(e) => setPhno(e.target.value)} /> <br />
            <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
            <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /> <br />
            <input type="password" name="confirm-password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /> <br />
            <button type="submit">Register</button>
        </form>
        <div>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error?.message}</p>}
        </div>
    </div>
  )
}

export default Register