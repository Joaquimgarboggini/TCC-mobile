import React from 'react';
import { Image } from 'react-native';

const AjudaIcon = ({ size = 24, color = '#333' }) => {
  return (
    <Image 
      source={require('./AjudaIcon.png')}
      style={{ 
        width: size, 
        height: size
      }}
      resizeMode="contain"
    />
  );
};

export default AjudaIcon;