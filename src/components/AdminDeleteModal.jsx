
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const AdminDeleteModal = ({ isOpen, onClose, manager }) => {
  const handleDelete = () => {
    console.log("관리자 삭제:", manager);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>관리자 삭제</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            정말로 삭제하시겠습니까?
          </p>
          <p className="text-sm text-gray-500">
            한번 삭제하면 복구할 수 없습니다.
          </p>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              삭제하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDeleteModal;
