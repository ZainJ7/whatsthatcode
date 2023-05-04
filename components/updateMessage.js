import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/global';

export default function UpdateMessage({ route, navigation }) {
  const { chat_id, message_id, messageText } = route.params;
  const [message, setMessage] = useState(messageText);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const url = `http://localhost:3333/api/1.0.0/chat/${chat_id}/message/${message_id}`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
        body: JSON.stringify({
          message: message,
        }),
      });
      if (response.ok) {
        navigation.goBack();
      } else {
        setError('Failed to update message');
      }
    } catch (error) {
      console.error(error);
      setError('Something went wrong');
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Update Message</Text>
      <View style={styles.formItem}>
        <TextInput
          style={styles.formInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Enter new message"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <View style={styles.formItem}>
        <TouchableOpacity style={styles.formTouch} onPress={handleSubmit}>
          <Text style={styles.formTouchText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    color: 'red',
    marginBottom: 10,
  },
  formItem: {
    padding: 20,
  },
  formTouch: {
    backgroundColor: '#128C7E',
    padding: 10,
    borderRadius: 10,
    margin: 10,
    textAlign: 'center',
  },
  formTouchText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  formInput: {
    fontSize: 20,
    borderRadius: 5,
    height: 50,
    width: 500,
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    marginVertical: 5,
    width: '100%',
    borderRadius: 5,
  },
});
