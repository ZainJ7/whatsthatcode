import React, { Component } from "react";
import { View, Text, Image, StyleSheet, FlatList, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";
import globalStyles from "../styles/global";

export default class AddOrDeleteUser extends Component {
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
    this.interval = setInterval(this.fetchContacts, 5000); 
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchContacts = async () => {                                 
    try {
      const token = await AsyncStorage.getItem("whatsthat_session_token");
      const url = `http://localhost:3333/api/1.0.0/contacts`;
      const response = await fetch(url, {
        headers: {
          "X-Authorization": token,
        },
      });
      const data = await response.json();

      const contacts = await Promise.all(
        data.map(async (contact) => {
          const photoUrlResponse = await fetch(
            `http://localhost:3333/api/1.0.0/user/${contact.user_id}/photo`,
            {
              method: "GET",
              headers: {
                "X-Authorization": token,
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
        }); 
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

  handleDeleteUser = async (userId) => {                              
    const { chat_id } = this.props.route.params;
    try {
      const token = await AsyncStorage.getItem("whatsthat_session_token");
      const url = `http://localhost:3333/api/1.0.0/chat/${chat_id}/user/${userId}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "X-Authorization": token,
        },
      });
      if (response.status === 200) {
        this.setState({ message: "User removed successfully!" }, () => {
          setTimeout(() => {
            this.setState({ message: "" });
          }, 3000);
        }); // Set the success message
      } else {
        this.setState({ message: "Failed to remove user." }, () => {
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
      <View style={styles.contactInfoView}>
        <Text style={styles.name}>
          {item.first_name} {item.last_name}
        </Text>
        <Text style={styles.email}>{item.email}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.handleAddUser(item.user_id)}
            style={[
              styles.button,
              { marginRight: 5 },
              { backgroundColor: "green" },
            ]}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.handleDeleteUser(item.user_id)}
            style={[
              styles.button,
              { marginLeft: 5 },
              { backgroundColor: "red" },
            ]}
          >
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  render() {
    return (                                                                          
      <View style={styles.container}>                                               
        <Text style={styles.title}>Add/Remove Users</Text>
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
    marginBottom: 20
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
  contactInfoView: {
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
  message: {
    fontSize: 20,
    alignSelf: "stretch",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    paddingTop: 10,
  },
  button: {
    width: 105,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 5,
    padding: 5,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#128C7E",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
