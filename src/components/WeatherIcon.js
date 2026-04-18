import React from 'react';

function WeatherIcon({ data, size = 48, className = '', style = {} }) {
  if (!data || !data.icon) return null;

  return (
    <img
      src={data.icon}
      alt={data.label || 'Weather Icon'}
      width={size}
      height={size}
      className={className}
      style={{
        display: 'block',
        filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))',
        ...style
      }}
      onError={(e) => {

        e.target.src = '/animated/cloudy.svg';
      }}
    />
  );
}

export default WeatherIcon;
