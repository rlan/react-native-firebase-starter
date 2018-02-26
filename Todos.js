// https://blog.invertase.io/getting-started-with-cloud-firestore-on-react-native-b338fb6525b9

import React from 'react';
import firebase from 'react-native-firebase';
import { FlatList, View, Text, TextInput, Button } from 'react-native';
import { StyleSheet, Platform, StatusBar } from 'react-native';

import Todo from './Todo';

class Todos extends React.Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('todos');
    this.unsubscribe = null;
    this.state = {
      textInput: '',
      loading: true,
      todos: [],
    };
  }
  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  onCollectionUpdate = (querySnapshot) => {
    const todos = [];
    querySnapshot.forEach((doc) => {
      const { title, complete } = doc.data();

      todos.push({
        key: doc.id,
        doc, // DocumentSnapshot
        title,
        complete,
      });
    });

    this.setState({
      todos,
      loading: false,
    });
  }
  updateTextInput(value) {
    this.setState({ textInput: value });
  }
  addTodo() {
    this.ref.add({
      title: this.state.textInput,
      complete: false,
    });
    this.setState({
      textInput: '',
    });
  }
  render() {
    if (this.state.loading) {
      return null; // TODO or redner a loading icon
    }

    return (
      <View>
        <StatusBar style={styles.statusBarBackground} />
        <FlatList
          data={this.state.todos}
          renderItem={({ item }) => <Todo {...item} />}
        />
        <TextInput
          placeholder={'Add TODO'}
          value={this.state.TextInput}
          onChangeText={(text) => this.updateTextInput(text)}
        />
        <Button
          title={'Add TODO'}
          disabled={!this.state.textInput.length}
          onPress={() => this.addTodo()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  statusBarBackground: {
    height: (Platform.OS === 'ios') ? 20 : StatusBar.currentHeight,
    backgroundColor: "white",
  }

});

export default Todos;
