import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import ListaEventosScreen from './screens/ListaEventosScreen';
import AdicionarEventoScreen from './screens/AdicionarEventoScreen';
import DetalhesEventoScreen from './screens/DetalhesEventoScreen';
import EditarEventoScreen from './screens/EditarEventoScreen';
import ListaPessoasScreen from './screens/ListaPessoasScreen';
import AdicionarPessoaScreen from './screens/AdicionarPessoaScreen';
import DetalhesPessoaScreen from './screens/DetalhesPessoaScreen';
import EditarPessoaScreen from './screens/EditarPessoaScreen';
import ListaRecursosScreen from './screens/ListaRecursosScreen';
import AdicionarRecursoScreen from './screens/AdicionarRecursoScreen';
import DetalhesRecursoScreen from './screens/DetalhesRecursoScreen';
import EditarRecursoScreen from './screens/EditarRecursoScreen';
import ListaRegistrosAjudaScreen from './screens/ListaRegistrosAjudaScreen';
import AdicionarRegistroAjudaScreen from './screens/AdicionarRegistroAjudaScreen';
import DetalhesRegistroAjudaScreen from './screens/DetalhesRegistroAjudaScreen';
import ListaLocalidadesScreen from './screens/ListaLocalidadesScreen';
import AdicionarLocalidadeScreen from './screens/AdicionarLocalidadeScreen';
import DetalhesLocalidadeScreen from './screens/DetalhesLocalidadeScreen';
import EditarLocalidadeScreen from './screens/EditarLocalidadeScreen';

export type RootStackParamList = {
  Home: undefined;
  ListaEventos: undefined;
  AdicionarEvento: undefined;
  DetalhesEvento: { eventoId: number };
  EditarEvento: { evento: any };
  ListaPessoas: undefined;
  AdicionarPessoa: undefined;
  DetalhesPessoa: { pessoaId: number };
  EditarPessoa: { pessoa: any };
  ListaRecursos: undefined;
  AdicionarRecurso: undefined;
  DetalhesRecurso: { recursoId: number };
  EditarRecurso: { recurso: any };
  ListaRegistrosAjuda: undefined;
  AdicionarRegistroAjuda: undefined;
  DetalhesRegistroAjuda: { registroId: number };
  ListaLocalidades: undefined;
  AdicionarLocalidade: undefined;
  DetalhesLocalidade: { localidadeId: number };
  EditarLocalidade: { localidade: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home" 
        screenOptions={{
          headerStyle: {
            backgroundColor: '#C53030',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'SOS ClimateTech' }} 
        />
        <Stack.Screen name="ListaEventos" component={ListaEventosScreen} options={{ title: 'Eventos Climáticos' }} />
        <Stack.Screen name="AdicionarEvento" component={AdicionarEventoScreen} options={{ title: 'Adicionar Evento' }} />
        <Stack.Screen name="DetalhesEvento" component={DetalhesEventoScreen} options={{ title: 'Detalhes do Evento' }} />
        <Stack.Screen name="EditarEvento" component={EditarEventoScreen} options={{ title: 'Editar Evento' }} />
        <Stack.Screen name="ListaPessoas" component={ListaPessoasScreen} options={{ title: 'Pessoas Afetadas' }} />
        <Stack.Screen name="AdicionarPessoa" component={AdicionarPessoaScreen} options={{ title: 'Adicionar Pessoa' }} />
        <Stack.Screen name="DetalhesPessoa" component={DetalhesPessoaScreen} options={{ title: 'Detalhes da Pessoa' }} />
        <Stack.Screen name="EditarPessoa" component={EditarPessoaScreen} options={{ title: 'Editar Pessoa' }} />
        <Stack.Screen name="ListaRecursos" component={ListaRecursosScreen} options={{ title: 'Recursos' }} />
        <Stack.Screen name="AdicionarRecurso" component={AdicionarRecursoScreen} options={{ title: 'Adicionar Recurso' }} />
        <Stack.Screen name="DetalhesRecurso" component={DetalhesRecursoScreen} options={{ title: 'Detalhes do Recurso' }} />
        <Stack.Screen name="EditarRecurso" component={EditarRecursoScreen} options={{ title: 'Editar Recurso' }} />
        <Stack.Screen name="ListaRegistrosAjuda" component={ListaRegistrosAjudaScreen} options={{ title: 'Registros de Ajuda' }} />
        <Stack.Screen name="AdicionarRegistroAjuda" component={AdicionarRegistroAjudaScreen} options={{ title: 'Registrar Ajuda' }} />
        <Stack.Screen name="DetalhesRegistroAjuda" component={DetalhesRegistroAjudaScreen} options={{ title: 'Detalhes do Registro' }} />
        <Stack.Screen name="ListaLocalidades" component={ListaLocalidadesScreen} options={{ title: 'Localidades' }} />
        <Stack.Screen name="AdicionarLocalidade" component={AdicionarLocalidadeScreen} options={{ title: 'Adicionar Localidade' }} />
        <Stack.Screen name="DetalhesLocalidade" component={DetalhesLocalidadeScreen} options={{ title: 'Detalhes da Localidade' }} />
        <Stack.Screen name="EditarLocalidade" component={EditarLocalidadeScreen} options={{ title: 'Editar Localidade' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

