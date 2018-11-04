import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

import Realm from 'realm';
import { appSchema } from '../../../DatabaseData/appSchema.js'

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
  render() {
    return (
      <View>        
        <SwipeListView
        useFlatList
        data={this.state.notes}
        keyExtractor={(item) => {
          return `${item.id}`
        }}
        renderItem={(data) => <View style={style.renderItem}>
            <Text>{data.item.value}</Text>
          </View> }
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
    backgroundColor: 'red',
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