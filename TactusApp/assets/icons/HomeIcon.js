import React from 'react';
import { Image } from 'react-native';

const HomeIcon = ({ size = 24, color = '#333' }) => {
  return (
    <Image 
      source={require('./HomeIcon.png')}
      style={{ 
        width: size, 
        height: size
      }}
      resizeMode="contain"
    />
  );
};

export default HomeIcon;