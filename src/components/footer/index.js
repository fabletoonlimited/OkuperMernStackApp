'use client'

import Image from 'next/image'
import Instagram from '../../../public/instagram-logo.png'
import Facebook from '../../../public/Facebook.png' // Update to correct logo
import X from '../../../public/X_icon_black.svg'
import Youtube from '../../../public/free-youtube-logo-icon-2431-thumb.png'
import Link from 'next/link'

function Footer() {

  return (
    <div className="bg-gray-700 w-full text-white">
      <div className="max-w-5xl mx-auto text-center px-6 md:px-0">
        <p className="text-md font-light pt-10 text-justify md:text-center text-md md:text-md lg:text-lg">
          Okuper is committed to ensuring digital accessibility for individuals with disabilities.
          We are continuously working to improve the accessibility of our web experience for everyone,
          and we welcome feedback and accommodation requests. If you wish to report an issue or seek
          an accommodation, please let us know.
        </p>

        <p className="text-xl md:text-xl font-bold mt-6 text-start md:text-center text-white">About Okuper's Recommendations</p>

        <p className="text-md font-light mt-2 mb-6 text-justify md:text-center text-md md:text-md lg:text-lg">
          Recommendations are based on your location and search activity, such as the homes you've
          viewed and saved and the filters you've used. We use this information to bring similar
          homes to your attention, so you don't miss out.
        </p>

        <div className="flex justify-center items-center gap-10 my-10">
         
          <Link href="https://www.instagram.com/okuper_/" target="_blank">
            <Image 
              className='hover:scale-150'
              src={Instagram} alt="Instagram" width={50} height={50} 
            />
          </Link>
          <Link href="https://web.facebook.com/profile.php?id=61568283636863" target='_blank'>
            <Image 
              className='hover:scale-120'
              src={Facebook} alt="Facebook" width={45} height={30} 
            />
          </Link>
          <Link href="https://www.x.com/@okuper_" target='_blank'>
            <Image 
            className='hover:scale-150'
            src={X} alt="X (formerly Twitter)" width={40} height={40} 
          />
          </Link>
        

          <Link href="https://www.youtube.com/@Okuper" target='_blank'>
            <Image 
              className='hover:scale-150'
              src={Youtube} alt="YouTube" width={50} height={30} 
            />
          </Link>
        </div>
      </div>

      <div className="bg-blue-950 text-white py-4 font-bold md:w-full w-full">
        <div className="max-w-5xl mx-auto flex justify-between text-center text-xs font-light gap-4 md:gap-0 md:px-0 px-5">
          <p className='text-md text-white'>Okuper 2025</p>
          <p className='text-md text-white'>Copyright© Okuper Technologies Limited. 2026.</p>
          <p className='text-md text-white'>Terms</p>
          <p className='text-md text-white'>Privacy</p>
        </div>
      </div>
    </div>
  )
}

export default Footer;
