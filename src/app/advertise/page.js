import styles from './Advertise.module.scss'
function Advertise () {
    return (
        <>
        <div className= {`flex gap-16 ${styles.container}` }>
       

        <div className={`${styles.group}`}>
             <div className={`space-y-5 p-8 mt-10 ml-14 ${styles.title}`} >
             <h1 className="text-5xl  font-bold">Advertise your brand</h1>
             <h4 className="text-xl  font-medium whitespace-normal">Please send your desired AD request to adverts@okuper.com</h4>
             <h4 className="text-xl  font-medium">We will respond by sending you the price list,advert duration<br/>
                and dimensions to send to us by email for upload.  </h4>
        </div>


        <div className={`space-y-5 mt-5 ${styles.sample}`}>
            <h3 className="font-medium text-4xl  text-center mr-8 text-[rgba(14,29,72,1)] ">Sample of in-List AD banner.</h3>

            <div className={`text-center ${styles.form}`}>

        <div className="align-center space-y-3 text-center p-10  border-2 rounded-lg bg-blue-900 mb-9 inline-block text-white">
            <h4 className="font-semibold text-2xl">Product / Brand Name!</h4>
            <p className="text-lg">Text and punchline you want to <br/>communicate with your customers,<br/>
                brand colour/image for your brand.
            </p>
            <p className="text-center border border-white text-2xl  rounded-xl p-3 inline-block ">Your Link....</p>
        </div>
            </div>

        </div>
        <div className='text-center mr-6'>
        <h4 className={` font-semibold text-xl  ${styles.dim}`}>Dimension: 350px by 259px</h4>
        </div>

    
        
        <div>


        <div className={`space-y-5 mb-14 mt-12 ${styles.banner}`}>          
        <h3 className="font-medium text-4xl text-center mr-10 text-[rgba(14,29,72,1)] ">Sample of side AD Banner.</h3>

        <div className={` text-center ${styles.brand}`}>

        <div className="align-center space-y-3 text-center p-14 pt-44  rounded-lg bg-blue-900 min-h-[900px]  text-white inline-block">
        <p className=" border border-white text-2xl  m-0 rounded-xl p-4 inline-block  ">Your Link....</p>
        <h4 className="font-semibold text-2xl pt-30">Product / Brand Name!</h4>
         <p className="text-lg font-medium">Text and punchline you want to <br/>
                communicate with your customers,<br/>
                 image/brand colour for your brand.
        </p>
        </div>
        </div>

            <h4 className={`font-semibold text-xl leading-relaxed text-center mr-5 text-[rgba(14,29,72,1) ${styles.sio}`}>Dimension: 350px by 870px
                <span className="block">or</span> 870px by 350px</h4>
        </div>
        </div>


        </div>
         
            <div className={` text-white  mt-38 ${styles.text}`}>
                <div className={`relative p-10 border-0 rounded-t-2xl  bg-[rgba(0,51,153,1)] ${styles.case}`} >  

            <h2 className="font-medium text-5xl leading-relaxed pl-4">Thank you for<br/> choosing to advertise <br/> your brand on Okuper.</h2>
                </div>
            <p className=" absolute font-medium leading-relaxed text-2xl   pl-14">Showcase your  brand to the hundreds of <br/> user who interact with our platform daily.<br/>
                Join us as we the real estate industry and <br/> give the power back to the people. </p>

            <img 
            src="/bannerlady.png" 
            alt="bannerlady" 
            className={`absolute  pl-14 pt-50 ${styles.bannerlady}`}/>

            <img 
            src="/BannerSam.png"  
            alt="Ad Banner Sam" 
            className={`rounded-b-2xl ${styles.bannersam}`}/>
            </div>
            

            
        
       
       



            </div>

            
        
        
        
        
        
        </>

    )

}
export default Advertise; 
