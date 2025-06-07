import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import {
  CurrentGroup,
  GroupMessages,
  OnlineUser,
  Groups,
  Users,
  Messages,
} from "../types/ChatType";
import { setSelectedTab, setText } from "../features/chat/ExtraSlice";
import useSendMessageOnClick from "../customHooks/useSendMessageOnClick";
import { socket } from "../utils/socket";
import useGetUsersAndGroups from "../customHooks/useGetUsersAndGroups";
import { addGroupMessage } from "../features/groupChat/GroupMessageSlice";
import useGetMessageFromURL from "../customHooks/useGetMessageFromURL";
import { decryptionGroup } from "../utils/encryptionDecryption";
import { setGroups } from "../features/groupChat/GroupsSlice";
import { setUsers } from "../features/chat/UsersSlice";
const GroupChat = () => {
  const currentGroup: CurrentGroup = useSelector(
    (state: RootState) => state.currentGroupData
  );
  const groupMessages: GroupMessages[] = useSelector(
    (state: RootState) => state.groupMessages
  );
  const text = useSelector((state: RootState) => state.extra.text);
  const dispatch = useDispatch();
  const { sendMessageOnClickGroup } = useSendMessageOnClick();
  const groups: Groups[] = useSelector((state: RootState) => state.groups);
  const users: Users[] = useSelector((state: RootState) => state.users);
  const [decryptedMessages, setDecryptedMessages] = useState<
    Record<string, string>
  >({});
  const [message, setMessage] = useState<GroupMessages>();
  const [onlineGroups, setOnlineGroups] = useState<string[]>([]);
  const groupRef = useRef<Groups[]>(groups);
  // Load groups
  useEffect(() => {
    if (groups) {
      socket.on("onlineGroups", handleOnlineGroups);
      socket.on("newGroupMessage", handleNewGroupMessage);
    }

    return () => {
      socket.off("onlineGroups", handleOnlineGroups);
      socket.off("newGroupMessage", handleNewGroupMessage);
    };
  }, []);

  const handleOnlineGroups = (data: string[]) => {
    setOnlineGroups(data);
  };

  const handleNewGroupMessage = (data: GroupMessages) => {
    if (
      data.groupId === currentGroup.id &&
      data.senderId !== localStorage.getItem("myUserId")
    ) {
      dispatch(addGroupMessage(data));
    }

    const topChat = groups.find((group) => group._id === data.groupId);
    console.log(topChat);
    if (topChat) {
      const updatedTopChat = {
        ...topChat,
        lastMessage: {
          ...topChat.lastMessage,
          encryptedText: data.encryptedText,
        },
      };
      console.log("workin");
      const filteredGroups = groups.filter(
        (group) => group._id !== data.groupId
      );
      dispatch(setGroups([updatedTopChat, ...filteredGroups]));
    }
  };

  useGetMessageFromURL(users, groups);

  const handleKeyDownSendMessage = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentGroup.id) {
      e.preventDefault();
      sendMessageOnClickGroup(currentGroup, text);
    }
  };

  const handleSendMessage = () => {
    if (currentGroup.id) {
      sendMessageOnClickGroup(currentGroup, text);
    }
  };

  useEffect(() => {
    const newDecryptedMessages = { ...decryptedMessages };
    let hasNewMessages = false;

    const messagesToDecrypt = groupMessages.filter(
      (msg) => !newDecryptedMessages[msg._id]
    );

    for (const msg of messagesToDecrypt) {
      try {
        const { decryptedText } = decryptionGroup(
          currentGroup.encryptionKey,
          msg.encryptedText
        );
        newDecryptedMessages[msg._id] = decryptedText;
        hasNewMessages = true;
      } catch (error) {
        console.error(`Failed to decrypt message ${msg._id}:`, error);
        newDecryptedMessages[msg._id] = "Failed to decrypt message";
        hasNewMessages = true;
      }
    }
    if (hasNewMessages) {
      setDecryptedMessages(newDecryptedMessages);
    }
  }, [groupMessages]);

  return (
    <div className="h-full w-full flex">
      {currentGroup.id !== "" && (
        <div className="h-full w-full flex flex-col items-center">
          <div className="h-20 w-[90%] bg-[#262837] rounded-4xl flex items-center mt-10 flex-shrink-0">
          <img src={currentGroup.grpProfilePic} className="h-12 w-12 rounded-full bg-white mx-8"/>
            <h1
              className="text-xl text-white cursor-pointer"
              onClick={() => dispatch(setSelectedTab("groupInfo"))}
            >
              {currentGroup.groupName}
            </h1>
          </div>
          <div className="h-[70%] w-[90%] my-10 relative flex flex-col-reverse justify-start gap-4 overflow-y-scroll">
            {groupMessages?.map((message) => {
              const isSender =
                message.senderId === localStorage.getItem("myUserId");
              return (
                <div
                  key={message._id}
                  className={`max-w-[90%] p-2 rounded-lg shadow-md break-words 
                    ${
                      isSender ? "self-end bg-blue-300" : "self-start bg-white"
                    }`}
                >
                  <div className="text-black text-[10px]">
                    {
                      users.find((user) => user._id === message.senderId)
                        ?.username
                    }
                  </div>
                  <div>{decryptedMessages[message._id] || " "}</div>
                </div>
              );
            })}
          </div>

          <div className="h-20 w-[90%] flex gap-5 items-center relative text-white">
            <input
              onChange={(e) => dispatch(setText(e.target.value))}
              onKeyDown={handleKeyDownSendMessage}
              value={text}
              type="text"
              className="h-10 w-[90%] bg-[#262837] px-5"
            />
            <button
              onClick={handleSendMessage}
              className="bg-[#084e6a] px-5 py-3 rounded-xl absolute right-0 hover:bg-[#0a5c7d] transition-colors"
            >
              SEND
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChat;
