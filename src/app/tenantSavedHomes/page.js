'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TenantDashboardSidebar from '@/components/tenantDashboardSidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

const Page = () => {
    const router = useRouter()

    const [selectedProperty, setSelectedProperty] = useState(false)
    const [loading, setLoading] = useState(true)
    const [property, setProperty] = useState(null)
    const [tenantId, setTenantId] = useState(null)

    const isTenantSelected =
        property?.selectedTenant?.toString() === tenantId?.toString()

    useEffect(() => {
        const fetchTenant = async () => {
            try {
                const response = await fetch('/api/tenant', {
                    method: 'GET',
                    credentials: 'include',
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch tenant')
                }

                const data = await response.json()

                console.log('Tenant:', data)

                // Tenant ID
                setTenantId(data._id)

                // Get the saved property
                const savedProperty = data.property?.[0] || null

                setProperty(savedProperty)

                // Property exists in tenant's saved properties
                setSelectedProperty(!!savedProperty)

            } catch (error) {
                console.error('Error fetching tenant:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchTenant()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <div>
            <TenantDashboardSidebar />

            <div className="justify-items-center p-6">

                {/* PROPERTY IMAGE */}
                <div className="rounded-full bg-gray-500 w-30 h-30 overflow-hidden">

                    {property?.previewPic ? (
                        <img
                            src={property.previewPic}
                            alt={property.title || 'Property'}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-center">
                            No Image
                        </div>
                    )}

                </div>

                {/* PROPERTY ID */}
                <p className="mt-4">
                    {property?._id || 'No property selected'}
                </p>

                {/* PROPERTY TITLE */}
                <h2 className="text-xl font-bold mt-2">
                    {property?.title || 'No property selected'}
                </h2>

                {/* PROPERTY ADDRESS */}
                {property?.address && (
                    <p className="text-gray-600 mt-1">
                        {property.address}
                    </p>
                )}

                {/* SELECTION STATUS */}
                <div className="mt-4">
                    <p className="flex items-center">

                        {isTenantSelected
                            ? 'You have been selected'
                            : 'Waiting for landlord selection'
                        }

                        {isTenantSelected && (
                            <FontAwesomeIcon
                                icon={faCheckCircle}
                                className="text-green-500 ml-2"
                            />
                        )}

                    </p>
                </div>

                {/* PAYMENT */}
                {isTenantSelected && (
                    <button
                        onClick={() => router.push('/payment')}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Proceed to pay
                    </button>
                )}

            </div>
        </div>
    )
}

export default Page