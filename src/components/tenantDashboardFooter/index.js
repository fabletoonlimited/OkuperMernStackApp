import Link from 'next/link'

import React from 'react'

const index = () => {
  return (
    <div className='bg-blue-950 text-white md:p-3 p-4 md:mt-199 mt-145 md:min-w-[1700px] w-170'>
       <ul className='flex justify-between md:px-20 '>
            <Link href ="/okuper2025">
               <li>
                    <p>Okuper2025</p>
               </li>    
            </Link>
            <Link href ="/copyright">
               <li>
                    <p className=''>&copy; Copyright.All Right Reserved</p>
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
