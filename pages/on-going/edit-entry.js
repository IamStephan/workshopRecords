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
      imageUri: ''
    }
  }

  static navigationOptions = {
    title: 'Edit Item',
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
      fullName: convertToNormalBlankString(this.props.navigation.getParam('task').fullname),
      number: convertToNormalBlankString(this.props.navigation.getParam('task').number),
      imageUri: convertToNormalBlankString(this.props.navigation.getParam('task').imageUri)
    })
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

  saveProfile() {
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

    Realm.open(appSchema).then((realm) => {
      function convertToNormalBlankString(value) {
        if (value) { return value }
        return ''
      }
      
      function convertToNormalNumerOrEmpty(number) {
        if (number) { return number.replace(/\s/g, '').replace(/\D/g,'') }
        return ''
      }
      let edit = realm.objects('tasks').filtered(`number = '${this.props.navigation.getParam('task').number}'`)
      realm.write(() => {
        for (var i = 0; i < edit.length; i++) {
          edit[0].fullname = convertToNormalBlankString(this.state.fullName)
          edit[0].number = convertToNormalNumerOrEmpty(this.state.number)
        }   
      })
      
      this.props.navigation.getParam('refresh')(realm)
      this.props.navigation.goBack()
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
          <TextInput style={style.input} placeholder="Number" onChangeText={(text) => this.setState({number: text})} value={this.state.number} keyboardType="numeric"/>
        </View>

        <TouchableOpacity onPress={() => { this.saveProfile() }}>
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