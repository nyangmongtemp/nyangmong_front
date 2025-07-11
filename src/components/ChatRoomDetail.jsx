import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL, USER } from "../../configs/host-config";
import { useAuth } from "../context/UserContext";
import axiosInstance from "../../configs/axios-config";
import { useNavigate } from "react-router-dom";

const ChatRoomDetail = ({ chatId, onBack, currentUserNickname, myUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [receiverId, setReceiverId] = useState(null);
  const { token } = useAuth();
  const messageContainerRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `${API_BASE_URL}${USER}/chat/list/${chatId}`
        );
        console.log("Chat messages:", response);

        if (response.data && response.data.result) {
          setMessages(response.data.result);
        }
        if (myUserId !== response.data.result[0].senderId) {
          setReceiverId(response.data.result[0].senderId);
        } else {
          setReceiverId(response.data.result[0].receiverId);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    };

    if (chatId && token) {
      fetchMessages();
    }
  }, [chatId, token]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      console.log(receiverId);

      const response = await axiosInstance.post(`${API_BASE_URL}${USER}/send`, {
        receiverId: receiverId,
        content: newMessage,
      });

      console.log("Message sent:", response);

      // 메시지 목록 새로고침
      const messagesResponse = await axiosInstance.get(
        `${API_BASE_URL}${USER}/chat/list/${chatId}`
      );
      if (messagesResponse.data && messagesResponse.data.result) {
        setMessages(messagesResponse.data.result);
      }

      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("메시지 전송에 실패했습니다.");
    }
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isMyMessage = (message) => {
    return message.senderId === myUserId;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">메시지를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border h-[600px] flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b flex items-center space-x-3">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold">
          {messages.length > 0 &&
            (messages[0].requestNickname === messages[0].nickname1
              ? messages[0].nickname2
              : messages[0].nickname1)}
        </h2>
      </div>

      {/* 메시지 목록 */}
      <div
        ref={messageContainerRef}
        className="flex-1 p-4 overflow-y-auto space-y-4"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            아직 메시지가 없습니다. 첫 메시지를 보내보세요!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.messageId}
              className={`flex ${
                isMyMessage(message) ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] ${
                  isMyMessage(message) ? "order-2" : "order-1"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 ${
                    isMyMessage(message)
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="break-words">{message.content}</p>
                </div>
                <div
                  className={`text-xs text-gray-500 mt-1 ${
                    isMyMessage(message) ? "text-right" : "text-left"
                  }`}
                >
                  {formatMessageTime(message.createAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 메시지 입력 */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-orange-500 hover:bg-orange-600"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomDetail;
