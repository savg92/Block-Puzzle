import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './styles/ThemeContext';
import { Grid } from './components/Grid/Grid';
import { DraggablePiece } from './components/Piece/DraggablePiece';
import { PIECES } from './engine/pieces';
import "./styles/global.css";

export default function App() {
  const handleDragEnd = (x: number, y: number) => {
    console.log('Dropped at:', x, y);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#020617' }}>
          <View className="flex-1" style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <View style={{ alignItems: 'center', marginBottom: 32 }}>
              <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#3b82f6', marginBottom: 8 }}>
                Block Puzzle
              </Text>
              <Text style={{ fontSize: 18, color: '#94a3b8' }}>
                UI Foundation Ready
              </Text>
            </View>
            
            <Grid />
            
            <View style={{ flexDirection: 'row', marginTop: 40, justifyContent: 'space-around', width: '100%' }}>
              <DraggablePiece 
                piece={PIECES.SMALL_L} 
                color="orange" 
                onDragEnd={handleDragEnd} 
              />
              <DraggablePiece 
                piece={PIECES.SQUARE_2} 
                color="blue" 
                onDragEnd={handleDragEnd} 
              />
              <DraggablePiece 
                piece={PIECES.LINE_3} 
                color="green" 
                onDragEnd={handleDragEnd} 
              />
            </View>
            
            <StatusBar style="light" />
          </View>
        </SafeAreaView>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}