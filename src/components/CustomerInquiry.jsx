import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, USER } from "../../configs/host-config";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const PAGE_SIZE = 5;

const answerFilterToParam = (filter) => {
  if (filter === "answered") return "y";
  if (filter === "unanswered") return "f";
  return "y"; // 기본값: 응답
};

const sortOrderToParam = (order) => {
  if (order === "latest") return "desc";
  if (order === "oldest") return "asc";
  return "desc";
};

// 날짜 포맷 함수 추가
function formatDateTime(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

const CustomerInquiry = () => {
  const [answerFilter, setAnswerFilter] = useState("answered"); // 기본값: answered(응답)
  const [sortOrder, setSortOrder] = useState("latest"); // latest | oldest
  const [currentPage, setCurrentPage] = useState(1);
  const [inquiries, setInquiries] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createContent, setCreateContent] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editInformId, setEditInformId] = useState(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      setLoading(true);
      setError("");
      try {
        const answerParam = answerFilterToParam(answerFilter);
        const sortParam = sortOrderToParam(sortOrder);
        const url = `${API_BASE_URL}${USER}/inform/list/${answerParam}`;
        const params = {
          page: currentPage - 1,
          size: PAGE_SIZE,
          sort: sortParam,
        };
        const res = await axiosInstance.get(url, { params });
        console.log(res);
        setInquiries(res.data.result.content || []);
        setTotalPages(res.data.result.totalPages || 1);
      } catch (err) {
        setError("목록을 불러오지 못했습니다.");
        setInquiries([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
    // eslint-disable-next-line
  }, [answerFilter, sortOrder, currentPage]);

  // 상세 조회 핸들러
  const handleItemClick = async (informId) => {
    setDetailLoading(true);
    setDetailError("");
    setDetailModalOpen(true);
    try {
      const url = `${API_BASE_URL}${USER}/inform/detail/${informId}`;
      const res = await axiosInstance.get(url);
      setDetailData(res.data.result);
      console.log("상세조회 응답:", res.data);
    } catch (err) {
      setDetailError("상세 정보를 불러오지 못했습니다.");
      setDetailData(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // 생성 핸들러
  const handleCreate = async () => {
    if (!createTitle.trim() || !createContent.trim()) {
      setCreateError("제목과 내용을 모두 입력해주세요.");
      return;
    }
    if (createTitle.trim().length < 7) {
      alert("제목은 7자 이상 입력해야 합니다.");
      return;
    }
    if (createContent.trim().length < 10) {
      alert("내용은 10자 이상 입력해야 합니다.");
      return;
    }
    setCreateLoading(true);
    setCreateError("");
    try {
      const url = `${API_BASE_URL}${USER}/inform/create`;
      const body = { title: createTitle, content: createContent };
      await axiosInstance.post(url, body);
      setCreateModalOpen(false);
      setCreateTitle("");
      setCreateContent("");
      // 목록 새로고침
      setCurrentPage(1);
    } catch (err) {
      setCreateError("등록에 실패했습니다.");
    } finally {
      setCreateLoading(false);
    }
  };

  // 수정 모달 열기
  const openEditModal = () => {
    if (!detailData) return;
    setEditInformId(detailData.informId);
    setEditTitle(detailData.title || "");
    setEditContent(detailData.content || "");
    setEditError("");
    setEditModalOpen(true);
  };

  // 수정 핸들러
  const handleEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      setEditError("제목과 내용을 모두 입력해주세요.");
      return;
    }
    if (editTitle.trim().length < 7) {
      alert("제목은 7자 이상 입력해야 합니다.");
      return;
    }
    if (editContent.trim().length < 10) {
      alert("내용은 10자 이상 입력해야 합니다.");
      return;
    }
    setEditLoading(true);
    setEditError("");
    try {
      const url = `${API_BASE_URL}${USER}/inform/modify`;
      const body = {
        informId: editInformId,
        title: editTitle,
        content: editContent,
      };
      await axiosInstance.patch(url, body);
      setEditModalOpen(false);
      setDetailModalOpen(false);
      setEditTitle("");
      setEditContent("");
      setEditInformId(null);
      // 목록 새로고침
      setCurrentPage(1);
    } catch (err) {
      setEditError("수정에 실패했습니다.");
    } finally {
      setEditLoading(false);
    }
  };

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!detailData || !detailData.informId) return;
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    try {
      const url = `${API_BASE_URL}${USER}/inform/${detailData.informId}`;
      await axiosInstance.delete(url);
      setDetailModalOpen(false);
      setCurrentPage(1);
    } catch (err) {
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 py-4">
      <Card className="w-full max-w-4xl shadow-lg border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-100 to-pink-100 border-b border-orange-200 rounded-t-lg py-4 px-8 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-800 text-center flex-1 text-left">
            고객문의
          </CardTitle>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold ml-4"
            onClick={() => setCreateModalOpen(true)}
          >
            생성
          </Button>
        </CardHeader>
        <CardContent className="p-8">
          {/* 정렬/필터 */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-2 mb-4">
            <div className="flex gap-2">
              <Select
                value={answerFilter}
                onValueChange={(v) => {
                  setAnswerFilter(v);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-32 h-9 text-sm">
                  <SelectValue placeholder="응답여부" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="answered">응답</SelectItem>
                  <SelectItem value="unanswered">미응답</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortOrder}
                onValueChange={(v) => {
                  setSortOrder(v);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-32 h-9 text-sm">
                  <SelectValue placeholder="정렬" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">최신순</SelectItem>
                  <SelectItem value="oldest">오래된순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* 문의 리스트 */}
          <div className="space-y-2 mb-4">
            {loading ? (
              <div className="text-center text-gray-400 py-6">
                불러오는 중...
              </div>
            ) : error ? (
              <div className="text-center text-red-400 py-6">{error}</div>
            ) : inquiries.length === 0 ? (
              <div className="text-center text-gray-400 py-6">
                문의가 없습니다.
              </div>
            ) : (
              inquiries.map((item) => (
                <Card
                  key={item.id}
                  className="border border-orange-200 rounded-md hover:shadow transition-shadow cursor-pointer bg-white"
                  onClick={() => handleItemClick(item.informId)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3">
                    <div className="flex items-center justify-center text-sm font-medium text-gray-800">
                      {item.title || "문의 제목"}
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      {item.answered === true
                        ? "응답"
                        : item.answered === false
                        ? "미응답"
                        : "-"}
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      {formatDateTime(item.date || item.updateAt)}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
          {/* 페이징 */}
          <Pagination>
            <PaginationContent>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className="min-w-[32px] h-8 text-sm"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>

      {/* 생성 모달 */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-lg p-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 border-0 shadow-none">
          <div className="rounded-lg shadow-lg border border-orange-200 bg-white overflow-hidden">
            <DialogHeader className="bg-gradient-to-r from-orange-100 to-pink-100 border-b border-orange-200 px-6 py-4">
              <DialogTitle className="text-lg font-bold text-gray-800">
                문의 등록
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  제목
                </label>
                <Input
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className="bg-orange-50 focus:bg-white"
                  maxLength={100}
                  disabled={createLoading}
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  내용
                </label>
                <Textarea
                  value={createContent}
                  onChange={(e) => setCreateContent(e.target.value)}
                  placeholder="내용을 입력하세요"
                  rows={6}
                  className="bg-orange-50 focus:bg-white"
                  maxLength={1000}
                  disabled={createLoading}
                />
              </div>
              {createError && (
                <div className="text-red-500 text-sm">{createError}</div>
              )}
              <div className="flex justify-end mt-4">
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6"
                  onClick={handleCreate}
                  disabled={createLoading}
                >
                  {createLoading ? "등록 중..." : "등록하기"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 수정 모달 */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-lg p-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 border-0 shadow-none">
          <div className="rounded-lg shadow-lg border border-orange-200 bg-white overflow-hidden">
            <DialogHeader className="bg-gradient-to-r from-orange-100 to-pink-100 border-b border-orange-200 px-6 py-4">
              <DialogTitle className="text-lg font-bold text-gray-800">
                문의 수정
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  제목
                </label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className="bg-orange-50 focus:bg-white"
                  maxLength={100}
                  disabled={editLoading}
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  내용
                </label>
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="내용을 입력하세요"
                  rows={6}
                  className="bg-orange-50 focus:bg-white"
                  maxLength={1000}
                  disabled={editLoading}
                />
              </div>
              {editError && (
                <div className="text-red-500 text-sm">{editError}</div>
              )}
              <div className="flex justify-end mt-4">
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6"
                  onClick={handleEdit}
                  disabled={editLoading}
                >
                  {editLoading ? "수정 중..." : "수정하기"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 상세 모달 */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-lg p-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 border-0 shadow-none">
          <div className="rounded-lg shadow-lg border border-orange-200 bg-white overflow-hidden">
            <DialogHeader className="bg-gradient-to-r from-orange-100 to-pink-100 border-b border-orange-200 px-6 py-4">
              <DialogTitle className="text-lg font-bold text-gray-800">
                문의 상세 정보
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-4">
              {detailLoading ? (
                <div className="text-center text-gray-400 py-6">
                  불러오는 중...
                </div>
              ) : detailError ? (
                <div className="text-center text-red-400 py-6">
                  {detailError}
                </div>
              ) : detailData ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700">제목</span>
                    <span className="text-base font-medium text-gray-900">
                      {detailData.title}
                    </span>
                  </div>
                  <div className="border-t border-orange-100 my-2" />
                  <div>
                    <span className="font-semibold text-gray-700">내용</span>
                    <div className="mt-1 text-gray-800 whitespace-pre-line">
                      {detailData.content}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="font-semibold text-gray-700">
                        작성일
                      </span>
                      <span className="ml-2 text-gray-600">
                        {formatDateTime(detailData.updateAt)}
                      </span>
                    </div>
                    <Badge
                      variant={
                        detailData.answered === true ? "default" : "outline"
                      }
                      className={
                        detailData.answered === true
                          ? "bg-green-100 text-green-700 border-green-300"
                          : "bg-gray-100 text-gray-600 border-gray-300"
                      }
                    >
                      {detailData.answered === true ? "응답" : "미응답"}
                    </Badge>
                  </div>
                  {detailData.answered === true && (
                    <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200">
                      <div className="mb-2">
                        <span className="font-semibold text-gray-700">
                          관리자
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">
                          답변 내용
                        </span>
                        <div className="mt-1 text-gray-800 whitespace-pre-line">
                          {detailData.reply ?? "-"}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* 수정하기 버튼 */}
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6"
                      onClick={openEditModal}
                    >
                      수정하기
                    </Button>
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6"
                      onClick={handleDelete}
                    >
                      삭제
                    </Button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerInquiry;
