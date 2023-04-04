import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import Login from './components/login';
import SignUp from './components/signUp';
import ContactList from './components/contactList';
import BlockedContact from './components/blockedContact'
import UserInfoView from './components/userInfoView'
import EditInfo from './components/editInfo'
import LogOut from './components/logout'
import ViewChat from './components/viewChat'
import ViewSingleChat from './components/viewSingleChat'
import UpdateChat from './components/updateChat'
import UpdateMessage from './components/updateMessage'
import Search from './components/search'
import ViewPhoto from './components/viewPhoto'
import AddOrDeleteUser from './components/addOrDeleteUser'


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ContactStack = createStackNavigator();

const ContactStackNavigator = () => {
  return (
    <ContactStack.Navigator>
      <ContactStack.Screen name="ContactList" component={ContactList} />
      <ContactStack.Screen name="BlockedContact" component={BlockedContact} />
      <ContactStack.Screen name="ViewPhoto" component={ViewPhoto} />
    </ContactStack.Navigator>
  );
};

const UserInfoStack = createStackNavigator();

const UserInfoStackNavigator = () => {
  return (
    <UserInfoStack.Navigator>
      <UserInfoStack.Screen name="UserInfoView" component={UserInfoView} />
      <UserInfoStack.Screen name="EditInfo" component={EditInfo} />
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
    </ChatStack.Navigator>
  );
};

const ContactIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>

);

const ChatIcon = (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
</svg>
);

const UserIcon = (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
</svg>
);

const SearchIcon = (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
</svg>
);

const LogOutIcon = (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
</svg>

);

const MainTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Contact" component={ContactStackNavigator} options={{headerShown: false,tabBarIcon: () => ContactIcon,}}/>
      <Tab.Screen name="Chat" component={ChatStackNavigator} options={{headerShown: false,tabBarIcon: () => ChatIcon,}} />
      <Tab.Screen name="UserInfo" component={UserInfoStackNavigator} options={{headerShown: false,tabBarIcon: () => UserIcon,}} />
      <Tab.Screen name="Search" component={Search} options={{// headerShown: false,
      tabBarIcon: () => SearchIcon,
      }} />
      <Tab.Screen name="LogOut" component={LogOut} options={{// headerShown: false,
        tabBarIcon: () => LogOutIcon,
      }} />      
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp}  />
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
