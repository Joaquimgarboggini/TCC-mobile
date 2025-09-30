import React from 'react';
import { Image } from 'react-native';

const ConfiguracoesIcon = ({ size = 24, color = '#333' }) => {
  return (
    <Image 
      source={require('./ConfiguracoesIcon.png')}
      style={{ 
        width: size, 
        height: size
      }}
      resizeMode="contain"
    />
  );
};

export default ConfiguracoesIcon;