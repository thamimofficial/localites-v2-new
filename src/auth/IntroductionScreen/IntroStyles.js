import { StyleSheet, Dimensions } from 'react-native';
import Fonts from '../../constants/Font';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  header: {
    fontSize: 24,
    fontFamily:'Sora-Bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    fontFamily:Fonts.regular
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 63,
    width: width - 40,
    alignSelf: 'center',
  },
  skipText: {
    fontSize: 16,
    color: 'orange',
    fontFamily:'Sora-Bold'
  },
  paginationContainer: {
    flex: 1,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'orange',
  },
  nextButton: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 20, 
    borderRadius: 32,
  },
  getStartedButton: {
    paddingHorizontal: 30, // Ensures the size remains the same
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily:'Sora-Bold',
    textAlign: 'center',
  },
});
