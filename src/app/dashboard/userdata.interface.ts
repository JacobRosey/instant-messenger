export interface Message {
  isRead: boolean,
  content: string,
  sender: string,
  recipient: string,
  timestamp: any
  id: number
}

export interface UserData {
    name: string;
    friends: Array<string>;
    messages: Array<Message>;
  }