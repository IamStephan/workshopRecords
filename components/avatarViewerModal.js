import React, {Component} from 'react';
import {TouchableOpacity, View, Modal, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class avatarViewer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Modal
      onRequestClose={ () => {this.props.closeModal()} }
      animationType="fade"
      transparent
      style={{padding: 5}}
      visible={this.props.visible}>
        <View style= {{ flex:1, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10 }}>
          <Image source={{uri: this.props.imageUri}} style= {{ flex:1, borderRadius: 20 }}/>
          <TouchableOpacity onPress={ () => {this.props.closeModal()} } style={{flexDirection: 'row'}}>
            <View style={[style.btn, {backgroundColor: 'red'}]}>
              <Icon name="close" size={25} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }
}

const style = StyleSheet.create({
  btn: {
    padding: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flex: 1,
    borderRadius: 100
  }
})