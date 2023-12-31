
export interface Message {
  isRead: boolean,
  content: string,
  sender: string,
  recipient: string,
  timestamp: any
}

export interface Request {
  isSender: boolean,
  name: string,
  timestamp: any
}

export interface UserData {
    name: string;
    friends: Array<string>;
    messages: Array<Message>;
    requests: Array<Request>
  }