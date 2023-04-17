import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/global';

class EditInfo extends Component {
  state = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    message: '',
  };

  async componentDidMount() {
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    const userId = await AsyncStorage.getItem('whatsthat_user_id');

    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw 'Something went wrong';
        }
      })
      .then((rJson) => {
        this.setState({
          first_name: rJson.first_name,
          last_name: rJson.last_name,
          email: rJson.email,
        });
      })
      .catch((error) => {
        this.setState({ error: error });
      });
  }

  editInfo = async () => {
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    const userId = await AsyncStorage.getItem('whatsthat_user_id');

    try {
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/user/${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token,
          },
          body: JSON.stringify({
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password,
          }),
        }
      );
      if (response.status === 200) {
        this.setState({ message: 'User Updated Successfully!' }, () => {
          setTimeout(() => {
            this.setState({ message: '' });
          }, 3000);
        });
      } else if (response.status === 400) {
        this.setState({ message: 'Failed Validation' }, () => {
          setTimeout(() => {
            this.setState({ message: '' });
          }, 3000);
        });
        throw 'Failed validation';
      } else {
        this.setState({ message: 'Something Went Wrong' }, () => {
          setTimeout(() => {
            this.setState({ message: '' });
          }, 3000);
        });
      }
    } catch (error) {}
  };

  render() {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Edit User Info</Text>
        <Text style={styles.message}>{this.state.message}</Text>
        <ScrollView>
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>First Name:</Text>
            <TextInput
              placeholder=" Enter first name..."
              style={styles.formInput}
              onChangeText={(first_name) => this.setState({ first_name })}
              value={this.state.first_name}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Last Name:</Text>
            <TextInput
              placeholder=" Enter last name..."
              style={styles.formInput}
              onChangeText={(last_name) => this.setState({ last_name })}
              value={this.state.last_name}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Email:</Text>
            <TextInput
              placeholder=" Enter email..."
              style={styles.formInput}
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Password:</Text>
            <TextInput
              placeholder=" Enter password..."
              style={styles.formInput}
              secureTextEntry
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
            />
          </View>

          <View style={styles.formItem}>
            <TouchableOpacity style={styles.formTouch} onPress={this.editInfo}>
              <Text style={styles.formTouchText}>Edit Info</Text>
            </TouchableOpacity>
          </View>
          <></>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formItem: {
    padding: 10,
  },
  formLabel: {
    fontSize: 30,
    color: 'black',
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
  message: {
    fontSize: 20,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
});

export default EditInfo;
