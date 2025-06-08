import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

interface RecursoDetalhes {
  id: number;
  nome: string;
  tipo: string;
  quantidade: number;
  eventoId: number;
}

type DetalhesRecursoRouteProp = RouteProp<RootStackParamList, 'DetalhesRecurso'>;

const DetalhesRecursoScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<DetalhesRecursoRouteProp>();
  const { recursoId } = route.params;

  const [recurso, setRecurso] = useState<RecursoDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<RecursoDetalhes>(`/recursos/${recursoId}`);
        setRecurso(response.data);
        navigation.setOptions({ title: `Detalhes: ${response.data.nome}` });
      } catch (err: any) {
        console.error("API Error fetching resource details:", err.response?.data || err.message);
        setError(err.response?.data?.message || 'Erro ao carregar detalhes do recurso.');
        Alert.alert('Erro', 'Não foi possível carregar os detalhes do recurso.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [recursoId, navigation]);

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja remover este recurso?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await api.delete(`/recursos/${recursoId}`);
              Alert.alert('Sucesso', 'Recurso removido com sucesso!');
              navigation.navigate('ListaRecursos');
            } catch (err: any) {
              console.error("API Error deleting resource:", err.response?.data || err.message);
              Alert.alert('Erro', err.response?.data?.message || 'Falha ao remover recurso.');
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

  if (error || !recurso) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="light-content" backgroundColor="#C53030" />
        <Text style={styles.errorText}>{error || 'Recurso não encontrado.'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C53030" />
      
      <View style={styles.card}>
        <Text style={styles.label}>Nome do Recurso:</Text>
        <Text style={styles.value}>{recurso.nome}</Text>

        <Text style={styles.label}>Tipo:</Text>
        <Text style={styles.value}>{recurso.tipo}</Text>

        <Text style={styles.label}>Quantidade Disponível:</Text>
        <Text style={styles.value}>{recurso.quantidade}</Text>

        <Text style={styles.label}>Evento Relacionado:</Text>
        <Text style={styles.value}>ID: {recurso.eventoId}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('EditarRecurso', { recurso: recurso })}
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

export default DetalhesRecursoScreen;

