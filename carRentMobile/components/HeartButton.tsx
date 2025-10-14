import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FavoritesService from '@/services/FavoritesService';

interface HeartButtonProps {
  vehicleId: string;
  size?: number;
  color?: string;
  onToggle?: (isFavorite: boolean) => void;
}

export default function HeartButton({ 
  vehicleId, 
  size = 24, 
  color = '#FF5722',
  onToggle 
}: HeartButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    checkFavoriteStatus();
  }, [vehicleId]);

  const checkFavoriteStatus = async () => {
    try {
      const favorite = await FavoritesService.isFavorite(vehicleId);
      setIsFavorite(favorite);
    } catch (error) {
      console.warn('Failed to check favorite status:', error);
    }
  };

  const animateHeart = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      animateHeart();
      
      const newFavoriteStatus = await FavoritesService.toggleFavorite(vehicleId);
      setIsFavorite(newFavoriteStatus);
      
      onToggle?.(newFavoriteStatus);
    } catch (error) {
      console.warn('Failed to toggle favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      disabled={isLoading}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <MaterialIcons
          name={isFavorite ? 'favorite' : 'favorite-border'}
          size={size}
          color={isFavorite ? color : '#999'}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});