import { Link } from 'lucide-react'
import React from 'react'

const index = () => {

  return (
    <div className='otp-form'>
        <div className='header-form'>
            <h1>Enter OTP</h1>
            <p>Please enter the OTP sent to your email address to verify your account.</p>
        </div>

        <form action={"javascript:void(0)"}>
            <div clas="otp-input-wrap">
                <input type="text" class = "code-input" required="" maxLength={1}  />
                <input type="text" class = "code-input" required=""  maxLength={1} />
                <input type="text" class = "code-input" required=""  maxLength={1}/>
                <input type="text" class = "code-input" required=""  maxLength={1} />
                <input type="text" class = "code-input" required=""  maxLength={1} />
                <input type="text" class = "code-input" required=""  maxLength={1} />
            </div>
        </form>
        <Link href="/signUpLandlord" className="mb-4 text-blue-700 underline">
            <button type="submit" 
            className="bg-blue-700 text-white px-6 py-2 md:px-10 md:py-4 md:text-xl rounded cursor-pointer font-medium">
                Verify OTP
            </button>
        </Link>                           
    </div>
  )
}

export default index
