import React from 'react'

const page = () => {
  return (
    <div className="pt-8 px-8 text-left md:flex-row items-center justify-center min-h-screen bg-gray-100">
      <h1 className="md:text-4xl text-3xl font-bold mb-4 text-left md:text-center">Welcome to our Help Page.</h1>
      <p className="text-md font-light mt-2 mb-6 text-justify md:text-center">
        We are here to help you! If you have any questions or need assistance, please reach out to our support team via email or phone. <br />  You can contact us via email at support@okuper.com or call us at (+234) 701-733-0597 or +234 701 733 0597. You can also follow us on social media. <br /> Our support hours are Monday to Friday, 9 AM to 5 PM. We look forward to assisting you!
      </p>
      <div className="flex justify-center items-center">
        <img 
          src="/customer_Support.png" 
          alt="helpImage" 
          className="w-96 h-auto mx-auto md:mx-0 " 
        />
      </div>
    </div>
  )
}

export default page
