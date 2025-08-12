import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Plus, Send, Trash2 } from "lucide-react";
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
import ReportButton from "../components/ReportButton";

const MessagesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [messages, setMessages] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [myUserId, setMyUserId] = useState(null);

  const { token, isLoggedIn, email } = useAuth();

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}${USER}/chat`);
      //   console.log(response);
      const data = response.data.result;
      setMessages(data);
      const firstChat = data[0];

      if (firstChat.nickname1 === firstChat.requestNickname) {
        setMyUserId(firstChat.userId1);
      } else {
        setMyUserId(firstChat.userId2);
      }
      //    console.log(myUserId);
    } catch (err) {
      ///     console.log(err);
    }
  }, []);

  useEffect(() => {
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

    // 항상 월/일 시:분 형식으로 출력
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${month}/${day} ${hour}:${minute}`;
  };

  // 메시지 보낸 사람의 닉네임을 찾는 함수
  const getSenderNickname = (chat) => {
    if (!chat.message || !chat.message.senderId) return "";

    // senderId가 userId1과 같으면 nickname1, userId2와 같으면 nickname2
    if (chat.message.senderId === chat.userId1) {
      return chat.nickname1;
    } else if (chat.message.senderId === chat.userId2) {
      return chat.nickname2;
    }
    return "";
  };

  const filteredMessages = getFilteredAndSortedMessages();

  const handleChatClick = (chatId) => {
    setSelectedChatId(chatId);
  };

  const handleBackToList = () => {
    setSelectedChatId(null);
    fetchUserData();
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
        //    console.log(err);
      }
    };

    if (token) fetchUserData();
  };

  // 채팅방 삭제 함수
  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation(); // 이벤트 버블링 방지

    if (!window.confirm("정말로 이 채팅방을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await axiosInstance.delete(`${API_BASE_URL}${USER}/clear/${chatId}`);
      //  console.log("채팅방 삭제 성공");

      // 채팅 목록에서 삭제된 채팅방 제거
      setMessages((prev) => prev.filter((chat) => chat.chatId !== chatId));

      // 현재 선택된 채팅방이 삭제된 채팅방이라면 선택 해제
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
      }
    } catch (error) {
      //    console.error("채팅방 삭제 실패:", error);
      alert("채팅방 삭제에 실패했습니다.");
    }
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
                        const senderNickname = getSenderNickname(chat);
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
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500">
                                      {formatDate(
                                        chat.message?.createAt || chat.updateAt
                                      )}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) =>
                                        handleDeleteChat(chat.chatId, e)
                                      }
                                      className="text-red-600 hover:bg-red-50 hover:text-red-700 p-1 h-6 w-6"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                    {/* 신고 버튼 추가 */}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 mb-2">
                                  {senderNickname && (
                                    <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                      {senderNickname}
                                    </span>
                                  )}
                                  <p className="text-sm text-gray-600 truncate flex-1">
                                    {chat.message?.content ||
                                      "메시지가 없습니다."}
                                  </p>
                                </div>
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
