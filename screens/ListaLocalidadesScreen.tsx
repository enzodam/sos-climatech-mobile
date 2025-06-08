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

interface LocalidadeResumo {
  id: number;
  cidade: string;
  estado: string;
}

const ListaLocalidadesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [localidades, setLocalidades] = useState<LocalidadeResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLocalidades = async () => {
    try {
      const response = await api.get<LocalidadeResumo[]>('/localidades');
      setLocalidades(response.data);
    } catch (error) {
      console.error("API Error fetching localidades:", error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de localidades.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLocalidades();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchLocalidades();
  };

  const renderLocalidadeItem = ({ item }: { item: LocalidadeResumo }) => (
    <TouchableOpacity
      style={styles.localidadeCard}
      onPress={() => navigation.navigate('DetalhesLocalidade', { localidadeId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.localidadeCidade}>{item.cidade}</Text>
        <Text style={styles.localidadeEstado}>{item.estado}</Text>
      </View>
      <Text style={styles.localidadeInfo}>📍 {item.cidade} - {item.estado}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="light-content" backgroundColor="#C53030" />
        <ActivityIndicator size="large" color="#C53030" />
        <Text style={styles.loadingText}>Carregando localidades...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C53030" />
      
      <FlatList
        data={localidades}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderLocalidadeItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#C53030']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma localidade cadastrada</Text>
            <Text style={styles.emptySubtext}>Toque no botão + para adicionar uma localidade</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AdicionarLocalidade')}
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
  localidadeCard: {
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
  localidadeCidade: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A365D',
    flex: 1,
  },
  localidadeEstado: {
    fontSize: 14,
    color: '#C53030',
    fontWeight: 'bold',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  localidadeInfo: {
    fontSize: 14,
    color: '#1A365D',
    marginBottom: 4,
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

export default ListaLocalidadesScreen;

