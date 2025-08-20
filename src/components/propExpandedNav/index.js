'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaAngleLeft } from 'react-icons/fa';

const index = () => {
  const router = useRouter();

  return (
    <div className='exp-prop-nav bg-white flex items-center justify-between px-4 py-3'>
      <div
        className='flex items-center back-to-listing gap-3 cursor-pointer'
        onClick={() => router.push('/rent')}>
        <FaAngleLeft />
        <h3>Back to Listing</h3>
      </div>

      {/* Optional Logo */}
      {/* <img
        src='/logo.png'
        alt='Okuper Logo'
        className='logo w-32 h-8 object-cover md:w-40 md:h-10 lg:w-48 lg:h-12 xl:w-56 xl:h-14 2xl:w-64 2xl:h-16 3xl:w-72 3xl:h-20 4xl:w-80 4xl:h-24 5xl:w-96 5xl:h-28 6xl:w-full 6xl:h-full max-w-full max-h-full'
      /> */}

      <div className='flex items-center justify-between gap-4'>
        <button 
          onClick={() => router.push('/savedHomes')}>
          <img src='/Save_House_Icon.png' alt='Save Icon' className='mr-4' />
        </button>
        
        <button onClick={() => router.push('')}>
          <img src='/Share_Icon.png' alt='Share Icon' className='user-avatar' />
        </button>

        <button onClick={() => router.push('/report')}>
          <img src='/Report_Icon.png' alt='Report Icon' className='ml-2' />
        </button> 
      </div>
    </div>
  );
};

export default index;
