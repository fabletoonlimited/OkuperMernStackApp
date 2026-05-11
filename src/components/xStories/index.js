import React from 'react'
import Image from 'next/image'

const index = () => {
  return (
    <div className="bg-gray-700 w-full md:w-full min-h-96 h-full text-white px-10 pt-20">
      <h3 className='font-medium text-3xl mb-20'>Tenants stories as seen on X</h3>
        <div className='flex md:gap-18 gap-10 -ml-8 overflow-x-auto scroll-smooth scrollbar-hide'>
          <Image 
            src={'/avatar.png'}
            alt='user1'
            width={200}
            height={200}
            className='mb-5 mt-25 transition hover:scale-150 animate-bounce hover:animate-none duration-10'
          />

          <Image 
            src={'/avatar(1).png'}
            alt='user2'
            width={200}
            height={200}
            className='mb-5 mt-25 transition hover:scale-150 animate-bounce hover:animate-none duration-50'
          />

          <Image 
            src={'/avatar(2).png'}
            alt='user3'
            width={200}
            height={200}
            className='mb-5 mt-25 transition hover:scale-150 animate-bounce hover:animate-none duration-10'
          />

          <Image 
            src={'/avatar(3).png'}
            alt='user1'
            width={200}
            height={200}
            className='mb-5 mt-25 transition hover:scale-150 animate-bounce hover:animate-none duration-50'
          />

          <Image 
            src={'/avatar(4).png'}
            alt='user1'
            width={200}
            height={200}
            className='mb-5 mt-25 transition hover:scale-150 animate-bounce hover:animate-none duration-10'
          />

          <Image 
            src={'/avatar(5).png'}
            alt='user1'
            width={200}
            height={200}
            className='mb-5 mt-25 transition hover:scale-150 animate-bounce hover:animate-none duration-50'
          />

          <Image 
            src={'/avatar.png'}
            alt='user1'
            width={200}
            height={200}
            className='mb-5 mt-25 transition hover:scale-150 animate-bounce hover:animate-none duration-10'
          />

          <Image 
            src={'/avatar(1).png'}
            alt='user1'
            width={200}
            height={200}
            className='mb-5 mt-25 transition hover:scale-150 animate-bounce hover:animate-none duration-50'
          />

          <Image 
            src={'/avatar(2).png'}
            alt='user1'
            width={200}
            height={200}
            className='mb-5 mt-25 transition hover:scale-150 animate-bounce hover:animate-none duration-10'
          />
        </div>
      </div>
  )
}

export default index
