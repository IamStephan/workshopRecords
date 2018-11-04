import React, {Component} from 'react';
import {Text, View, ScrollView} from 'react-native';
import { createStackNavigator, DrawerItems } from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';

import ArchiveList from './archived/archive-list'
import ViewArchiveItem from './archived/view-archive-item'
import ViewTask from './archived/view-task'

export default createStackNavigator({
  ArchiveList: {
    screen: ArchiveList
  },
  ViewArchiveItem: {
    screen: ViewArchiveItem
  },
  ViewTask: {
    screen: ViewTask
  }
}, {
  transitionConfig: getSlideFromRightTransition
})