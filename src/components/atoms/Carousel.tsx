import React from 'react';
import {View, StyleSheet} from 'react-native';
import Swiper from 'react-native-swiper';
import PrimaryText from './PrimaryText';
import useThemeColors from '../../hooks/useThemeColors';
import SvgImage from '../../../assets/images/4.svg';
import SvgImage1 from '../../../assets/images/5.svg';
import SvgImage2 from '../../../assets/images/6.svg';

const Carousel = () => {
  const colors = useThemeColors();
  const data = [
    {
      id: '1',
      image: <SvgImage width="250" height="250" />,
      text: 'Track your expenses',
    },
    {
      id: '2',
      image: <SvgImage1 width="250" height="250" />,
      text: 'Analyse your spendings',
    },
    {
      id: '3',
      image: <SvgImage2 width="250" height="250" />,
      text: 'Track your Borrowings and Lendings',
    },
  ];
  return (
    <Swiper
      style={styles.wrapper}
      height={300}
      horizontal={true}
      autoplay
      dot={
        <View
          style={{
            backgroundColor: colors.secondaryAccent,
            width: 8,
            height: 8,
            borderRadius: 4,
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 3,
          }}
        />
      }
      activeDot={
        <View
          style={{
            backgroundColor: colors.primaryText,
            width: 9,
            height: 9,
            borderRadius: 5,
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 3,
          }}
        />
      }
      paginationStyle={{
        bottom: '15%',
        left: 0,
        right: 0,
      }}
      loop>
      {data.map(item => (
        <View style={styles.slide} key={item.id}>
          {item.image}
          <PrimaryText style={{marginTop: '3%'}}>{item.text}</PrimaryText>
        </View>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: '30%',
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  image: {
    height: 250,
    width: 200,
  },
});

export default Carousel;
