import React, {Component} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Realm from 'realm';
import { appSchema } from '../../../DatabaseData/appSchema.js'

import NewEntryModal from './global/NewEntryModal';
import EditEntryModal from './global/EditEntryModal';

export default class NotesPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      notes: [],
      newEntryModal: {
        visible: false
      },
      editEntryModal: {
        visible: false,
        data: {
          entryID: null,
          profileID: null,
          entryIndex: null,
          ref: null,
          textValue: ''
        }
      }
    }
  }

  componentWillMount() {
    Realm.open(appSchema).then((realm) => {
      let profileData = realm.objects('tasks').filtered(`id = ${this.props.screenProps.task.id}`)
      this.setState({notes: profileData[0].notes})
    }).catch(e => { alert(e) })
  }

  handleNewEntry(text) {
    if (!/\S/.test(text)) {
      alert('Connot be empty')
      return
    }
    Realm.open(appSchema).then((realm) => {
      let lastEdit = `${new Date().getTime()}`
      let profileData = realm.objects('tasks').filtered(`id = ${this.props.screenProps.task.id}`)
      let id = Date.now() + Math.random()
      realm.write(() => {
        profileData[0].notes.unshift({
          id: id,
          value: text,
          lastEdit: lastEdit
        })
      })
      this.setState({notes: profileData[0].notes, newEntryModal: {visible: false}})
    }).catch(e => { alert(e) })
  }

  handleDeleteEntry(dataItem) {
    Realm.open(appSchema).then((realm) => {
      let profileData = realm.objects('tasks').filtered(`id = ${this.props.screenProps.task.id}`)
      let profileItem = profileData[0].notes.filtered(`id = ${dataItem.item.id}`)
      realm.write(() => {
        realm.delete(profileItem)
      })
      this.setState({notes: profileData[0].notes})
    }).catch(e => { alert(e) })
  }

  editEntryBtn (textValue, entryId, ref) {
    this.setState({
      editEntryModal: {
        visible: true,
        data: {
          value: textValue,
          entryID: entryId,
          ref: ref
        }
      }
    })
  }

  handleEditEntry(text, entryId, ref) {
    if (!/\S/.test(text)) {
      alert('Connot be empty')
      return
    }
    Realm.open(appSchema).then((realm) => {
      let lastEdit = `${new Date().getTime()}`
      let profileData = realm.objects('tasks').filtered(`id = ${this.props.screenProps.task.id}`)
      let profileItem = profileData[0].notes.filtered(`id = ${entryId}`)
      realm.write(() => {
        profileItem[0].value = text
        profileItem[0].lastEdit = lastEdit
      })
      this.setState({editEntryModal: { visible: false }})
      setTimeout(() => {
        ref.closeRow()
      }, 150)
    }).catch(e => { alert(e) })
  }

  render() {
    return (
      <View>        
        <NewEntryModal
        visible={this.state.newEntryModal.visible}
        closeModal={() => { this.setState({newEntryModal: {visible: false}}) }}
        tagValue={'Notes'}
        submitButton={(text) => {this.handleNewEntry(text)}}/>

        <EditEntryModal
        visible={this.state.editEntryModal.visible}
        closeModal={() => { this.setState({editEntryModal: {visible: false}}) }}
        tagValue={'Notes'}
        data={this.state.editEntryModal.data}
        submitButton={(text, entryId, ref) => {this.handleEditEntry(text, entryId, ref)}}/>

        <TouchableOpacity onPress={() => { this.setState({newEntryModal: {visible: true}}) }}>
          <View style={style.newEntry}>
            <Icon name="add-circle" size={20} color="white" />
          </View>
        </TouchableOpacity>

        <SwipeListView
        useFlatList
        data={this.state.notes}
        keyExtractor={(item) => {
          return `${item.id}`
        }}

        renderItem={(data) => <View style={style.renderItem}>
            <Text>{data.item.value}</Text>
          </View> }

        renderHiddenItem={(data, rowMap) => <View style={style.hiddenRenderItem}>
            <TouchableOpacity onPress={ () => {this.handleDeleteEntry(data)} }>
              <View style={[style.btn, style.deleteBtn]}>
                <Icon name="delete-forever" size={25} color="white" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {this.editEntryBtn( data.item.value, data.item.id, rowMap[data.item.id])}}>
              <View style={[style.btn, style.editBtn]}>
                <Text style={{color: 'white'}}>Edit</Text>
              </View>
            </TouchableOpacity>
          </View>}

        leftOpenValue={75}
        rightOpenValue={-75}
        recalculateHiddenLayout={true}
        />
      </View>
    )
  }
}

const style = StyleSheet.create({
  hiddenRenderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between'
  },
  btn: {
    padding: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    flex: 1
  },
  deleteBtn: {
    backgroundColor: '#d9534f',
    alignSelf: 'flex-start'
  },
  editBtn: {
    backgroundColor: 'dimgrey',
    alignSelf: 'flex-start'
  },
  newEntry: {
    backgroundColor: 'dimgrey',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    margin: 5,
    borderRadius: 20
  },
  renderItem: {
    minHeight: 50,
    backgroundColor: 'white',
    padding: 5,
    justifyContent: 'center'
  }
})