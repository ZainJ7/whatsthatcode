import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import globalStyles from '../styles/global';

export default class BlockedContact extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      isLoading: null,
      message: '',
    };
  }

  componentDidMount() {
    this.fetchContacts();
    this.interval = setInterval(this.fetchContacts, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchContacts = async () => {
    try {
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const url = `http://localhost:3333/api/1.0.0/blocked`;
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

  unblockContact = async (contactId) => {
    try {
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const url = `http://localhost:3333/api/1.0.0/user/${contactId}/block`;
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
        this.setState({ message: 'Contact Unblocked Successfully!' }, () => {
          setTimeout(() => {
            this.setState({ message: '' });
          }, 3000);
        });
      } else {
        this.setState({ message: 'Failed to unblock contact.' }, () => {
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
        <TouchableOpacity onPress={() => this.unblockContact(item.user_id)}>
          <Text style={styles.unblockButton}>Unblock</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  render() {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Blocked Contacts</Text>
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
  unblockButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#128C7E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  message: {
    fontSize: 20,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
});
