import Link from 'next/link'

import React from 'react'

const index = () => {
  return (
    <div className='bg-blue-950 text-white md:p-3 p-6 md:mt-199 mt-145 w-full '>
       <ul className='flex justify-between md:px-20 space-x-2'>
            <Link href ="/okuper2025">
               <li>
                    <p>Okuper2025</p>
               </li>    
            </Link>
            <Link href ="/copyright">
               <li>
                    <p className=' md:m-0 m-5 text-center'>&copy; Copyright.All Right Reserved</p>
               </li>    
            </Link>
            
            <Link href ="/terms">
               <li>
                    <p>Terms</p>
               </li> 
            </Link>

            <Link href ="/privacy">
               <li>
                    <p>Privacy</p>
               </li>    
            </Link>
       </ul>
       
    </div>
  )
}

export default index
