import React, { useState } from "react";
import CommentSection from "./CommentSection";

const CommentSectionExample = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">CommentSection 컴포넌트 예제</h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">커뮤니티 게시글 댓글</h2>
        <CommentSection postId="1" category="community" showReplies={true} />
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">입양 게시글 댓글</h2>
        <CommentSection postId="1" category="adoption" showReplies={true} />
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">답글 기능 비활성화</h2>
        <CommentSection postId="1" category="community" showReplies={false} />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">CommentSection Props:</h3>
        <ul className="text-sm space-y-1">
          <li>
            <strong>postId:</strong> 게시물 ID (필수)
          </li>
          <li>
            <strong>category:</strong> 게시물 카테고리 (필수) - "community",
            "adoption" 등
          </li>
          <li>
            <strong>showReplies:</strong> 답글 기능 표시 여부 (기본값: true)
          </li>
          <li>
            <strong>className:</strong> 추가 CSS 클래스 (선택)
          </li>
        </ul>

        <h3 className="font-semibold mb-2 mt-4">주요 기능:</h3>
        <ul className="text-sm space-y-1">
          <li>• 자동으로 백엔드 API와 통신하여 댓글 CRUD 처리</li>
          <li>• 로그인 상태에 따른 UI 변경</li>
          <li>• 본인이 작성한 댓글만 수정/삭제 가능</li>
          <li>• 로딩 상태 및 에러 처리</li>
          <li>• 키보드 단축키 (Enter로 제출)</li>
        </ul>
      </div>
    </div>
  );
};

export default CommentSectionExample;
