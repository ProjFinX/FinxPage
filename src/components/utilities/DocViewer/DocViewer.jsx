import React, { useState, useEffect, useRef } from 'react';
import ImageViewer from './drivers/ImageViewer';
import OtherViewer from './drivers/OtherViewer';
import PdfViewer from './drivers/PDFViewer';


const DocViewer = ({ localUrl, postUrl, filename }) => {

  debugger;

  const filetype = () => {

    const extension = filename?.toString().split('.').pop(); // get file extension

    switch (extension) {

      case "pdf":
        return extension;
      case "jpg":
        return "image";
      case "png":
        return "image"
      case "jpeg":
        return "image";
      case "jfif" :
        return "image";
      default:
        return "other";

    }

  }
debugger;

  switch (filetype()) {
    case "image":
      return <ImageViewer localUrl={localUrl} postUrl={postUrl} />;
    case "pdf":
      return <PdfViewer url={localUrl} filename={filename} />;
      case "other":
        return <OtherViewer url={localUrl} filename={filename} />;
    default:
      return null;


  }

};
export default DocViewer;
