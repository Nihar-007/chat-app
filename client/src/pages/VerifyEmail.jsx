import {useEffect, useState} from 'react'

function VerifyEmail() {
    const [otp, setOtp] = useState('')

    const handleVerify = () => {
        
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