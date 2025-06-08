import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  StatusBar
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

interface EventoResumo {
  id: number;
  tipo: string;
}

interface PessoaResumo {
  id: number;
  nome: string;
  cpf: string;
  cidade: string;
  evento?: EventoResumo; // Make evento optional
  statusAssistencia: 'PENDENTE' | 'ASSISTIDO';
}

const ListaPessoasScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [pessoas, setPessoas] = useState<PessoaResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPessoas = async () => {
    try {
      const response = await api.get<PessoaResumo[]>('/pessoas');
      setPessoas(response.data);
    } catch (error) {
      console.error("API Error fetching pessoas:", error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de pessoas.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPessoas();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchPessoas();
  };

  const formatCpf = (cpf: string) => {
    const cleaned = cpf.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return cpf;
  };

  const renderPessoaItem = ({ item }: { item: PessoaResumo }) => (
    <TouchableOpacity
      style={styles.personCard}
      onPress={() => navigation.navigate('DetalhesPessoa', { pessoaId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.personName}>{item.nome}</Text>
        <View style={[
          styles.statusBadge,
          item.statusAssistencia === 'ASSISTIDO' ? styles.statusAssistido : styles.statusPendente
        ]}>
          <Text style={styles.statusText}>
            {item.statusAssistencia === 'ASSISTIDO' ? '✅ Assistido' : '⏳ Pendente'}
          </Text>
        </View>
      </View>
      <Text style={styles.personCpf}>📄 CPF: {formatCpf(item.cpf)}</Text>
      <Text style={styles.personCity}>📍 {item.cidade}</Text>
      {item.evento && <Text style={styles.personEvent}>🌪️ Evento: {item.evento.tipo}</Text>}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="light-content" backgroundColor="#C53030" />
        <ActivityIndicator size="large" color="#C53030" />
        <Text style={styles.loadingText}>Carregando pessoas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C53030" />
      
      <FlatList
        data={pessoas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPessoaItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#C53030']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma pessoa cadastrada</Text>
            <Text style={styles.emptySubtext}>Toque no botão + para adicionar uma pessoa</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AdicionarPessoa')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  personCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#C53030',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  personName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A365D',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPendente: {
    backgroundColor: '#FFF3CD',
  },
  statusAssistido: {
    backgroundColor: '#D4EDDA',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A365D',
  },
  personCpf: {
    fontSize: 14,
    color: '#1A365D',
    marginBottom: 4,
  },
  personCity: {
    fontSize: 14,
    color: '#1A365D',
    marginBottom: 4,
  },
  personEvent: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#1A365D',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#C53030',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

export default ListaPessoasScreen;


