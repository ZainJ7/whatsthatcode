import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as EmailValidator from 'email-validator';
import globalStyles from '../styles/global';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPass: '',
      error: '',
      success: false,
      submitted: false,
    };

    this._onPressButton = this._onPressButton.bind(this);
  }

  _onPressButton() {
    this.setState({ submitted: true });
    this.setState({ error: '' });
    this.setState({ success: false });

    if (!(this.state.email && this.state.password)) {
      this.setState({ error: 'Must enter email and password' }, () => {
        setTimeout(() => {
          this.setState({ error: '' });
        }, 2000);
      });
      return;
    }

    if (!EmailValidator.validate(this.state.email)) {
      this.setState({ error: 'Must enter valid email' }, () => {
        setTimeout(() => {
          this.setState({ error: '' });
        }, 2000);
      });
      return;
    }
    

    const PASSWORD_REGEX = new RegExp(
      '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
    );
    if (!PASSWORD_REGEX.test(this.state.password)) {
      this.setState({ error: 'Password isn\'t strong enough' }, () => {
        setTimeout(() => {
          this.setState({ error: '' });
        }, 2000);
      });
      return;
    }
    

    if (this.state.password !== this.state.confirmPass) {
  this.setState({ error: 'Passwords do not match' }, () => {
    setTimeout(() => {
      this.setState({ error: '' });
    }, 2000);
  });
  return;
}


    this.setState({ success: true });

    return fetch('http://localhost:3333/api/1.0.0/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'first_name': this.state.first_name,
        'last_name': this.state.last_name,
        'email': this.state.email,
        'password': this.state.password
      })
    })
      .then((response) => {
        if(response.status === 201){
          this.setState({ message: 'Success user created' }, () => {
            setTimeout(() => {
              this.setState({ message: '' });
            }, 3000);
          });
          return response.json()
        }else if(response.status === 400){
          this.setState({ message: 'Email already in use' }, () => {
            setTimeout(() => {
              this.setState({ message: '' });
            }, 3000);
          });
          throw 'Failed validation';
        }else{
          this.setState({ message: 'Sorry something went wrong on our end, please try again' }, () => {
            setTimeout(() => {
              this.setState({ message: '' });
            }, 3000);
          });
          throw 'Something went wrong';
        }
      })
        .then((rJson) => {
          console.log(rJson)
          this.setState({'error': 'User added successfully'})
          this.setState({'submitted': false});
          this.props.navigation.navigate('Login')
        })
        .catch((error) => {
          this.setState({'error': error})
          this.setState({'submitted': false});
        })
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={globalStyles.container}>
        <ScrollView>
          <Text style={globalStyles.title}>Create An Account</Text>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>First Name:</Text>
            <TextInput
              placeholder=' Enter first name...'
              style={styles.formInput}
              onChangeText={(first_name) => this.setState({ first_name })}
              value={this.state.first_name}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Last Name:</Text>
            <TextInput
              placeholder=' Enter last name...'
              style={styles.formInput}
              onChangeText={(last_name) => this.setState({ last_name })}
              value={this.state.last_name}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Email:</Text>
            <TextInput
              placeholder=' Enter email...'
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
              placeholder=' Enter password...'
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
            <Text style={styles.formLabel}>Confirm Password:</Text>
            <TextInput
              placeholder=' Enter password...'
              style={styles.formInput}
              secureTextEntry
              onChangeText={(confirmPass) => this.setState({ confirmPass })}
              value={this.state.confirmPass}
            />
          </View>

          <View style={styles.formItem}>
            <TouchableOpacity
              style={styles.formTouch}
              onPress={() => this._onPressButton()}
            >
              <Text style={styles.formTouchText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.message}>{this.state.message}</Text>
          <View style={styles.haveAccountContainer}>
       <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.haveAccountButton}>Already have an account?</Text>
        </TouchableOpacity>
        </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  message: {
    fontSize: 20,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  formItem: {
    padding: 10,
  },
  formLabel: {
    fontSize: 20,
    color: 'black',
  },
  formInput: {
    fontSize: 20,
    borderRadius: 5,
    height: 40,
    width: 500,
    borderWidth: 1,
    borderColor: '#777',
    padding: 5,
    marginVertical: 5,
    width: '100%',
    borderRadius: 5,
  },
  formTouch: {
    backgroundColor: '#128C7E',
    padding: 10,
    borderRadius: 10,
    margin: 10,
    textAlign: 'center',
  },
  formTouchText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  error: {
    color: 'red',
    fontSize: 20,
    textAlign: 'center',
  },
  success: {
    color: 'green',
    fontSize: 20,
    marginTop: 5,
    marginBottom: 10,
    textAlign: 'center',
  },
  haveAccountContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  haveAccountButton: {
    color: 'black',
    fontSize: 25,
    textDecorationLine: 'underline',
  },
});

export default SignUp;