import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Picker,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/global';

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
        this.setState((prevState) => ({
          message: {
            ...prevState.message,
            [userId]: 'Contact added successfully!',
          },
        }));
      } else {
        this.setState((prevState) => ({
          message: { ...prevState.message, [userId]: 'Failed to add contact' },
        }));
      }
      setTimeout(() => {
        this.setState((prevState) => ({
          message: { ...prevState.message, [userId]: null },
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

  handlePrevPage = () => {
    const { offset } = this.state;
    if (offset > 0) {
      this.setState({ offset: offset - 5 }, this.fetchUsers);
    }
  };

  handleNextPage = () => {
    const { users, offset } = this.state;
    if (users.length === 5) {
      this.setState({ offset: offset + 5 }, this.fetchUsers);
    }
  };

  renderUsers = ({ item }) => (
    <View style={styles.contactContainer}>
      <Image
        source={{ uri: item.profilePicture }}
        style={styles.profilePicture}
      />
      <View style={styles.contactInfo}>
        <Text style={styles.name}>
          {item.given_name} {item.family_name}
        </Text>
        <Text style={styles.email}>{item.email}</Text>
        <View style={styles.buttonContainer}>
          <View style={styles.addButtonContainer}>
            <TouchableOpacity onPress={() => this.addContact(item.user_id)}>
              <Text style={styles.addUserButton}>Add User</Text>
            </TouchableOpacity>
            <View>
              {this.state.message[item.user_id] && (
                <Text style={styles.message}>
                  {this.state.message[item.user_id]}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  render() {
    const { users, offset } = this.state;
    const perPage = 5;
    const totalPages = Math.ceil(users.length / perPage);
    const currentPage = Math.floor(offset / perPage) + 1;
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const currentUsers = users.slice(startIndex, endIndex);
    return (
      <View style={styles.container}>
        <Text style={globalStyles.title}>Search</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search"
            onChangeText={(text) => this.setState({ q: text })}
            value={this.state.q}
          />
          <Picker
            style={styles.picker}
            selectedValue={this.state.search_in}
            onValueChange={(value) => this.setState({ search_in: value })}
          >
            <Picker.Item label="All" value="all" />
            <Picker.Item label="Contacts" value="contacts" />
          </Picker>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={this.fetchUsers}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.resultsContainer}>
          <FlatList
            data={currentUsers}
            renderItem={this.renderUsers}
            keyExtractor={(item) => item.user_id.toString()}
            style={styles.listContainer}
          />
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[styles.paginationButton, { marginRight: 10 }]}
              onPress={() =>
                this.setState({
                  offset: Math.max(offset - perPage, 0),
                })
              }
              disabled={offset === 0}
            >
              <Text style={styles.paginationButtonText}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.paginationText}>
              Page {currentPage} of {totalPages}
            </Text>
            <TouchableOpacity
              style={[styles.paginationButton, { marginLeft: 10 }]}
              onPress={() =>
                this.setState({
                  offset: Math.min(
                    offset + perPage,
                    (totalPages - 1) * perPage
                  ),
                })
              }
              disabled={offset === (totalPages - 1) * perPage}
            >
              <Text style={styles.paginationButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  inputContainer: {
    width: '90%',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    marginVertical: 5,
    width: '100%',
    borderRadius: 5,
  },
  listContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
  },
  searchButton: {
    backgroundColor: '#128C7E',
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  resultsContainer: {
    flex: 1,
    width: '90%',
    marginTop: 20,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
    minHeight: 100,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
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
  message: {
    paddingTop: 10,
    color: 'green',
    fontWeight: 'bold',
    width: 120,
  },
  email: {
    paddingTop: 5,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  paginationButton: {
    backgroundColor: '#128C7E',
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
  },
  paginationButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  paginationText: {
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    marginVertical: 5,
    width: '100%',
    borderRadius: 5,
  },
  addButtonContainer: {
    flexDirection: 'column',
  },
});
