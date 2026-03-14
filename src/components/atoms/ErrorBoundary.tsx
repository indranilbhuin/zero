import React, {Component, ErrorInfo, ReactNode} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import PrimaryText from './PrimaryText';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(): State {
    return {hasError: true};
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (__DEV__) {
      console.error('ErrorBoundary caught:', error, info.componentStack);
    }
  }

  handleRetry = () => {
    this.setState({hasError: false});
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <PrimaryText size={40} weight="bold">:(</PrimaryText>
          <PrimaryText size={16} weight="semibold" style={styles.title}>
            Something went wrong
          </PrimaryText>
          <PrimaryText size={13} color="#888" style={styles.subtitle}>
            The app ran into an unexpected error.{'\n'}Your data is safe.
          </PrimaryText>
          <TouchableOpacity onPress={this.handleRetry} style={styles.button} activeOpacity={0.7}>
            <PrimaryText size={14} weight="semibold" color="#fff">
              Try Again
            </PrimaryText>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#000',
  },
  title: {
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#22c55e',
  },
});

export default ErrorBoundary;
