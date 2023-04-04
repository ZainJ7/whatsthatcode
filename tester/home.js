import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";

export default class ContactList extends Component {

    componentDidMount(){
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
        this.checkLoggedIn();
      });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    checkLoggedIn = async () => {
      const value = await AsyncStorage.getItem('whatsthat_session_token');
      if (value == null) {
        this.props.navigation.navigate('Login');
      };

    }


  constructor(props) {
    super(props);

    this.state = {
    };
  }


  render() {
    return (
      <View style={styles.container}>
          <Text style={styles.title}>Home</Text>
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
    paddingTop: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
    backgroundColor: "lightgreen",
    paddingVertical: 20,
    paddingHorizontal: 60
  },
  listContainer: {
    flex: 1,
    width: "100%",
  },
  contactContainer: {
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
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginLeft: 10,
    borderColor: "black",
    borderWidth: 5
  },
  contactInfo: {
    marginLeft: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    fontSize: 15,
  },
});
