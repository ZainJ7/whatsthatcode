import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ViewPhoto extends React.Component {
  state = {
    photo: null,
    isLoading: null,
  };

  async componentDidMount() {
    const { route } = this.props;
    const user_id = route.params.user_id;
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    this.get_profile_image(user_id, token);
  }

  get_profile_image = (user_id, token) => {
    fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/photo`, {
      method: 'GET',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((res) => {
        return res.blob();
      })
      .then((resBlob) => {
        let data = URL.createObjectURL(resBlob);
        this.setState({
          photo: data,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.photo && (
          <Image source={{ uri: this.state.photo }} style={styles.photo} />
        )}
      </View>
    );
  }
}

ViewPhoto.navigationOptions = {
  title: 'Photo View',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  photo: {
    width: 300,
    height: 300,
  },
});

export default ViewPhoto;
