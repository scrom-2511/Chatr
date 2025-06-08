import axios from "axios";
import { setUsers } from "../features/chat/UsersSlice";
import { useDispatch } from "react-redux";
import { setGroups } from "../features/groupChat/GroupsSlice";
import { setLastMessage } from "../features/chat/LastMessageSlice";
const useGetUsersAndGroups = () => {
  const dispatch = useDispatch();
  const getUsers = async () => {
    const userId = localStorage.getItem("myUserId");
    const req = await axios.get("http://localhost:3000/message/allUsers", {
      withCredentials: true,
    });
    const lastMessage = await axios.get(
      "http://localhost:3000/common/getLastDirectMessage",
      {
        params: { userId },
        withCredentials: true,
      }
    );
    const usersWithLastMessage = req.data.data.map((user: any) => ({
      ...user,
      lastMessage: lastMessage.data.find(
        (message: any) =>
          message.recieverId === user._id || message.senderId === user._id
      ),
    }));
    const sortedUsersWithLastMessage = usersWithLastMessage.sort(
      (a: any, b: any) => {
        if(a.lastMessage && b.lastMessage){
          return (
            new Date(b.lastMessage.updatedAt || b.lastMessage.createdAt).getTime() -
            new Date(a.lastMessage.updatedAt || a.lastMessage.createdAt).getTime()
          );
        }
      }
    );
    dispatch(setUsers(sortedUsersWithLastMessage));
    dispatch(setLastMessage(lastMessage.data));
  };

  const getGroups = async () => {
    const userId = localStorage.getItem("myUserId");
    const groupsReq = await axios.get(
      "http://localhost:3000/group/getAllGroups",
      { params: { userId }, withCredentials: true }
    );
    const lastMessageReq = await axios.get(
      "http://localhost:3000/common/getLastGroupMessage",
      {
        params: { userId },
        withCredentials: true,
      }
    );

    const groupsWithLastMessage = groupsReq.data.map((group: any) => ({
      ...group,
      lastMessage: lastMessageReq.data.lastMessage.find(
        (message: any) => message.groupId === group._id
      ),
    }));
    const sortedGroupsWithLastMessage = groupsWithLastMessage.sort(
      (a: any, b: any) => {
        if(a.lastMessage && b.lastMessage){
          return (
            new Date(b.lastMessage.updatedAt || b.lastMessage.createdAt).getTime() -
            new Date(a.lastMessage.updatedAt || a.lastMessage.createdAt).getTime()
          );
        }
        return 0;
      }
    );
    dispatch(setGroups(sortedGroupsWithLastMessage));
  };

  return { getUsers, getGroups };
};

export default useGetUsersAndGroups;
