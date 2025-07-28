'use client'

import Image from 'next/image'
import Instagram from '../../../public/instagram-logo.png'
import Facebook from '../../../public/Facebook.png' // Update to correct logo
import X from '../../../public/X_icon_black.svg'
import Youtube from '../../../public/free-youtube-logo-icon-2431-thumb.png'

function Footer() {
  return (
    <div className="bg-gray-700 w-full text-white px-6 pt-10">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-sm font-light">
          Okuper is committed to ensuring digital accessibility for individuals with disabilities.
          We are continuously working to improve the accessibility of our web experience for everyone,
          and we welcome feedback and accommodation requests. If you wish to report an issue or seek
          an accommodation, please let us know.
        </p>

        <p className="text-base font-bold mt-6">About Okuper's Recommendations</p>

        <p className="text-sm font-light mt-2 mb-6">
          Recommendations are based on your location and search activity, such as the homes you've
          viewed and saved and the filters you've used. We use this information to bring similar
          homes to your attention, so you don't miss out.
        </p>

        <div className="flex justify-center gap-8 mt-10">
          <Image src={Instagram} alt="Instagram" width={40} height={40} />
          <Image src={Facebook} alt="Facebook" width={40} height={30} />
          <Image src={X} alt="X (formerly Twitter)" width={40} height={40} />
          <Image src={Youtube} alt="YouTube" width={40} height={30} />
        </div>
      </div>

      <div className="bg-blue-950 text-white mt-10 py-4 mx-[-25] font-bold md:w-screen max-w-screen">
        <div className="flex flex-col md:flex-row justify-between text-center text-xs font-light gap-4 md:gap-0 px-20">
          <p>Okuper 2025</p>
          <p>Copyright © Fabletoon Limited. All Rights Reserved.</p>
          <p>Terms</p>
          <p>Privacy</p>
        </div>
      </div>
    </div>
  )
}

export default Footer;
