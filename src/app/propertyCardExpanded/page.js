import React from 'react'
import PropExpandedNav from '../../components/propExpandedNav/index.js'

const index = () => {
  return (
    <div>
      <PropExpandedNav />
        <div className='property-card-expanded'>
            <h1>Property Card Expanded</h1>
            <p>
            This is the expanded view of a property card. It provides detailed information about the property,
            including features, amenities, and other relevant details that help potential buyers or renters make informed decisions.
            </p>    
        </div>
    </div>
  )
}

export default index
