import React, { Component } from "react";
import { View, Text, Image, StyleSheet, FlatList, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TouchableOpacity } from "react-native-gesture-handler";

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
    this.interval = setInterval(this.fetchContacts, 5000); //refresh cntacts every 5 seconds
  }

  componentWillUnmount() {
    // Clear the interval when the component unmounts
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
      
      // Make a separate API call to get the profile photo URL for each contact
      const contacts = await Promise.all(
        data.map(async contact => {
          const photoUrlResponse = await fetch(`http://localhost:3333/api/1.0.0/user/${contact.user_id}/photo`, {
            method: 'GET',
            headers: {
              'X-Authorization': token,
            },
          });
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
        this.setState(prevState => ({
          contacts: prevState.contacts.filter(contact => contact.user_id !== contactId)
        }));
        this.setState({ message: 'Contact blocked successfully!' });
      } else {
        this.setState({ message: 'Failed to block contact' });
      }
    } catch (error) {
      console.error(error);
    }
  }
  
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
        // remove the deleted contact from the state
        this.setState(prevState => ({
          contacts: prevState.contacts.filter(contact => contact.user_id !== contactId)
        }));
        console.log("Contact deleted successfully!");
      } else {
        console.error("Failed to delete contact.");
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
            <Text style={styles.delete}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.blockContact(item.user_id)}
            style={{ flex: 1, marginLeft: 5 }}
          >
            <Text style={styles.block}>Block</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );


  render() {
    const { navigation } = this.props;
    return (      
      <View style={styles.container}>
        <Text style={styles.title}>Contact List</Text>
        <View style={styles.addButtonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('BlockedContact')}> 
           <Text style={styles.blockButton}>Blocked Contacts</Text>
          </TouchableOpacity>
          </View>
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    backgroundColor: "#128C7E",
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
    paddingVertical: 20,
    paddingHorizontal: 60,
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#fff",
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
    shadowColor: "#000",
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
    justifyContent: "center",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  status: {
    fontSize: 14,
    color: "#777",
  },
  delete: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  block: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'orange',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  message: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#eee",
    alignSelf: "stretch",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
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
