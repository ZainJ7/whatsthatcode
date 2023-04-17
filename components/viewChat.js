import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/global';

export default class ViewChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chats: [],
    };
  }

  componentDidMount() {
    this.fetchChats();
    this.interval = setInterval(this.fetchChats, 3000); //refresh messages every 3 seconds
  }

  componentWillUnmount() {
    // Clear the interval when the component unmounts
    clearInterval(this.interval);
  }

  fetchChats = async () => {
    try {
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const url = 'http://localhost:3333/api/1.0.0/chat';
      const response = await fetch(url, {
        headers: {
          'X-Authorization': token,
        },
      });
      const data = await response.json();
      this.setState({
        chats: data,
      });
    } catch (error) {
      console.error(error);
    }
  };

  createChat = async () => {
    try {
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const url = 'http://localhost:3333/api/1.0.0/chat';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'New Chat',
        }),
      });
      const data = await response.json();
      const chatId = data.chat_id;
      this.props.navigation.navigate('ViewSingleChat', { chat_id: chatId });
    } catch (error) {
      console.error(error);
    }
  };

  renderChat = ({ item }) => (
    <TouchableOpacity
      style={styles.chatContainer}
      onPress={() =>
        this.props.navigation.navigate('ViewSingleChat', {
          chat_id: item.chat_id,
        })
      }
    >
      <View style={styles.nameContainer}>
        <Text style={styles.name}>
          {item.creator.first_name} {item.creator.last_name}
        </Text>
        <Text style={styles.chatName}>{item.name}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() =>
              this.props.navigation.navigate('UpdateChat', {
                chat_id: item.chat_id,
              })
            }
          >
            <Text style={styles.updateButtonText}>Edit Chat Name</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.timestamp}>
          {new Date(item.last_message.timestamp).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Chat List</Text>
        <TouchableOpacity style={styles.createButton} onPress={this.createChat}>
          <Text style={styles.createButtonText}>Create Chat</Text>
        </TouchableOpacity>
        <FlatList
          data={this.state.chats}
          renderItem={this.renderChat}
          keyExtractor={(item) => item.chat_id.toString()}
          style={styles.listContainer}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
  },
  chatContainer: {
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
  nameContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatName: {
    fontSize: 16,
    color: 'black',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#128C7E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  updateButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 10,
  },
  timestamp: {
    fontSize: 14,
    color: '#8e8e8e',
  },
  createButton: {
    backgroundColor: '#128C7E',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    marginHorizontal: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
