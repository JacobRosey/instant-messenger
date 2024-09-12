
export interface Message {
  isRead: boolean,
  content: string,
  sender: string,
  recipient: string,
  timestamp: any,
  id: string
}

export interface Request {
  isSender: boolean,
  name: string,
  timestamp: any
  isPending: boolean
}

export interface UserData {
    name: string;
    friends: Array<string>;
    messages: Array<Message>;
    requests: Array<Request>
  }