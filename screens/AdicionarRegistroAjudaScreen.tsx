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

interface RegistroAjudaRequest {
  pessoaId: number;
  recursoId: number;
  quantidade: number;
}

interface PessoaResumo {
  id: number;
  nome: string;
  cpf: string;
}

interface RecursoResumo {
  id: number;
  nome: string;
  tipo: string;
  quantidade: number;
}

const AdicionarRegistroAjudaScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [pessoaId, setPessoaId] = useState<number | undefined>(undefined);
  const [recursoId, setRecursoId] = useState<number | undefined>(undefined);
  const [quantidade, setQuantidade] = useState('');
  const [pessoas, setPessoas] = useState<PessoaResumo[]>([]);
  const [recursos, setRecursos] = useState<RecursoResumo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPessoas, setLoadingPessoas] = useState(true);
  const [loadingRecursos, setLoadingRecursos] = useState(true);

  useEffect(() => {
    const fetchPessoasParaPicker = async () => {
      setLoadingPessoas(true);
      try {
        const response = await api.get<PessoaResumo[]>('/pessoas');
        setPessoas(response.data);
      } catch (error) {
        console.error("API Error fetching pessoas for picker:", error);
        Alert.alert('Erro', 'Não foi possível carregar a lista de pessoas para seleção.');
      } finally {
        setLoadingPessoas(false);
      }
    };

    const fetchRecursosParaPicker = async () => {
      setLoadingRecursos(true);
      try {
        const response = await api.get<RecursoResumo[]>('/recursos');
        setRecursos(response.data);
      } catch (error) {
        console.error("API Error fetching recursos for picker:", error);
        Alert.alert('Erro', 'Não foi possível carregar a lista de recursos para seleção.');
      } finally {
        setLoadingRecursos(false);
      }
    };

    fetchPessoasParaPicker();
    fetchRecursosParaPicker();
  }, []);

  const formatCpf = (cpf: string) => {
    const cleaned = cpf.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return cpf;
  };

  const handleSalvar = async () => {
    const quantidadeNum = parseInt(quantidade);
    if (!pessoaId || !recursoId || !quantidade) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios (*).');
      return;
    }
    if (isNaN(quantidadeNum) || quantidadeNum < 1) {
      Alert.alert('Erro', 'Quantidade deve ser um número positivo maior que zero.');
      return;
    }

    const registroData: RegistroAjudaRequest = {
      pessoaId,
      recursoId,
      quantidade: quantidadeNum,
    };

    setLoading(true);
    try {
      await api.post('/registros-ajuda', registroData);
      Alert.alert('Sucesso', 'Registro de ajuda adicionado com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      console.error("API Error creating registro:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Falha ao adicionar registro de ajuda. Verifique os dados e a conexão.';
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
        <Text style={styles.label}>Pessoa Afetada *</Text>
        {loadingPessoas ? (
          <ActivityIndicator style={styles.pickerLoading} color="#C53030" />
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={pessoaId}
              style={styles.picker}
              onValueChange={(itemValue) => setPessoaId(itemValue)}
              enabled={!loading}
            >
              <Picker.Item label="Selecione uma pessoa..." value={undefined} />
              {pessoas.map((pessoa) => (
                <Picker.Item
                  key={pessoa.id}
                  label={`${pessoa.nome} - CPF: ${formatCpf(pessoa.cpf)}`}
                  value={pessoa.id}
                />
              ))}
            </Picker>
          </View>
        )}

        <Text style={styles.label}>Recurso *</Text>
        {loadingRecursos ? (
          <ActivityIndicator style={styles.pickerLoading} color="#C53030" />
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={recursoId}
              style={styles.picker}
              onValueChange={(itemValue) => setRecursoId(itemValue)}
              enabled={!loading}
            >
              <Picker.Item label="Selecione um recurso..." value={undefined} />
              {recursos.map((recurso) => (
                <Picker.Item
                  key={recurso.id}
                  label={`${recurso.nome} (${recurso.tipo}) - Disponível: ${recurso.quantidade}`}
                  value={recurso.id}
                />
              ))}
            </Picker>
          </View>
        )}

        <Text style={styles.label}>Quantidade Entregue *</Text>
        <TextInput
          style={styles.input}
          value={quantidade}
          onChangeText={setQuantidade}
          placeholder="Ex: 5"
          placeholderTextColor="#999"
          keyboardType="numeric"
          editable={!loading}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSalvar}
            disabled={loading || loadingPessoas || loadingRecursos}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Registrar Ajuda</Text>
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

export default AdicionarRegistroAjudaScreen;

