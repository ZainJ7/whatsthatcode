import React, { Component } from "react";
import {View, ScrollView, Text, TouchableOpacity, StyleSheet,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import globalStyles from "../styles/global";

class LogOut extends Component {
  constructor(props) {
    super(props);
  }

  async logout() {
    console.log("Logout");

    return fetch("http://localhost:3333/api/1.0.0/logout", {
      method: "POST",
      headers: {
        "X-Authorization": await AsyncStorage.getItem(
          "whatsthat_session_token"
        ),
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          await AsyncStorage.removeItem("whatsthat_session_token");
          await AsyncStorage.removeItem("whatsthat_user_id");
        } else if (response.status === 401) {
          console.log("Unauthorised");
          await AsyncStorage.removeItem("whatsthat_session_token");
          await AsyncStorage.removeItem("whatsthat_user_id");
          this.props.navigation.navigate("Login");
        } else {
          throw "Something went wrong";
        }
      })
      .catch((error) => {
        this.setState({ error: error });
        this.setState({ submitted: false });
      });
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={globalStyles.container}>
        <ScrollView>
          <Text style={globalStyles.title}>Log Out Here</Text>

          <View style={styles.formItem}>
            <TouchableOpacity
              style={styles.formTouch}
              onPress={() => this.logout()}
              onPress={() => navigation.navigate("Login")}
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
  formItem: {
    padding: 20,
  },
  formTouch: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#128C7E",
    paddingHorizontal: 30,
    paddingVertical: 30,
    borderRadius: 10,
    textAlign: "center",
  },
  formTouchText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
});

export default LogOut;
