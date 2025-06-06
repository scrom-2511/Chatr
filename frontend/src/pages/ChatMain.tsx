import { useEffect, useState } from "react";
import useGetUsersAndGroups from "../customHooks/useGetUsersAndGroups";
import DirectChat from "../components/DirectChat";
import GroupChat from "../components/GroupChat";
import GroupInfo from "../components/GroupInfo";
import { LeftPart } from "../components/ChatComponents";
import { setMessages } from "../features/chat/MessageSlice";
import { setGroupMessages } from "../features/groupChat/GroupMessageSlice";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import Profile from "../components/Profile";

const ChatMain = () => {
  const { getUsers, getGroups } = useGetUsersAndGroups();
  const selectedTab = useSelector((state: RootState) => state.extra.selectedTab);

  // Load users and groups
  useEffect(() => {
    const loadData = async () => {
      await getUsers();
      await getGroups();
    };
    loadData();
  }, []);

  useEffect(() => {
    setMessages([]);
    setGroupMessages([]);
  }, [selectedTab]);
  return (
    <div className="h-full w-full flex">
      {/* Left sidebar with users and groups */}
      <LeftPart/>

      {/* Main chat area */}
      <div className="h-full w-[75%]">
        {selectedTab === "direct" && (
          <DirectChat />
        )}
        {selectedTab === "group" && (
          <GroupChat />
        )}
        {selectedTab === "groupInfo" && (
          <GroupInfo />
        )}
        {selectedTab === "profile" && (
          <Profile />
        )}
      </div>
    </div>
  );
};

export default ChatMain;
