
import React from "react";
import { User, FileText, MessageCircle, Heart } from "lucide-react";

const TabNavigation = ({ activeTab, setActiveTab, setCurrentPage }) => {
  const tabs = [
    { id: "profile", label: "프로필 정보", icon: User },
    { id: "posts", label: "내 게시글", icon: FileText },
    { id: "comments", label: "내 댓글", icon: MessageCircle },
    { id: "likes", label: "좋아요", icon: Heart },
  ];

  return (
    <div className="mb-6">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentPage(1);
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
