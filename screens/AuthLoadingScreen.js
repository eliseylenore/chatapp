import React from 'react';
import {ActivityIndicator, AsyncStorage, StatusBar, View} from 'react-native';
import User from '../User';
import firebase from 'firebase';
import firebaseConfig from '../constants/firebaseConfig';

class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    User.phone = await AsyncStorage.getItem('userPhone');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(User.phone ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default AuthLoadingScreen;
