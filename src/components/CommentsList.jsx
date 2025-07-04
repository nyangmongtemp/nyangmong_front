
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

const CommentsList = ({ comments }) => {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardTitle className="text-gray-800 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          내가 작성한 댓글 ({comments.length}개)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">
                  {comment.postTitle}
                </h4>
                <span className="text-xs text-gray-500">{comment.date}</span>
              </div>
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                {comment.comment}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentsList;
