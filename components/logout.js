import React, { Component } from "react";
import { View, ScrollView, Text, TextInput, TouchableOpacity,StyleSheet, } from "react-native";
import * as EmailValidator from "email-validator";
import AsyncStorage from '@react-native-async-storage/async-storage'

class LogOut extends Component {
  constructor(props) {
    super(props);
  }

  async logout() {
    console.log("Logout")

    return fetch("http://localhost:3333/api/1.0.0/logout", {
        method: 'POST',
        headers: {
            "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
        }
    })     
    .then(async (response) => {
        if(response.status === 200){
            await AsyncStorage.removeItem("whatsthat_session_token")
            await AsyncStorage.removeItem("whatsthat_user_id")
        }else if(response.status === 401){
            console.log("Unauthorised")
            await AsyncStorage.removeItem("whatsthat_session_token")
            await AsyncStorage.removeItem("whatsthat_user_id")
            this.props.navigation.navigate("Login")
        }else{
            throw "Something went wrong"
        }
    })
        .catch((error) => {
            this.setState({"error": error});
            this.setState({"submitted": false});
        })
    }

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Log Out Here</Text>

          <View style={styles.formItem}>
            <TouchableOpacity
              style={styles.formTouch}
              onPress={() => this.logout()}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.formTouchText}>Press To Log Out</Text>
            </TouchableOpacity>
          </View>
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
    color: "white",
    backgroundColor: "#128C7E",
    padding: 10,
    paddingHorizontal: 100,
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    alignSelf: "stretch",
  },
  formItem: {
    padding: 20,
  },
  formTouch: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#128C7E',
    paddingHorizontal: 30,
    paddingVertical: 30,
    borderRadius: 10,
  },
  formTouchText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});

export default LogOut;
