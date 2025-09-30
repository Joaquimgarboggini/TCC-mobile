import React from 'react';
import { Image } from 'react-native';

const TecladoIcon = ({ size = 24, color = '#333' }) => {
  return (
    <Image 
      source={require('./TecladoIcon.png')}
      style={{ 
        width: size, 
        height: size
      }}
      resizeMode="contain"
    />
  );
};

export default TecladoIcon;

export default TecladoIcon;