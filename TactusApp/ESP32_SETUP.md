# 🔧 Configuração ESP32 Bluetooth

## ⚠️ Importante
O módulo `react-native-bluetooth-classic` **NÃO FUNCIONA** no Expo Go. É necessário fazer build nativo.

## 🛠️ Configuração Necessária

### 1. Instalar dependências (já feito ✅)
```bash
npm install react-native-bluetooth-classic
```

### 2. Configurar Android (OBRIGATÓRIO)
Adicione no `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

### 3. Build Nativo (OBRIGATÓRIO)
```bash
# Limpar cache
cd android && ./gradlew clean && cd ..

# Build nativo Android
npx expo run:android
```

## 🎮 Para Desenvolvimento
Use o **ESP32 Simulator** que aparece em modo desenvolvimento:
- Funciona no navegador web (`npx expo start` + pressionar 'w')
- Simula as 10 teclas das luvas (QWERTYUIOP)
- Perfeito para testar a lógica sem hardware

## 📱 Para Produção
1. **Pareie o ESP32** com o celular via Bluetooth
2. **Execute build nativo**: `npx expo run:android`
3. **Use o ESP32Controller** no app para conectar às luvas

## 🔍 Troubleshooting

### Erro: "BluetoothSerial.isBluetoothEnabled is not a function"
- **Causa**: Rodando no Expo Go ou sem build nativo
- **Solução**: Use `npx expo run:android` em vez de Expo Go

### ESP32 não aparece na lista
- **Causa**: ESP32 não pareado
- **Solução**: Pareie manualmente nas configurações do Android

### Conexão falha
- **Causa**: Permissões não concedidas
- **Solução**: Permita localização e Bluetooth nas configurações do app