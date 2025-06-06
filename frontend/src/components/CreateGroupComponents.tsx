import { useState } from "react";
import { Users } from "../types/ChatType";
import useCreateGroup from "../customHooks/useGroupOperations";
import { RootState } from "../app/store";
import { useSelector, useDispatch } from "react-redux";
import { setGroupName, setSelectedUsers, setSelectedUsersPublicKey } from "../features/groupChat/CreateGroupSlice";
import { setSelectedTab } from "../features/chat/ExtraSlice";

export const GroupMenuComponent = ({
  grpMenuRef,
  onCreateGroupClick,
}: {
  grpMenuRef: React.RefObject<HTMLDivElement | null>;
  onCreateGroupClick: () => void;
}) => {
  const users: Users[] = useSelector((state: RootState) => state.users);
  const [selectedUsersTemp, setSelectedUsersTemp] = useState<string[]>([]);
  const [selectedUsersPublicKeyTemp, setSelectedUsersPublicKeyTemp] = useState<string[]>([]);
  const dispatch = useDispatch();

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
      ref={grpMenuRef}
      className="h-[500px] w-[500px] bg-[#262837] absolute right-[50%] top-[50%] translate-x-[50%] translate-y-[-50%] rounded-lg flex-col items-center pt-10 text-white hidden z-50"
    >
      <div className="text-xl font-bold">SELECT GROUP MEMBERS</div>
      <div className="h-[400px] w-[90%] flex flex-col items-center mb-10 overflow-y-scroll">
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => handleUserSelect(user._id, user.publicKey)}
            className={`h-28 w-[90%] bg-[#303346] rounded-4xl flex items-center flex-shrink-0 relative mt-10 cursor-pointer
              ${selectedUsersTemp.includes(user._id)
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
          if (selectedUsersTemp.length < 3) {
            return;
          }
          dispatch(setSelectedUsers([...selectedUsersTemp, localStorage.getItem("myUserId")!]));
          dispatch(setSelectedUsersPublicKey([...selectedUsersPublicKeyTemp, localStorage.getItem("publicKeySender")!]));
          onCreateGroupClick();
        }}
        className="bg-[#084e6a] px-5 py-3 rounded-xl mb-10 hover:bg-[#0a5c7d] transition-colors"
      >
        CREATE GROUP
      </button>
    </div>
  );
};

export const MenuComponent = ({
  menuRef,
  onMenuOptionClick,
}: {
  menuRef: React.RefObject<HTMLDivElement | null>;
  onMenuOptionClick: () => void;
}) => {
  const dispatch = useDispatch();
  return (
    <div
      ref={menuRef}
      
    >
      <div 
        onClick={onMenuOptionClick}
        className="h-[50px] w-full flex items-center justify-center hover:bg-[#606060] transition-colors"
      >
        CREATE GROUP
      </div>
      <div 
        onClick={()=> {
          dispatch(setSelectedTab("profile"));
          if (menuRef.current) {
            menuRef.current.style.display = "none";
          }
        }}
        className="h-[50px] w-full flex items-center justify-center hover:bg-[#606060] transition-colors"
      >
        MY PROFILE
      </div>
    </div>
  );
};

export const GroupNameComponent = ({
  grpNameRef,
  onNameGroupClick,
}: {
  grpNameRef: React.RefObject<HTMLDivElement | null>;
  onNameGroupClick: () => void;
}) => {
  const dispatch = useDispatch();
  const { createGroup } = useCreateGroup();
  const [groupNameInput, setGroupNameInput] = useState("");

  return (
    <div
      ref={grpNameRef}
      className="h-[200px] w-[500px] bg-[#262837] absolute right-[50%] top-[50%] translate-x-[50%] translate-y-[-50%] rounded-lg flex-col items-center gap-10 pt-10 text-white hidden z-50"
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
          onNameGroupClick();
        }}
        className="bg-[#084e6a] px-5 py-3 rounded-xl hover:bg-[#0a5c7d] transition-colors text-white"
      >
        CREATE GROUP
      </button>
    </div>
  );
};
