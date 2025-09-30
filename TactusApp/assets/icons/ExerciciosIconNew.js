import React from 'react';
import { Image } from 'react-native';

const ExerciciosIcon = ({ size = 24, color = '#333' }) => {
  return (
    <Image 
      source={require('./ExerciciosIcon.svg')}
      style={{ 
        width: size, 
        height: size,
        tintColor: color 
      }}
      resizeMode="contain"
    />
  );
};

export default ExerciciosIcon;