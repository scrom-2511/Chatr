import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setCurrentUser } from "../features/chat/CurrentUserSlice";
import { setMessages } from "../features/chat/MessageSlice";
import { setGroupMessages } from "../features/groupChat/GroupMessageSlice";
import { setCurrentGroup } from "../features/groupChat/CurrentGroupSlice";
import { socket } from "../utils/socket";
import { decryptEncryptionKeyGroup } from "../utils/encryptionDecryption";
const useGetMessageOnClickChat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getMessageOnClickChat = async (id: string, username: string) => {
    try {
      navigate(`/chat/${id}`);
      const req = await axios.get(
        `http://localhost:3000/message/allMessage/${id}`,
        {
          withCredentials: true,
        }
      );
      const publicKey = req.data.publicKey
      dispatch(setCurrentUser({ id, username, publicKey }));
      dispatch(setMessages(req.data.messages));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const getGroupMessageOnClickChat = async (groupId: string, groupName: string) => {
    try {
      navigate(`/groupChat/${groupId}`);
      const req = await axios.get(
        `http://localhost:3000/groupMessage/getAllGroupMessages/${groupId}`, {
        params: {
          userId: localStorage.getItem("myUserId"),
        },
        withCredentials: true,
      }
      );
      const { decryptedEncryptionKey } = decryptEncryptionKeyGroup(req.data.encryptedEncryptionKey);
      socket.emit("joinGroup", groupId);
      dispatch(setCurrentGroup({ id: groupId, groupName: groupName, encryptionKey: decryptedEncryptionKey }));
      dispatch(setGroupMessages(req.data.messages));
    } catch (error) {
      console.error("Error fetching group messages:", error);
    }
  };
  return { getMessageOnClickChat, getGroupMessageOnClickChat };
};

export default useGetMessageOnClickChat;