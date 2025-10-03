import React from 'react';
import { Image } from 'react-native';

const MemoriaIcon = ({ size = 20, color = '#333', style }) => {
  return (
    <Image 
      source={require('./exercicios/MemoriaIcon.png')}
      style={[
        {
          width: size,
          height: size,
          tintColor: color
        },
        style
      ]}
      resizeMode="contain"
    />
  );
};

export default MemoriaIcon;