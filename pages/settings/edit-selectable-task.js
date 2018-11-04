import React, {Component} from 'react';
import {Text, View, TextInput, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { showMessage, hideMessage } from "react-native-flash-message";

import Realm from 'realm';
import { appSchema } from '../../DatabaseData/appSchema.js'

export default class HomePage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      description: ''
    }
  }

  static navigationOptions = {
    title: 'Edit Workshop Task',
    headerStyle: {
      elevation: 0
    }
  }

  componentWillMount() {
    function convertToNormalBlankString(value) {
      if (value) { return value }
      return ''
    }

    this.setState({
      title: convertToNormalBlankString(this.props.navigation.getParam('task').title),
      description: convertToNormalBlankString(this.props.navigation.getParam('task').description)
    })
  }

  saveTask() {
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
      function convertToNormalBlankString(value) {
        if (value) { return value }
        return ''
      }
      let edit = realm.objects('TypesOfTasksOptions').filtered(`id = ${this.props.navigation.getParam('task').id}`)
      realm.write(() => {
        edit[0].title = convertToNormalBlankString(this.state.title)
        edit[0].description = convertToNormalBlankString(this.state.description)
      })
      
      this.props.navigation.getParam('refresh')(realm)
      this.props.navigation.goBack()
    }).catch(e => { alert(e) })
  }

  render() {
    return (
      <ScrollView style={style.screen}>
        <View style={style.inputView}>
          <TextInput style={style.input} placeholder="Title" onChangeText={(text) => this.setState({title: text})} value={this.state.title}/>
        </View>

        <View style={style.inputView}>
          <TextInput style={style.input} placeholder="Description" onChangeText={(text) => this.setState({description: text})} value={this.state.description} multiline/>
        </View>

        <TouchableOpacity onPress={() => { this.saveTask() }}>
          <View style={style.addBtn}>
            <Text style={style.text}>Save</Text>
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
    backgroundColor: 'red',
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