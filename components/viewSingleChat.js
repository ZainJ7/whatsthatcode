import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import globalStyles from "../styles/global";

export default class ViewSingleChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      newMessage: "",
      userLoggedInId: "",
    };
  }

  async componentDidMount() {
    this.state.userLoggedInId = await AsyncStorage.getItem("whatsthat_user_id");
    const { chat_id } = this.props.route.params;
    this.fetchMessages(chat_id);
    this.interval = setInterval(this.fetchMessages, 3000); //refresh messages every 3 seconds
  }

  componentWillUnmount() {
    // Clear the interval when the component unmounts
    clearInterval(this.interval);
  }

  fetchMessages = async (chat_id) => {
    //set interval 3 sec
    try {
      const { chat_id } = this.props.route.params;
      const token = await AsyncStorage.getItem("whatsthat_session_token");
      const url = `http://localhost:3333/api/1.0.0/chat/${chat_id}`;
      const response = await fetch(url, {
        headers: {
          "X-Authorization": token,
        },
      });
      const data = await response.json();
      this.setState({
        messages: data.messages,
      });
    } catch (error) {
      console.error(error);
    }
  };

  handleNewMessage = (text) => {
    this.setState({ newMessage: text });
  };

  handleSendMessage = async () => {
    const { chat_id } = this.props.route.params;
    const { newMessage } = this.state;
    try {
      const token = await AsyncStorage.getItem("whatsthat_session_token");
      const url = `http://localhost:3333/api/1.0.0/chat/${chat_id}/message`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "X-Authorization": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newMessage,
        }),
      });
      const data = await response.json();
      if (response.status === 201) {
        this.fetchMessages(chat_id);
        this.setState(
          {
            messages: [...this.state.messages, data],
            newMessage: "",
          },
          () => {
            this.fetchMessages(chat_id);
          }
        );
      } else {
        console.error(data.message);
        this.fetchMessages(chat_id);
      }
    } catch (error) {
      console.error(error);
      this.fetchMessages(chat_id);
    }
    this.setState({ newMessage: "" }); // Clear the user input
  };

  handleDeleteMessage = async (message_id) => {
    const { chat_id } = this.props.route.params;
    try {
      const token = await AsyncStorage.getItem("whatsthat_session_token");
      const url = `http://localhost:3333/api/1.0.0/chat/${chat_id}/message/${message_id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "X-Authorization": token,
        },
      });
      if (response.status === 200) {
        this.fetchMessages(chat_id);
      } else {
        const data = await response.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      <View style={styles.messageInfo}>
        <Text style={styles.senderName}>
          {item.author.first_name} {item.author.last_name}
        </Text>
        {item.author.user_id == this.state.userLoggedInId ? (
          <Text style={styles.messageText}>{item.message}</Text>
        ) : (
          <Text style={styles.messageTextAway}>{item.message}</Text>
        )}
        <Text style={styles.timestamp}>
          {new Date(item.timestamp * 1000).toLocaleString()}
        </Text>
        <View style={styles.deleteAndUpdateButtonContainer}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => this.handleDeleteMessage(item.message_id)}
          >
            <Text style={styles.sendButtonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() =>
              this.props.navigation.navigate("UpdateMessage", {
                chat_id: this.props.route.params.chat_id,
                message_id: item.message_id,
              })
            }
          >
            <Text style={styles.sendButtonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  render() {
    const { chat } = this.props.route.params;
    const { chat_id } = this.props.route.params;
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Chat</Text>
        <TouchableOpacity
          style={styles.addUserButton}
          onPress={() =>
            this.props.navigation.navigate("AddOrDeleteUser", {
              chat_id: chat_id,
            })
          }
        >
          <Text style={styles.addUserButtonText}>Add/Remove Users</Text>
        </TouchableOpacity>
        <FlatList
          data={this.state.messages}
          renderItem={this.renderMessage}
          keyExtractor={(item) => item.message_id.toString()}
          style={styles.listContainer}
        />
        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type your message here"
            value={this.state.newMessage}
            onChangeText={this.handleNewMessage}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={this.handleSendMessage}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
  },
  messageInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  senderName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  messageText: {
    backgroundColor: "#93E9BE",
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  messageTextAway: {
    backgroundColor: "#89CFF0",
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  timestamp: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 5,
  },
  sendButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  sendButtonText: {
    color: "#fff",
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  addUserButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  addUserButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
    paddingTop: 10,
  },
  messageInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  messageInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    width: 100,
    height: 40,
    paddingRight: 10,
    marginRight: 10,
  },
  deleteAndUpdateButtonContainer: {
    flexDirection: "row",
    marginRight: 10,
  },
  updateButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    width: 100,
    height: 40,
  },
});
