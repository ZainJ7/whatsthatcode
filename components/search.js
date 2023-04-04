import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      q: '',
      search_in: '',
      limit: '',
      offset: 0,
      userId: '',
      message: '',
    };
  }

  componentDidMount() {
    this.fetchUsers();
  }

  addContact = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('whatsthat_session_token');
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
        // Set the message to show only for the user who clicked the "Add User" button
        this.setState((prevState) => ({
          message: { ...prevState.message, [userId]: 'Contact added successfully!' }
        }));
      } else {
        // Set the message to show only for the user who clicked the "Add User" button
        this.setState((prevState) => ({
          message: { ...prevState.message, [userId]: 'Failed to add contact' }
        }));
      }
   // Clear the message after 2 seconds
   setTimeout(() => {
    this.setState((prevState) => ({
      message: { ...prevState.message, [userId]: null }
    }));
  }, 2000);

} catch (error) {
  console.error(error);
}
};
  


  fetchUsers = async () => {
    try {
      const { q, search_in, limit, offset } = this.state;
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const url = `http://localhost:3333/api/1.0.0/search?q=${q}&search_in=${search_in}&limit=${limit}&offset=${offset}`;
      const response = await fetch(url, {
        headers: {
          'X-Authorization': token,
        },
      });
      const data = await response.json();
      this.setState({
        users: data,
      });
    } catch (error) {
      console.error(error);
    }
  };

  renderUsers = ({ item }) => (
    <View style={styles.contactContainer}>
      <Image source={{ uri: item.profilePicture }} style={styles.profilePicture} />
      <View style={styles.contactInfo}>
        <Text style={styles.name}>
          {item.given_name} {item.family_name}
        </Text>
        <Text style={styles.email}>{item.email}</Text>
        <View style={styles.buttonContainer}>
          <View style={{ flexDirection: 'column' }}>
            <TouchableOpacity onPress={() => this.addContact(item.user_id)}>
              <Text style={styles.addUserButton}>Add User</Text>
            </TouchableOpacity>
            <View>
              {this.state.message[item.user_id] && (
                <Text style={styles.message}>{this.state.message[item.user_id]}</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
  

  render() {
    const { users } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, {width: '100%'}]}
            placeholder="Search"
            onChangeText={(text) => this.setState({ q: text })}
            value={this.state.q}
          />
          <TextInput
            style={[styles.input, {width: '100%'}]}
            placeholder="Search in (all or contacts)"
            onChangeText={(text) => this.setState({ search_in: text })}
            value={this.state.search_in}
          />
          <TextInput
            style={[styles.input, {width: '100%'}]}
            placeholder="Limit (e.g. 20)"
            onChangeText={(text) => this.setState({ limit: text })}
            value={this.state.limit.toString()}
          />
          <TextInput
            style={[styles.input, {width: '100%'}]}
            placeholder="Offset (e.g. 0)"
            onChangeText={(text) => this.setState({ offset: text })}
            value={this.state.offset.toString()}
          />
          <TouchableOpacity style={styles.searchButton} onPress={this.fetchUsers}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.resultsContainer}>
          <FlatList
            data={users}
            renderItem={this.renderUsers}
            keyExtractor={(item) => item.user_id.toString()}
            style={styles.listContainer}
          />
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    },
    title: {
    color: "white",
    backgroundColor: "#128C7E",
    padding: 10,
    paddingHorizontal: 100,
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    alignSelf: "stretch",
    },
    inputContainer: {
    width: "90%",
    marginBottom: 10,
    },
    input: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 8,
    marginVertical: 5,
    width: "100%",
    borderRadius: 5,
    },
    listContainer: {
      flex: 1,
      width: "100%",
      paddingHorizontal: 10
    },
    dropdown: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 8,
    margin: 10,
    width: "30%",
    },
    searchButton: {
    backgroundColor: "#128C7E",
    padding: 10,
    borderRadius: 10,
    margin: 10,
    },
    searchButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    },
    resultsContainer: {
    flex: 1,
    width: "90%",
    marginTop: 20,
    },
    resultItem: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    },
    resultLabel: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
    },
    resultValue: {
    fontSize: 18,
    },
    paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    },
    paginationButton: {
    padding: 10,
    borderRadius: 10,
    },
    paginationButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    },
    searchContainer: {
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    },
    searchIcon: {
    marginRight: 10,
    },
    searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#777",
    },
    contactContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#ffffff",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#dcdcdc",
      minHeight: 100,
      marginVertical: 10,
      marginHorizontal: 10,
      borderRadius: 10,
      overflow: 'hidden',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    },
    name: {
      fontSize: 18,
      fontWeight: "bold",
    },
    contactPhoneNumber: {
    fontSize: 16,
    color: "#555",
    },
    buttonContainer: {
      flexDirection: "row",
      paddingTop: 10
    },
    addUserButton: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: '#128C7E',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
    },
    buttonContainer: {
      paddingTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    messageContainer: {
      flexDirection: 'column',
      marginTop: 10,
    },
    message: {
      paddingTop: 10,
      color: 'green',
      fontWeight: 'bold',
      width: 120
    },
    email: {
      paddingTop: 5
    }
    });
