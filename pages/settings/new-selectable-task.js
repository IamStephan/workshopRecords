import React, {Component} from 'react';
import {Text, View, TextInput, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { showMessage } from "react-native-flash-message";

import Realm from 'realm';
import { appSchema } from '../../DatabaseData/appSchema.js'

export default class NewSelectableTask extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      description: ''
    }
  }

  static navigationOptions = {
    title: 'New Workshop Task',
    headerStyle: {
      elevation: 0
    }
  }

  addTask() {
    if ((this.state.title == '' || !this.state.title.replace(/\s/g, '').length)) {
      showMessage({
        message: 'Error',
        description: 'Title cannot be empty',
        type: 'danger',
        icon: 'error'
      })
      return
    }

    Realm.open(appSchema).then((realm) => {
      let id = Date.now() + Math.random()

      function convertToNormalBlankString(value) {
        if (value) { return `${value}` }
        return ''
      }

      realm.write(() => {
        realm.create('TypesOfTasksOptions', {
          id: id,
          title: convertToNormalBlankString(this.state.title),
          description: convertToNormalBlankString(this.state.description)
        })
      })

      this.props.navigation.getParam('refresh')(realm)
      this.props.navigation.goBack()
    }).catch(e => { alert(e) })
  }

  render() {
    return (
      <ScrollView style={style.screen}>
        <View style={style.inputView}>
          <TextInput style={style.input} placeholder="Title" onChangeText={(text) => this.setState({title: text})}/>
        </View>

        <View style={style.inputView}>
          <TextInput style={style.input} placeholder="Description" onChangeText={(text) => this.setState({description: text})} multiline/>
        </View>

        <TouchableOpacity onPress={() => { this.addTask() }}>
          <View style={style.addBtn}>
            <Text style={style.text}>Add</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const style = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white'
  },
  inputView: {
    borderBottomWidth: 0.25,
    flexDirection: 'row',
    margin: 10
  },
  input: {
    flex: 1
  },
  btn: {
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'dimgrey'
  },
  text: {
    color: 'white'
  },
  cancelBtn:{
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#d9534f',
    margin: 10,
    borderRadius: 100
  },
  addBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'cadetblue',
    margin: 10,
    borderRadius: 100
  }
})