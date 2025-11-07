"use client";
import React, { useState, useEffect} from 'react'

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
                maxWidth: '450px', 
                width: '100%',
                height: '300px', 
                border: '1px solid #ccc', 
                padding: '20px', 
                borderRadius: '5px',
                paddingLeft: '40px',
                marginTop: '20px',
                marginLeft: '50px'
                }}
            >
                <p style={{paddingTop: 30, marginBottom: 20}}>What is your residency Status?</p>
                
                {selectResidencyStatus && !showResidencyStatus && (
                    <p className="text-start text-muted text-2xl mb-2"
                        onClick={() => setShowResidencyStatus(true)} 
                        style={{ cursor: "pointer", borderRadius: '4px', border: '1px solid #ccc'}}
                    >
                        <strong className='text-xl'>{selectResidencyStatus}</strong> (click to change)
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
    </>
  )
}

export default page
