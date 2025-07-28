import React from 'react'
import Image from 'next/image'

const index = () => {
  return (
    <div className="bg-gray-700 w-full min-h-96 h-full md:full text-white md:px-40 px-10 pt-20 ">
      <h3 className='font-medium text-3xl mb-15'>Tenants stories as seen on X</h3>
        <div className='flex gap-8 -mt-12 -ml-8'>
            <Image 
            src={'/User_1.png'}
            alt='user1'
            width={215}
            height={215}
            className='mb-20 mt-10'
            />

            <Image 
            src={'/User_1.png'}
            alt='user1'
            width={215}
            height={215}
            className='mb-20 mt-10'
            />

            <Image 
            src={'/User_1.png'}
            alt='user1'
            width={215}
            height={215}
            className='mb-20 mt-10'
            />

            <Image 
            src={'/User_1.png'}
            alt='user1'
            width={215}
            height={215}
            className='mb-20 mt-10'
            />

            <Image 
            src={'/User_1.png'}
            alt='user1'
            width={215}
            height={215}
            className='mb-20 mt-10'
            />

        </div>
      </div>
  )
}

export default index
