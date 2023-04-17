import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/global';

export default class DraftsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drafts: [],
      newDraft: '',
      message: '',
    };
  }

  async componentDidMount() {
    const drafts = await AsyncStorage.getItem('drafts');
    if (drafts !== null) {
      this.setState({ drafts: JSON.parse(drafts) });
    }
  }

  handleNewDraft = (text) => {
    this.setState({ newDraft: text });
  };

  handleSaveDraft = async () => {
    const { drafts, newDraft } = this.state;
    if (newDraft) {
      const updatedDrafts = [...drafts, newDraft];
      this.setState({ drafts: updatedDrafts, newDraft: '' });
      await AsyncStorage.setItem('drafts', JSON.stringify(updatedDrafts));
    }
  };

  handleDeleteDraft = async (index) => {
    const { drafts } = this.state;
    drafts.splice(index, 1);
    this.setState({ drafts: drafts });
    await AsyncStorage.setItem('drafts', JSON.stringify(drafts));
  };

  handleEditDraft = async (index) => {
    const { drafts } = this.state;
    const draftText = drafts[index];
    this.props.navigation.navigate('EditDraftScreen', {
      draftIndex: index,
      draftText: draftText,
      drafts: drafts,
      updateDrafts: this.updateDrafts,
    });
  };

  updateDrafts = (drafts) => {
    this.setState({ drafts: drafts });
  };

  handleSendDraft = async (draft) => {
    const { chat_id } = this.props.route.params;
    try {
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const url = `http://localhost:3333/api/1.0.0/chat/${chat_id}/message`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: draft,
        }),
      });
      const data = await response.json();
      if (response.status === 201) {
        this.fetchMessages(chat_id);
        this.setState(
          {
            messages: [...this.state.messages, data],
            newDraft: '',
          },
          () => {
            this.fetchMessages(chat_id);
          }
        );
        this.setState({ message: 'Message Sent!' }, () => {
          setTimeout(() => {
            this.setState({ message: '' });
          }, 3000);
        });
      } else {
        console.error(data.message);
        this.fetchMessages(chat_id);
      }
    } catch (error) {}
  };

  renderDraft = ({ item, index }) => (
    <View style={styles.draftContainer}>
      <Text style={styles.draftText}>{item}</Text>
      <View style={styles.draftButtonsContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => this.handleDeleteDraft(index)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => this.handleEditDraft(index)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => this.handleSendDraft(item)}
        >
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  render() {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Drafts</Text>
        <View style={styles.formItem}>
          <TextInput
            style={styles.formInput}
            placeholder="Enter Your Draft"
            value={this.state.newDraft}
            onChangeText={this.handleNewDraft}
          />
        </View>
        <View style={styles.formItem}>
          <TouchableOpacity
            style={styles.formTouch}
            onPress={this.handleSaveDraft}
          >
            <Text style={styles.formTouchText}>Save Draft</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.message}>{this.state.message}</Text>
        <FlatList
          data={this.state.drafts}
          renderItem={this.renderDraft}
          keyExtractor={(index) => index.toString()}
          style={styles.draftsList}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  draftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
    minHeight: 100,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  draftText: {
    flex: 1,
    marginRight: 10,
    fontSize: 15,
  },
  draftButtonsContainer: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: 'orange',
    padding: 20,
    borderRadius: 5,
    marginRight: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 5,
    marginRight: 5,
  },
  sendButton: {
    backgroundColor: 'green',
    padding: 20,
    borderRadius: 5,
    marginRight: 5,
  },
  draftsList: {
    flex: 1,
    fontSize: 40,
  },
  message: {
    fontSize: 20,
    color: 'black',
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  formItem: {
    padding: 20,
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
});
