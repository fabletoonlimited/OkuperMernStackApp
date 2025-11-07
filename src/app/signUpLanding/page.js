"use client";
import React, { useState, useEffect} from 'react'
import Link from 'next/link';

const page = () => {
    const [selectResidencyStatus, setSelectResidencyStatus] = useState(null);
    const [showResidencyStatus, setShowResidencyStatus] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
    if (selectResidencyStatus && selectResidencyStatus !== 'selectOne') {
        setShowResidencyStatus(false);
    } else {
        setShowResidencyStatus(true);
    }
    }, [selectResidencyStatus]);


    const residencyStatus = {
        selectOne: "Select One",
        citizen: "Citizen",
        permanentResident: "Permanent Resident",
        workPermit: "Work Permit",
        studentVisa: "Student Visa",
        visitorVisa: "Visitor Visa"
    };

    const enumValues = ["selectOne", "citizen", "permanentResident", "workPermit", "studentVisa", "visitorVisa"];
    const translated = enumValues.map(residency => ({
        value: residency,
        label: residencyStatus[residency]
    })
    );
       
  return (
    <>
        <h1 className='font-bold text-4xl' style={{paddingLeft: 50, marginTop: 70}}>Sign Up</h1>
            
            <div className='residencyContainer mt-5 mb-5 text-2xl' 
                style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                maxWidth: '510px', 
                width: '100%',
                height: '500px',
                maxHeight: '100%',
                border: '1px solid #ccc', 
                padding: '20px', 
                borderRadius: '5px',
                paddingLeft: '40px',
                marginTop: '20px',
                marginLeft: '50px',
                marginBottom: '50px'
                }}
            >
                <p style={{paddingTop: 30, marginBottom: 20}}>What is your residency status?</p>
                
                {selectResidencyStatus && !showResidencyStatus && (
                    <p className="text-start text-muted text-2xl mb-2 px-1"
                        onClick={() => setShowResidencyStatus(true)} 
                        style={{ cursor: "pointer", borderRadius: '4px', border: '1px solid #ccc', padding: '2px' }}
                    >
                        <strong>{selectResidencyStatus}</strong> (click to change)
                    </p>
                    )}
                {showResidencyStatus && (
                    <select
                        value={selectResidencyStatus || 'selectOne'}
                        onChange={(e) => setSelectResidencyStatus(e.target.value)}
                        style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        {translated.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                                
                            </option>
                        ))}
                    </select>
                )}
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}   
            </div>
            {/*Who is Button*/}
             <div className='whoIsUsingThePlatform mt-10 mb-15 ml-12' style={{ display: 'flex', gap: '20px' }}>
                <button className='myself text-blue-950 rounded-lg p-5 px-20 border-2 solid-blue-950 text-2xl text-center cursor-pointer'> Myself </button>
                <button className='else  text-blue-950 rounded-lg p-5 px-13 border-2 solid-blue-950 text-2xl text-center cursor-pointer'> Someone else </button>
            </div>
        
            {/*SignUpAs*/}
             <div className='whoIsUsingThePlatform mt-10 mb-50 ml-12' style={{ display: 'flex', gap: '20px' }}>
                <Link href='/signUpTenant'>
                    <button className='myself bg-blue-950 text-white rounded-lg p-5 px-5 border-1px solid #ccc text-2xl text-center cursor-pointer'> Sign Up as Tenant </button>
                </Link>

                <Link href='/signUpLandlord'>
                    <button className='someoneElse  bg-blue-950 text-white rounded-lg p-5 px-5 border-1px solid #ccc text-2xl text-center cursor-pointer'> Sign Up as Landlord </button>
                </Link>
            </div>
    </>
  )
}

export default page
