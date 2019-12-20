import React, {Component} from 'react';
import {TextInput, Text, View, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';
import styles from '../constants/styles';
import firebase from 'firebase';

class LoginScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    phone: '',
    name: '',
  };

  handleChange = key => val => {
    this.setState({
      [key]: val,
    });
  };

  submitForm = async () => {
    if (this.state.phone.length < 10) {
      Alert.alert('Error', 'Invalid phone number');
    } else if (this.state.name.length < 5) {
      Alert.alert('Error', 'Invalid name');
    } else {
      await AsyncStorage.setItem('userPhone', this.state.phone);
      User.phone = this.state.phone;
      //Write to firebase
      firebase
        .database()
        .ref('users/' + User.phone)
        .set({
          name: this.state.name,
        });
      this.props.navigation.navigate('App');
    }
  };

  componentDidMount() {
    AsyncStorage.getItem('userPhone', (err, val) => {
      if (val) {
        this.setState({phone: val});
      }
      if (err) {
        Alert.alert('Error', 'was not able to retrieve user phone');
      }
    });

    AsyncStorage.getItem('name', (err, val) => {
      if (val) {
        this.setState({name: val});
      }
      if (err) {
        Alert.alert('Error', 'was not able to retrieve username');
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Phone Number"
          style={styles.input}
          onChangeText={this.handleChange('phone')}
          value={this.state.phone}
        />
        <TextInput
          placeholder="Name"
          style={styles.input}
          onChangeText={this.handleChange('name')}
          value={this.state.name}
        />
        <TouchableOpacity onPress={this.submitForm}>
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default LoginScreen;
