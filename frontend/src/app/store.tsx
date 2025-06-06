import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/AuthSlice'
import userReducer from '../features/chat/UsersSlice'
import currentUserReducer from '../features/chat/CurrentUserSlice'
import messageReducer from '../features/chat/MessageSlice'
import extraReducer from '../features/chat/ExtraSlice'
import createGroupReducer from '../features/groupChat/CreateGroupSlice'
import groupsReducer from '../features/groupChat/GroupsSlice'
import groupMessageReducer from '../features/groupChat/GroupMessageSlice'
import currentGroupReducer from '../features/groupChat/CurrentGroupSlice'
import lastMessageReducer from '../features/chat/LastMessageSlice'
import componentsVisibleReducer from '../features/groupChat/ComponentsVisibileSlice'
import currentGroupUsersReducer from '../features/groupChat/currentGroupUsers'

export const store = configureStore({
  reducer: {
    authentication: authReducer,
    users: userReducer,
    currentUserData: currentUserReducer,
    messages: messageReducer,
    extra: extraReducer,
    createGroup: createGroupReducer,
    groups: groupsReducer,
    groupMessages: groupMessageReducer,
    currentGroupData: currentGroupReducer,
    lastMessages: lastMessageReducer,
    componentsVisible: componentsVisibleReducer,
    currentGroupUsers: currentGroupUsersReducer
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

