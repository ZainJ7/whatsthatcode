import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";


export default class UserInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
    };
  }

  componentDidMount() {
    this.fetchUserInfo();
  }

  fetchUserInfo = async () => {
    try {
      const userId = this.props.route.params.userId; // extract user id from navigation params
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const url = `http://localhost:3333/api/1.0.0/user/${userId}`;
      const response = await fetch(url, {
        headers: {
          'X-Authorization': token,
        },
      });
      const data = await response.json();
      this.setState({
        user: data,
      });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { user } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>User Info</Text>
        <Image
          source={{ uri: user.profilePicture }}
          style={styles.profilePicture}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.label}>First Name:</Text>
          <Text style={styles.info}>{user.first_name}</Text>
          <Text style={styles.label}>Last Name:</Text>
          <Text style={styles.info}>{user.last_name}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{user.email}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50
  },
  title: {
    color: "black",
    backgroundColor: "lightgreen",
    padding: 10,
    paddingHorizontal: 100,
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    alignSelf: "stretch",
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderColor: "black",
    borderWidth: 5
  },
  infoContainer: {
    alignItems: "flex-start",
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: "lightgreen",
    borderColor: "black",
    borderRadius: 10,
    borderWidth: 1,
  },
  label: {
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 10,
  },
  info: {
    fontSize: 25,
    marginBottom: 20,
  },
});
