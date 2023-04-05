import React, { Component } from "react";
import {View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet,} from "react-native";
import * as EmailValidator from "email-validator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import globalStyles from "../styles/global";

class Login extends Component {

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem("whatsthat_session_token");
    if (value == null) {
      this.props.navigation.navigate("SignUp");
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      email: "ashley.williams@mmu.ac.uk",
      password: "Wr3xh4m!",
      error: "",
      success: false,
      submitted: false,
    };

    this._onPressButton = this._onPressButton.bind(this);
  }

  _onPressButton() {
    this.setState({ submitted: true });
    this.setState({ error: "" });
    this.setState({ success: false });

    if (!(this.state.email && this.state.password)) {
      this.setState({ error: "Must enter email and password" });
      return;
    }

    if (!EmailValidator.validate(this.state.email)) {
      this.setState({ error: "Must enter valid email" });
      return;
    }

    this.setState({ success: true });

    return fetch("http://localhost:3333/api/1.0.0/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) {
          throw "Failed validation";
        } else {
          throw "Something went wrong";
        }
      })
      .then(async (rJson) => {
        console.log(rJson);
        try {
          await AsyncStorage.setItem("whatsthat_user_id", rJson.id);
          await AsyncStorage.setItem("whatsthat_session_token", rJson.token);

          this.setState({ submitted: false });

          this.props.navigation.navigate("Main");
        } catch {
          throw "Something went wrong";
        }
      });
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={globalStyles.container}>
        <ScrollView>
          <Text style={globalStyles.title}>Login</Text>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Email:</Text>
            <TextInput
              placeholder=" Enter email..."
              style={styles.formInput}
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
            />
            <>
              {this.state.submitted && !this.state.email && (
                <Text style={styles.error}>*Email is required</Text>
              )}
            </>
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
            <>
              {this.state.submitted && !this.state.password && (
                <Text style={styles.error}>*Password is required</Text>
              )}
            </>
          </View>

          <View style={styles.formItem}>
            <TouchableOpacity
              style={styles.formTouch}
              onPress={() => this._onPressButton()}
            >
              <Text style={styles.formTouchText}>Login</Text>
            </TouchableOpacity>
          </View>

          {this.state.submitted && !this.state.error && (
            <Text style={styles.success}>Success! Your Logged In</Text>
          )}
          <>
            {this.state.error && (
              <Text style={styles.error}>{this.state.error}</Text>
            )}
          </>
          <View style={styles.dontHaveAccountContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.dontHaveAccountButton}>
                Don't have an account?
              </Text>
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
    textAlign: "center",
  },
  formTouchText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  error: {
    color: "red",
    fontSize: 20,
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

export default Login;
