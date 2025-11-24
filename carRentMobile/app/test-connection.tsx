import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TestConnectionService from '@/services/TestConnectionService';
import config from '@/config';

export default function TestConnectionScreen() {
  const [loading, setLoading] = useState(false);
  const [connectionResult, setConnectionResult] = useState<any>(null);
  const [endpoints, setEndpoints] = useState<any[]>([]);

  const testConnection = async () => {
    setLoading(true);
    setConnectionResult(null);
    
    try {
      const result = await TestConnectionService.testConnection();
      setConnectionResult(result);
      
      if (result.success) {
        Alert.alert('Success', result.message);
      } else {
        Alert.alert('Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const testEndpoints = async () => {
    setLoading(true);
    setEndpoints([]);
    
    try {
      const result = await TestConnectionService.testAuthEndpoints();
      setEndpoints(result.endpoints);
    } catch (error) {
      Alert.alert('Error', 'Failed to test endpoints');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Backend Connection Test</Text>
          <Text style={styles.subtitle}>API URL: {config.API_BASE_URL}</Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={testConnection}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Test Connection</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary, loading && styles.buttonDisabled]}
            onPress={testEndpoints}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#3b82f6" />
            ) : (
              <Text style={styles.buttonTextSecondary}>Test Endpoints</Text>
            )}
          </TouchableOpacity>
        </View>

        {connectionResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Connection Result:</Text>
            <View
              style={[
                styles.resultBox,
                connectionResult.success ? styles.successBox : styles.errorBox,
              ]}
            >
              <Text style={styles.resultStatus}>
                Status: {connectionResult.success ? '✅ Success' : '❌ Failed'}
              </Text>
              <Text style={styles.resultMessage}>{connectionResult.message}</Text>
              {connectionResult.data && (
                <Text style={styles.resultData}>
                  {JSON.stringify(connectionResult.data, null, 2)}
                </Text>
              )}
            </View>
          </View>
        )}

        {endpoints.length > 0 && (
          <View style={styles.endpointsContainer}>
            <Text style={styles.resultTitle}>Endpoints Status:</Text>
            {endpoints.map((endpoint, index) => (
              <View key={index} style={styles.endpointItem}>
                <Text style={styles.endpointName}>{endpoint.name}</Text>
                <Text style={styles.endpointPath}>{endpoint.path}</Text>
                <Text
                  style={[
                    styles.endpointStatus,
                    endpoint.status === 'Available' && styles.statusAvailable,
                    endpoint.status === 400 && styles.statusOk,
                    endpoint.status === 404 && styles.statusError,
                  ]}
                >
                  {endpoint.status}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>📝 Instructions:</Text>
          <Text style={styles.instructionsText}>
            1. Make sure backend is running on port 5000
          </Text>
          <Text style={styles.instructionsText}>
            2. Your computer and phone must be on the same network
          </Text>
          <Text style={styles.instructionsText}>
            3. Current API URL: {config.API_BASE_URL}
          </Text>
          <Text style={styles.instructionsText}>
            4. If connection fails, check firewall settings
          </Text>
          <Text style={styles.instructionsText}>
            5. Backend CORS must allow mobile app origin
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    padding: 20,
    gap: 12,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    padding: 20,
    paddingTop: 0,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  resultBox: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  successBox: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  resultStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  resultData: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  endpointsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  endpointItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  endpointName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  endpointPath: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  endpointStatus: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  statusAvailable: {
    color: '#10b981',
  },
  statusOk: {
    color: '#f59e0b',
  },
  statusError: {
    color: '#ef4444',
  },
  instructions: {
    padding: 20,
    paddingTop: 0,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
});
