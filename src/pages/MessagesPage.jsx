import React, { useEffect, useState } from "react";
import { ArrowLeft, Plus, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ChatRoomDetail from "@/components/ChatRoomDetail";
import NewChatModal from "@/components/NewChatModal";
import { API_BASE_URL, USER } from "../../configs/host-config";
import { useAuth } from "../context/UserContext";
import axiosInstance from "../../configs/axios-config";

const MessagesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [messages, setMessages] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [myUserId, setMyUserId] = useState(null);

  const { token, isLoggedIn, email } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}${USER}/chat`);
        console.log(response);

        const data = response.data.result;
        setMessages(data);
        const firstChat = data[0];

        if (firstChat.nickname1 === firstChat.requestNickname) {
          setMyUserId(firstChat.userId1);
        } else {
          setMyUserId(firstChat.userId2);
        }
        console.log(myUserId);
      } catch (err) {
        console.log(err);
      }
    };
    if (token) fetchUserData();
  }, [token, email]);

  // 채팅방 목록 필터링 및 정렬
  const getFilteredAndSortedMessages = () => {
    let filtered = messages.filter((chat) => {
      const otherNickname =
        chat.requestNickname === chat.nickname1
          ? chat.nickname2
          : chat.nickname1;
      return otherNickname.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // 정렬
    filtered.sort((a, b) => {
      const dateA = new Date(a.updateAt);
      const dateB = new Date(b.updateAt);
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString("ko-KR", { weekday: "short" });
    } else {
      return date.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const filteredMessages = getFilteredAndSortedMessages();

  const handleChatClick = (chatId) => {
    setSelectedChatId(chatId);
  };

  const handleBackToList = () => {
    setSelectedChatId(null);
  };

  const handleNewChatSuccess = () => {
    setIsNewChatModalOpen(false);
    // 채팅 목록 새로고침
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}${USER}/chat`);
        const data = response.data.result;
        setMessages(data);
      } catch (err) {
        console.log(err);
      }
    };
    if (token) fetchUserData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {selectedChatId ? (
              <ChatRoomDetail
                chatId={selectedChatId}
                onBack={handleBackToList}
                myUserId={myUserId}
                currentUserNickname={
                  messages.find((m) => m.chatId === selectedChatId)
                    ?.requestNickname
                }
              />
            ) : (
              <>
                {/* 뒤로가기 버튼 */}
                <div className="mb-6">
                  <button
                    onClick={() => navigate("/")}
                    className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span>뒤로가기</span>
                  </button>
                </div>

                {/* 페이지 제목 */}
                <div className="mb-8 text-center">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    메시지
                  </h1>
                </div>

                {/* 검색 및 정렬 */}
                <div className="bg-white rounded-lg border p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                      <Input
                        placeholder="닉네임으로 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-80"
                      />
                      <Dialog
                        open={isNewChatModalOpen}
                        onOpenChange={setIsNewChatModalOpen}
                      >
                        <DialogTrigger asChild>
                          <Button className="bg-orange-500 hover:bg-orange-600">
                            <Plus className="h-4 w-4 mr-2" />
                            채팅 시작하기
                          </Button>
                        </DialogTrigger>
                        <NewChatModal onSuccess={handleNewChatSuccess} />
                      </Dialog>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">정렬</span>
                      <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="latest">최신순</SelectItem>
                          <SelectItem value="oldest">오래된순</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* 메시지 목록 */}
                  <div className="space-y-3">
                    {filteredMessages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        메시지가 없습니다.
                      </div>
                    ) : (
                      filteredMessages.map((chat) => {
                        const otherNickname =
                          chat.requestNickname === chat.nickname1
                            ? chat.nickname2
                            : chat.nickname1;
                        return (
                          <div
                            key={chat.chatId}
                            className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleChatClick(chat.chatId)}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-semibold text-gray-800">
                                    {otherNickname}
                                  </h3>
                                  <span className="text-xs text-gray-500">
                                    {formatDate(chat.updateAt)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 truncate">
                                  {chat.message?.content ||
                                    "메시지가 없습니다."}
                                </p>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-400">
                                    채팅방 생성: {formatDate(chat.createAt)}
                                  </span>
                                  {!chat.message?.readed &&
                                    chat.message?.senderId !== chat.userId1 &&
                                    chat.requestNickname === chat.nickname1 && (
                                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    )}
                                  {!chat.message?.readed &&
                                    chat.message?.senderId !== chat.userId2 &&
                                    chat.requestNickname === chat.nickname2 && (
                                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="w-80 flex-shrink-0">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
