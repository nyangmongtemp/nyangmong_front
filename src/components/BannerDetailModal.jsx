
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const BannerDetailModal = ({ isOpen, onClose, banner }) => {
  if (!banner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>배너 이름(업력 가능)</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 border rounded-lg h-48 flex items-center justify-center">
            <span className="text-gray-500">배너 이미지</span>
          </div>

          <div className="flex justify-end">
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
            >
              이미지 수정하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BannerDetailModal;
