import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { encontrarCEP } from './utils/api';


const API_url = 'http://localhost:3000/usuarios';

const UsuariosItem = ({ usuarios, onDelete, onEdit }) => {
  return (
    <View style={styles.usuariosItem}>
  <View style={styles.usuariosDetails}>
    <Text style={styles.usuariosName}>Nome: {usuarios.nome}</Text>
    <Text style={styles.usuariosCpf}>CPF: {usuarios.cpf}</Text>
    <Text style={styles.usuariosIdade}>Idade: {usuarios.idade}</Text>
    <Text style={styles.usuariosEndereco}>Endereço: {usuarios.endereco}, CEP: {usuarios.cep}</Text>
    
  </View>

  <View style={styles.usuariosActions}>
    <TouchableOpacity style={styles.button} onPress={() => onEdit(usuarios)}>
      <Text style={styles.buttonText}>Editar</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => onDelete(usuarios.id)}>
      <Text style={styles.buttonText}>Excluir</Text>
    </TouchableOpacity>
  </View>
</View>
  );
};

const UsuariosForm = ({ usuarios, onSave, onCancel }) => {
  const [cpf, setCpf] = useState(usuarios ? usuarios.cpf : '');
  const [name, setName] = useState(usuarios ? usuarios.nome : '');
  const [idade, setIdade] = useState(usuarios ? usuarios.idade : '');
  const [cep, setCep] = useState(usuarios ? usuarios.cep : '');
  const [logradouro, setLogradouro] = useState(usuarios ? usuarios.logradouro : '');
  const [bairro, setBairro] = useState(usuarios ? usuarios.bairro : '');
  const [cidade, setCidade] = useState(usuarios ? usuarios.cidade : '');
  const [uf, setUf] = useState(usuarios ? usuarios.uf : '');
  const [numero, setNumero] = useState(usuarios ? usuarios.numero : '');

  useEffect(() => {
    const buscarCEP = async () => {
      if (cep.length === 8) {
        const data = await encontrarCEP(cep);
        if (data) {
          setLogradouro(data.logradouro);
          setBairro(data.bairro);
          setCidade(data.localidade);
          setUf(data.uf);
        }
      }
    };
    buscarCEP();
  }, [cep]);

  const handleSubmit = () => {
    const usuarioData = {
      cpf,
      nome: name,
      idade,
      cep,
      endereco: `${logradouro}, Nº: ${numero}, Bairro: ${bairro}, Cidade: ${cidade} - ${uf}`,
    };

    if (usuarios) {
      axios.put(`${API_url}/${usuarios.id}`, usuarioData)
        .then(() => onSave())
        .catch((error) => alert(error.message));
    } else {
      axios.post(API_url, usuarioData)
        .then(() => onSave())
        .catch((error) => alert(error.message));
    }
  };

  return (
    <View style={styles.usuariosForm}>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Idade"
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="CEP"
        value={cep}
        onChangeText={setCep}
        maxLength={8}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Logradouro"
        value={logradouro}
        onChangeText={setLogradouro}
      />
      <TextInput
        style={styles.input}
        placeholder="Número"
        value={numero}
        onChangeText={setNumero}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Bairro"
        value={bairro}
        onChangeText={setBairro}
      />
      <TextInput
        style={styles.input}
        placeholder="Cidade"
        value={cidade}
        onChangeText={setCidade}
      />
      <TextInput
        style={styles.input}
        placeholder="UF"
        value={uf}
        onChangeText={setUf}
      />
      <View style={styles.formActions}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const App = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuarios, setSelectedUsuarios] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = () => {
    axios.get(API_url)
      .then((response) => setUsuarios(response.data))
      .catch((error) => alert(error.message));
  };

  const handleDeleteUsuarios = (id) => {
    axios.delete(`${API_url}/${id}`)
      .then(() => fetchUsuarios())
      .catch((error) => alert(error.message));
  };

  const handleEditUsuarios = (usuarios) => {
    setSelectedUsuarios(usuarios);
    setShowForm(true);
  };

  const handleSaveUsuarios = () => {
    setShowForm(false);
    fetchUsuarios();
  };

  const handleCancelUsuarios = () => {
    setShowForm(false);
    setSelectedUsuarios(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Usuários</Text>
      {showForm ? (
        <UsuariosForm
          usuarios={selectedUsuarios}
          onSave={handleSaveUsuarios}
          onCancel={handleCancelUsuarios}
        />
      ) : (
        <>
          <FlatList
            data={usuarios}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <UsuariosItem
                usuarios={item}
                onDelete={handleDeleteUsuarios}
                onEdit={handleEditUsuarios}
              />
            )}
          />
          <TouchableOpacity style={styles.button} onPress={() => setShowForm(true)}>
            <Text style={styles.buttonText}>Adicionar usuário</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#79A9E4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 50,
  },
  usuariosItem: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Alinha o conteúdo no topo
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#B6D0FF',
    borderRadius: 10,
    marginLeft: 10,
    flexWrap: 'wrap', // Permite que o conteúdo quebre para a próxima linha
  },
  usuariosName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1, // Ocupa o máximo de espaço disponível antes dos botões
  },
  usuariosIdade: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  usuariosCpf: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  usuariosCep: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  usuariosEndereco: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    flexWrap: 'wrap', // Permite quebra de linha
    marginVertical: 2, // Ajuste do espaçamento para visualização do endereço
    width: '100%', // Garantir que ocupe toda a largura
  },
  usuariosForm: {
    padding: 5,
    marginVertical: 5,
    backgroundColor: '#B6D0FF',
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  formActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  usuariosDetails: {
    flex: 1, // Ocupa o espaço necessário antes dos botões
    paddingRight: 10,
  },
  usuariosActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Alinha os botões à direita
    alignItems: 'center', // Alinha os botões verticalmente
  },
  button: {
    backgroundColor: '#4F69E6',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 8,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
