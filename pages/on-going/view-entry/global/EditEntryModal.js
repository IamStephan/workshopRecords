import React, {Component} from 'react'
import {Text, View, TouchableWithoutFeedback, TouchableOpacity, TextInput, Modal, StyleSheet, Keyboard} from 'react-native';

export default class CustomModal extends Component {
  constructor (props) {
    super(props)

    this.state = {
      input: ''
    }
  }

  render() {
    let _this = this

    return (
      <Modal
      onRequestClose={ () => {
          Keyboard.dismiss()
         this.props.closeModal() 
       }}
      visible={this.props.visible}
      transparent
      animationType="fade"
      onShow={() => {
        let _this = this
        setTimeout(()=>{this.textInput.focus()}, 150)
        this.setState({input: _this.props.data.value})
      }}>
        <TouchableWithoutFeedback
        style={{flex: 1}}
        onPress={ () => {
            Keyboard.dismiss()
            this.props.closeModal() 
        }}>
          <View style={style.closeOverlay}/>
        </TouchableWithoutFeedback>

        <View style={style.inputView}>
          <View style={{justifyContent: 'center'}}>
            <View
            style={style.tagIndicator}>
              <Text style={{color: 'white'}}>{this.props.tagValue}</Text>
            </View>
          </View>

          <TextInput
            multiline
            style={{flex: 1}}
            ref={(input) => { this.textInput = input }}
            onChangeText={(text) => this.setState({input: text})}
            value={this.state.input}/>

          <View style={{justifyContent: 'center'}}>
            <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss()
              _this.props.submitButton( _this.state.input, _this.props.data.entryID, _this.props.data.ref) 
              this.setState({input: ''})
            }}
            style={style.submitBtn}>
              <Text style={{color: 'white'}}>Save</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </Modal>
    )
  }
}

const style = StyleSheet.create({
  closeOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1
  },
  inputView: {
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  tagIndicator: {
    backgroundColor: 'dimgrey',
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    margin: 5,
    borderRadius: 100
  },
  submitBtn: {
    backgroundColor: 'cadetblue',
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    margin: 5,
    borderRadius: 100
  }
})