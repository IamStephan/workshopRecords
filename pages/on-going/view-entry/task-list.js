import React, {Component} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Modal, FlatList} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

import Realm from 'realm';
import { appSchema } from '../../../DatabaseData/appSchema.js'

export default class TaskList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tasks: [],
      tempTask: [],
      options: null,
      selectedItems: []
    }
  }

  componentWillMount() {
    Realm.open(appSchema).then((realm) => {
      let optionsData = realm.objects('TypesOfTasksOptions')
      let tasks = realm.objects('tasks').filtered(`id = ${this.props.screenProps.task.id}`)[0].tasksDone
      if (!optionsData.length) {
          this.setState({tasks: tasks})
      } else {
        this.setState({options: [
          {
            title: 'Workshop',
            id: 1,
            children: Array.from(optionsData)
          }
        ], tasks: tasks})
      } 
    }).catch(e => { alert(e) })
  }

  onSelectedItemsChange(selectedItems) {
    this.setState({ selectedItems: selectedItems })
  }

  onSelectedItemObjectsChange(selectedItems) {
    this.setState({ tempTask: selectedItems })
  }

  onConfirm() {
    Realm.open(appSchema).then((realm) => {
      let tasks = realm.objects('tasks').filtered(`id = ${this.props.screenProps.task.id}`)
      let tempTaskClone = this.state.tempTask.slice()
      let taskClone = this.state.tasks.slice()

      realm.write(() => {
        for (var i = 0; i < this.state.tempTask.length; i++) {
          let id = (() => {return Date.now() + i})()
          tasks[0].tasksDone.push({
            id: id,
            title: this.state.tempTask[i].title,
            description: this.state.tempTask[i].description
          })
          taskClone.push({
            id: id,
            title: this.state.tempTask[i].title,
            description: this.state.tempTask[i].description
          })
        }
      })
      this.setState({tasks: taskClone, selectedItems: [], tempTask: []})
    }).catch(e => { alert(e) })
  }

  handleDeleteEntry(dataItem) {
    Realm.open(appSchema).then((realm) => {
      let tasksData = realm.objects('tasks').filtered(`id = ${this.props.screenProps.task.id}`)
      let taskItem = tasksData[0].tasksDone.filtered(`id = ${dataItem.item.id}`)
      let tasks = realm.objects('tasks').filtered(`id = ${this.props.screenProps.task.id}`)[0].tasksDone
      realm.write(() => {
        realm.delete(taskItem)
      })
      this.setState({tasks: tasks})
    }).catch(e => { alert(e) })
    
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <SectionedMultiSelect
          items={this.state.options}
          uniqueKey='id'
          subKey='children'
          showDropDowns={false}
          readOnlyHeadings={true}
          onSelectedItemsChange={(e) => {this.onSelectedItemsChange(e)}}
          onSelectedItemObjectsChange={(e) => {this.onSelectedItemObjectsChange(e)}}
          onConfirm={() => {this.onConfirm()}}
          showChips={false}
          selectedItems={this.state.selectedItems}
          hideSearch={true}
          hideSelect={true}
          confirmText="Add"
          colors={{primary: 'cadetblue'}}
          noItemsComponent={
            <View style={{alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', padding: 5}}>There is no Workshop tasks to select.</Text>
              <Text style={{padding: 5}}>Go to Settings and setup what tasks can be done by the workshop.</Text>
              <TouchableOpacity onPress={() => {
                this.props.screenProps.nav.navigate('SelectableTasks')
              }}>
                <View style={{padding: 10, backgroundColor: 'cadetblue', borderRadius: 100, alignItems: 'center'}}>
                  <Text style={{color: 'white'}}>Go To Settings</Text>
                </View>
              </TouchableOpacity>
            </View>
          }
          styles={{
            subItemText: {
              padding: 5
            }
          }}
          displayKey="title"
          ref={sectionedMultiSelect => this.sectionedMultiSelect = sectionedMultiSelect}
        />
        <TouchableOpacity onPress={() => {this.sectionedMultiSelect._toggleSelector()}}>
          <View style={style.newEntry}>
            <Icon name="add-circle" size={20} color="white" />
          </View>
        </TouchableOpacity>

        <SwipeListView
        useFlatList
        data={this.state.tasks}
        keyExtractor={(item) => {
          return `${item.id}`
        }}

        renderItem={(data) => <View style={style.renderItem}>
            <Text>{data.item.title}</Text>
          </View> }

        renderHiddenItem={(data, rowMap) => <View style={style.hiddenRenderItem}>
            <TouchableOpacity onPress={ () => {this.handleDeleteEntry(data)} }>
              <View style={[style.btn, style.deleteBtn]}>
                <Icon name="delete-forever" size={25} color="white" />
              </View>
            </TouchableOpacity>
          </View>}

        leftOpenValue={75}
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