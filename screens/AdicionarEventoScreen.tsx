import React, { useState, useEffect } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import api from '../services/api';

interface EventoRequest {
  tipo: string;
  dataInicio: string;
  localidadeId: number;
  impacto?: string;
}

interface LocalidadeResumo {
  id: number;
  cidade: string;
  estado: string;
}

const AdicionarEventoScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tipo, setTipo] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [localidadeId, setLocalidadeId] = useState<number | undefined>(undefined);
  const [impacto, setImpacto] = useState('');
  const [localidades, setLocalidades] = useState<LocalidadeResumo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingLocalidades, setLoadingLocalidades] = useState(true);

  useEffect(() => {
    const fetchLocalidadesParaPicker = async () => {
      setLoadingLocalidades(true);
      try {
        const response = await api.get<LocalidadeResumo[]>('/localidades');
        setLocalidades(response.data);
      } catch (error) {
        console.error("API Error fetching localidades for picker:", error);
        Alert.alert('Erro', 'Não foi possível carregar a lista de localidades para seleção.');
      } finally {
        setLoadingLocalidades(false);
      }
    };
    fetchLocalidadesParaPicker();
  }, []);

  const formatDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,4})(\d{0,2})(\d{0,2})$/);
    if (!match) return text;
    let formatted = '';
    if (match[1]) formatted += match[1];
    if (match[2]) formatted += '-' + match[2];
    if (match[3]) formatted += '-' + match[3];
    return formatted;
  };

  const handleDateChange = (text: string) => {
    setDataInicio(formatDate(text));
  };

  const isDateValid = (date: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
  };

  const handleSalvar = async () => {
    if (!tipo || !dataInicio || !localidadeId) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios (*).');
      return;
    }
    if (!isDateValid(dataInicio)) {
      Alert.alert('Erro', 'Data inválida. Use o formato AAAA-MM-DD.');
      return;
    }

    const eventoData: EventoRequest = {
      tipo,
      dataInicio,
      localidadeId,
      impacto: impacto || undefined,
    };

    setLoading(true);
    try {
      await api.post('/eventos', eventoData);
      Alert.alert('Sucesso', 'Evento adicionado com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      console.error("API Error creating evento:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Falha ao adicionar evento. Verifique os dados e a conexão.';
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
        <Text style={styles.label}>Tipo do Evento *</Text>
        <TextInput
          style={styles.input}
          value={tipo}
          onChangeText={setTipo}
          placeholder="Ex: Enchente, Seca, Tornado..."
          placeholderTextColor="#999"
          editable={!loading}
        />

        <Text style={styles.label}>Data de Início *</Text>
        <TextInput
          style={styles.input}
          value={dataInicio}
          onChangeText={handleDateChange}
          placeholder="AAAA-MM-DD"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={10}
          editable={!loading}
        />

        <Text style={styles.label}>Localidade *</Text>
        {loadingLocalidades ? (
          <ActivityIndicator style={styles.pickerLoading} color="#C53030" />
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={localidadeId}
              style={styles.picker}
              onValueChange={(itemValue) => setLocalidadeId(itemValue)}
              enabled={!loading}
            >
              <Picker.Item label="Selecione uma localidade..." value={undefined} />
              {localidades.map((localidade) => (
                <Picker.Item
                  key={localidade.id}
                  label={`${localidade.cidade} - ${localidade.estado}`}
                  value={localidade.id}
                />
              ))}
            </Picker>
          </View>
        )}

        <Text style={styles.label}>Descrição do Impacto</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={impacto}
          onChangeText={setImpacto}
          placeholder="Descreva o impacto do evento..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          editable={!loading}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSalvar}
            disabled={loading || loadingLocalidades}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Salvar Evento</Text>
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    justifyContent: 'center',
  },
  picker: {
    color: '#1A365D',
    height: 50,
  },
  pickerLoading: {
    marginVertical: 20,
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

export default AdicionarEventoScreen;

