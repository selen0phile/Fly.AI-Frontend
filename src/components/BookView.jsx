import React, { useState } from 'react';
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function BookView({ url }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>
      {(url !== '' && url) && <Document file={{ url: url }} onLoadSuccess={onDocumentLoadSuccess} onLoadError={(error) => console.log("Inside Error", error)}>
        <Page pageNumber={pageNumber} />
      </Document>}
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
}

export default BookView