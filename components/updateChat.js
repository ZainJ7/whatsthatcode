import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UpdateChat({ route, navigation }) {
  const [chatName, setChatName] = useState('');
  const [chatDetails, setChatDetails] = useState(null);
  const { chat_id } = route.params;

  useEffect(() => {
    async function fetchChatDetails() {
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const url = `http://localhost:3333/api/1.0.0/chat/${chat_id}`;
      const response = await fetch(url, {
        headers: {
          'X-Authorization': token,
        },
      });
      const data = await response.json();
      setChatDetails(data);
      setChatName(data.name);
    }
    fetchChatDetails();
  }, []);

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const url = `http://localhost:3333/api/1.0.0/chat/${chat_id}`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
        body: JSON.stringify({
          name: chatName,
        }),
      });
      if (response.ok) {
        navigation.goBack();
      } else {
        console.error('Failed to update chat');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {chatDetails && (
        <>
          <Text style={styles.title}>Update Chat Info</Text>
          <View style={styles.formItem}>
          <TextInput
            style={styles.formInput}
            value={chatName}
            onChangeText={setChatName}
            placeholder="Enter new chat name"
          />
          </View>
          <View style={styles.formItem}>
          <TouchableOpacity style={styles.formTouch} onPress={handleSubmit}>
            <Text style={styles.formTouchText}>Submit</Text>
          </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  title: {
    color: "white",
    backgroundColor: "#128C7E",
    padding: 10,
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    alignSelf: "stretch",
    width: "100%",
  },
  inputContainer: {
    padding: 20,
  },
  label: {
    fontSize: 30,
    color: "black",
  },
  input: {
    fontSize: 20,
    borderRadius: 5,
    height: 50,
    width: 500,
    borderWidth: 1,
    borderColor: "#777",
    padding: 8,
    marginVertical: 5,
    width: "100%",
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "#128C7E",
    padding: 10,
    borderRadius: 10,
    margin: 10,
    textAlign: "center"
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  formItem: {
    padding: 20,
  },
  formTouch: {
    backgroundColor: "#128C7E",
    padding: 10,
    borderRadius: 10,
    margin: 10,
    textAlign: "center"
  },
  formTouchText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  formInput: {
    fontSize: 20,
    borderRadius: 5,
    height: 50,
    width: 500,
    borderWidth: 1,
    borderColor: "#777",
    padding: 8,
    marginVertical: 5,
    width: "100%",
    borderRadius: 5,
  },
});


