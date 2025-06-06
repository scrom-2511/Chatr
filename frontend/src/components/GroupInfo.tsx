import { useSelector } from "react-redux";
import { RootState } from "../app/store";   
import { useState, useEffect } from "react";
import axios from "axios";
import { Users } from "../types/ChatType";
import { setGrpUsersSelectMenuVisible } from "../features/groupChat/ComponentsVisibileSlice";
import { useDispatch } from "react-redux";
import { setCurrentGroupUsers } from "../features/groupChat/currentGroupUsers";
const GroupInfo = () => {
  const dispatch = useDispatch();
  const currentGroup = useSelector((state: RootState) => state.currentGroupData);
  const users = useSelector((state: RootState) => state.users);
  const currentGroupUsers = useSelector((state: RootState) => state.currentGroupUsers);
  const getAllGroupMembers = async () => {
    const req = await axios.get(`http://localhost:3000/group/getAllGroupMembers/${currentGroup.id}`)
    dispatch(setCurrentGroupUsers(req.data))
  }
  useEffect(() => {
    getAllGroupMembers()
  }, [])
  return (
    <div className="h-full w-full flex text-white flex-col items-center">
      <div className="h-[70%] w-full flex flex-col items-center pt-30 gap-10">
        <div className="h-50 w-50 bg-white rounded-full"></div>
        <h1 className="text-2xl">{currentGroup.groupName}</h1>
      </div>
      <div className="h-full w-full flex flex-col items-center gap-10 overflow-y-scroll">
        <h1 className="text-2xl">GROUP MEMBERS</h1>
        { 
          currentGroupUsers.filter((user)=> user !== localStorage.getItem("myUserId")).map((member: any) => {  
            return (
              <div
                key={member._id}
                className="h-28 w-[90%] bg-[#303346] rounded-4xl flex items-center flex-shrink-0 relative mt-10 hover:bg-[#3a3a4a] transition-colors cursor-pointer"
              >
                <div className="h-12 w-12 rounded-full bg-white mx-8"></div>
                <div className="text-white">
                  {users && users.map((user:Users)=>(
                    (user._id === member) ? (
                      <h1>{user.username}</h1>
                    ) : null
                  ))}
                </div>
              </div>
            );
          }
        )}
        <div
          className="h-28 w-[90%] bg-[#303346] rounded-4xl flex justify-center items-center flex-shrink-0 relative mt-10 hover:bg-[#3a3a4a] transition-colors cursor-pointer"
          onClick={()=>{
            dispatch(setGrpUsersSelectMenuVisible(true));
            console.log(currentGroupUsers)
            console.log(users)
          }}
        >
          <div className="text-white text-xl">ADD A NEW USER</div>
        </div>
      </div>
    </div>
  );
}

export default GroupInfo
