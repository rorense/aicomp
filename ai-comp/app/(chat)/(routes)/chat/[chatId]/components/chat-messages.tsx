"use client";

import { Companion } from "@prisma/client";
import ChatMessage, { ChatMessageProps } from "./chat-message";

interface ChatMessagesProps {
  companion: Companion;
  messages: ChatMessageProps[];
  isLoading: boolean;
}

const ChatMessages = ({
  companion,
  isLoading,
  messages = [],
}: ChatMessagesProps) => {
  return (
    <div className="flex-1 overflow-y-auto pr-4">
      <ChatMessage
        src={companion.src}
        role="system"
        content={`Hello, I am ${companion.name}, ${companion.description}`}
      />
      <ChatMessage
        role="user"
        content={`Hello, I am ${companion.name}, ${companion.description}`}
      />
    </div>
  );
};

export default ChatMessages;
