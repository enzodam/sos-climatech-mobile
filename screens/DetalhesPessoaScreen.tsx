import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

interface EventoResumo {
  id: number;
  tipo: string;
}

interface PessoaDetalhes {
  id: number;
  nome: string;
  cpf: string;
  cidade: string;
  evento: EventoResumo;
  statusAssistencia: 'PENDENTE' | 'ASSISTIDO';
}

type DetalhesPessoaRouteProp = RouteProp<RootStackParamList, 'DetalhesPessoa'>;

const DetalhesPessoaScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<DetalhesPessoaRouteProp>();
  const { pessoaId } = route.params;

  const [pessoa, setPessoa] = useState<PessoaDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<PessoaDetalhes>(`/pessoas/${pessoaId}`);
        setPessoa(response.data);
        navigation.setOptions({ title: `Detalhes: ${response.data.nome}` });
      } catch (err: any) {
        console.error("API Error fetching person details:", err.response?.data || err.message);
        setError(err.response?.data?.message || 'Erro ao carregar detalhes da pessoa.');
        Alert.alert('Erro', 'Não foi possível carregar os detalhes da pessoa.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [pessoaId, navigation]);

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja remover esta pessoa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await api.delete(`/pessoas/${pessoaId}`);
              Alert.alert('Sucesso', 'Pessoa removida com sucesso!');
              navigation.navigate('ListaPessoas');
            } catch (err: any) {
              console.error("API Error deleting person:", err.response?.data || err.message);
              Alert.alert('Erro', err.response?.data?.message || 'Falha ao remover pessoa.');
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const formatCpf = (cpf: string) => {
    const cleaned = cpf.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return cpf;
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="light-content" backgroundColor="#C53030" />
        <ActivityIndicator size="large" color="#C53030" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (error || !pessoa) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="light-content" backgroundColor="#C53030" />
        <Text style={styles.errorText}>{error || 'Pessoa não encontrada.'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C53030" />
      
      <View style={styles.card}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.value}>{pessoa.nome}</Text>

        <Text style={styles.label}>CPF:</Text>
        <Text style={styles.value}>{formatCpf(pessoa.cpf)}</Text>

        <Text style={styles.label}>Cidade:</Text>
        <Text style={styles.value}>{pessoa.cidade}</Text>

        <Text style={styles.label}>Evento Relacionado:</Text>
        <Text style={styles.value}>{pessoa.evento.tipo} (ID: {pessoa.evento.id})</Text>

        <Text style={styles.label}>Status Assistência:</Text>
        <View style={[
          styles.statusBadge,
          pessoa.statusAssistencia === 'ASSISTIDO' ? styles.statusAssistido : styles.statusPendente
        ]}>
          <Text style={styles.statusText}>
            {pessoa.statusAssistencia === 'ASSISTIDO' ? '✅ Assistido' : '⏳ Pendente'}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('EditarPessoa', { pessoa: pessoa })}
          disabled={deleting}
        >
          <Ionicons name="pencil" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton, deleting && styles.buttonDisabled]}
          onPress={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="trash" size={20} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Remover</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 15,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    color: '#1A365D',
  },
  errorText: {
    color: '#C53030',
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    color: '#1A365D',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  value: {
    color: '#1A365D',
    fontSize: 16,
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  statusPendente: {
    backgroundColor: '#FFF3CD',
  },
  statusAssistido: {
    backgroundColor: '#D4EDDA',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A365D',
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#FF9500',
  },
  deleteButton: {
    backgroundColor: '#C53030',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  icon: {
    marginRight: 8,
  },
});

export default DetalhesPessoaScreen;

