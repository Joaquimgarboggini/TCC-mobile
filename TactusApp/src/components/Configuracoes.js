import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import HeaderMinimal from './HeaderMinimal';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { ScaleContext } from '../context/ScaleContext';
import ESP32Stable from './ESP32Stable';

const Configuracoes = () => {
  const navigation = useNavigation();
  const { 
    selectedScale, 
    setSelectedScale, 
    availableScales,
    selectedInstrument,
    setSelectedInstrument
  } = useContext(ScaleContext);
  
  const [localScale, setLocalScale] = useState(selectedScale || 'C Maior');
  const [localInstrument, setLocalInstrument] = useState(selectedInstrument || 'Piano1');
  const [isScaleDropdownOpen, setIsScaleDropdownOpen] = useState(false);
  const [isInstrumentDropdownOpen, setIsInstrumentDropdownOpen] = useState(false);

  // Verificação de segurança para availableScales
  const safeAvailableScales = availableScales || ['C Maior', 'D Maior', 'E Maior', 'F Maior', 'G Maior', 'A Maior', 'B Maior'];

  // Lista de instrumentos disponíveis
  const availableInstruments = [
    { key: 'Piano1', label: 'Piano (padrão)' },
    { key: 'Keys1', label: 'Keys 1' },
    { key: 'Keys2', label: 'Keys 2' },
    { key: 'Keys3', label: 'Keys 3' },
    { key: 'Lead1', label: 'Lead 1' },
    { key: 'Lead2', label: 'Lead 2' },
    { key: 'Lead3', label: 'Lead 3' },
  ];

  const handleScaleSelection = (scale) => {
    setLocalScale(scale);
    setIsScaleDropdownOpen(false);
  };

  const handleInstrumentSelection = (instrument) => {
    setLocalInstrument(instrument);
    setIsInstrumentDropdownOpen(false);
  };

  const getInstrumentLabel = (instrumentKey) => {
    const instrument = availableInstruments.find(inst => inst.key === instrumentKey);
    return instrument ? instrument.label : instrumentKey;
  };

  const handleConclude = () => {
    setSelectedScale(localScale);
    setSelectedInstrument(localInstrument);
    navigation.goBack();
  };

  const handleCancel = () => {
    setLocalScale(selectedScale);
    setLocalInstrument(selectedInstrument);
    navigation.goBack();
  };

  const handleBack = () => {
    if (localScale !== selectedScale || localInstrument !== selectedInstrument) {
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
      <ScrollView 
        contentContainerStyle={{ 
          alignItems: 'center', 
          paddingHorizontal: 20, 
          paddingTop: 20,
          paddingBottom: 120  // Aumentar padding para ver os botões no celular
        }}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        <Text style={[styles.pageText, { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 }]}>
          Configurações do Aplicativo
        </Text>
        
        {/* Seção da Escala */}
        <Text style={[styles.pageText, { marginBottom: 15 }]}>
          Selecione uma escala musical:
        </Text>
        
        {/* Dropdown da Escala */}
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsScaleDropdownOpen(true)}
        >
          <Text style={styles.dropdownButtonText}>{String(localScale || 'Nenhuma')}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        {/* Seção do Instrumento */}
        <Text style={[styles.pageText, { marginBottom: 15, marginTop: 30 }]}>
          Selecione um instrumento:
        </Text>
        
        {/* Dropdown do Instrumento */}
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsInstrumentDropdownOpen(true)}
        >
          <Text style={styles.dropdownButtonText}>{getInstrumentLabel(localInstrument)}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        {/* Modal do Dropdown da Escala */}
        <Modal
          visible={isScaleDropdownOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsScaleDropdownOpen(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsScaleDropdownOpen(false)}
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
                onPress={() => setIsScaleDropdownOpen(false)}
              >
                <Text style={styles.modalCloseButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Modal do Dropdown do Instrumento */}
        <Modal
          visible={isInstrumentDropdownOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsInstrumentDropdownOpen(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsInstrumentDropdownOpen(false)}
          >
            <View style={styles.dropdownModal}>
              <Text style={styles.modalTitle}>Selecione um Instrumento</Text>
              
              <FlatList
                data={availableInstruments}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      localInstrument === item.key && styles.selectedDropdownItem
                    ]}
                    onPress={() => handleInstrumentSelection(item.key)}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      localInstrument === item.key && styles.selectedDropdownItemText
                    ]}>
                      {item.label}
                    </Text>
                    {localInstrument === item.key && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                )}
              />
              
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setIsInstrumentDropdownOpen(false)}
              >
                <Text style={styles.modalCloseButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
        
        <Text style={[styles.pageText, { marginVertical: 30, textAlign: 'center', fontSize: 16 }]}>
          Escala selecionada: <Text style={{ fontWeight: 'bold', color: '#007AFF' }}>{String(localScale || 'Nenhuma')}</Text>
        </Text>
        
        <Text style={[styles.pageText, { marginBottom: 30, textAlign: 'center', fontSize: 16 }]}>
          Instrumento selecionado: <Text style={{ fontWeight: 'bold', color: '#007AFF' }}>{getInstrumentLabel(localInstrument)}</Text>
        </Text>
        
        {/* ESP32Stable */}
        <ESP32Stable />
        
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