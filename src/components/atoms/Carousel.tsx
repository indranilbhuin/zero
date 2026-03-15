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
  {id: '1', title: 'Track Expenses', subtitle: 'Simple, fast, always offline'},
  {id: '2', title: 'Visual Reports', subtitle: 'Understand where your money goes'},
  {id: '3', title: 'Manage Debts', subtitle: 'Never forget who owes what'},
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
      dot={<View style={[gs.m3, gs.rounded4, {backgroundColor: colors.secondaryAccent, width: 6, height: 6}]} />}
      activeDot={<View style={[gs.m3, gs.rounded5, {backgroundColor: colors.primaryText, width: 8, height: 8}]} />}
      paginationStyle={[gs.bottom15p, gs.left0, gs.right0]}
      loop>
      {SLIDES.map(slide => {
        const ImageComponent = SLIDE_IMAGES[slide.id];
        return (
          <View style={gs.center} key={slide.id}>
            <ImageComponent width="220" height="220" />
            <PrimaryText size={16} weight="semibold" style={gs.mt15}>
              {slide.title}
            </PrimaryText>
            <PrimaryText size={12} color={colors.secondaryText} style={gs.mt4}>
              {slide.subtitle}
            </PrimaryText>
          </View>
        );
      })}
    </Swiper>
  );
};

export default memo(Carousel);
