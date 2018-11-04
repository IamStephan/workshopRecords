import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationEvents } from 'react-navigation';

import Realm from 'realm';
import { appSchema } from '../../DatabaseData/appSchema.js'

export default class EntryList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tasks: null,
      searchTerm: '',
      currentViewed: null
    }
  }
  static navigationOptions = {
    title: 'Avaliable Workshop Tasks',
    headerStyle: {
      elevation: 0
    }
  }

  componentWillMount() {
    Realm.open(appSchema).then((realm) => {
      this.setState({tasks: realm, loading: false})
    }).catch(e => { alert(e) })
  }

  handleDelete(dataItem) {
    Realm.open(appSchema).then((realm) => {
      let deleteItem = realm.objects('TypesOfTasksOptions').filtered(`id = ${dataItem.item.id}`)

      realm.write(() => {
        realm.delete(deleteItem)
      })
      this.setState({tasks: realm})
    }).catch(e => { alert(e) })
  }

  refreshContent(realm) {
    this.setState({tasks: realm})
  }

  render() {
    let _this = this
    let tasks

    if (this.state.tasks) {
      tasks = this.state.tasks.objects('TypesOfTasksOptions').sorted('id', true)
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

        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate('NewSelectableTask', {refresh: (realm) => {
            this.refreshContent(realm)
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
            <View style={{flex: 1}}>
              <Text style={{fontWeight: 'bold'}}>{data.item.title || '-'}</Text>
              <Text>{data.item.description || '-'}</Text>
            </View>
          </View>}

        renderHiddenItem={(data, rowMap) =>
          <View style={style.renderHiddenItem}>
            <TouchableOpacity onPress={ () => this.handleDelete(data, rowMap) }>
              <View style={[style.btn, {backgroundColor: '#d9534f'}]}>
                <Icon name="delete-forever" size={25} color="white" />
              </View>
            </TouchableOpacity>
          
            <TouchableOpacity onPress={ _ => {
              this.props.navigation.navigate('EditSelectableTask', {task: data.item, refresh: (realm) => {this.refreshContent(realm)}})
              this.setState({currentViewed: rowMap[data.item.id]})
            } }>
              <View style={[style.btn, {backgroundColor: 'dimgrey'}]}>
                <Icon name="edit" size={25} color="white" />
              </View>
            </TouchableOpacity>
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
    flex: 1
  },
  renderItem: {
    flexDirection: 'row',
    padding: 5,
    minHeight: 75,
    flex: 1,
    alignItems: 'center',
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
  renderHiddenItem: {
    flexDirection: 'row',
    flex: 1,
    height: 75,
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})