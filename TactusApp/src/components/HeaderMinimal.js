import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Importar ícones customizados
import HomeIcon from '../../assets/icons/HomeIcon';
import ExerciciosIcon from '../../assets/icons/ExerciciosIconFixed';
import MusicasIcon from '../../assets/icons/MusicasIconNew';
import TecladoIcon from '../../assets/icons/TecladoIconNew';
import ConfiguracoesIcon from '../../assets/icons/ConfiguracoesIconNew';
import AjudaIcon from '../../assets/icons/AjudaIconNew';

const iconComponents = {
  'home': HomeIcon,
  'exercicios': ExerciciosIcon,
  'musicas': MusicasIcon,
  'teclado': TecladoIcon,
  'configuracoes': ConfiguracoesIcon,
  'ajuda': AjudaIcon,
};

const HeaderMinimal = ({ title, onBack, iconType = 'home', isHome = false }) => {
  const IconComponent = iconComponents[iconType] || HomeIcon;
  
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingTop: 40,
      paddingBottom: 20,
      backgroundColor: 'transparent'
    }}>
      {/* Left side - Back arrow or App title */}
      <View style={{ alignItems: 'flex-start' }}>
        {isHome ? (
          <View style={{
            backgroundColor: '#151515',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            marginLeft: -20, // Estende até a borda esquerda
            paddingLeft: 32, // Compensa o margin negativo
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.2,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: 'white'
            }}>
              Tactus Glove App
            </Text>
          </View>
        ) : (
          onBack && (
            <View style={{ paddingLeft: 20 }}>
              <TouchableOpacity 
                onPress={onBack}
                style={{
                  padding: 8,
                  borderRadius: 20,
                  backgroundColor: '#f0f0f0',
                  minWidth: 40,
                  alignItems: 'center'
                }}
              >
                <Icon name="arrow-left" size={18} color="#333" />
              </TouchableOpacity>
            </View>
          )
        )}
      </View>

      {/* Right side - Page title with icon */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D9D9D9',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
        marginRight: -20, // Estende até a borda direita
        paddingRight: 36, // Compensa o margin negativo
        marginTop: -46, // Sobe mais o título (era -40)
        paddingTop: 54, // Compensa o margin negativo (era 48)
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: '#333',
          marginRight: 8
        }}>
          {title}
        </Text>
        <IconComponent size={20} color="#333" />
      </View>
    </View>
  );
};

export default HeaderMinimal;