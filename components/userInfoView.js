import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TouchableOpacity } from "react-native-gesture-handler";

export default class UserInfoView extends Component { //changename as is called myinfo
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      photo: null,
      isLoading: true
    };
  }

 async componentDidMount() {
    this.fetchUserInfo();
      this.interval = setInterval(this.fetchUserInfo, 3000); //refresh messages every 3 seconds
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const userId = await AsyncStorage.getItem('whatsthat_user_id');
      this.get_profile_image(token, userId)
     // this.interval = setInterval(this.get_profile_image, 3000);
    }

    get_profile_image(token, userId) {
      fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
          method: "GET",
          headers: {
              "X-Authorization": token
          }
      })
      .then((res) => {
          return res.blob()
      })
      .then((resBlob) => {
          let data = URL.createObjectURL(resBlob);

          this.setState({
              photo: data,
              isLoading: false
          })
      })
      .catch((err) => {
          console.log(err)
      })
  }

  fetchUserInfo = async () => {
    try {
      const userId = Number(await AsyncStorage.getItem('whatsthat_user_id'));
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
    const { navigation } = this.props;
    return (
      <View style={styles.container}> 
        <Text style={styles.title}>User Info</Text>
        <View style={styles.infoContainer}>
        <View >
        <Image source={{uri: this.state.photo}} style={styles.photo}/>
          </View>
          <Text style={styles.label}>First Name:</Text>
          <Text style={styles.info}>{user.first_name}</Text>
          <Text style={styles.label}>Last Name:</Text>
          <Text style={styles.info}>{user.last_name}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{user.email}</Text>
        </View>
        <TouchableOpacity style={styles.editInfoContainer} onPress={() => navigation.navigate('EditInfo')}>
           <Text style={styles.editInfoButton}>Edit Info</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editInfoContainer} onPress={() => navigation.navigate('CameraSendToServer')}>
           <Text style={styles.editInfoButton}>Upload Profile Photo</Text>
          </TouchableOpacity>
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
  infoContainer: {
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#dcdcdc",
    minHeight: 300, 
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },  
  label: {
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 10,
  },
  info: {
    fontSize: 25,
    marginBottom: 20,
    marginLeft: 10,
  },
  editInfoContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#128C7E",
    borderRadius: 10,
    marginHorizontal: 40,
    padding: 10,
    marginVertical: 10,
  },
  editInfoButton: {
    backgroundColor: "#128C7E",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
});

