import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminEditModal = ({ isOpen, onClose, manager }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "총괄",
    status: "활성",
  });

  const handleSubmit = () => {
    console.log("관리자 수정:", formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>관리자 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-600">정말로 수정하시겠습니까?</p>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleSubmit}>
              수정하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminEditModal;
