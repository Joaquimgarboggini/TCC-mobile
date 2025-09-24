import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';

const TopBar = ({ title, onBack, rightComponent }) => (
  <View style={styles.topBarContainer}>
    <View style={styles.topBarBackButton}>
      {onBack && (
        <TouchableOpacity 
          onPress={onBack}
          style={{ 
            padding: 8, 
            minWidth: 44, 
            minHeight: 44, 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-left" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
    <View style={styles.topBarRight}>{rightComponent}</View>
    <Text style={styles.topBarTitle}>{title}</Text>
  </View>
);

export default TopBar;