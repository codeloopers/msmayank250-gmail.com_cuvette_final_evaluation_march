
import React from 'react';

const CopyLink = ({ link }) => {
    const fullUrl = `https://msmayank250-gmail-com-cuvette-final.onrender.com${link}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl)
      .then(() => alert('Link copied to clipboard!'))
      .catch((err) => console.error('Failed to copy link: ', err));
  };

  

  return (
    <div className="copy-link-container">
      
      <div onClick={copyToClipboard} className='copy'>Your Link is here<div>
       
      </div></div>
    </div>
  );
};

export default CopyLink;
