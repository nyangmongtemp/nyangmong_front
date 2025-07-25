
import React, { useState, useEffect } from "react";
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
import { getAdminInquiryList } from "../../configs/api-utils";

const AdminInquiryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answered, setAnswered] = useState("all");

  useEffect(() => {
    setLoading(true);
    getAdminInquiryList(currentPage, 10, searchTerm, answered)
      .then(setData)
      .finally(() => setLoading(false));
  }, [currentPage, searchTerm, answered]);

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Select value={answered} onValueChange={v => { setAnswered(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="답변여부" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="true">답변완료</SelectItem>
              <SelectItem value="false">미답변</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="검색어 입력 (이름, 이메일, 제목)"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-80"
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-700">
            <span>사용자 이름</span>
            <span>이메일</span>
            <span>제목</span>
            <span>답변여부</span>
            <span>문의일시</span>
          </div>
        </div>

        {loading && <div className="p-4 text-center">로딩중...</div>}
        {!loading && data?.content?.length === 0 && <div className="p-4 text-center">문의가 없습니다.</div>}
        {!loading && data?.content?.map((inquiry) => (
          <div
            key={inquiry.informId}
            className="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
            onClick={() => { setSelectedInquiry(inquiry); setIsModalOpen(true); }}
          >
            <div className="grid grid-cols-5 gap-4 text-sm">
              <span>{inquiry.userName}</span>
              <span>{inquiry.userEmail}</span>
              <span className="text-blue-600 hover:underline">{inquiry.title}</span>
              <span>{inquiry.answered ? "답변완료" : "미답변"}</span>
              <span>{formatDate(inquiry.createAt)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 페이징 */}
      {data?.totalPages && data.totalPages >= 1 && (
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

              {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === data.totalPages ||
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
                        className={`cursor-pointer px-3 py-1 rounded border transition-colors ${
                          currentPage === page
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-700 border-gray-300"
                        }`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  </React.Fragment>
                ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(Math.min(data.totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === data.totalPages
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
        informId={selectedInquiry?.informId}
      />
    </div>
  );
};

export default AdminInquiryManagement;
