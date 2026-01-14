import React from 'react';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './styles/ThemeContext';
import "./styles/global.css";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <View className="flex-1 items-center justify-center bg-slate-950">
          <View className="p-6 rounded-2xl bg-slate-900 shadow-xl border border-slate-800">
            <Text className="text-3xl font-bold text-blue-500 mb-2">
              Block Puzzle
            </Text>
            <Text className="text-lg text-slate-400">
              UI Foundation Ready
            </Text>
          </View>
          <StatusBar style="light" />
        </View>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}