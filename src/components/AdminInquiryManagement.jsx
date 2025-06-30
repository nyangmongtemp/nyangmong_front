
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InquiryDetailModal from "./InquiryDetailModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const AdminInquiryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("createdAt_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const inquiries = [
    {
      id: 1,
      author: "사용자 이름",
      title: "내용 (1줄 정도만 노출)",
      progress: "진행 완료",
      date: "Y(응답 여부)",
    },
    {
      id: 2,
      author: "사용자 이름",
      title: "내용 (1줄 정도만 노출)",
      progress: "진행 완료",
      date: "Y(응답 여부)",
    },
    {
      id: 3,
      author: "사용자 이름",
      title: "내용 (1줄 정도만 노출)",
      progress: "진행 완료",
      date: "N(응답 여부)",
    },
    {
      id: 4,
      author: "사용자 이름",
      title: "내용 (1줄 정도만 노출)",
      progress: "진행 완료",
      date: "N(응답 여부)",
    },
    {
      id: 5,
      author: "사용자 이름",
      title: "내용 (1줄 정도만 노출)",
      progress: "진행 완료",
      date: "N(응답 여부)",
    },
    {
      id: 6,
      author: "사용자 이름",
      title: "내용 (1줄 정도만 노출)",
      progress: "진행 완료",
      date: "Y(응답 여부)",
    },
    {
      id: 7,
      author: "사용자 이름",
      title: "내용 (1줄 정도만 노출)",
      progress: "진행 완료",
      date: "N(응답 여부)",
    },
    {
      id: 8,
      author: "사용자 이름",
      title: "내용 (1줄 정도만 노출)",
      progress: "진행 완료",
      date: "Y(응답 여부)",
    }
  ];

  const handleInquiryClick = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);
  };

  const filteredInquiries = inquiries.filter(
    (inquiry) =>
      inquiry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이징 계산
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInquiries = filteredInquiries.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="검색어 입력 (이름, 이메일)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80"
          />
        </div>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="ml-4 w-40">
            <SelectValue placeholder="정렬조건" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt_desc">최신순</SelectItem>
            <SelectItem value="createdAt_asc">오래된순</SelectItem>
            <SelectItem value="no_answer">응답</SelectItem>
            <SelectItem value="yes_answer">미응답</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700">
            <span>사용자 이름</span>
            <span>내용 (1줄 정도만 노출)</span>
            <span>진행 완료</span>
            <span>Y(응답 여부)</span>
          </div>
        </div>

        {paginatedInquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            className="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
            onClick={() => handleInquiryClick(inquiry)}
          >
            <div className="grid grid-cols-4 gap-4 text-sm">
              <span>{inquiry.author}</span>
              <span className="text-blue-600 hover:underline">
                {inquiry.title}
              </span>
              <span>{inquiry.progress}</span>
              <span>{inquiry.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 페이징 */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 2
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  </React.Fragment>
                ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <InquiryDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        inquiry={selectedInquiry}
      />
    </div>
  );
};

export default AdminInquiryManagement;
