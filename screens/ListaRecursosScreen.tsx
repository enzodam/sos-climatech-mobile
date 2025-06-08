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

interface RecursoResumo {
  id: number;
  nome: string;
  tipo: string;
  quantidade: number;
  eventoId: number;
}

const ListaRecursosScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [recursos, setRecursos] = useState<RecursoResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecursos = async () => {
    try {
      const response = await api.get<RecursoResumo[]>('/recursos');
      setRecursos(response.data);
    } catch (error) {
      console.error("API Error fetching recursos:", error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de recursos.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRecursos();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecursos();
  };

  const renderRecursoItem = ({ item }: { item: RecursoResumo }) => (
    <TouchableOpacity
      style={styles.resourceCard}
      onPress={() => navigation.navigate('DetalhesRecurso', { recursoId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.resourceName}>{item.nome}</Text>
        <Text style={styles.resourceQuantity}>Qtd: {item.quantidade}</Text>
      </View>
      <Text style={styles.resourceType}>📦 Tipo: {item.tipo}</Text>
      <Text style={styles.resourceEvent}>🌪️ Evento ID: {item.eventoId}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="light-content" backgroundColor="#C53030" />
        <ActivityIndicator size="large" color="#C53030" />
        <Text style={styles.loadingText}>Carregando recursos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C53030" />
      
      <FlatList
        data={recursos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecursoItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#C53030']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum recurso cadastrado</Text>
            <Text style={styles.emptySubtext}>Toque no botão + para adicionar um recurso</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AdicionarRecurso')}
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
  resourceCard: {
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
  resourceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A365D',
    flex: 1,
  },
  resourceQuantity: {
    fontSize: 14,
    color: '#C53030',
    fontWeight: 'bold',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  resourceType: {
    fontSize: 14,
    color: '#1A365D',
    marginBottom: 4,
  },
  resourceEvent: {
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

export default ListaRecursosScreen;

