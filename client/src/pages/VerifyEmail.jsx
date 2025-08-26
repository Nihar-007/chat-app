import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function VerifyEmail() {
  const [otp, setOtp] = useState('')
  const baseUrl = import.meta.env.VITE_BASE_URL
  const location = useLocation()
  const navigate = useNavigate()
  const { name, phno, email } = location.state || {}

  const handleVerify = async (e) => {
    try {
      e.preventDefault()

      const response = await fetch(`${baseUrl}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp })
      });
      const result = await response.json();
      if (result.user) {
        navigate('/')
        alert('Email verified successfully!');
      } else {
        alert('Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying email:', error);
    }
  }

  return (
    <div>
      <h1>Verify Email</h1>
      <form method='post'>
        <input type="text" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
        <button type="submit" onClick={handleVerify}>Verify</button>
      </form>
    </div>
  )
}

export default VerifyEmail