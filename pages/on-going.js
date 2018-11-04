import React, {Component} from 'react';
import {BackHandler} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';

import EntryList from './on-going/entry-list'
import ViewEntry from './on-going/view-entry'
import ViewEntryList from './on-going/view-entry-list'
import NewEntry from './on-going/new-entry'
import EditEntry from './on-going/edit-entry'

export default createStackNavigator({
  EntryList: {
    screen: EntryList
  },
  ViewEntryList: {
    screen: ViewEntryList
  },
  ViewEntry: {
    screen: ViewEntry
  },
  NewEntry: {
    screen: NewEntry
  },
  EditEntry: {
    screen: EditEntry
  }
}, {
  transitionConfig: getSlideFromRightTransition
})