import React from "react";
import { List } from "grommet";
import ChatMessage from "./ChatMessage"; // Ensure this component is imported correctly

interface ChatMessageType {
  user: string;
  text: string;
  isSentByMe: boolean;
}

const ChatConversation: React.FC<{ message: ChatMessageType[] }> = ({ message }) => {
  return (
    <List data={message} primaryKey="text">
      {(item) => (
        <ChatMessage
          key={item.text} // Using the text as a key, assuming it's unique
          user={item.user}
          text={item.text}
          isSentByMe={item.isSentByMe}
        />
      )}
    </List>
  );
};

export default ChatConversation;
