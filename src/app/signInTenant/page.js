"use client";
import React, { useState, useEffect} from 'react'
import Link from 'next/link';

const page = () => {
  return (
    <>
        <h1 className='font-bold text-4xl' style={{paddingLeft: 45, marginTop: 70}}>Sign in</h1>

        {/*SignUp Form*/}
        <div className='signUpLoandingContainer md:flex-col col mt-10 mb-50'>
            <div className='landlordSignupFormSection text-2xl mt-10 mb-10 md:w-100% w-50% md:mr-10 mr-10' 
                style={{ 
                    display: 'flex',
                    flexDirection: 'column', 
                    maxWidth: '556px', 
                    // width: '100%',
                    height: 'auto',
                    maxHeight: '100%',
                    border: '1px solid #ccc', 
                    padding: '20px', 
                    borderRadius: '5px',
                    paddingLeft: '35px',
                    paddingRight: '50px',
                    marginTop: '20px',
                    marginLeft: '50px',
                    paddingBottom: '80px'
                    }}
            >

                    {/*Email*/}
                    <p style={{paddingTop: 20, marginBottom: 30}}>Email Address</p>
                    <input 
                        type="email" 
                        placeholder="Enter your email address" 
                        className="border-2 border-gray-300 p-3 rounded w-60 md:w-120"
                    />

                    {/*Password*/}
                    <p style={{paddingTop: 20, marginBottom: 30}}>Password</p>
                    <input 
                        type="password" 
                        placeholder="Create a password" 
                        className="border-2 border-gray-300 p-3 rounded w-60 md:w-120"
                    />

                    {/*Referral*/}
                    <p style={{paddingTop: 20, marginBottom: 30}}>Referral Code (Optional)</p>
                    <input 
                        type="text" 
                        placeholder="Enter your referral code" 
                        className="border-2 border-gray-300 p-3 rounded w-60 md:w-120"
                    />
                    <p style={{paddingTop: 30, marginBottom: 30}}>Forgot password? 
                        <Link href='/forgotPassword'> 
                            <span className='cursor-pointer hover:text-blue-600'> Click here</span>
                        </Link> 
                    </p>
            </div>

            {/*Terms*/}
            <div className='termsSection -mt-11 md:mt-10 md:ml-13 ml-13 mr-10 md:mr-0 flex items-center'>
                <input 
                    type="checkbox" 
                    id="agreeTerms" 
                    className="w-7 h-7 border-2 border-blue-950 rounded cursor-pointer accent-blue-700"
                />   
                {/*Terms Text*/}                 
                <span className='text-sm ml-2 md:ml-2 mr-0 md:mr-12 md:mt-0 mt-5'>By signing up, you agree to Okuper's <a href='/termsOfService' className='text-blue-600 underline'>Terms of Service</a> and <a href='/privacyPolicy' className='text-blue-600 underline'>Privacy Policy</a>.</span>
            </div>
                
            {/*SignIn Btn*/}
            <div className="tenantSignUpBtn mt-10 ml-12 md:ml-12 flex flex-col md:flex-row gap-5">
                <Link href='/tenantDashboard'>
                    <button 
                    className='tenantSignInBtn bg-blue-950 hover:bg-blue-800 text-white p-4 md:w-140 w-75 border-1px text-2xl text-center cursor-pointer md:mb-20 mb-30'> Sign In </button>
                </Link>
            </div>

            {/*Banner Section*/}
            <div className='bannerSection md:flex md:justify-right md:items-right -mt-10 md:-mt-240 ml-10 md:ml-190 md:mb-30 mb-10 md:w-100% w-50% md:mr-10 mr-10'>
                {/* RIGHT SECTION */}
                <div className={ 'relative h-80 rounded-2xl shadow-lg bannerBgColor mb-170'}>
                    <div className={'relative p-10 rounded-t-2xl md:w-153.5 w-50% bg-[rgba(0,51,153,1)] py-13 leading-relaxed bannerBgColor '}>
                        <h2 className="font-medium md:text-5xl text-2xl text-white leading-10 md:leading-17 px-0.2 md:px-2 text-center">
                            <b>Rent & Buy your Homes Directly on Okuper</b>
                        </h2>
                    </div>

                    <p className="absolute md:font-medium leading-[1.5] -mt-10 md:text-[20px] text-white text-center px-5 md:px-20 text-xl md:text-center">
                        No agents. No hidden fees. Connect directly with your next home owners on Okuper. Verified people and real homes.
                    </p>

                    {/* RIGHT BANNER IMAGES */}
                    <img
                        src="/bannerGirl.png"
                        alt="bannerGirl"
                        className={'bannerGirl md:h-auto h-60 md:w-110 w-50 bottom-[-275px] md:bottom-[-721px]'}
                        style={{position: 'absolute', height: 'auto'}}
                    />

                    <img
                        src="/BannerSam.png"
                        alt="Ad Banner Sam"
                        className={'rounded-b-2xl'}
                    />
                </div>
            </div>
            {/*End of Banner Section*/}
        </div>
    </>
)}

export default page
