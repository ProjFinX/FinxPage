import React, { useState, useEffect, useRef } from 'react';


const ImageViewer = ({ localUrl, postUrl }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoom, setZoom] = useState(1.0);
  const imgRef = useRef(null);

  useEffect(() => {
    const loadLocalImage = async () => {
      try {
        setImageUrls([localUrl]);

      } catch (error) {
        console.error(error);
      }
    };

    loadLocalImage();
  }, [localUrl]);

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handleZoomIn = () => {
    if (zoom < 2.0) {
      setZoom(zoom + 0.1);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 0.5) {
      setZoom(zoom - 0.1);
    }
  };

  return (
    <div>
      <div className='row'>
        <div className="pdf-viewer">
          <div className="pdf-controls">
            <button className="pdf-control" onClick={handleZoomIn}>Zoom In</button>
            <button className="pdf-control" onClick={handleZoomOut}>Zoom Out</button>
          </div>
        </div>
      </div>
      <div className='row' style={{ display: 'flex', justifyContent: 'center' }}>
      {imageUrls.length > 0 ? (
        <img
          src={imageUrls[currentImageIndex]}
          ref={imgRef}
          style={{ width: `${zoom * 100}%` }}
        />
      ) : (
        <p>Loading image...</p>
      )}

      </div>

    </div>
  );
};

export default ImageViewer;