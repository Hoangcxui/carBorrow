/**
 * API Services Index
 * Export all API services for easy importing
 */

export { default as ApiService } from './ApiService';
export { default as AuthApiService } from './AuthApiService';
export { default as VehicleApiService } from './VehicleApiService';
export { default as BookingApiService } from './BookingApiService';
export { default as LocationApiService } from './LocationApiService';
export { default as TestConnectionService } from './TestConnectionService';

// Usage examples:
// import { AuthApiService, VehicleApiService, LocationApiService } from '@/services';
// 
// const login = await AuthApiService.login(email, password);
// const vehicles = await VehicleApiService.getVehicles();
// const locations = await LocationApiService.getLocations();
