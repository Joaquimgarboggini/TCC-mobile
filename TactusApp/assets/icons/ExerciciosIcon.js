import React from 'react';
import { SvgUri } from 'react-native-svg';

const ExerciciosIcon = ({ size = 24, color = '#333' }) => {
  const svgSource = require('./ExerciciosIcon.svg');
  
  return (
    <SvgUri
      width={size}
      height={size}
      uri={svgSource}
      style={{ tintColor: color }}
    />
  );
};

export default ExerciciosIcon;
);

export default ExerciciosIcon;