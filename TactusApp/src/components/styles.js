import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // TopBar styles
  topBarContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    elevation: 4,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  topBarBackButton: {
    paddingRight: 16,
  },
  topBarTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    fontFamily: 'comic-sans-ms',
  },
  topBarRight: {
    minWidth: 40,
    alignItems: 'flex-end',
  },

  // ButtonPage styles
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },

  // App.js container
  appContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  // Page container styles (Ajuda, Exercicios, Musicas, Teclado)
  pageContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pageContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageText: {
    fontSize: 22,
    color: '#333',
  },

  // Scale selection styles
  scaleList: {
    marginVertical: 20,
  },
  scaleItem: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  selectedScaleItem: {
    backgroundColor: '#ddd',
    borderColor: '#888',
  },
  scaleText: {
    textAlign: 'center',
    fontSize: 16,
  },
  selectedScaleText: {
    marginTop: 16,
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },

  // Picker styles
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    marginVertical: 10,
  },
});

export default styles;