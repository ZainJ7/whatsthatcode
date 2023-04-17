import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/global';

export default class EditDraftScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      draftText: props.route.params.draftText,
    };
  }

  handleDraftTextChange = (text) => {
    this.setState({ draftText: text });
  };

  handleUpdateDraft = async () => {
    const { draftIndex } = this.props.route.params;
    const { draftText } = this.state;

    if (draftText) {
      const drafts = [...this.props.route.params.drafts];
      drafts[draftIndex] = draftText;
      this.props.route.params.updateDrafts(drafts);
      await AsyncStorage.setItem('drafts', JSON.stringify(drafts));
      this.props.navigation.goBack();
    }
  };

  render() {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}> Edit Draft</Text>
        <View style={styles.formItem}>
          <TextInput
            style={styles.formInput}
            placeholder="Enter your draft"
            value={this.state.draftText}
            onChangeText={this.handleDraftTextChange}
          />
        </View>
        <TouchableOpacity
          style={styles.formTouch}
          onPress={this.handleUpdateDraft}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formItem: {
    padding: 20,
  },
  formInput: {
    fontSize: 20,
    borderRadius: 5,
    height: 50,
    width: 500,
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    marginVertical: 5,
    width: '100%',
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  formTouch: {
    backgroundColor: '#128C7E',
    padding: 10,
    borderRadius: 10,
    margin: 10,
    textAlign: 'center',
  },
});
