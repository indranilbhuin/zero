import React from 'react';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

const Icon = ({name, size, color, type}) => {
  const iconProps = {
    name,
    size,
    color,
  };
  switch (type) {
    case 'AntDesign':
      return <AntDesignIcon {...iconProps} />;
    case 'FontAwesome':
      return <FontAwesomeIcon {...iconProps} />;
    case 'MaterialIcons':
      return <MaterialIconsIcon {...iconProps} />;
    case 'Feather':
      return <FeatherIcon {...iconProps} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcon {...iconProps} />;
    default:
      return <AntDesignIcon {...iconProps} />;
  }
};

export default Icon;
