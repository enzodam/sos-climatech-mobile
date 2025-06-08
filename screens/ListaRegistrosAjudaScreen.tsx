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

interface RegistroAjudaResumo {
  id: number;
  pessoaId: number;
  recursoId: number;
  quantidade: number;
  dataRegistro: string;
  entregue: boolean;
}

const ListaRegistrosAjudaScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [registros, setRegistros] = useState<RegistroAjudaResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRegistros = async () => {
    try {
      const response = await api.get<RegistroAjudaResumo[]>('/registros-ajuda');
      setRegistros(response.data);
    } catch (error) {
      console.error("API Error fetching registros:", error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de registros de ajuda.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRegistros();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchRegistros();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const renderRegistroItem = ({ item }: { item: RegistroAjudaResumo }) => (
    <TouchableOpacity
      style={styles.registroCard}
      onPress={() => navigation.navigate('DetalhesRegistroAjuda', { registroId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.registroId}>Registro #{item.id}</Text>
        <View style={[
          styles.statusBadge,
          item.entregue ? styles.statusEntregue : styles.statusPendente
        ]}>
          <Text style={styles.statusText}>
            {item.entregue ? '✅ Entregue' : '⏳ Pendente'}
          </Text>
        </View>
      </View>
      <Text style={styles.registroInfo}>👤 Pessoa ID: {item.pessoaId}</Text>
      <Text style={styles.registroInfo}>📦 Recurso ID: {item.recursoId}</Text>
      <Text style={styles.registroInfo}>📊 Quantidade: {item.quantidade}</Text>
      <Text style={styles.registroDate}>📅 {formatDate(item.dataRegistro)}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="light-content" backgroundColor="#C53030" />
        <ActivityIndicator size="large" color="#C53030" />
        <Text style={styles.loadingText}>Carregando registros...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C53030" />
      
      <FlatList
        data={registros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRegistroItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#C53030']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum registro de ajuda cadastrado</Text>
            <Text style={styles.emptySubtext}>Toque no botão + para adicionar um registro</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AdicionarRegistroAjuda')}
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
  registroCard: {
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
  registroId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A365D',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPendente: {
    backgroundColor: '#FFF3CD',
  },
  statusEntregue: {
    backgroundColor: '#D4EDDA',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A365D',
  },
  registroInfo: {
    fontSize: 14,
    color: '#1A365D',
    marginBottom: 4,
  },
  registroDate: {
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

export default ListaRegistrosAjudaScreen;

