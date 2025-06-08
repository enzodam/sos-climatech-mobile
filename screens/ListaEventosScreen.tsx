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

interface Localidade {
  id: number;
  cidade: string;
  estado: string;
}

interface EventoResumo {
  id: number;
  tipo: string;
  localidade: Localidade;
  dataInicio: string;
  impacto?: string;
}

const ListaEventosScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [eventos, setEventos] = useState<EventoResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEventos = async () => {
    try {
      const response = await api.get<EventoResumo[]>('/eventos');
      setEventos(response.data);
    } catch (error) {
      console.error("API Error fetching eventos:", error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de eventos.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchEventos();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchEventos();
  };

  const renderEventoItem = ({ item }: { item: EventoResumo }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('DetalhesEvento', { eventoId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.eventType}>{item.tipo}</Text>
        <Text style={styles.eventDate}>{item.dataInicio}</Text>
      </View>
      <Text style={styles.eventLocation}>
        📍 {item.localidade.cidade} / {item.localidade.estado}
      </Text>
      {item.impacto && (
        <Text style={styles.eventImpact} numberOfLines={2}>
          💥 {item.impacto}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="light-content" backgroundColor="#C53030" />
        <ActivityIndicator size="large" color="#C53030" />
        <Text style={styles.loadingText}>Carregando eventos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C53030" />
      
      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEventoItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#C53030']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum evento cadastrado</Text>
            <Text style={styles.emptySubtext}>Toque no botão + para adicionar um evento</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AdicionarEvento')}
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
  eventCard: {
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
  eventType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A365D',
    flex: 1,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  eventLocation: {
    fontSize: 14,
    color: '#1A365D',
    marginBottom: 4,
  },
  eventImpact: {
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

export default ListaEventosScreen;

