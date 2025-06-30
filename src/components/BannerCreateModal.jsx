
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BannerCreateModal = ({ isOpen, onClose }) => {
  const [bannerName, setBannerName] = useState("");

  const handleSubmit = () => {
    console.log("배너 생성:", bannerName);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>배너 이름 (업력 가능)</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 border rounded-lg h-48 flex items-center justify-center">
            <span className="text-gray-500">배너 이미지</span>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              배너 등록하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BannerCreateModal;
