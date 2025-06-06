import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  CurrentGroup,
  CurrentUser,
  GroupMessages,
  Groups,
  Messages,
  Users,
} from "../types/ChatType";
import { setMessages } from "../features/chat/MessageSlice";
import { setText } from "../features/chat/ExtraSlice";
import {
  encryptionDirect,
  encryptionGroup,
} from "../utils/encryptionDecryption";
import { socket } from "../utils/socket";
import { setGroupMessages } from "../features/groupChat/GroupMessageSlice";
import { RootState } from "../app/store";
import { setUsers } from "../features/chat/UsersSlice";
import { setGroups } from "../features/groupChat/GroupsSlice";
const useSendMessageOnClick = () => {
  const dispatch = useDispatch();
  const users: Users[] = useSelector((state: RootState) => state.users);
  const groups: Groups[] = useSelector((state: RootState) => state.groups);
  const groupMessages: GroupMessages[] = useSelector(
    (state: RootState) => state.groupMessages
  );
  const sendMessageOnClickChat = async (
    currentUser: CurrentUser,
    text: string,
    messages: Messages[]
  ) => {
    try {
      if (text.trim() === "") return;
      const {
        encryptedText,
        encryptedSessionKeyReceiver,
        encryptedSessionKeySender,
      } = encryptionDirect(
        currentUser.publicKey,
        localStorage.getItem("publicKeySender")!,
        text
      );
      const req = await axios.post(
        `http://localhost:3000/message/sendMessage/${currentUser.id}`,
        {
          encryptedText: encryptedText,
          encryptedSessionKeySender: encryptedSessionKeySender,
          encryptedSessionKeyReceiver: encryptedSessionKeyReceiver,
          senderId: localStorage.getItem("myUserId"),
          recieverId: currentUser.id,
        },
        { withCredentials: true }
      );
      if (req.data.success) {
        const lastMessageReq = await axios.post(
          "http://localhost:3000/common/setLastMessage",
          {
            lastMessage: req.data.data,
          },
          { withCredentials: true }
        );
        if (lastMessageReq.data.success) {
          socket.emit("message", req.data.data);
          dispatch(setMessages([req.data.data, ...messages]));
        }
      }
      dispatch(setText(""));
      const topChat = users.find((user) => user._id === currentUser.id);
      if (topChat) {
        const updatedTopChat = { ...topChat, lastMessage: req.data.data };
        const filteredUsers = users.filter(
          (user) => user._id !== currentUser.id
        );
        dispatch(setUsers([updatedTopChat, ...filteredUsers]));
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const sendMessageOnClickGroup = async (
    currentGroup: CurrentGroup,
    text: string
  ) => {
    try {
      if (text.trim() === "") return;
      const { encryptedText } = encryptionGroup(
        currentGroup.encryptionKey,
        text
      );
      const req = await axios.post(
        `http://localhost:3000/groupMessage/sendGroupMessage/${currentGroup.id}`,
        {
          groupId: currentGroup.id,
          encryptedText: encryptedText,
          senderId: localStorage.getItem("myUserId"),
        },
        { withCredentials: true }
      );
      if (req.data.success) {
        const lastMessageReq = await axios.post(
          "http://localhost:3000/common/setLastMessage",
          {
            lastMessage: req.data.newGroupMessage,
            isGroupMessage: true,
          },
          { withCredentials: true }
        );
        if (lastMessageReq.data.success) {
          socket.emit("newGroupMessage", req.data.newGroupMessage);
          dispatch(
            setGroupMessages([req.data.newGroupMessage, ...groupMessages])
          );
        }
      }
      dispatch(setText(""));
      // if (groups.length > 1) {
      //   const topChat = groups.find((group) => group._id === currentGroup.id);
      //   if (topChat) {
      //     const filteredGroups = groups.filter(
      //       (group) => group._id !== currentGroup.id
      //     );
      //     const updatedTopChat = {
      //       ...topChat,
      //       lastMessage: req.data.newGroupMessage,
      //     };
      //     dispatch(setGroups([updatedTopChat, ...filteredGroups]));
      //   }
      // }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return { sendMessageOnClickChat, sendMessageOnClickGroup };
};

export default useSendMessageOnClick;
