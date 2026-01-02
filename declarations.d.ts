declare module '*.svg' {
  import React from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module 'react-native-svg-charts' {
  import React from 'react';
  import {ViewStyle} from 'react-native';

  interface ChartProps {
    style?: ViewStyle;
    data?: any[];
    svg?: object;
    contentInset?: {top?: number; bottom?: number; left?: number; right?: number};
    numberOfTicks?: number;
    animate?: boolean;
    animationDuration?: number;
    gridMin?: number;
    gridMax?: number;
    children?: React.ReactNode;
  }

  interface PieChartProps extends ChartProps {
    innerRadius?: number | string;
    outerRadius?: number | string;
    labelRadius?: number | string;
    padAngle?: number;
    sort?: (a: any, b: any) => number;
    valueAccessor?: (args: {item: any; index: number}) => number;
  }

  export class PieChart extends React.Component<PieChartProps> {}
  export class BarChart extends React.Component<ChartProps> {}
  export class LineChart extends React.Component<ChartProps> {}
  export class AreaChart extends React.Component<ChartProps> {}
  export class StackedBarChart extends React.Component<ChartProps> {}
  export class StackedAreaChart extends React.Component<ChartProps> {}
  export class YAxis extends React.Component<ChartProps> {}
  export class XAxis extends React.Component<ChartProps> {}
  export class Grid extends React.Component<ChartProps> {}
}
