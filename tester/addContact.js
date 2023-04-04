import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class AddContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      message: '',
    };
  }

  addContact = async () => {
    try {
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const userId = this.state.userId;
      const url = `http://localhost:3333/api/1.0.0/user/${userId}/contact`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
        body: JSON.stringify({}),
      });
      if (response.ok) {
        this.setState({ message: 'Contact added successfully!' });
      } else {
        this.setState({ message: 'Failed to add contact' });
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Add Contact</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter user ID"
          onChangeText={(text) => this.setState({ userId: text })}
          value={this.state.userId}
        />
        <TouchableOpacity style={styles.button} onPress={this.addContact}>
          <Text style={styles.buttonText}>Add Contact</Text>
        </TouchableOpacity>
        {this.state.message !== '' && (
          <Text style={styles.message}>{this.state.message}</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50
  },
  title: {
    color: "black",
    backgroundColor: "lightgreen",
    padding: 10,
    paddingHorizontal: 100,
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    alignSelf: "stretch",
  },
  input: {
    height: 40,
    width: 300,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'lightgreen',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  message: {
    color: 'green',
    marginTop: 10,
    fontSize: 16,
  }
});
