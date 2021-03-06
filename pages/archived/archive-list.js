import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import {Avatar} from 'react-native-elements'
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationEvents } from 'react-navigation';

import Realm from 'realm';
import { appSchema } from '../../DatabaseData/appSchema.js'

import AvatarViewer from '../../components/avatarViewerModal'

export default class ArchiveList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tasks: null,
      searchTerm: '',
      currentViewed: null,
      avatarViewer: {
        visible: false,
        imageUri: ''
      }
    }
  }
  static navigationOptions = {
    header: null
  }

  componentWillMount() {
    Realm.open(appSchema).then((realm) => {
      this.setState({tasks: realm, loading: false})
    }).catch(e => { alert(e) })
  }

  handleDelete(dataItem) {
    Realm.open(appSchema).then((realm) => {
      let deleteItem = realm.objects('tasks').filtered(`number = '${dataItem.item.number}'`)

      realm.write(() => {
        realm.delete(deleteItem)
      })
      this.setState({tasks: realm})
    }).catch(e => { alert(e) })
  }

  getInitials(text) {    
    if (text == '' || !text.replace(/\s/g, '').length) {
      return ''
    }
    return text.match(/\b(\w)/g).join('')
  }

  AvatarType(fullnm, imageu) {
    let _this = this

    if (!imageu) {
      return (
        <Avatar
          medium
          rounded
          title={_this.getInitials(fullnm)}
          containerStyle={{margin: 10}}
        />
      )
    } else {
      return (
        <Avatar
          medium
          rounded
          containerStyle={{margin: 10}}
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

  render() {
    let _this = this
    let tasks

    if (this.state.tasks) {
      tasks = this.state.tasks.objects('tasks').sorted('id', true).filtered('archived = true DISTINCT(number)').filtered(`fullname CONTAINS[c] '${this.state.searchTerm}' OR number CONTAINS[c] '${this.state.searchTerm}'`)
    } else {
      tasks = []
    }

    return (
      <View style={style.screen}>
        <NavigationEvents 
          onDidFocus={() => {
            if (!this.state.currentViewed) { return }
            this.state.currentViewed.closeRow()
          }}
        />
        <AvatarViewer
          visible={this.state.avatarViewer.visible}
          closeModal={() => {this.setState({avatarViewer: {visible: false}})}}
          imageUri={this.state.avatarViewer.imageUri}
        />
        <View style={{flexDirection: 'row', margin: 10, alignItems: 'center'}}>
          <View style={{paddingRight: 10}}>
            <Icon name="menu" size={30} color="dimgrey" onPress={() => { this.props.navigation.openDrawer() }}/>
          </View>

          <View style={{flexDirection: 'row', flex: 1, borderWidth: 0.25, borderRadius: 100, height: 40, alignItems: 'center', paddingLeft: 10}}>
            <Icon name="search" size={25} color="dimgrey" />
            <TextInput style={{flex: 1}} onChangeText={(text) => this.setState({searchTerm: text})} placeholder="Search.." />
          </View>
        </View>

        <SwipeListView
        useFlatList
        data={tasks}
        keyExtractor={(item) => {
          return `${item.id}`
        }}

        onRowDidClose={() => {
          if (!this.state.currentViewed) { return }
          this.setState({currentViewed: null})
        }}

        renderItem={(data) =>
          <View style={style.renderItem}>
              {this.AvatarType(data.item.fullname, data.item.imageUri)}
            <View style={{flex: 1}}>
              <Text style={{fontWeight: 'bold'}}>{data.item.fullname || '-'}</Text>
              <Text>{data.item.number || '-'}</Text>
            </View>
          </View>}

        renderHiddenItem={(data, rowMap) =>
          <View style={style.renderHiddenItem}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={ () => this.handleDelete(data, rowMap) }>
                <View style={[style.btn, {backgroundColor: '#d9534f'}]}>
                  <Icon name="delete-forever" size={25} color="white" />
                </View>
              </TouchableOpacity>
            </View>
            
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={ _ => {
                this.props.navigation.navigate('ViewArchiveItem', {archivedItem: data.item})
                this.setState({currentViewed: rowMap[data.item.id]}) 
              } }>
                <View style={[style.btn, {backgroundColor: 'dimgrey'}]}>
                  <Text style={{color: 'white'}}>View</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>}

        leftOpenValue={75}
        rightOpenValue={-75}
        recalculateHiddenLayout={true}
        getItemLayout={(data, index) => ({length: 75, offset: 75 * index, index})}/>
      </View>
    )
  }
}

const style = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white'
  },
  newProfileBtn: {
    backgroundColor: 'dimgrey',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    margin: 5,
    borderRadius: 20
  },
  btn: {
    padding: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: 75
  },
  renderItem: {
    flexDirection: 'row',
    padding: 5,
    height: 75,
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  renderHiddenItem: {
    flexDirection: 'row',
    flex: 1,
    height: 75,
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})