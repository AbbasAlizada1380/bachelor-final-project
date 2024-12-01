import React from 'react';
import { ClipLoader } from 'react-spinners';

const LoadingOverlay = ({ loading }) => {
  return (
    loading && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <ClipLoader size={50} color={"#fff"} />
      </div>
    )
  );
};

export default LoadingOverlay;
