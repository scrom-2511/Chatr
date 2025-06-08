import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import {
  CurrentUser,
  Groups,
  Messages,
  OnlineUser,
  Users,
} from "../types/ChatType";
import { setText } from "../features/chat/ExtraSlice";
import useGetMessageFromURL from "../customHooks/useGetMessageFromURL";
import useSendMessageOnClick from "../customHooks/useSendMessageOnClick";
import { addMessage, setMessages } from "../features/chat/MessageSlice";
import { decryptionDirect, decryptionDirectImg, encryptionDirect, encryptionDirectImg } from "../utils/encryptionDecryption";
import { socket } from "../utils/socket";
import useGetUsersAndGroups from "../customHooks/useGetUsersAndGroups";
import { setUsers } from "../features/chat/UsersSlice";
import axios from "axios";

const DirectChat = () => {
  const [message, setMessage] = useState<Messages>();
  const [onlineUsers, setOnlineUsers] = useState<Array<OnlineUser>>([]);
  const [decryptedMessages, setDecryptedMessages] = useState<{[key: string]: string}>({});

  const users: Users[] = useSelector((state: RootState) => state.users);
  const usersRef = useRef<Users[]>(users);
  const messages: Messages[] = useSelector(
    (state: RootState) => state.messages
  );
  const currentUser: CurrentUser = useSelector(
    (state: RootState) => state.currentUserData
  );
  const text = useSelector((state: RootState) => state.extra.text);

  const dispatch = useDispatch();
  const { sendMessageOnClickChat } = useSendMessageOnClick();
  const groups: Groups[] = useSelector((state: RootState) => state.groups);

  const plusRef = useRef<HTMLInputElement>(null);

  // Update usersRef when users change
  useEffect(() => {
    usersRef.current = users;
    console.log("Users updated in ref:", usersRef.current);
  }, [users]);

  // Load users and groups
  useEffect(() => {
    if (users) {
      socket.on("onlineUsers", handleOnlineUsers);
      socket.on("messageNew", handleNewMessage);
    }
    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("messageNew", handleNewMessage);
    };
  }, []);

  const handleOnlineUsers = (data: OnlineUser[]) => {
    console.log("Online users updated:", data);
    setOnlineUsers(data);
  };

  const handleNewMessage = (data: Messages) => {
    console.log(data);
    if (data.senderId === currentUser.id) {
      console.log("yess");
      dispatch(addMessage(data));
    }

    const topChat = usersRef.current.find((user) => user._id === data.senderId);
    console.log(topChat);
    if (topChat) {
      const updatedTopChat = { ...topChat, lastMessage: data };
      console.log("workin");
      const filteredUsers = usersRef.current.filter(
        (user) => user._id !== data.senderId
      );
      dispatch(setUsers([updatedTopChat, ...filteredUsers]));
    }
  };

  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  useGetMessageFromURL(users, groups);

  useEffect(() => {
    const decryptMessages = async () => {
      const newDecryptedMessages = { ...decryptedMessages };
      let hasNewMessages = false;
    
      const messagesToDecrypt = messages.filter(
        (msg) => !newDecryptedMessages[msg._id]
      );
    
      for (const msg of messagesToDecrypt) {
        try {
          if (!msg?.isImage) {
            const result = decryptionDirect(
              msg.encryptedText,
              msg.encryptedSessionKeyReceiver,
              msg.encryptedSessionKeySender
            );
    
            if (result?.decryptedText) {
              newDecryptedMessages[msg._id] = result.decryptedText;
              hasNewMessages = true;
            } else {
              newDecryptedMessages[msg._id] = "Failed to decrypt message";
              hasNewMessages = true;
            }
          } else {
            const result = await decryptionDirectImg(
              msg.encryptedText,
              msg.encryptedSessionKeyReceiver,
              msg.encryptedSessionKeySender
            );
    
            if (result?.decryptedText) {
              newDecryptedMessages[msg._id] = result.decryptedText;
              hasNewMessages = true;
            } else {
              newDecryptedMessages[msg._id] = "Failed to decrypt image";
              hasNewMessages = true;
            }
          }
        } catch (error) {
          console.error(`Failed to decrypt message ${msg._id}:`, error);
          newDecryptedMessages[msg._id] = "Failed to decrypt message";
          hasNewMessages = true;
        }
      }
    
      if (hasNewMessages) {
        setDecryptedMessages(newDecryptedMessages);
      }
    };

    decryptMessages();
  }, [messages]);

  const handleOnChangeChatImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const publicKeySender = localStorage.getItem("publicKeySender");
    const publicKeyReciever = currentUser.publicKey;
    if (!publicKeyReciever || !publicKeySender) return

    const reader = new FileReader();
    reader.onload = async () => {
      const imgMessage: Messages = {
        _id: "",
        encryptedSessionKeyReceiver: "",
        encryptedSessionKeySender: "",
        encryptedText: "",
        encryptionKey: {},
        isImage: true,
        recieverId: "",
        senderId: localStorage.getItem("myUserId")!,
        text: reader.result as string,
      };
      const updatedMessages = [imgMessage, ...messages];
      dispatch(setMessages(updatedMessages));
      const { file, encryptedSessionKeyReceiver, encryptedSessionKeySender } = encryptionDirectImg(publicKeyReciever, publicKeySender, reader.result as string);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("senderId", localStorage.getItem("myUserId")!);
      formData.append("recieverId", currentUser.id);
      formData.append("encryptedSessionKeyReceiver", encryptedSessionKeyReceiver)
      formData.append("encryptedSessionKeySender", encryptedSessionKeySender)

      try {
        await axios.post(
          "http://localhost:3000/common/imageUpload",
          formData
        );
      } catch (error) {
        console.error("Upload failed:", error);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleKeyDownSendMessage = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessageOnClickChat(currentUser, text, messages);
    }
  };

  return (
    <div className="h-full w-full flex">
      {currentUser.id !== "" && (
        <div className="h-full w-full flex flex-col items-center">
          <div className="h-20 w-[90%] bg-[#262837] rounded-4xl flex items-center mt-10 flex-shrink-0">
            <img
              src={currentUser.profilePic}
              className="h-12 w-12 rounded-full bg-white mx-8"
            />
            <h1 className="text-xl text-white">{currentUser.username}</h1>
          </div>
          <div className="h-[70%] w-[90%] my-10 relative flex flex-col-reverse justify-start gap-4 overflow-y-scroll">
            {messages?.map((message) => {
              const isSender =
                message.senderId === localStorage.getItem("myUserId");
              // if (message.isImage) console.log(message);
              {
                return !message.isImage ? (
                  <div
                    key={message._id}
                    className={`max-w-[90%] p-2 rounded-lg shadow-md break-words 
                    ${isSender ? "self-end bg-blue-300" : "self-start bg-white"
                      }`}
                  >
                    {decryptedMessages[message._id] || "Decrypting..."}
                  </div>
                ) : (
                  <img
                 src={ message.text || decryptedMessages[message._id] }
                    alt=""
                    className={`h-50 w-50 bg-white object-cover 
                  ${isSender ? "self-end" : "self-start"}`}
                  />
                );
              }
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
            <img
              src="/images/plus.svg"
              alt=""
              className="h-20 w-20 z-10 invert absolute right-15"
              onClick={() => plusRef.current?.click()}
            />
            <input
              ref={plusRef}
              type="file"
              accept="image/*"
              name="image"
              className="w-0 hidden"
              onChange={handleOnChangeChatImage}
            />
            <button
              onClick={() =>
                sendMessageOnClickChat(currentUser, text, messages)
              }
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

export default DirectChat;
