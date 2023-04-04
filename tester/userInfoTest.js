import React, { Component } from "react";
import { View, Text, Image, StyleSheet, FlatList, TextInput, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class ContactListTest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: "",
      first_name: "",
      last_name: "",
      contacts: [],
    };
  }

  handleInputChange = (value) => {
    this.setState({
      userId: value,
    });
  };

  handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const userId = this.state.userId;
      const url = `http://localhost:3333/api/1.0.0/user/${userId}`;
      const response = await fetch(url, {
        headers: {
          'X-Authorization': token,
        },
      });
      const data = await response.json();
      this.setState({
        first_name: data.first_name,
        last_name: data.last_name,
      });
    } catch (error) {
      console.error(error);
    }
  };

  handleAddContact = async () => {
    try {
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const userId = this.state.userId;
      const url = `http://localhost:3333/api/1.0.0/user/${userId}/contacts`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      const newContact = { id: data.contact_id, name: `${this.state.first_name} ${this.state.last_name}` };
      this.setState((prevState) => ({ contacts: [...prevState.contacts, newContact] }));
    } catch (error) {
      console.error(error);
    }
  };

  renderContact = ({ item }) => (
    <View style={styles.contact}>
      <Text style={styles.contactName}>{item.name}</Text>
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter user ID"
            onChangeText={this.handleInputChange}
            value={this.state.userId}
          />
          <Button title="Get User Info" onPress={this.handleSubmit} />
        </View>
        {this.state.first_name && this.state.last_name && (
          <View style={styles.userInfo}>
            <Image style={styles.userImage} source={{ uri: 'https://picsum.photos/200' }} />
            <Text style={styles.userName}>{`${this.state.first_name} ${this.state.last_name}`}</Text>
            <Button title="Add Contact" onPress={this.handleAddContact} />
          </View>
        )}
        {this.state.contacts.length > 0 && (
          <View style={styles.contactsContainer}>
            <Text style={styles.contactsTitle}>Contacts</Text>
            <FlatList
              data={this.state.contacts}
              renderItem={this.renderContact}
              keyExtractor={(item) => item.id.toString()}
              style={styles.contactsList}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      alignItems: "stretch",
      justifyContent: "flex-start",
      paddingTop: 50,
    },
    contact: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    contactImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    contactName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "black",
      },
      form: {
        padding: 20,
        backgroundColor: "#eee",
      },
      formTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "black",
      },
      formInput: {
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        marginBottom: 10,
        padding: 10,
      },
      formButton: {
        backgroundColor: "lightgreen",
        color: "white",
        padding: 10,
        borderRadius: 4,
      },
  });
  
