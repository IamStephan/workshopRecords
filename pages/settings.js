import React, {Component} from 'react';
import { createStackNavigator } from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';

import SettingsList from './settings/settings-list'
import SelectableTasks from './settings/selectable-task'
import NewSelectableTask from './settings/new-selectable-task'
import EditSelectableTask from './settings/edit-selectable-task'

export default createStackNavigator({
  SettingsList: {
    screen: SettingsList
  },
  SelectableTasks: {
    screen: SelectableTasks
  },
  NewSelectableTask: {
    screen: NewSelectableTask
  },
  EditSelectableTask: {
    screen: EditSelectableTask
  }
}, {
  transitionConfig: getSlideFromRightTransition
})