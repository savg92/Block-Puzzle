import "./styles/global.css";
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 items-center justify-center bg-white dark:bg-slate-900">
        <Text className="text-xl font-bold text-slate-900 dark:text-white">
          Block Puzzle Initialized!
        </Text>
        <StatusBar style="auto" />
      </View>
    </GestureHandlerRootView>
  );
}
