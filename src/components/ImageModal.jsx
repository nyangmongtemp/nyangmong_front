import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ImageModal = ({ isOpen, onClose, image1, image2 }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">문화시설 이미지</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {image1 && (
            <div>
              <h3 className="text-lg font-medium mb-2">이미지</h3>
              <img
                src={image1}
                alt="문화시설 이미지"
                className="w-full h-auto rounded-lg shadow-md"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}

          {image2 && image2 !== image1 && (
            <div>
              <h3 className="text-lg font-medium mb-2">이미지 2</h3>
              <img
                src={image2}
                alt="문화시설 이미지 2"
                className="w-full h-auto rounded-lg shadow-md"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}

          {!image1 && !image2 && (
            <div className="text-center py-8 text-gray-500">
              표시할 이미지가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
