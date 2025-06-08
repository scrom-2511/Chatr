import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { setSelectedUsers } from "../features/groupChat/CreateGroupSlice";
import { setGroupName } from "../features/groupChat/CreateGroupSlice";
import { decryptEncryptionKeyGroup } from "../utils/encryptionDecryption";

const useGroupOperations = () => {
  const dispatch = useDispatch();
  const groupName = useSelector((state: RootState) => state.createGroup.groupName);
  const currentGroup = useSelector((state: RootState)=> state.currentGroupData)
  const selectedUsers = useSelector((state: RootState) => state.createGroup.selectedUsers);
  const selectedUsersPublicKey = useSelector((state: RootState) => state.createGroup.selectedUsersPublicKey);
  const createGroup = async () => {
    try {
      const req = await axios.post(`http://localhost:3000/groupMessage/createGroup`, {
        groupName: groupName,
        groupMembers: selectedUsers,
        publicKey: selectedUsersPublicKey
      })
      dispatch(setGroupName(""));
      dispatch(setSelectedUsers([]));
    } catch (error) {
      console.log(error);
    }
  }

  const leaveGroup = async (groupId: string, userId: string) => {
    try {
      const req = await axios.get(`http://localhost:3000/group/leaveGroup`, {
        params: {
          groupId: groupId,
          userId: userId
        }
      })
    } catch (error) {
        console.log(error);
    }
  }

  const addGroup1 = async () =>{
    const req = await axios.post("http://localhost:3000/group/addGroup1", {
      userId: localStorage.getItem("publicKey"),
      groupId: currentGroup.id
    })
    const decryptedEncryptionKey = decryptEncryptionKeyGroup(req.data.encryptedEncryptionKey);
    return {decryptedEncryptionKey};
  }

  const addGroup2 = async (decryptedEncryptionKey:string)=>{
    const req = await axios.post("http://localhost:3000/group/addGroup2", {
      userId: localStorage.getItem("publicKey"),
      groupId: currentGroup.id,
      decryptedEncryptionKey
    })
    const message = req.data.message;
    return {message};
  }

  const addGroup = async ()=>{
    const {decryptedEncryptionKey} =  await addGroup1();
    const decdecryptedEncryptionKeyFinal = decryptedEncryptionKey.toString();
    const {message} = await addGroup2(decdecryptedEncryptionKeyFinal);
  }

  return { createGroup, leaveGroup, addGroup };
}

export default useGroupOperations;
