import React from 'react'

function LoadingLine() {




  return (
    <>
    <style>{`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    .content-blurred {
      filter: blur(5px);
    }
    .content-disabled {
      pointer-events: auto;  /* Disables all interaction */
    }
  `}</style>


    <div className="loader-line"></div>
   <div className="loading-overlay  content-disabled"></div>
    </>
  )
}
export default LoadingLine