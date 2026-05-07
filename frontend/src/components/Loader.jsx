import React from 'react'
import '../componentStyles/Loader.css'

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-ring">
        <div className="loader-ring-inner" />
        <div className="loader-dot-orbit">
          <div className="loader-dot" />
        </div>
      </div>
      <p className="loader-text">Loading<span className="loader-dots"><span>.</span><span>.</span><span>.</span></span></p>
    </div>
  )
}

export default Loader