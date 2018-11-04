'use strict';

import React, { Component } from 'react';

import {TouchableOpacity, View, Text, BackHandler} from 'react-native';

export default class SettingsList extends Component {
    static navigationOptions = {
    title: 'Settings',
    headerStyle: {
      elevation: 0
    }
  }
  
  render() {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <TouchableOpacity onPress={() => {this.props.navigation.navigate('SelectableTasks')}}>
          <View  style={{justifyContent: 'center', padding: 10, height: 75}}>
            <Text style={{fontWeight: 'bold'}}>Avaliable Workshop Tasks</Text>
          </View>
        </TouchableOpacity>
      </View>
        
    );
  }
}