import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';

const TopBar = ({ title, onBack, rightComponent }) => (
  <View style={styles.topBarContainer}>
    {onBack && (
      <TouchableOpacity onPress={onBack} style={styles.topBarBackButton}>
        <Icon name="chevron-left" size={28} color="#fff" />
      </TouchableOpacity>
    )}
    <Text style={styles.topBarTitle}>{title}</Text>
    <View style={styles.topBarRight}>{rightComponent}</View>
  </View>
);

export default TopBar;