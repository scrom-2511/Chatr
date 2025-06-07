import axios from "axios";
import { Users, Groups } from "../types/ChatType";
import { useEffect, useState } from "react";
import useGroupOperations from "../customHooks/useGroupOperations";
const Profile = () => {
  const [userInfo, setUserInfo] = useState<Users>();
  const [myGroups, setMyGroups] = useState<Groups[]>([]);
  const [imgSrc, setImgSrc] = useState<string>("");
  
  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(()=>{
    setImgSrc(userInfo?.profilePic||"")
  },[userInfo])

  const { leaveGroup } = useGroupOperations();

  const getUserInfo = async () => {
    const response = await axios.get(
      `http://localhost:3000/user/userInfo/${localStorage.getItem("myUserId")}`
    );
    console.log(response.data.userInfo)
    setUserInfo(response.data.userInfo);
    setMyGroups(response.data.userGroupsInfo);
  };

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      console.log(reader.result);
      setImgSrc(reader.result?.toString() || "");
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("userId", localStorage.getItem("myUserId")!);

    try {
      await axios.post("http://localhost:3000/common/profileImageUpload", formData);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  
  return (
    <div className="h-full w-full flex text-white flex-col items-center">
      <div className="h-[70%] w-full flex flex-col items-center pt-30 gap-10">
        <div className="h-50 w-50 bg-white rounded-full relative">
          <input
            type="file"
            accept="image/*"
            name="profileImage"
            className="opacity-0 h-full w-full rounded-full absolute top-0 z-10"
            onChange={handleOnChange}
          />
          {imgSrc && <img
              src={imgSrc}
              alt="profile"
              className="h-full w-full rounded-full absolute top-0 z-0 object-cover"
            />}
        </div>
        <h1 className="text-2xl">{userInfo?.username}</h1>
      </div>
      <div className="h-full w-full flex flex-col items-center gap-10 overflow-y-scroll">
        <h1 className="text-2xl">YOUR GROUPS</h1>
        {myGroups.map((group: any) => {
          return (
            <div
              key={group._id}
              className="h-28 w-[90%] bg-[#303346] rounded-4xl flex items-center flex-shrink-0 relative mt-10 hover:bg-[#3a3a4a] transition-colors"
            >
              <div className="h-12 w-12 rounded-full bg-white mx-8 relative"></div>
              <div className="text-white">
                <h1>{group.groupName}</h1>
              </div>
              <div
                className="absolute right-10 bg-[#c10000] p-3 rounded-2xl cursor-pointer"
                onClick={() =>
                  leaveGroup(group._id, localStorage.getItem("myUserId")!)
                }
              >
                LEAVE GROUP
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
