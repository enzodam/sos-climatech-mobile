import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

interface RegistroAjudaDetalhes {
  id: number;
  pessoaId: number;
  recursoId: number;
  quantidade: number;
  dataRegistro: string;
  entregue: boolean;
}

type DetalhesRegistroAjudaRouteProp = RouteProp<RootStackParamList, 'DetalhesRegistroAjuda'>;

const DetalhesRegistroAjudaScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<DetalhesRegistroAjudaRouteProp>();
  const { registroId } = route.params;

  const [registro, setRegistro] = useState<RegistroAjudaDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<RegistroAjudaDetalhes>(`/registros-ajuda/${registroId}`);
        setRegistro(response.data);
        navigation.setOptions({ title: `Registro #${response.data.id}` });
      } catch (err: any) {
        console.error("API Error fetching registro details:", err.response?.data || err.message);
        setError(err.response?.data?.message || 'Erro ao carregar detalhes do registro.');
        Alert.alert('Erro', 'Não foi possível carregar os detalhes do registro.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [registroId, navigation]);

  const handleMarcarComoNaoEntregue = async () => {
    if (!registro) return;
    
    Alert.alert(
      'Confirmar Alteração',
      'Tem certeza que deseja marcar este registro como NÃO entregue?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            setUpdating(true);
            try {
              const response = await api.put<RegistroAjudaDetalhes>(`/registros-ajuda/${registroId}/nao-entregue`);
              setRegistro(response.data);
              Alert.alert('Sucesso', 'Status atualizado com sucesso!');
            } catch (err: any) {
              console.error("API Error updating registro:", err.response?.data || err.message);
              Alert.alert('Erro', err.response?.data?.message || 'Falha ao atualizar status.');
            } finally {
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja remover este registro de ajuda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await api.delete(`/registros-ajuda/${registroId}`);
              Alert.alert('Sucesso', 'Registro removido com sucesso!');
              navigation.navigate('ListaRegistrosAjuda');
            } catch (err: any) {
              console.error("API Error deleting registro:", err.response?.data || err.message);
              Alert.alert('Erro', err.response?.data?.message || 'Falha ao remover registro.');
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
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

  if (error || !registro) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="light-content" backgroundColor="#C53030" />
        <Text style={styles.errorText}>{error || 'Registro não encontrado.'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C53030" />
      
      <View style={styles.card}>
        <Text style={styles.label}>ID do Registro:</Text>
        <Text style={styles.value}>#{registro.id}</Text>

        <Text style={styles.label}>Pessoa Afetada:</Text>
        <Text style={styles.value}>ID: {registro.pessoaId}</Text>

        <Text style={styles.label}>Recurso:</Text>
        <Text style={styles.value}>ID: {registro.recursoId}</Text>

        <Text style={styles.label}>Quantidade Entregue:</Text>
        <Text style={styles.value}>{registro.quantidade}</Text>

        <Text style={styles.label}>Data do Registro:</Text>
        <Text style={styles.value}>{formatDate(registro.dataRegistro)}</Text>

        <Text style={styles.label}>Status de Entrega:</Text>
        <View style={[
          styles.statusBadge,
          registro.entregue ? styles.statusEntregue : styles.statusPendente
        ]}>
          <Text style={styles.statusText}>
            {registro.entregue ? '✅ Entregue' : '⏳ Pendente'}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {registro.entregue && (
          <TouchableOpacity
            style={[styles.button, styles.updateButton, updating && styles.buttonDisabled]}
            onPress={handleMarcarComoNaoEntregue}
            disabled={updating || deleting}
          >
            {updating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="refresh" size={20} color="#fff" style={styles.icon} />
                <Text style={styles.buttonText}>Marcar como Não Entregue</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.deleteButton, deleting && styles.buttonDisabled]}
          onPress={handleDelete}
          disabled={deleting || updating}
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
  statusEntregue: {
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
  updateButton: {
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

export default DetalhesRegistroAjudaScreen;

