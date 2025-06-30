
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

const BannerOrderModal = ({ isOpen, onClose, banners, onOrderUpdate }) => {
  const [orderedBanners, setOrderedBanners] = useState([]);

  useEffect(() => {
    if (banners) {
      setOrderedBanners([...banners]);
    }
  }, [banners]);

  const moveUp = (index) => {
    if (index > 0) {
      const newOrder = [...orderedBanners];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      setOrderedBanners(newOrder);
    }
  };

  const moveDown = (index) => {
    if (index < orderedBanners.length - 1) {
      const newOrder = [...orderedBanners];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      setOrderedBanners(newOrder);
    }
  };

  const handleSave = () => {
    if (onOrderUpdate) {
      onOrderUpdate(orderedBanners);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>배너 순서 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {orderedBanners.map((banner, index) => (
            <div key={banner.id} className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="flex flex-col space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="h-6 w-6 p-0"
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveDown(index)}
                  disabled={index === orderedBanners.length - 1}
                  className="h-6 w-6 p-0"
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="flex-1">
                <div className="text-sm font-medium">{banner.name}</div>
                <div className="text-xs text-gray-500">순서: {index + 1}</div>
              </div>
              
              <div className="w-16 h-10 bg-gray-100 rounded overflow-hidden">
                <img 
                  src={banner.imageUrl} 
                  alt={banner.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            순서 저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BannerOrderModal;
