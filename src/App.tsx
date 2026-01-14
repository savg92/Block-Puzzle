import React from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './styles/ThemeContext';
import { Grid } from './components/Grid/Grid';
import "./styles/global.css";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#020617' }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <View style={{ alignItems: 'center', marginBottom: 32 }}>
              <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#3b82f6', marginBottom: 8 }}>
                Block Puzzle
              </Text>
              <Text style={{ fontSize: 18, color: '#94a3b8' }}>
                UI Foundation Ready
              </Text>
            </View>
            
            <Grid />
            
            <StatusBar style="light" />
          </View>
        </SafeAreaView>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
