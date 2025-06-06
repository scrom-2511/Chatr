import { useEffect } from 'react';
import { Users, Groups } from '../types/ChatType';
import useGetMessageOnClickChat from './useGetMessageOnClickChat';
import { setCurrentGroup } from '../features/groupChat/CurrentGroupSlice';
import { useDispatch } from 'react-redux';
import { setSelectedTab } from '../features/chat/ExtraSlice';

const useGetMessageFromURL = (users: Users[], groups: Groups[]) => {
  const { getMessageOnClickChat, getGroupMessageOnClickChat } = useGetMessageOnClickChat();
  const dispatch = useDispatch();
  useEffect(() => {
    if (window.location.pathname.startsWith('/chat/') && users.length > 0) {
      const id = window.location.pathname.split('/chat/')[1];
      const user = users.find((user) => user._id === id);

      if (!user) return;
      getMessageOnClickChat(id, user.username);
    }
  }, [users]);

  useEffect(() => {
    if (window.location.pathname.startsWith('/groupChat/') && groups.length > 0) {
      const id = window.location.pathname.split('/groupChat/')[1];
      const group = groups.find((group) => group._id === id);
      if (!group) return;
      dispatch(setCurrentGroup({ id: id, groupName: group.groupName }));
      dispatch(setSelectedTab("group"));
      getGroupMessageOnClickChat(id, group.groupName);
    }
  }, [groups]);
};

export default useGetMessageFromURL;
