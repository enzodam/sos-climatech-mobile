import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import api from '../services/api';

interface LocalidadeRequest {
  cidade: string;
  estado: string;
}

const AdicionarLocalidadeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (!cidade || !estado) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios (*).');
      return;
    }

    const localidadeData: LocalidadeRequest = {
      cidade,
      estado,
    };

    setLoading(true);
    try {
      await api.post('/localidades', localidadeData);
      Alert.alert('Sucesso', 'Localidade adicionada com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      console.error("API Error creating localidade:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Falha ao adicionar localidade. Verifique os dados e a conexão.';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#C53030" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Cidade *</Text>
        <TextInput
          style={styles.input}
          value={cidade}
          onChangeText={setCidade}
          placeholder="Ex: São Paulo, Rio de Janeiro..."
          placeholderTextColor="#999"
          editable={!loading}
        />

        <Text style={styles.label}>Estado *</Text>
        <TextInput
          style={styles.input}
          value={estado}
          onChangeText={setEstado}
          placeholder="Ex: SP, RJ, MG..."
          placeholderTextColor="#999"
          editable={!loading}
          maxLength={2}
          autoCapitalize="characters"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSalvar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Salvar Localidade</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton, loading && styles.buttonDisabled]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  label: {
    color: '#1A365D',
    fontWeight: 'bold',
    marginTop: 15,
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    color: '#1A365D',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  buttonContainer: {
    marginTop: 30,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#C53030',
  },
  cancelButton: {
    backgroundColor: '#718096',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
});

export default AdicionarLocalidadeScreen;

