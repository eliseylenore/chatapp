import React from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import styles from '../constants/styles';
import {SafeAreaView} from 'react-navigation';
import User from '../User';
import firebase from 'firebase';

export default class ChatScreen extends React.Component {
  static navigationOption = ({navigation}) => {
    return {
      title: navigation.getParam('name'),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      person: {
        name: props.navigation.getParam('name'),
        phone: props.navigation.getParam('phone'),
      },
      textMessage: '',
      messageList: [],
    };
  }

  componentDidMount() {
    firebase
      .database()
      .ref('messages')
      .child(User.phone)
      .child(this.state.person.phone)
      .on('child_added', message => {
        this.setState(prevState => {
          return {
            messageList: [...prevState.messageList, message.val()],
          };
        });
      });
  }

  handleChange = key => val => {
    this.setState({[key]: val});
  };

  sendMessage = async () => {
    let msgId;
    if (this.state.textMessage.length > 0) {
      msgId = firebase
        .database()
        .ref('messages')
        .child(User.phone)
        .child(this.state.person.phone)
        .push().key;
    }

    let updates = {};
    let message = {
      message: this.state.textMessage,
      time: firebase.database.ServerValue.TIMESTAMP,
      from: User.phone,
    };
    updates[
      'messages/' + User.phone + '/' + this.state.person.phone + '/' + msgId
    ] = message;
    updates[
      'messages/' + this.state.person.phone + '/' + User.phone + '/' + msgId
    ] = message;
    firebase
      .database()
      .ref()
      .update(updates);
    this.setState({textMessage: ''});
  };

  renderRow = ({item}) => {
    return (
      // eslint-disable-next-line react/self-closing-comp
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flexDirection: 'row',
          width: '60%',
          alignSelf: item.from === User.phone ? 'flex-end' : 'flex-start',
          backgroundColor: item.from === User.phone ? '#00897b' : '#7cb342',
          borderRadius: 5,
          marginBottom: 10,
        }}>
        <Text
          style={{
            color: '#fff',
            padding: 7,
            fontSize: 16,
          }}>
          {item.message}
        </Text>
        <Text style={{color: '#eee', padding: 3, fontSize: 12}}>
          {item.time}
        </Text>
      </View>
    );
  };

  render() {
    let {height, width} = Dimensions.get('window');
    return (
      <SafeAreaView>
        <FlatList
          style={{padding: 10, height: height * 0.8}}
          data={this.state.messageList}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            style={styles.input}
            value={this.state.textMessage}
            placeholder="Type message here..."
            onChangeText={this.handleChange('textMessage')}
          />
          <TouchableOpacity onPress={this.sendMessage}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
