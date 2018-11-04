import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ScrollView, BackHandler} from 'react-native';
import { createDrawerNavigator, DrawerItems } from 'react-navigation';
import {Avatar} from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons';
import FlashMessage from "react-native-flash-message";

import OnGoing from './pages/on-going'
import Archive from './pages/archive'
import Settings from './pages/settings'

export default class App extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <RootDrawerNav />
        <FlashMessage position="top" renderFlashMessageIcon={(icon, styles) => <Icon name={icon} style={[{color: "#fff",marginTop: -1,fontSize: 21}, styles]} />}/>
      </View>
      
    )
  }
}

const RootDrawerNav = createDrawerNavigator({
  OnGoing: {
    screen: OnGoing,
    navigationOptions: {
      drawerLabel: 'On Going Tasks'
    }
  },
  Archived: {
    screen: Archive,
    navigationOptions: {
      drawerLabel: 'Client History'
    }
  },
  Settings: {
    screen: Settings
  }
}, {
  contentComponent: (props) => {
    return (
      <ScrollView>
        <View style={{alignItems: 'center', margin: 10}}>
          <Avatar
            large
            rounded
            source={require('./assets/drawerIcon.png')}
          />
        </View>
        
        <DrawerItems {...props} />
      </ScrollView>
    ) 
  }
})