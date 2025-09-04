import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from './styles';

const ButtonPage = ({ label, onPress, style }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

export default ButtonPage;