import { StyleSheet } from 'react-native';

const cardShadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
};

export const shadowStyles = StyleSheet.create({
  card: {
    ...cardShadow,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Cairo-Regular',
    fontSize: 16,
    ...cardShadow,
    textAlign: 'right',
  },
});