import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OnlineUser, Users, Groups, Messages } from "../types/ChatType";
import { setCurrentGroup } from "../features/groupChat/CurrentGroupSlice";
import useGroupOperations from "../customHooks/useGroupOperations";
import {
  setGroupName,
  setSelectedUsers,
  setSelectedUsersPublicKey,
} from "../features/groupChat/CreateGroupSlice";
import useGetMessageOnClickChat from "../customHooks/useGetMessageOnClickChat";
import { RootState } from "../app/store";
import { socket } from "../utils/socket";
import { setMessages } from "../features/chat/MessageSlice";
import { setGroupMessages } from "../features/groupChat/GroupMessageSlice";
import { setCurrentUser } from "../features/chat/CurrentUserSlice";
import { useNavigate } from "react-router-dom";
import { setSelectedTab } from "../features/chat/ExtraSlice";
import {
  decryptEncryptionKeyGroup,
  decryptionDirect,
  decryptionGroup,
} from "../utils/encryptionDecryption";
import { setUsers } from "../features/chat/UsersSlice";
import {
  setGrpUsersSelectMenuVisible,
  setGrpNameComponentVisible,
  setMenuVisible,
} from "../features/groupChat/ComponentsVisibileSlice";
export const LeftPart = () => {
  const dispatch = useDispatch();
  const menuVisible = useSelector(
    (state: RootState) => state.componentsVisible.menuVisible
  );
  const grpNameComponentVisible = useSelector(
    (state: RootState) => state.componentsVisible.grpNameComponentVisible
  );
  const grpUsersSelectMenuVisible = useSelector(
    (state: RootState) => state.componentsVisible.grpUsersSelectMenuVisible
  );
  const currentGroup = useSelector(
    (state: RootState) => state.currentGroupData
  );
  const currentGroupUsers = useSelector(
    (state: RootState) => state.currentGroupUsers
  );
  const { getMessageOnClickChat, getGroupMessageOnClickChat } =
    useGetMessageOnClickChat();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const users: Users[] = useSelector((state: RootState) => state.users);
  const groups: Groups[] = useSelector((state: RootState) => state.groups);
  const navigate = useNavigate();
  const selectedTab = useSelector(
    (state: RootState) => state.extra.selectedTab
  );

  useEffect(() => {
    const handleOnlineUsers = (data: OnlineUser[]) => {
      setOnlineUsers(data);
    };

    const handleMessage = (data: Messages) => {
      console.log(data.senderId);
      const usersUpdatedUsersOnMessage = users.map((user) =>
        user._id === data.senderId || user._id === data.recieverId
          ? { ...user, lastMessage: data }
          : user
      );
      dispatch(setUsers(usersUpdatedUsersOnMessage));
    };

    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("message", handleMessage);
    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, []);

  useEffect(() => {
    console.log(currentGroup.id);
  }, [currentGroup.id]);

  const handleTabChange = (tab: string) => {
    dispatch(setSelectedTab(tab));
    dispatch(setCurrentUser({ id: "", username: "", publicKey: "" }));
    dispatch(setCurrentGroup({ id: "", groupName: "", encryptionKey: "" }));
    dispatch(setMessages([]));
    dispatch(setGroupMessages([]));
    navigate("/chat");
  };

  const GroupUsersSelectMenuComponent = () => {
    const dispatch = useDispatch();
    const [selectedUsersTemp, setSelectedUsersTemp] = useState<string[]>([]);
    const [selectedUsersPublicKeyTemp, setSelectedUsersPublicKeyTemp] =
      useState<string[]>([]);

    const handleUserSelect = (userId: string, publicKey: string) => {
      setSelectedUsersTemp((prev) => {
        if (prev.includes(userId)) {
          return prev.filter((id) => id !== userId);
        }
        return [...prev, userId];
      });
      setSelectedUsersPublicKeyTemp((prev) => {
        if (prev.includes(publicKey)) {
          return prev.filter((id) => id !== publicKey);
        }
        return [...prev, publicKey];
      });
    };

    return (
      <div
        className="h-[500px] w-[500px] bg-[#262837] absolute right-[50%] top-[50%] translate-x-[50%] translate-y-[-50%] rounded-lg flex-col items-center pt-10 text-white hidden z-50"
        style={{ display: grpUsersSelectMenuVisible ? "flex" : "none" }}
      >
        <div className="text-xl font-bold">SELECT GROUP MEMBERS</div>
        <div className="h-[400px] w-[90%] flex flex-col items-center mb-10 overflow-y-scroll">
          {currentGroup.id === "" &&
            users
              .filter((user) => user._id !== localStorage.getItem("myUserId"))
              .map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserSelect(user._id, user.publicKey)}
                  className={`h-28 w-[90%] bg-[#303346] rounded-4xl flex items-center flex-shrink-0 relative mt-10 cursor-pointer
                ${
                  selectedUsersTemp.includes(user._id)
                    ? "border-2 border-blue-500"
                    : ""
                }`}
                >
                  <div className="h-12 w-12 rounded-full bg-white mx-8"></div>
                  <div className="text-white">
                    <h1>{user.username}</h1>
                  </div>
                </div>
              ))}
          {currentGroup.id !== "" && users.filter((user) => !currentGroupUsers.includes(user._id)).map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserSelect(user._id, user.publicKey)}
                  className={`h-28 w-[90%] bg-[#303346] rounded-4xl flex items-center flex-shrink-0 relative mt-10 cursor-pointer
                ${
                  selectedUsersTemp.includes(user._id)
                    ? "border-2 border-blue-500"
                    : ""
                }`}
                >
                  <div className="h-12 w-12 rounded-full bg-white mx-8"></div>
                  <div className="text-white">
                    <h1>{user.username}</h1>
                  </div>
                </div>
              ))}
        </div>
        <button
          onClick={() => {
            if (selectedUsersTemp.length < 2) {
              return;
            }
            dispatch(
              setSelectedUsers([
                ...selectedUsersTemp,
                localStorage.getItem("myUserId")!,
              ])
            );
            dispatch(
              setSelectedUsersPublicKey([
                ...selectedUsersPublicKeyTemp,
                localStorage.getItem("publicKeySender")!,
              ])
            );
            dispatch(setGrpUsersSelectMenuVisible(false));
            dispatch(setGrpNameComponentVisible(true));
          }}
          className="bg-[#084e6a] px-5 py-3 rounded-xl mb-10 hover:bg-[#0a5c7d] transition-colors"
        >
          CREATE GROUP
        </button>
      </div>
    );
  };

  const GroupNameComponent = () => {
    const dispatch = useDispatch();
    const { createGroup } = useGroupOperations();
    const [groupNameInput, setGroupNameInput] = useState("");

    return (
      <div
        className="h-[200px] w-[500px] bg-[#262837] absolute right-[50%] top-[50%] translate-x-[50%] translate-y-[-50%] rounded-lg flex-col items-center gap-10 pt-10 text-white z-50"
        style={{ display: grpNameComponentVisible ? "flex" : "none" }}
      >
        <input
          value={groupNameInput}
          onChange={(e) => {
            setGroupNameInput(e.target.value);
            dispatch(setGroupName(e.target.value));
          }}
          type="text"
          placeholder="Group Name"
          className="w-[90%] h-[50px] bg-transparent text-white p-4 border border-gray-500 rounded-md"
        />
        <button
          onClick={async () => {
            if (!groupNameInput.trim()) return;
            await createGroup();
            setGroupNameInput("");
            dispatch(setGrpNameComponentVisible(false));
          }}
          className="bg-[#084e6a] px-5 py-3 rounded-xl hover:bg-[#0a5c7d] transition-colors text-white"
        >
          CREATE GROUP
        </button>
      </div>
    );
  };

  return (
    <div className="h-full rounded-r-4xl w-[25%] bg-[#262837] flex flex-col items-center overflow-y-scroll">
      <div className="flex h-25 w-full items-center justify-between text-white p-8 relative">
        <div className="text-2xl font-extrabold">CHATTR</div>
        <img
          onClick={() => {
            dispatch(setMenuVisible(true));
          }}
          src="/images/menu.svg"
          alt="menu"
          className="h-12 w-12 invert cursor-pointer"
        />
        <div
          className="h-[100px] w-[200px] bg-[#4f4f4f] absolute right-18 top-16 rounded-lg flex-col items-center justify-center hidden cursor-pointer text-white"
          style={{ display: menuVisible ? "flex" : "none" }}
        >
          <div
            className="h-[50px] w-full flex items-center justify-center hover:bg-[#606060] transition-colors"
            onClick={() => {
              dispatch(setGrpUsersSelectMenuVisible(true));
              dispatch(setSelectedTab(""));
              navigate("/chat");
              dispatch(
                setCurrentGroup({ id: "", groupName: "", encryptionKey: "" })
              );
            }}
          >
            CREATE GROUP
          </div>
          <div
            className="h-[50px] w-full flex items-center justify-center hover:bg-[#606060] transition-colors"
            onClick={() => dispatch(setSelectedTab("profile"))}
          >
            MY PROFILE
          </div>
        </div>
      </div>

      <GroupUsersSelectMenuComponent />
      <GroupNameComponent />

      <div className="h-20 w-full bg-[#262837] flex items-center justify-evenly text-white">
        <div
          className={`h-10 w-20 rounded-2xl bg-[#303346] cursor-pointer flex items-center justify-center ${
            selectedTab === "direct" ? "bg-[#00b6ff]" : ""
          }`}
          onClick={() => handleTabChange("direct")}
        >
          DIRECT
        </div>
        <div
          className={`h-10 w-20 rounded-2xl bg-[#303346] cursor-pointer flex items-center justify-center ${
            selectedTab === "group" ? "bg-[#00b6ff]" : ""
          }`}
          onClick={() => handleTabChange("group")}
        >
          GROUP
        </div>
      </div>
      <div className="w-full flex flex-col items-center overflow-y-scroll">
        {(selectedTab === "direct" ||
          selectedTab === "profile" ||
          selectedTab === "") &&
          users.map((user) => {
            let result;
            if (user.lastMessage) {
              result = decryptionDirect(
                user.lastMessage?.encryptedText,
                user.lastMessage?.encryptedSessionKeySender,
                user.lastMessage?.encryptedSessionKeyReceiver
              );
            }
            return (
              <div
                key={user._id}
                onClick={() => getMessageOnClickChat(user._id, user.username)}
                className="h-28 w-[90%] bg-[#303346] rounded-4xl flex items-center flex-shrink-0 relative mt-10 cursor-pointer hover:bg-[#3a3a4a] transition-colors"
              >
                <div className="h-12 w-12 rounded-full bg-white mx-8"></div>
                <div className="text-white">
                  <h1>{user.username}</h1>
                  <h1 className="">
                    {result?.decryptedText.length! > 20
                      ? result?.decryptedText.slice(0, 20) + "..."
                      : result?.decryptedText}
                  </h1>
                </div>
                {onlineUsers.map((onlineUser) => {
                  return onlineUser.userId === user._id ? (
                    <div
                      key={onlineUser.userId}
                      className="h-6 w-6 rounded-full bg-[#00b6ff] absolute right-5"
                    ></div>
                  ) : null;
                })}
              </div>
            );
          })}
        {(selectedTab === "group" || selectedTab === "groupInfo") &&
          groups.map((group) => {
            let result = "";
            if (group.lastMessage) {
              const myUserId = localStorage.getItem("myUserId")!;
              const encryptedEncryptionKey = (
                group.lastMessage?.encryptionKey as { [key: string]: string }
              )[myUserId];
              const { decryptedEncryptionKey } = decryptEncryptionKeyGroup(
                encryptedEncryptionKey
              );
              const { decryptedText } = decryptionGroup(
                decryptedEncryptionKey,
                group.lastMessage?.encryptedText
              );
              result = decryptedText;
            }
            return (
              <div
                key={group._id}
                className="h-28 w-[90%] bg-[#303346] rounded-4xl flex items-center flex-shrink-0 relative mt-10 cursor-pointer hover:bg-[#3a3a4a] transition-colors"
                onClick={() => {
                  selectedTab === "groupInfo"
                    ? dispatch(setSelectedTab("group"))
                    : getGroupMessageOnClickChat(group._id, group.groupName);
                  getGroupMessageOnClickChat(group._id, group.groupName);
                }}
              >
                <div className="h-12 w-12 rounded-full bg-white mx-8"></div>
                <div className="text-white">
                  <h1>{group.groupName}</h1>
                  <h1 className="">
                    {result?.length! > 20
                      ? result?.slice(0, 20) + "..."
                      : result}
                  </h1>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
