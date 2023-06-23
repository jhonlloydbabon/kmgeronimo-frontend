import React, { useState, useEffect } from 'react';

const PageHeader = ({ link }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="py-2 px-5 flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-semibold uppercase text-dark-gray">{link}</h1>
        <h3 className="text-sm text-dark-gray">
          {`${currentTime.toLocaleDateString()} ${currentTime.toLocaleTimeString()}`}
        </h3>
      </div>
      <div>
        <h4 className="capitalize font-medium">
          <p className='text-dark-gray'>
            <span>admin</span> / <span className='underline'>{link}</span>
          </p>
        </h4>
      </div>
    </div>
  );
}

export default PageHeader;
