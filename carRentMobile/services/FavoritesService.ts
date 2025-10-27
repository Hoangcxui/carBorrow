import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from './ApiService';
import { Vehicle, ApiResponse } from '../types';

const FAVORITES_KEY = '@car_rental_favorites';

export interface FavoriteVehicle {
  vehicleId: string;
  addedAt: string;
  vehicle?: Vehicle; // Cached vehicle data
}

export class FavoritesService {
  // Get local favorites (offline support)
  async getLocalFavorites(): Promise<string[]> {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.warn('Failed to load local favorites:', error);
      return [];
    }
  }

  // Save local favorites
  async saveLocalFavorites(vehicleIds: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(vehicleIds));
    } catch (error) {
      console.warn('Failed to save local favorites:', error);
    }
  }

  // Get favorites from server
  async getFavorites(): Promise<FavoriteVehicle[]> {
    try {
      const response = await ApiService.get<ApiResponse<FavoriteVehicle[]>>('/api/favorites');
      const serverFavorites = response.data.data || [];
      
      // Sync with local storage
      const vehicleIds = serverFavorites.map(f => f.vehicleId);
      await this.saveLocalFavorites(vehicleIds);
      
      return serverFavorites;
    } catch (error: any) {
      console.warn('Failed to fetch favorites from server, using local data:', error);
      
      // Fallback to local favorites
      const localIds = await this.getLocalFavorites();
      return localIds.map(id => ({
        vehicleId: id,
        addedAt: new Date().toISOString(),
      }));
    }
  }

  // Add vehicle to favorites
  async addToFavorites(vehicleId: string): Promise<boolean> {
    try {
      // Update server
      await ApiService.post('/api/favorites', { vehicleId });
      
      // Update local storage
      const localFavorites = await this.getLocalFavorites();
      if (!localFavorites.includes(vehicleId)) {
        localFavorites.push(vehicleId);
        await this.saveLocalFavorites(localFavorites);
      }
      
      return true;
    } catch (error: any) {
      console.warn('Failed to add to server favorites, saving locally:', error);
      
      // Save locally even if server fails
      const localFavorites = await this.getLocalFavorites();
      if (!localFavorites.includes(vehicleId)) {
        localFavorites.push(vehicleId);
        await this.saveLocalFavorites(localFavorites);
      }
      
      return true;
    }
  }

  // Remove vehicle from favorites
  async removeFromFavorites(vehicleId: string): Promise<boolean> {
    try {
      // Update server
      await ApiService.delete(`/api/favorites/${vehicleId}`);
      
      // Update local storage
      const localFavorites = await this.getLocalFavorites();
      const updatedFavorites = localFavorites.filter(id => id !== vehicleId);
      await this.saveLocalFavorites(updatedFavorites);
      
      return true;
    } catch (error: any) {
      console.warn('Failed to remove from server favorites, removing locally:', error);
      
      // Remove locally even if server fails
      const localFavorites = await this.getLocalFavorites();
      const updatedFavorites = localFavorites.filter(id => id !== vehicleId);
      await this.saveLocalFavorites(updatedFavorites);
      
      return true;
    }
  }

  // Check if vehicle is in favorites
  async isFavorite(vehicleId: string): Promise<boolean> {
    try {
      const localFavorites = await this.getLocalFavorites();
      return localFavorites.includes(vehicleId);
    } catch (error) {
      return false;
    }
  }

  // Toggle favorite status
  async toggleFavorite(vehicleId: string): Promise<boolean> {
    const isFav = await this.isFavorite(vehicleId);
    
    if (isFav) {
      await this.removeFromFavorites(vehicleId);
      return false;
    } else {
      await this.addToFavorites(vehicleId);
      return true;
    }
  }

  // Get favorite vehicles with details
  async getFavoriteVehicles(): Promise<Vehicle[]> {
    try {
      const favorites = await this.getFavorites();
      
      // Fetch vehicle details for each favorite
      const vehiclePromises = favorites.map(async (fav) => {
        if (fav.vehicle) {
          return fav.vehicle; // Use cached data
        }
        
        try {
          const response = await ApiService.get<ApiResponse<Vehicle>>(`/api/vehicles/${fav.vehicleId}`);
          return response.data.data;
        } catch (error) {
          console.warn(`Failed to fetch vehicle ${fav.vehicleId}:`, error);
          return null;
        }
      });
      
      const vehicles = await Promise.all(vehiclePromises);
      return vehicles.filter((v): v is Vehicle => v !== null);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch favorite vehicles');
    }
  }

  // Sync local favorites with server
  async syncFavorites(): Promise<void> {
    try {
      const [localFavorites, serverFavorites] = await Promise.all([
        this.getLocalFavorites(),
        this.getFavorites()
      ]);
      
      const serverIds = serverFavorites.map(f => f.vehicleId);
      
      // Find differences
      const toAdd = localFavorites.filter(id => !serverIds.includes(id));
      const toRemove = serverIds.filter(id => !localFavorites.includes(id));
      
      // Sync differences
      const promises = [
        ...toAdd.map(id => this.addToFavorites(id)),
        ...toRemove.map(id => this.removeFromFavorites(id))
      ];
      
      await Promise.all(promises);
    } catch (error) {
      console.warn('Failed to sync favorites:', error);
    }
  }

  // Clear all favorites
  async clearFavorites(): Promise<void> {
    try {
      await ApiService.delete('/api/favorites');
      await this.saveLocalFavorites([]);
    } catch (error: any) {
      // Clear locally even if server fails
      await this.saveLocalFavorites([]);
      throw new Error(error.response?.data?.message || 'Failed to clear favorites');
    }
  }

  // Get favorites count
  async getFavoritesCount(): Promise<number> {
    try {
      const localFavorites = await this.getLocalFavorites();
      return localFavorites.length;
    } catch (error) {
      return 0;
    }
  }
}

export default new FavoritesService();