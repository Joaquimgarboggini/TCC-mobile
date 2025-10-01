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

const HeaderMinimal = ({ title, onBack, iconType = 'home', isHome = false, inverted = false }) => {
  const IconComponent = iconComponents[iconType] || HomeIcon;
  
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingTop: 30, // Reduzido de 40 para 30
      paddingBottom: 15, // Reduzido de 20 para 15
      backgroundColor: 'transparent'
    }}>
      {/* Left side - Conteúdo dinâmico baseado em inverted */}
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
        ) : inverted ? (
          // Se invertido, mostrar título da página no lado esquerdo
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
            marginLeft: -20, // Estende até a borda esquerda
            paddingLeft: 36, // Compensa o margin negativo
            marginTop: -45, // Ajustado para nova altura
            paddingTop: 53, // Ajustado para nova altura
            marginRight: 60, // Margem à direita para não esconder na barra do Android
          }}>
            <IconComponent size={20} color="#333" style={{ marginRight: 8 }} />
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#333'
            }}>
              {title}
            </Text>
          </View>
        ) : (
          // Modo normal: seta de voltar no lado esquerdo
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

      {/* Right side - Conteúdo dinâmico baseado em inverted */}
      <View style={{ alignItems: 'flex-end' }}>
        {!isHome && inverted ? (
          // Se invertido, mostrar seta de voltar no lado direito
          onBack && (
            <View style={{ paddingRight: 60 }}> {/* Aumentado de 40 para 60 para margem da barra do Android */}
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
        ) : !isHome && !inverted ? (
          // Modo normal: título da página no lado direito
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
            marginTop: -46, // Sobe mais o título
            paddingTop: 54, // Compensa o margin negativo
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
        ) : null}
      </View>
    </View>
  );
};

export default HeaderMinimal;