import React, {memo} from 'react';
import {ICON_REGISTRY, isValidIconName} from './IconRegistry';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#000000',
  strokeWidth = 2,
}) => {
  if (!isValidIconName(name)) {
    console.warn(`Icon "${name}" not found in registry`);
    return null;
  }

  const IconComponent = ICON_REGISTRY[name];

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
    />
  );
};

export default memo(Icon);
export {type IconName} from './IconRegistry';
