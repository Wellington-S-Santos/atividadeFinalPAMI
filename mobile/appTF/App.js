import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import { useState } from 'react';

const API_url = 'http://172.16.7.19:3000/usuarios';

const AlunosItem = ({ alunos, onDelete, onEdit }) => {
  return (
    <View style={styles.alunosItem}>
      <Text style={styles.alunosName}>{alunos.nome}</Text>
      <Text style={styles.alunosrm}>{alunos.rm}</Text>
      <View style={styles.alunosActions}>
        <TouchableOpacity style={styles.button} onPress={() => onEdit(alunos)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => onDelete(alunos.id)}>
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const UsuariosForm = ({ usuarios, onSave, onCancel }) => {
  const [cpf, setCpf] = useState(usuarios ? usuarios.cpf : '');
  const [name, setName] = useState(usuarios ? usuarios.nome : '');
  const [idade, setIdade] = useState(usuarios ? usuarios.idade: '');
  const [cep, setCep] = useState(usuarios ? usuarios.cep : '');
  const [endereco, setEndereco] = useState(usuarios ? usuarios.endereco : '');
  const [numero, setNumero] = useState(usuarios ? usuarios.numero: '');


  const handleSubmit = () => {
    if (alunos) {
      axios.put(`${API_URL}/${usuarios.id}`, { cpf: cpf,nome: name, idade: idade, cep: cep, endereco: endereco })
        .then(() => onSave())
        .catch((error) => alert(error.message));
    } else {
      axios.post(API_URL, {cpf: cpf,nome: name, idade: idade, cep: cep, endereco: endereco })
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
        keyboardType="numeric"
      />
        <TextInput
        style={styles.input}
        placeholder="endereco"
        value={endereco}
        onChangeText={setEndereco}
      />
        <TextInput
        style={styles.input}
        placeholder="Número"
        value={numero}
        onChangeText={setNumero}
        keyboardType="numeric"
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
    fetchAlunos();
  }, []);

  const fetchAlunos = () => {
    axios.get(API_URL)
      .then((response) => setUsuarios(response.data))
      .catch((error) => alert(error.message));
  };

  const handleDeleteUsuarios = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => fetchAlunos())
      .catch((error) => alert(error.message));
  };

  const handleEditUsuarios = (alunos) => {
    setSelectedUsuarios(usuarios);
    setShowForm(true);
  };

  const handleSaveUsuarios = () => {
    setShowForm(false);
    fetchAlunos();
  };

  const handleCancelUsuarios = () => {
    setShowForm(false);
    setSelectedUsuarios(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRUD API com React Native ALUNOS</Text>
      {showForm ? (
        <AlunosForm
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
    backgroundColor: '#D8D8D8',
  }, 
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 50,
  },
  alunosItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  alunosName: {
    flex: 1,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000000',
    margin: 5,
  },
  alunosrm: {
    flex: 1,
    fontSize: 26,
    textAlign: 'right',
    color: '#000000',
  },
  alunosActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  alunosForm: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#FF0000',
    borderWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
 
 
});

export default App;

