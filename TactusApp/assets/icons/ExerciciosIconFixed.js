import React from 'react';
import { Image } from 'react-native';

const ExerciciosIcon = ({ size = 24, color = '#333' }) => {
  return (
    <Image 
      source={require('./ExerciciosIcon.png')}
      style={{ 
        width: size, 
        height: size
      }}
      resizeMode="contain"
    />
  );
};

export default ExerciciosIcon;