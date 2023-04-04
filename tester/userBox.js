import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default class UserBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        firstName: "Zain",
        lastName: "Janwani",
        profilePicture: "https://t.ly/g34e",
      },
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: this.state.user.profilePicture }}
            style={styles.profilePicture}
          />
          <Text style={styles.name}>
            {this.state.user.firstName} {this.state.user.lastName}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "lightgreen",
    marginBottom: 10,
    paddingVertical: 10,
    padding: 20,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginLeft: 10,
    borderColor: "black",
    borderWidth: 5
  },
  name: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
