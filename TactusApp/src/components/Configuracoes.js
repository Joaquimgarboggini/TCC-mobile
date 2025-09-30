import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import HeaderMinimal from './HeaderMinimal';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { ScaleContext } from '../context/ScaleContext';

const Configuracoes = () => {
  const navigation = useNavigation();
  const { selectedScale, setSelectedScale, availableScales } = useContext(ScaleContext);
  const [localScale, setLocalScale] = useState(selectedScale || 'C Maior');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Verificação de segurança para availableScales
  const safeAvailableScales = availableScales || ['C Maior', 'D Maior', 'E Maior', 'F Maior', 'G Maior', 'A Maior', 'B Maior'];

  const handleScaleSelection = (scale) => {
    setLocalScale(scale);
    setIsDropdownOpen(false);
  };

  const handleConclude = () => {
    setSelectedScale(localScale);
    navigation.goBack();
  };

  const handleCancel = () => {
    setLocalScale(selectedScale);
    navigation.goBack();
  };

  const handleBack = () => {
    if (localScale !== selectedScale) {
      handleCancel();
    } else {
      navigation.goBack();
    }
  };

  // Verificação de segurança - não renderizar se o contexto não estiver carregado
  if (!selectedScale && !availableScales) {
    return (
      <View style={styles.pageContainer}>
        <HeaderMinimal title="Configurações" iconType="configuracoes" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 20, paddingTop: 20 }}>
          <Text style={styles.pageText}>Carregando configurações...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.pageContainer}>
      <HeaderMinimal title="Configurações" icon="cog" onBack={handleBack} />
      <ScrollView contentContainerStyle={[{ 
        flexGrow: 1, 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingTop: 20 
      }]}>
        <Text style={[styles.pageText, { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 }]}>
          Configuração da Escala Musical
        </Text>
        
        <Text style={[styles.pageText, { marginBottom: 15 }]}>
          Selecione uma escala musical:
        </Text>
        
        {/* Dropdown personalizado */}
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsDropdownOpen(true)}
        >
          <Text style={styles.dropdownButtonText}>{localScale}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        {/* Modal do Dropdown */}
        <Modal
          visible={isDropdownOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsDropdownOpen(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsDropdownOpen(false)}
          >
            <View style={styles.dropdownModal}>
              <Text style={styles.modalTitle}>Selecione uma Escala</Text>
              
              <FlatList
                data={safeAvailableScales}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      localScale === item && styles.selectedDropdownItem
                    ]}
                    onPress={() => handleScaleSelection(item)}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      localScale === item && styles.selectedDropdownItemText
                    ]}>
                      {item}
                    </Text>
                    {localScale === item && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                )}
              />
              
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setIsDropdownOpen(false)}
              >
                <Text style={styles.modalCloseButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
        
        <Text style={[styles.pageText, { marginVertical: 30, textAlign: 'center', fontSize: 16 }]}>
          Escala selecionada: <Text style={{ fontWeight: 'bold', color: '#007AFF' }}>{localScale}</Text>
        </Text>
        
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.confirmButton,
              { 
                minWidth: 150, 
                width: '60%', 
                maxWidth: 200, 
                paddingVertical: 10,
                marginVertical: 4
              }
            ]} 
            onPress={handleConclude}
          >
            <Text style={[styles.buttonText, { fontSize: 16, fontWeight: 'bold' }]}>✓ Concluir</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.cancelButton,
              { 
                minWidth: 150, 
                width: '60%', 
                maxWidth: 200, 
                paddingVertical: 10,
                marginVertical: 4
              }
            ]} 
            onPress={handleCancel}
          >
            <Text style={[styles.buttonText, { fontSize: 16 }]}>✕ Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Configuracoes;