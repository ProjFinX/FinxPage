import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaDownload, FaSearchMinus, FaSearchPlus } from 'react-icons/fa';


pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/js/pdf.worker.min.mjs`;

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;



function PdfViewer(url , filename) {

    debugger;
    const [numPages, setNumPages] = useState(null);

    const [scale, setScale] = useState(1);

    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    function handleZoomIn() {
        setScale(scale + 0.1);
    }

    function handleZoomOut() {
        setScale(scale - 0.1);
    }

    function handlePageChange(newPageNumber) {
        setPageNumber(newPageNumber);
    }


    function handleDownload() {

        debugger;

        const a = document.createElement('a');
      a.href = url.url;
      a.download = url.filename;
      a.click();
      URL.revokeObjectURL(url.url);



    }


    return (
        <div className="pdf-viewer">
            <div className="pdf-controls">
                <button className="pdf-control" onClick={handleZoomIn}>
                    <FaSearchPlus />
                </button>
                <button className="pdf-control" onClick={handleZoomOut}>
                    <FaSearchMinus />
                </button>
                <button className="pdf-control" onClick={handleDownload}>
                    <FaDownload />
                </button>
            </div>
            <div className="pdf-page-navigation">
                <button
                    className="pdf-page-nav-button"
                    disabled={pageNumber === 1}
                    onClick={() => handlePageChange(pageNumber - 1)}
                >
                    Previous
                </button>
                <span className="pdf-page-number">
                    Page {pageNumber} of {numPages}
                </span>
                <button
                    className="pdf-page-nav-button"
                    disabled={pageNumber === numPages}
                    onClick={() => handlePageChange(pageNumber + 1)}
                >
                    Next
                </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Document file={url.url} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} scale={scale} />
            </Document>
            </div>
        </div>
    );
}

export default PdfViewer;