export interface Users {
  _id: string;
  username: string;
  email: string;
  password: string;
  publicKey: string;
  lastMessage: Messages;
  profilePic: string
}

export interface CurrentUser {
  id: string;
  username: string;
  publicKey: string;
}

export interface Messages {
  _id: string;
  senderId: string;
  recieverId: string;
  text: string;
  encryptedText: string;
  encryptedSessionKeyReceiver: string;
  encryptedSessionKeySender: string;
  encryptionKey: object;
}

export interface OnlineUser {
  userId: string;
  socketId: string;
}

export interface Groups {
  _id: string;
  groupName: string;
  groupMembers: string[];
  lastMessage: Messages;
}

export interface GroupMessages {
  _id: string;
  groupId: string;
  encryptedText: string;
  senderId: string;
}

export interface CurrentGroup {
  id: string;
  groupName: string;
  encryptionKey: string;
}

