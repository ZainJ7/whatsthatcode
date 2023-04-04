import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class UploadImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image_uri: null,
    };
  }

  sendToServer = async (data) => {
    const user_id = await AsyncStorage.getItem('whatsthat_user_id');
    const token = await AsyncStorage.getItem("whatsthat_session_token");

    let res = await fetch(data.base64);
    let blob = await res.blob();

    return fetch(`http://localhost:${user_id}/photo`, {
      method: "POST",
      headers: {
        "Content-Type": "image/png",
        "X-Authorization": token,
      },
      body: blob,
    })
      .then((response) => {
        console.log("Picture added", response);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  render() {
    const { image_uri } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Upload Image</Text>
        {image_uri && (
          <Image source={{ uri: image_uri }} style={styles.image} />
        )}
        <TouchableOpacity style={styles.button} onPress={this.handleChooseImage}>
          <Text style={styles.buttonText}>Choose Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={this.handleUploadImage}
          disabled={!image_uri}
        >
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    backgroundColor: 'lightgreen',
    paddingVertical: 20,
    paddingHorizontal: 60,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
