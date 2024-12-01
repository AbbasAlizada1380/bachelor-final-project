import React from 'react';
import { useLocation } from 'react-router-dom';

const Completed = () => {
  const Location=useLocation();
  const {familyCode,Id}=Location.state;
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-950">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl mb-4 text-green-500">فامیل هذا نکاح خط خویش رااخذ نموده اند</h2>
        <h2 className="text-2xl mb-4 text-green-500">آی دی فامیل:{Id}</h2>
        <h2 className="text-2xl mb-4 text-green-500"> کود فامیل:{familyCode}</h2>


      </div>
    </div>
  );
};

export default Completed;
