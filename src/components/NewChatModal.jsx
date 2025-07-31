import React, { useState } from "react";
import { Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { API_BASE_URL, USER } from "../../configs/host-config";
import { useAuth } from "../context/UserContext";
import axiosInstance from "../../configs/axios-config";

const NewChatModal = ({ onSuccess }) => {
  const [step, setStep] = useState(1); // 1: 사용자 검색, 2: 사용자 선택, 3: 메시지 입력
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${API_BASE_URL}${USER}/search/${searchTerm}`
      );

      console.log("Search results:", response);
      if (response.data && response.data.result) {
        setSearchResults(response.data.result);
      }
    } catch (err) {
      console.error("Search failed:", err);
      alert("사용자 검색에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setStep(2);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedUser) return;

    try {
      setLoading(true);
      const response = await axiosInstance.post(`${API_BASE_URL}${USER}/send`, {
        receiverId: selectedUser.userId,
        content: message,
      });

      console.log("Chat created:", response);
      alert("메시지가 전송되었습니다!");
      onSuccess();
    } catch (err) {
      if (err.response?.status === 400) {
        alert("본인에게는 메시지를 보낼 수 없습니다.");
      } else if (err.response?.status === 404) {
        alert("메시지를 보낼 수 없는 사용자입니다.");
      } else {
        alert("메시지 전송 중 오류가 발생하였습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setSearchTerm("");
    setSearchResults([]);
    setSelectedUser(null);
    setMessage("");
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>
          {step === 1 && "사용자 검색"}
          {step === 2 && "메시지 보내기"}
        </DialogTitle>
      </DialogHeader>

      {step === 1 && (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="닉네임 또는 이메일로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {searchResults.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                {loading ? "검색 중..." : "검색 결과가 없습니다."}
              </div>
            ) : (
              searchResults.map((user) => (
                <div
                  key={user.userId}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="flex items-center space-x-3">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.nickname}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-semibold">
                          {user.nickname?.charAt(0) || user.email?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{user.nickname}</div>
                      <div className="text-sm text-gray-500">
                        이름: {user.username}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {step === 2 && selectedUser && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {selectedUser.profileImage ? (
                <img
                  src={selectedUser.profileImage}
                  alt={selectedUser.nickname}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-lg">
                    {selectedUser.nickname?.charAt(0) ||
                      selectedUser.email?.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <div className="font-medium text-lg">
                  {selectedUser.nickname}
                </div>
                <div className="text-sm text-gray-500">
                  {selectedUser.email}
                </div>
              </div>
            </div>
          </div>

          <Textarea
            placeholder="메시지를 입력하세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1"
            >
              뒤로가기
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={loading || !message.trim()}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              <Send className="h-4 w-4 mr-2" />
              전송
            </Button>
          </div>
        </div>
      )}
    </DialogContent>
  );
};

export default NewChatModal;
