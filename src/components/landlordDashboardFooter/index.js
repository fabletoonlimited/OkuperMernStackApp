import Link from 'next/link'
import React from 'react'

const index = () => {
  return (
    <div className='bg-blue-950 text-white md:p-3 p-6 md:mt-20 mt-100 w-auto md:mx-0 mx-5 h-auto md:h-20 items-center md:items-center'>
       <ul className='flex justify-between md:px-20 space-x-2 md:space-x-0 md:justify-between items-center md:items-center'>
            <Link href ="/okuper2025">
               <li>
                    <p className='text-md md:text-lg text-sm'>Okuper2026</p>
               </li>    
            </Link>
            <Link href ="/copyright">
               <li>
                    <p className='text-md md:text-lg text-sm text-center'>&copy; Copyright. <br />All Right Reserved.</p>
               </li>    
            </Link>
            
            <Link href ="/terms">
               <li>
                    <p className='text-md md:text-lg text-sm'>Terms</p>
               </li> 
            </Link>

            <Link href ="/privacy">
               <li>
                    <p className='text-md md:text-lg text-sm'>Privacy</p>
               </li>    
            </Link>
       </ul>
       
    </div>
  )
}

export default index
