import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

interface Localidade {
  id: number;
  cidade: string;
  estado: string;
}

interface EventoDetalhes {
  id: number;
  tipo: string;
  localidade: Localidade;
  dataInicio: string;
  impacto?: string;
}

type DetalhesEventoRouteProp = RouteProp<RootStackParamList, 'DetalhesEvento'>;

const DetalhesEventoScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<DetalhesEventoRouteProp>();
  const { eventoId } = route.params;

  const [evento, setEvento] = useState<EventoDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<EventoDetalhes>(`/eventos/${eventoId}`);
        setEvento(response.data);
        navigation.setOptions({ title: `Detalhes: ${response.data.tipo}` });
      } catch (err: any) {
        console.error("API Error fetching event details:", err.response?.data || err.message);
        setError(err.response?.data?.message || 'Erro ao carregar detalhes do evento.');
        Alert.alert('Erro', 'Não foi possível carregar os detalhes do evento.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [eventoId, navigation]);

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja remover este evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await api.delete(`/eventos/${eventoId}`);
              Alert.alert('Sucesso', 'Evento removido com sucesso!');
              navigation.navigate('ListaEventos');
            } catch (err: any) {
              console.error("API Error deleting event:", err.response?.data || err.message);
              Alert.alert('Erro', err.response?.data?.message || 'Falha ao remover evento.');
              setDeleting(false);
            }
          },
        },
      ]
    );
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

  if (error || !evento) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="light-content" backgroundColor="#C53030" />
        <Text style={styles.errorText}>{error || 'Evento não encontrado.'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C53030" />
      
      <View style={styles.card}>
        <Text style={styles.label}>Tipo do Evento:</Text>
        <Text style={styles.value}>{evento.tipo}</Text>

        <Text style={styles.label}>Localidade:</Text>
        <Text style={styles.value}>
          {evento.localidade.cidade} / {evento.localidade.estado} (ID: {evento.localidade.id})
        </Text>

        <Text style={styles.label}>Data de Início:</Text>
        <Text style={styles.value}>{evento.dataInicio}</Text>

        <Text style={styles.label}>Impacto:</Text>
        <Text style={styles.value}>{evento.impacto || 'Não informado'}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('EditarEvento', { evento: evento })}
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

export default DetalhesEventoScreen;

