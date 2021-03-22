import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, 
  TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TaskList from './src/components/TaskList';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Animatable from 'react-native-animatable';

/* vou er que personalizar o botao*/
 const AnimateBtn = Animatable.createAnimatableComponent(TouchableOpacity);


export default function App() {

  const [task, setTask] = useState([]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');

  // busca os dados no storage ao iniciar o app
  useEffect(() => {
    async function loadTask(){
      const taskStorage = await AsyncStorage.getItem('@task'); // @taks pode ser qualquer nome

      if(taskStorage){   // verifica se tem dados
        setTask(JSON.parse(taskStorage));
      }
    }

    loadTask();

    
  }, []);  // em branco sempre executa

  // tarefa que salva no storage
  useEffect(() => {

      async function saveTask(){
        await AsyncStorage.setItem('@task', JSON.stringify(task));
      }

      saveTask();
    
  }, [task]); // fica monitorando a lista, so executa para lista



function handleAdd(){
  
  if(input === '') return;
  
  const data = {
    key: input,
    task: input
  };

  setTask([...task, data]);
  setOpen(false);
  setInput('');
}

const handleDelete = useCallback((data) => {

  const find = task.filter(r => r.key !== data.key); // filtra todos menos o que selecionei

  setTask(find); // mosta todos menos o selecionado


});
  


  return (

    <SafeAreaView style={styles.container}>

      <StatusBar backgroundColor="#171D31" barStyle="light-content"/>
      <View style={styles.content}>
        <Text style={styles.title}>Minhas Tarefas</Text>
      </View>

      <FlatList
        marginHorizontal={10}
        showsHorizontalScrollIndicator={false}  /* tira barra de rolagem*/
        data={task} /* todos os dados fica aqui*/
        keyExtractor={ (item) => String(item.key) } /* todos os dados fica aqui*/
        renderItem={ ({ item }) => <TaskList data={item} handleDelete={handleDelete} />}
      />

      <Modal animationType="slide" transparent={false} visible={open}>
        <SafeAreaView style={styles.modal}>

          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={ () => setOpen(false) }>
              <Ionicons style={{marginLeft: 5, marginRight: 5}} name="md-arrow-back" size={40} color="#fff"/>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nova Tarefa</Text>
          </View>

          <Animatable.View 
          animation="fadeInUp"  
          useNativeDriver
          style={styles.modalBody}>
            <TextInput
              multiline={true}
              placeholderTextColor="#747474"
              autoCorrect={false}
              placeholder="O que precisa fazer hoje?"
              style={styles.input}
              value={input}
              onChangeText={ (texto) => setInput(texto)}
            />
            <TouchableOpacity style={styles.handleAdd} onPress={handleAdd}>
              <Text style={styles.handleAddText}>Cadastrar</Text>
            </TouchableOpacity>
          </Animatable.View>

        </SafeAreaView>
      </Modal>

      <AnimateBtn 
      style={styles.fab}
      useNativeDriver
      animation="bounceInUp"
      duration={1500}
      onPress={ () => setOpen(true) }
      >
        <Ionicons name="ios-add" size={35} color="#fff"/>
      </AnimateBtn>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171D31',
  },
  content: {

  },
  title: {
    marginTop: 10,
    paddingBottom: 10,
    fontSize: 25,
    textAlign: 'center',
    color: '#FFF'
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#0094ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    right: 25,
    bottom: 25,
    elevation: 2,
    zIndex: 9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 3,}
  },
  modal: {
    flex: 1,
    backgroundColor: '#171D31',
  },
  modalHeader:{ 
    marginLeft: 10,
    marginTop:20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    marginLeft: 15,
    fontSize: 23,
    color: '#fff'
  },
  modalBody: {
    marginTop: 15, 
  },
  input: {
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 9,
    height: 85,
    textAlignVertical: 'top',
    color: '#000',
    borderRadius: 5,
  },
  handleAdd:{
    backgroundColor: '#fff',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 5
  },
  handleAddText: {
    fontSize: 20 
  }

});
