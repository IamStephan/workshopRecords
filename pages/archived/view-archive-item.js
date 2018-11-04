import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar} from 'react-native-elements'
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationEvents } from 'react-navigation';
import { showMessage } from "react-native-flash-message";
import moment from 'moment'

import Realm from 'realm';
import { appSchema } from '../../DatabaseData/appSchema.js'

import AvatarViewer from '../../components/avatarViewerModal'

export default class ViewArchiveList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tasks: null,
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
      tasks = this.state.tasks.objects('tasks').sorted('id', true).filtered(`archived = true AND number = '${this.props.navigation.getParam('archivedItem').number}'`)
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

        <View style={{alignItems: 'center', margin: 5}}>
          {this.AvatarType(this.props.navigation.getParam('archivedItem', '-').fullname,this.props.navigation.getParam('archivedItem', '-').imageUri)}
          <Text style={{fontWeight: 'bold'}}>{this.props.navigation.getParam('archivedItem', '-').fullname || '-'}</Text>
          <Text>{this.props.navigation.getParam('archivedItem', '-').number || '-'}</Text>
        </View>

        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate('NewEntry', {newTaskInfo: {
            number: this.props.navigation.getParam('archivedItem', '-').number,
            fullname: this.props.navigation.getParam('archivedItem', '-').fullname
          }})
        }}>
          <View style={style.newEntry}>
            <Icon name="add-circle" size={20} color="white" />
          </View>
        </TouchableOpacity>

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
              {/*this.AvatarType(data.item.fullname, data.item.imageUri)*/}
            <View style={{flex: 1}}>
              <Text style={{fontWeight: 'bold'}}>{data.item.fullname || '-'}</Text>
              <Text>{data.item.bike || data.item.description}</Text>
              <Text style={{color: 'lightgrey'}}>{moment(parseInt(data.item.itemArchived, 10)).format('D MMM YYYY')}</Text>
            </View>
          </View>}

        renderHiddenItem={(data, rowMap) =>
          <View style={style.renderHiddenItem}>
            <View />

            <TouchableOpacity onPress={ _ => {
              this.props.navigation.navigate('ViewTask', {task: data.item})
              this.setState({currentViewed: rowMap[data.item.id]})
            } }>
              <View style={[style.btn, {backgroundColor: 'dimgrey'}]}>
                <Text style={{color: 'white'}}>View</Text>
              </View>
            </TouchableOpacity>
          </View>}
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
  newEntry: {
    backgroundColor: 'dimgrey',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    margin: 5,
    borderRadius: 20
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
    flex: 1
  },
  renderItem: {
    flexDirection: 'row',
    padding: 10,
    minHeight: 50,
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  topBar: {
    alignItems: 'center',
    margin: 10
  },
  renderHiddenItem: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})