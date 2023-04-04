import React, { Component } from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";

export default class ContactList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [
        {
          id: "1",
          firstName: "Zain",
          lastName: "Janwani",
          profilePicture: "https://t.ly/g34e",
        },
        {
          id: "2",
          firstName: "John",
          lastName: "Doe",
          profilePicture: "https://t.ly/g34e",
        },
      ],
    };
  }

  renderContact = ({ item }) => (
    <View style={styles.contactContainer}>
      <Image source={{ uri: item.profilePicture }} style={styles.profilePicture} />
      <View style={styles.contactInfo}>
        <Text style={styles.name}>
          {item.firstName} {item.lastName}
        </Text>
      </View>
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Contact List</Text>
        <FlatList
          data={this.state.contacts}
          renderItem={this.renderContact}
          keyExtractor={(item) => item.id}
          style={styles.listContainer}
        />
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
