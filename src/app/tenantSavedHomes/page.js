'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TenantDashboardSidebar from '@/components/tenantDashboardSidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

const Page = () => {
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [properties, setProperties] = useState([])
    const [tenantId, setTenantId] = useState(null)

    useEffect(() => {
        const fetchSavedProperties = async () => {
            try {
                const response = await fetch('/api/favorites', {
                    method: 'GET',
                    credentials: 'include',
                    cache: 'no-store',
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(
                        data.message || 'Failed to fetch saved properties'
                    )
                }

                console.log('SAVED FAVORITES:', data)

                setTenantId(data.tenantId)

                // Extract actual property documents
                const savedProperties = [
                    ...new Map(
                        (data.favorites || [])
                            .map(favorite => favorite.propertyId)
                            .filter(property => property && property._id)
                            .map(property => [property._id.toString(), property])
                    ).values()
                ];

                setProperties(savedProperties);

            } catch (error) {
                console.error('Error fetching saved properties:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSavedProperties()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading saved properties...
            </div>
        )
    }

    return (
        <div>
            <TenantDashboardSidebar />

            <div className="p-6">

                <h1 className="text-2xl font-bold mb-6">
                    My Saved Homes
                </h1>

                {properties.length === 0 ? (

                    <div className="text-center p-6">
                        <h2 className="text-xl font-bold">
                            No saved properties
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Properties you save will appear here.
                        </p>
                    </div>

                ) : (

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {properties.map(property => {

                            const selectedTenantId =
                                property.selectedTenant?._id ||
                                property.selectedTenant

                            const isTenantSelected =
                                selectedTenantId?.toString() ===
                                tenantId?.toString()

                            return (
                                <div
                                    key={property._id}
                                    className="border rounded-lg p-5 shadow-md"
                                >
                                <Link 
                                    href={`/propertyCardExpanded?propertyId=${property._id}`}
                                    className='block cursor-pointer'
                                >

                                    {/* PROPERTY IMAGE */}
                                    <div className="w-full h-56 overflow-hidden rounded-lg bg-gray-200">

                                        {property.previewPic ? (
                                            <img
                                                src={property.previewPic}
                                                alt={property.title || 'Property'}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                No Image
                                            </div>
                                        )}

                                    </div>

                                    {/* PROPERTY DETAILS */}
                                    <p className="mt-4 text-sm text-gray-500">
                                        {property._id}
                                    </p>

                                    <h2 className="text-xl font-bold mt-2">
                                        {property.title}
                                    </h2>

                                    <p className="text-gray-600 mt-1">
                                        {property.address}
                                    </p>

                                    <p className="font-semibold mt-2">
                                        {property.price}                                         
                                    </p>
                                    <p className="text-sm mt-3 text-blue-600">
                                        View property and contact landlord
                                    </p>                                
                                </Link>

                                    {/* LANDLORD SELECTION STATUS */}
                                    <div className="mt-4">

                                        {isTenantSelected ? (

                                            <p className="flex items-center text-green-600">
                                                You have been selected

                                                <FontAwesomeIcon
                                                    icon={faCheckCircle}
                                                    className="ml-2"
                                                />
                                            </p>

                                        ) : (

                                            <p className="text-orange-500">
                                                Click to chat landlord to start selection process or wait for landlord selection if you have.
                                            </p>

                                        )}

                                    </div>

                                    {isTenantSelected && (
                                       <button
                                            onClick={() =>
                                                router.push(`/payment?propertyId=${property._id}`)
                                            }
                                            className="bg-blue-600 text-white px-5 py-2 rounded mt-4"
                                        >
                                            Proceed to pay
                                        </button>
                                    )}
                                </div>

                            )
                        })}

                    </div>
                )}

            </div>
        </div>
    )
}

export default Page
