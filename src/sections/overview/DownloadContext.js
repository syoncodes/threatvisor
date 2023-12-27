// DownloadContext.js
import React, { createContext, useContext, useState } from 'react';

const DownloadContext = createContext();

export const useDownloadContext = () => {
  return useContext(DownloadContext);
};

export const DownloadProvider = ({ children }) => {
  const [downloadFunction, setDownloadFunction] = useState(null);

  const initiateDownload = () => {
    if (downloadFunction) {
      downloadFunction();
    }
  };

  return (
    <DownloadContext.Provider value={{ setDownloadFunction, initiateDownload }}>
      {children}
    </DownloadContext.Provider>
  );
};
