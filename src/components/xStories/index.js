import React from 'react'
import Image from 'next/image'

const index = () => {
  return (
    <div className="bg-gray-700 w-full md:w-full min-h-96 h-full text-white px-10 pt-20">
      <h3 className='font-medium text-3xl mb-15'>Tenants stories as seen on X</h3>
        <div className='flex md:gap-18 gap-10 -mt-12 -ml-8 overflow-x-auto scroll-smooth scrollbar-hide'>
          <Image 
            src={'/User_1.png'}
            alt='user1'
            width={215}
            height={215}
            className='mb-20 mt-10 transition-shadow hover:scale-105 duration-300'
          />

          <Image 
            src={'/User_1.png'}
            alt='user1'
            width={215}
            height={215}
            className='mb-20 mt-10 transition-shadow hover:scale-105 duration-300'
          />

          <Image 
            src={'/User_1.png'}
            alt='user1'
            width={215}
            height={215}
            className='mb-20 mt-10 transition-shadow hover:scale-105 duration-300'
          />

          <Image 
            src={'/User_1.png'}
            alt='user1'
            width={215}
            height={215}
            className='mb-20 mt-10 transition-shadow hover:scale-105 duration-300'
          />

          <Image 
            src={'/User_1.png'}
            alt='user1'
            width={215}
            height={215}
            className='mb-20 mt-10 transition-shadow hover:scale-105 duration-300'
          />

          <Image 
            src={'/User_1.png'}
            alt='user1'
            width={215}
            height={215}
            className='mb-20 mt-10 transition-shadow hover:scale-105 duration-300'
          />

          <Image 
            src={'/User_1.png'}
            alt='user1'
            width={215}
            height={215}
            className='mb-20 mt-10 transition-shadow hover:scale-105 duration-300'
          />

          <Image 
            src={'/User_1.png'}
            alt='user1'
            width={215}
            height={215}
            className='mb-20 mt-10 transition-shadow hover:scale-105 duration-300'
          />

          <Image 
            src={'/User_1.png'}
            alt='user1'
            width={215}
            height={215}
            className='mb-20 mt-10 transition-shadow hover:scale-105 duration-300'
          />
        </div>
      </div>
  )
}

export default index
