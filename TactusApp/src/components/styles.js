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
});

export default styles