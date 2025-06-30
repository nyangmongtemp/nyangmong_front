
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const InquiryDetailModal = ({ isOpen, onClose, inquiry }) => {
  const [responseText, setResponseText] = useState("");

  if (!inquiry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>최신순, 오래된 순, 응답 여부</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              현재 가지고 이용약관 내용을 넣을 분량
              신규 등록, GET으로 블러옴 때 기존 내용이 있으면 NULL로
              보내자.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사용자 이름
                </label>
                <Input 
                  value={inquiry.author}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <Input 
                  value="user@example.com"
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                진행 완료
              </label>
              <Input 
                value={inquiry.progress}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 내용
            </label>
            <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px]">
              <p className="text-gray-800">
                텍스트 에디터<br/>
                (이용약관처럼 기존 내용을 불러올 X)
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              텍스트 입력 창
            </label>
            <Textarea
              placeholder="POST, PUT, PATCH 중 하나를 쓰자."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="min-h-[150px]"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              확인
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InquiryDetailModal;
