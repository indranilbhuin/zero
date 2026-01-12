import React, {memo} from 'react';
import {View} from 'react-native';
import Swiper from 'react-native-swiper';
import PrimaryText from './PrimaryText';
import useThemeColors from '../../hooks/useThemeColors';
import SvgImage from '../../../assets/images/4.svg';
import SvgImage1 from '../../../assets/images/5.svg';
import SvgImage2 from '../../../assets/images/6.svg';
import {gs} from '../../styles/globalStyles';

const SLIDES = [
  {id: '1', text: 'Track your expenses'},
  {id: '2', text: 'Analyse your spendings'},
  {id: '3', text: 'Track your Borrowings and Lendings'},
] as const;

const SLIDE_IMAGES: Record<string, React.FC<{width: string; height: string}>> = {
  '1': SvgImage,
  '2': SvgImage1,
  '3': SvgImage2,
};

const Carousel = () => {
  const colors = useThemeColors();

  return (
    <Swiper
      style={gs.mt30p}
      height={300}
      horizontal={true}
      autoplay
      dot={<View style={[gs.m3, gs.rounded4, gs.size8, {backgroundColor: colors.secondaryAccent}]} />}
      activeDot={<View style={[gs.m3, gs.rounded5, {backgroundColor: colors.primaryText, width: 9, height: 9}]} />}
      paginationStyle={[gs.bottom15p, gs.left0, gs.right0]}
      loop>
      {SLIDES.map(slide => {
        const ImageComponent = SLIDE_IMAGES[slide.id];
        return (
          <View style={gs.center} key={slide.id}>
            <ImageComponent width="250" height="250" />
            <PrimaryText style={gs.mt3p}>{slide.text}</PrimaryText>
          </View>
        );
      })}
    </Swiper>
  );
};

export default memo(Carousel);
