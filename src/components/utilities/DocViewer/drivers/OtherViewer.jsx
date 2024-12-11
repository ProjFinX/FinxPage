import React, { useState } from "react";
import { FaDownload, FaSearchMinus, FaSearchPlus } from "react-icons/fa";

function OtherViewer(url, filename) {
  function handleDownload() {
    debugger;

    const a = document.createElement("a");
    a.href = url.url;
    a.download = url.filename;
    a.click();
    URL.revokeObjectURL(url.url);
  }

  return (
    <div className="pdf-viewer">
      <div className="pdf-controls">
        <button className="pdf-control" onClick={handleDownload}>
          <FaDownload />
        </button>
      </div>
      File cannot be viewed , Unsupported format !
    </div>
  );
}

export default OtherViewer;
