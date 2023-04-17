import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Login from './components/login';
import SignUp from './components/signUp';
import ContactList from './components/contactList';
import BlockedContact from './components/blockedContact';
import UserInfoView from './components/userInfoView';
import EditInfo from './components/editInfo';
import LogOut from './components/logout';
import ViewChat from './components/viewChat';
import ViewSingleChat from './components/viewSingleChat';
import UpdateChat from './components/updateChat';
import UpdateMessage from './components/updateMessage';
import Search from './components/search';
import AddOrDeleteUser from './components/addOrDeleteUser';
import UploadPhoto from './components/uploadPhoto';
import Drafts from './components/draftsScreen';
import EditDraftScreen from './components/editDraftScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ContactStack = createStackNavigator();

const ContactStackNavigator = () => {
  return (
    <ContactStack.Navigator>
      <ContactStack.Screen name="ContactList" component={ContactList} />
      <ContactStack.Screen name="BlockedContact" component={BlockedContact} />
    </ContactStack.Navigator>
  );
};

const UserInfoStack = createStackNavigator();

const UserInfoStackNavigator = () => {
  return (
    <UserInfoStack.Navigator>
      <UserInfoStack.Screen name="UserInfoView" component={UserInfoView} />
      <UserInfoStack.Screen name="EditInfo" component={EditInfo} />
      <UserInfoStack.Screen name="UploadPhoto" component={UploadPhoto} />
    </UserInfoStack.Navigator>
  );
};

const ChatStack = createStackNavigator();

const ChatStackNavigator = () => {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen name="ViewChat" component={ViewChat} />
      <ChatStack.Screen name="ViewSingleChat" component={ViewSingleChat} />
      <ChatStack.Screen name="UpdateChat" component={UpdateChat} />
      <ChatStack.Screen name="AddOrDeleteUser" component={AddOrDeleteUser} />
      <ChatStack.Screen name="UpdateMessage" component={UpdateMessage} />
      <ChatStack.Screen name="Drafts" component={Drafts} />
      <ChatStack.Screen name="EditDraftScreen" component={EditDraftScreen} />
    </ChatStack.Navigator>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{ showLabel: false }}
      options={{ headerShown: false }}
    >
      <Tab.Screen
        name="Contacts"
        component={ContactStackNavigator}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? 'ios-people' : 'ios-people-outline'}
              size={size}
              color={'black'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStackNavigator}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? 'ios-chatbubbles' : 'ios-chatbubbles-outline'}
              size={size}
              color={'black'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Info"
        component={UserInfoStackNavigator}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? 'ios-person' : 'ios-person-outline'}
              size={size}
              color={'black'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? 'ios-search' : 'ios-search-outline'}
              size={size}
              color={'black'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Log Out"
        component={LogOut}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? 'ios-log-out' : 'ios-log-out-outline'}
              size={size}
              color={'black'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
