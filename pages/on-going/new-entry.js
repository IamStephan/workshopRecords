import React, {Component} from 'react';
import {Text, View, TextInput, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Avatar} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import { showMessage, hideMessage } from "react-native-flash-message";

import Realm from 'realm';
import { appSchema } from '../../DatabaseData/appSchema.js'

export default class HomePage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fullName: '',
      number: '',
      imageUri: '',
      bike: '',
      description: ''
    }
  }

  static navigationOptions = {
    title: 'New Item',
    headerStyle: {
      elevation: 0
    }
  }

  componentWillMount() {
    if (this.props.navigation.getParam('newTaskInfo')) {
      this.setState({
        fullName: this.props.navigation.getParam('newTaskInfo').fullname,
        number: this.props.navigation.getParam('newTaskInfo').number
      })
    }
  }

  getAvatarSource() {
    const options = {
      title: 'Select Avatar',
      customButtons: [{ name: 'rmv', title: 'Remove Avatar' }],
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }

    ImagePicker.showImagePicker(options,(response) => {
      if(response.didCancel) { return }
      if (response.customButton) {
        this.setState({
          imageUri: ''
        })
      }

      this.setState({
        imageUri: response.uri
      });
    })
  }

  getInitials(text) {
    if (text == '' || !text.replace(/\s/g, '').length) {
      return ''
    }
    return text.match(/\b(\w)/g).join('')
  }

  addProfile() {
    if ((this.state.fullName == '' || !this.state.fullName.replace(/\s/g, '').length)) {
      showMessage({
        message: 'Error',
        description: 'Full name cannot be empty',
        type: 'danger',
        icon: 'error'
      })
      return
    }
    if (this.state.number && this.state.number.replace(/\s/g, '').replace(/\D/g,'').length !== 10) {
      showMessage({
        message: 'Error',
        description: 'Please provide a valid number or leave it empty',
        type: 'danger',
        icon: 'error'
      })
      return
    }
    if ((this.state.bike == '' || !this.state.bike.replace(/\s/g, '').length) && (this.state.description == '' || !this.state.description.replace(/\s/g, '').length)) {
      showMessage({
        message: 'Error',
        description: 'Both Bike and Description cannot be empty',
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
      function convertToNormalNumerOrEmpty(number) {
        if (number) { return number.replace(/\s/g, '').replace(/\D/g,'') }
        return ''
      }

      realm.write(() => {
        realm.create('tasks', {
          id: id,
          fullname: convertToNormalBlankString(this.state.fullName),
          number: convertToNormalNumerOrEmpty(this.state.number),
          imageUri: convertToNormalBlankString(this.state.imageUri),
          bike: convertToNormalBlankString(this.state.bike),
          itemCreated: convertToNormalBlankString(Date.now()),
          description: convertToNormalBlankString(this.state.description)
        })
      })
      let item = {
        id: id,
        fullname: convertToNormalBlankString(this.state.fullName),
        number: convertToNormalNumerOrEmpty(this.state.number),
        imageUri: convertToNormalBlankString(this.state.imageUri),
        bike: convertToNormalBlankString(this.state.bike),
        itemCreated: convertToNormalBlankString(Date.now()),
        description: convertToNormalBlankString(this.state.description)
      }

      if (this.props.navigation.getParam('newTaskInfo')) {
        this.props.navigation.replace('ViewEntry', {task: item})
      } else {
        this.props.navigation.replace('ViewEntryList', {task: item})
      }

      
    }).catch(e => { alert(e) })
  }

  render() {
    let _this = this

    function AvatarType() {
      if (!_this.state.imageUri) {
        return (
          <Avatar
            large
            rounded
            title={_this.getInitials(_this.state.fullName)}
            containerStyle={{margin: 10}}
            onPress={() => _this.getAvatarSource()}
          />
        )
      } else {
        return (
          <Avatar
            large
            rounded
            containerStyle={{margin: 10}}
            onPress={() => _this.getAvatarSource()}
            source={{uri:_this.state.imageUri}}
          />
        )
      }
    }
    return (
      <ScrollView style={style.screen}>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          {AvatarType()}
        </View>

        <View style={style.inputView}>
          <TextInput style={style.input} placeholder="Full Name" onChangeText={(text) => this.setState({fullName: text})} value={this.state.fullName}/>
        </View>

        <View style={style.inputView}>
          <TextInput style={style.input} placeholder="Number" onChangeText={(text) => this.setState({number: text})} keyboardType="numeric" value={this.state.number}/>
        </View>

        <View style={style.inputView}>
          <TextInput style={style.input} placeholder="Bike Description" onChangeText={(text) => this.setState({bike: text})}/>
        </View>

        <View style={style.inputView}>
          <TextInput style={style.input} placeholder="Item Description" onChangeText={(text) => this.setState({description: text})}/>
        </View>

        <TouchableOpacity onPress={() => { this.addProfile() }}>
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