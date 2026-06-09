import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>😵</Text>
          <Text style={styles.title}>出了点问题</Text>
          <Text style={styles.subtitle}>请重启应用试试</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.onReset?.()}
          >
            <Text style={styles.buttonText}>重新开始</Text>
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
    backgroundColor: '#0d0d0d',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 16,
  },
  subtitle: {
    color: '#888888',
    fontSize: 15,
    marginTop: 8,
  },
  button: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#e85d8a',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#e85d8a',
    fontSize: 15,
  },
});

export default ErrorBoundary;
