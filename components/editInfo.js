import React, { Component } from "react";
import { View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet,} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as EmailValidator from "email-validator";

class EditInfo extends Component {
    state = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      error: "",
      errorForState: "", //none of the errors work
    };




    async componentDidMount() {
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const userId = await AsyncStorage.getItem('whatsthat_user_id');
    
      return fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token
        }
      })
      .then((response) => {
        if(response.status === 200){
          return response.json()
        }else{
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
        this.setState({"error": error})
      })
    }    

_onPressButton() {
  this.setState({ submitted: true });
  this.setState({ error: "" });
  this.setState({ success: false });

  if (!(this.state.email && this.state.password)) {
    this.setState({ errorForState: "Must enter email and password" });
    return;
  }

  if (!EmailValidator.validate(this.state.email)) {
    this.setState({ errorForState: "Must enter valid email" });
    return;
  }

  const PASSWORD_REGEX = new RegExp(
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
  );
  if (!PASSWORD_REGEX.test(this.state.password)) {
    this.setState({
      errorForState: "Password isn't strong enough",
    });
    return;
  }

  if (this.state.password !== this.state.confirmPass) {
    this.setState({ errorForState: "Passwords do not match" });
    return;
  }

  this.setState({ success: true });

  return fetch("http://localhost:3333/api/1.0.0/user", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "first_name": this.state.first_name,
      "last_name": this.state.last_name,
      "email": this.state.email,
      "password": this.state.password
    })
  })
    .then((response) => {
      if(response.status === 201){
        return response.json()
      }else if(response.status === 400){
        throw 'Failed validation';
      }else{
        throw 'Something went wrong';
      }
    })
      .then((rJson) => {
        console.log(rJson)
        this.setState({"error": "User added successfully"})
        this.setState({"submitted": false});
        this.props.navigation.navigate("Login")
      })
      .catch((error) => {
        this.setState({"error": error})
        this.setState({"submitted": false});
      })
}
  
    editInfo = async () => {
      // get token and user id from AsyncStorage
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const userId = await AsyncStorage.getItem('whatsthat_user_id');
    
      // make PATCH request
      try {
        const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token
          },
          body: JSON.stringify({
            "first_name": this.state.first_name,
            "last_name": this.state.last_name,
            "email": this.state.email,
            "password": this.state.password
          })
        });
        if (response.status === 200) {
          this.setState({"error": "User updated successfully"});
        } else if (response.status === 400) {
            this.setState({"error": "Failed Validation"})  
          throw 'Failed validation';
        } else {
            this.setState({"error": "Something went Wrong"})
          throw 'Something went wrong';
        }
      } catch (error) {
        console.log("its fine")
      }
      
    };


  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Edit User Info</Text>

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
  {this.state.errorForState !== "" && (
    <Text style={styles.errorForState}>{this.state.errorForState}</Text>
  )}
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
  {this.state.errorForState !== "" && (
    <Text style={styles.errorForState}>{this.state.errorForState}</Text>
  )}
</View>


          <View style={styles.formItem}>
            <TouchableOpacity
              style={styles.formTouch}
              onPress={this.editInfo}
            >
              <Text style={styles.formTouchText}>Edit Info</Text>
            </TouchableOpacity>
          </View>

          {this.state.submitted && !this.state.error && (
            <Text style={styles.success}>Success! Account Created</Text>
          )}
          <>
            {this.state.error && (
              <Text style={styles.error}>{this.state.error}</Text>
            )}
          </>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
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
  formItem: {
    padding: 10,
  },
  formLabel: {
    fontSize: 30,
    color: "black",
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
  error: {
    color: "red",
    fontSize: 20,
    marginTop: 5,
    marginBottom: 10,
    textAlign: "center",
  },
  success: {
    color: "green",
    fontSize: 20,
    marginTop: 5,
    marginBottom: 10,
    textAlign: "center",
  },
  dontHaveAccountContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  dontHaveAccountButton: {
    color: "black",
    fontSize: 25,
    textDecorationLine: "underline",
  },
});

export default EditInfo;
