import Link from "next/link";


function landlordDashboard() {   
    return (
        <>
            <div>
                <div>
                    <div className=" ">
                        <img
                            className="w-[211.14px] h-[88px]"
                            src="/logo.png"
                            alt=""
                        />
                        <ul>
                            <li className="">
                                <Link href="/Dashboard">
                                    Dashboard
                                </Link> 
                            </li>
                            <li className="">
                                <Link href="/Help Center">
                                    Help Center
                                </Link> 
                            </li>
                            <li className="">
                                <Link href="/Saved Homes">
                                    Saved Homes
                                </Link> 
                            </li>
                            <li className="">
                                <Link href="/Messages">
                                    Messages
                                </Link> 
                            </li>
                            <li className="">
                                <Link href="/Listings">
                                    Listings
                                </Link> 
                            </li>
                            <li className="">
                                <Link href="/Verification">
                                    Verifications
                                </Link> 
                            </li>
                            <li className="">
                                <Link href="/Home Interests">
                                    Home Interests
                                </Link> 
                            </li>
                            
                        </ul>
                    </div>
                    <div>
                        <h1>Welcome,Landlord</h1>
                        <p>
                            We are thrilled that you have chosen to list your
                            property with Okuper.
                        </p>

                    </div>
                        <div>
                            <h3>Your next steps</h3>
                            <p>
                                In other to complete your profile and
                                listing,there are a few things left to do
                            </p>
                      </div>
                    
                    <div>
                        <p>Your profile</p>
                        <p>Your profile information is 50% incomplete</p>
                        
                    </div>
                </div>
            </div>
        </>
    );
}

    export default landlordDashboard;
        
        
        
        
        
        
    
    