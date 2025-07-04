
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

const LikedPostsList = ({ posts }) => {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-pink-50 to-red-50">
        <CardTitle className="text-gray-800 flex items-center">
          <Heart className="w-5 h-5 mr-2" />
          좋아요한 게시글 ({posts.length}개)
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
                <span className="text-xs text-gray-500">by {post.author}</span>
                <span className="text-xs text-gray-500">{post.date}</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2 hover:text-pink-600 transition-colors">
                {post.title}
              </h4>
              <div className="flex items-center text-xs text-gray-500">
                <Heart className="w-3 h-3 mr-1 text-red-500" />
                <span>{post.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LikedPostsList;
