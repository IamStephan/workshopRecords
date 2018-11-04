import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Avatar} from 'react-native-elements'
import { createMaterialTopTabNavigator } from 'react-navigation';

import AvatarViewer from '../../components/avatarViewerModal'

import Tasks from './view-task/task-list'
import Notes from './view-task/notes'

export default class ViewTask extends Component {
  constructor(props) {
    super(props)

    this.state= {
      avatarViewer: {
        visible: false,
        imageUri: ''
      }
    }
  }

  static navigationOptions = {
    header: null
  }

  getInitials(text) {
    if (text == '' || !text.replace(/\s/g, '').length) {
      return ''
    }
    return text.match(/\b(\w)/g).join('')
  }

  render() {
    let _this = this

    function AvatarType(fullnm, imageu) {
      if (!imageu) {
        return (
          <Avatar
            large
            rounded
            title={_this.getInitials(fullnm)}
            containerStyle={{marginBottom: 10}}
          />
        )
      } else {
        return (
          <Avatar
            large
            rounded
            containerStyle={{marginBottom: 10}}
            onPress={() => {
              _this.setState({
                avatarViewer: {
                  visible: true,
                  imageUri: imageu
                }
              })
            }}
            source={{uri:imageu}}
          />
        )
      }
    }
    return (
      <View style={style.screen}>
        <AvatarViewer
          visible={this.state.avatarViewer.visible}
          closeModal={() => {this.setState({avatarViewer: {visible: false}})}}
          imageUri={this.state.avatarViewer.imageUri}
        />
        <View style={style.topBar}>
          {AvatarType(this.props.navigation.getParam('task', '-').fullname,this.props.navigation.getParam('task', '-').imageUri)}
          <Text style={{fontWeight: 'bold'}}>{this.props.navigation.getParam('task', '-').fullname || '-'}</Text>
          <Text>{this.props.navigation.getParam('task', '-').number || '-'}</Text>
          <Text>{this.props.navigation.getParam('task', '-').bike || '-'}</Text>
        </View>
        <TabNav screenProps={{task: this.props.navigation.getParam('task', '-')}}/>
      </View>
    )
  }
}

const style = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white'
  },
  topBar: {
    alignItems: 'center',
    margin: 10
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 50
  }
})

const TabNav = createMaterialTopTabNavigator({
  Tasks: {
    screen: Tasks
  },
  Notes: {
    screen: Notes
  }
}, {
  lazy: true,
  optimizationsEnabled: true,
  swipeEnabled: false,
  tabBarOptions: {
    activeTintColor: 'dimgrey',
    inactiveTintColor: 'dimgrey',
    indicatorStyle: {
      backgroundColor: 'lightgrey'
    },
    style: {
      backgroundColor: 'white',
      elevation: 0
    }
  }
})