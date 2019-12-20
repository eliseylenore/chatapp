import React, {Component} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import User from '../User';
import AsyncStorage from '@react-native-community/async-storage';
import styles from '../constants/styles';
import firebase from 'firebase';

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Chats',
  };

  state = {
    users: [],
  };

  componentDidMount() {
    let dbRef = firebase.database().ref('users');
    dbRef.on('child_added', newUser => {
      let person = newUser.val();
      person.phone = newUser.key;
      if (person.phone === User.phone) {
        User.name = person.name;
      } else {
        this.setState(prevState => {
          return {
            users: [...prevState.users, person],
          };
        });
      }
    });
  }

  _logout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  renderRow = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.userContainer}
        onPress={() => this.props.navigation.navigate('Chat', item)}>
        <Text style={{fontSize: 20}}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.state.users}
          renderItem={this.renderRow}
          keyExtractor={item => item.phone}
        />
        <TouchableOpacity onPress={this._logout} style={styles.marginBottom}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
