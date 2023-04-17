import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import globalStyles from '../styles/global';

export default class ContactList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      isLoading: null,
    };
  }

  async componentDidMount() {
    this.fetchContacts();
    this.interval = setInterval(this.fetchContacts, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchContacts = async () => {
    try {
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const url = `http://localhost:3333/api/1.0.0/contacts`;
      const response = await fetch(url, {
        headers: {
          'X-Authorization': token,
        },
      });
      const data = await response.json();

      const contacts = await Promise.all(
        data.map(async (contact) => {
          const photoUrlResponse = await fetch(
            `http://localhost:3333/api/1.0.0/user/${contact.user_id}/photo`,
            {
              method: 'GET',
              headers: {
                'X-Authorization': token,
              },
            }
          );
          const photoBlob = await photoUrlResponse.blob();
          const photoUrl = URL.createObjectURL(photoBlob);
          return { ...contact, photoUrl };
        })
      );

      this.setState({
        contacts,
      });
    } catch (error) {
      console.error(error);
    }
  };

  blockContact = async (contactId) => {
    try {
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const url = `http://localhost:3333/api/1.0.0/user/${contactId}/block`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      });
      if (response.ok) {
        this.setState((prevState) => ({
          contacts: prevState.contacts.filter(
            (contact) => contact.user_id !== contactId
          ),
        }));
        this.setState({ message: 'Contact blocked succsessfully!.' }, () => {
          setTimeout(() => {
            this.setState({ message: '' });
          }, 3000);
        });
      } else {
        this.setState({ message: 'Failed to block contact.' }, () => {
          setTimeout(() => {
            this.setState({ message: '' });
          }, 3000);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  deleteContact = async (contactId) => {
    try {
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const url = `http://localhost:3333/api/1.0.0/user/${contactId}/contact`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'X-Authorization': token,
        },
      });
      if (response.ok) {
        this.setState((prevState) => ({
          contacts: prevState.contacts.filter(
            (contact) => contact.user_id !== contactId
          ),
        }));
        this.setState({ message: 'Contact Deleted Successfully!' }, () => {
          setTimeout(() => {
            this.setState({ message: '' });
          }, 3000);
        });
      } else {
        this.setState({ message: 'Failed to delete contact.' }, () => {
          setTimeout(() => {
            this.setState({ message: '' });
          }, 3000);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  renderContact = ({ item }) => (
    <View style={styles.contactContainer}>
      <Image source={{ uri: item.photoUrl }} style={styles.photo} />
      <View style={styles.contactInfo}>
        <Text style={styles.name}>
          {item.first_name} {item.last_name}
        </Text>
        <Text style={styles.email}>{item.email}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.deleteContact(item.user_id)}
            style={{ flex: 1, marginRight: 5 }}
          >
            <Text style={styles.deleteButton}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.blockContact(item.user_id)}
            style={{ flex: 1, marginLeft: 5 }}
          >
            <Text style={styles.blockButton}>Block</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  render() {
    const { navigation } = this.props;
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Contact List</Text>
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('BlockedContact')}
          >
            <Text style={styles.blockButton}>Blocked Contacts</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.message}>{this.state.message}</Text>
        <FlatList
          data={this.state.contacts}
          renderItem={this.renderContact}
          keyExtractor={(item) => item.user_id.toString()}
          style={styles.listContainer}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
    justifyContent: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  blockButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'orange',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  message: {
    fontSize: 20,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingTop: 10,
  },
  addButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  blockButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#128C7E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
});
