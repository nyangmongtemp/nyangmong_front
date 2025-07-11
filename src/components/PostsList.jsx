import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Heart, MessageCircle } from "lucide-react";

const PostsList = ({ posts }) => {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-pink-50">
        <CardTitle className="text-gray-800 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          내가 작성한 게시글 ({posts.length}개)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b last:border-b-0"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-xs text-gray-500">{post.date}</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2 hover:text-orange-600 transition-colors">
                {post.title}
              </h4>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>조회 {post.views}</span>
                <span className="flex items-center">
                  <Heart className="w-3 h-3 mr-1" />
                  {post.likes}
                </span>
                <span className="flex items-center">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {post.comments}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostsList;
