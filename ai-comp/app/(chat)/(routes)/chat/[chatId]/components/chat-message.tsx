"use client";

import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import BotAvatar from "./bot-avatar";
import { BeatLoader } from "react-spinners";
import UserAvatar from "./user-avatar";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

export interface ChatMessageProps {
  role: "system" | "user";
  content?: string;
  isLoading?: boolean;
  src?: string;
}

// The actual chat messagges component
const ChatMessage = ({ role, content, isLoading, src }: ChatMessageProps) => {
  const { toast } = useToast();
  const { theme } = useTheme();

  // Function to copy message to clipboard
  const onCopy = () => {
    if (!content) {
      return;
    }
    navigator.clipboard.writeText(content);
    toast({
      description: "Message copied to clipboard",
    });
  };

  return (
    <div
      // If the role is user, the message will be aligned to the right, if not, it will be aligned to the left
      className={cn(
        "group flex items-start gap-x-3 py-4 w-full",
        role === "user" && "justify-end"
      )}
    >
      {/* If the role is the system display bot avatar */}
      {role !== "user" && src && <BotAvatar src={src} />}
      {/* Display the content of the messages */}
      <div className="rounded-md px-4 py-2 max-w-sm bg-primary/10">
        {isLoading ? (
          <BeatLoader size={5} color={theme === "light" ? "black" : "white"} />
        ) : (
          content
        )}
      </div>
      {/* If it is the user, display user avatar */}
      {role === "user" && <UserAvatar />}
      {/* If the message is from the bot and is not loading display the copy button */}
      {role !== "user" && !isLoading && (
        <Button
          onClick={onCopy}
          className="opacity-0 group-hover:opacity-100 transition"
          size="icon"
          variant="ghost"
        >
          <Copy className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default ChatMessage;
