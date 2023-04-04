import React, { Component } from "react";
import { View, Text, Image, StyleSheet, FlatList, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TouchableOpacity } from "react-native-gesture-handler";

export default class AddUser extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      contacts: [],
      isLoading: null,
      userId: "",
      message: "",
    };
  }

  handleUserIdChange = (text) => {
    this.setState({ userId: text });
  };

  async componentDidMount() {
    this.fetchContacts();
   // this.interval = setInterval(this.fetchContacts, 5000); //refresh cntacts every 5 seconds
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

  
  handleAddUser = async (userId) => {
    const { chat_id } = this.props.route.params;
    try {
      const token = await AsyncStorage.getItem("whatsthat_session_token");
      const url = `http://localhost:3333/api/1.0.0/chat/${chat_id}/user/${userId}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "X-Authorization": token,
        },
      });
      if (response.status === 200) {
        this.setState({ message: "User added successfully!" }, () => {
          setTimeout(() => {
            this.setState({ message: "" });
          }, 3000);
        }); // Set the success message
      } else {
        this.setState({ message: "Failed to add user." }, () => {
          setTimeout(() => {
            this.setState({ message: "" });
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
              onPress={() => this.handleAddUser(item.user_id)}
                style={{ flex: 1, marginRight: 5 }}
                >
            <Text style={styles.delete}>Add User To Chat</Text>
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
          </View>
          <View style={styles.messageContainer}>
          <Text style={styles.message}>{this.state.message}</Text> 
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
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
    backgroundColor: "lightgreen",
    paddingVertical: 20,
    paddingHorizontal: 60
  },
  listContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 10,
  },
  contactContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "lightgreen",
    marginBottom: 10,
    paddingVertical: 10,
    padding: 20,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginLeft: 10,
    borderColor: "black",
    borderWidth: 5
  },
  contactInfo: {
    marginLeft: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    fontSize: 15,
  },
  delete: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
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
  blockButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'orange',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginLeft: 10,
    borderColor: "black",
    borderWidth: 5
  },
  buttonContainer: {
    flexDirection: "row",
    paddingTop: 10
  },
  message: {
    color: 'green',
    fontSize: 20,
    fontStyle: 'bold'
  },
  messageContainer: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },  
});
