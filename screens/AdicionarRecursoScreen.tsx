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

interface RecursoRequest {
  nome: string;
  tipo: string;
  quantidade: number;
  eventoId: number;
}

interface EventoResumo {
  id: number;
  tipo: string;
  localidade: { cidade: string; estado: string };
  dataInicio: string;
}

const AdicionarRecursoScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [eventoId, setEventoId] = useState<number | undefined>(undefined);
  const [eventos, setEventos] = useState<EventoResumo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEventos, setLoadingEventos] = useState(true);

  useEffect(() => {
    const fetchEventosParaPicker = async () => {
      setLoadingEventos(true);
      try {
        const response = await api.get<EventoResumo[]>('/eventos');
        setEventos(response.data);
      } catch (error) {
        console.error("API Error fetching eventos for picker:", error);
        Alert.alert('Erro', 'Não foi possível carregar a lista de eventos para seleção.');
      } finally {
        setLoadingEventos(false);
      }
    };
    fetchEventosParaPicker();
  }, []);

  const handleSalvar = async () => {
    const quantidadeNum = parseInt(quantidade);
    if (!nome || !tipo || !quantidade || !eventoId) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios (*).');
      return;
    }
    if (isNaN(quantidadeNum) || quantidadeNum < 0) {
      Alert.alert('Erro', 'Quantidade deve ser um número positivo.');
      return;
    }

    const recursoData: RecursoRequest = {
      nome,
      tipo,
      quantidade: quantidadeNum,
      eventoId,
    };

    setLoading(true);
    try {
      await api.post('/recursos', recursoData);
      Alert.alert('Sucesso', 'Recurso adicionado com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      console.error("API Error creating recurso:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Falha ao adicionar recurso. Verifique os dados e a conexão.';
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
        <Text style={styles.label}>Nome do Recurso *</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: Água potável, Medicamentos..."
          placeholderTextColor="#999"
          editable={!loading}
        />

        <Text style={styles.label}>Tipo do Recurso *</Text>
        <TextInput
          style={styles.input}
          value={tipo}
          onChangeText={setTipo}
          placeholder="Ex: Alimentação, Medicamento, Abrigo..."
          placeholderTextColor="#999"
          editable={!loading}
        />

        <Text style={styles.label}>Quantidade Disponível *</Text>
        <TextInput
          style={styles.input}
          value={quantidade}
          onChangeText={setQuantidade}
          placeholder="Ex: 100"
          placeholderTextColor="#999"
          keyboardType="numeric"
          editable={!loading}
        />

        <Text style={styles.label}>Evento Relacionado *</Text>
        {loadingEventos ? (
          <ActivityIndicator style={styles.pickerLoading} color="#C53030" />
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={eventoId}
              style={styles.picker}
              onValueChange={(itemValue) => setEventoId(itemValue)}
              enabled={!loading}
            >
              <Picker.Item label="Selecione um evento..." value={undefined} />
              {eventos.map((evento) => (
                <Picker.Item
                  key={evento.id}
                  label={`${evento.tipo} - ${evento.localidade.cidade} (${evento.dataInicio})`}
                  value={evento.id}
                />
              ))}
            </Picker>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSalvar}
            disabled={loading || loadingEventos}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Salvar Recurso</Text>
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

export default AdicionarRecursoScreen;

