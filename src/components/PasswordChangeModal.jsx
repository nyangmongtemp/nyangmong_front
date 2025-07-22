import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "../../configs/axios-config";
import { API_BASE_URL, ADMIN } from "../../configs/host-config";

const API_BASE = "/admin"; // 실제 API prefix에 맞게 수정 필요

const PasswordChangeModal = ({ open, onOpenChange, email, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState("");

  // 세션스토리지에서 토큰 가져오기
  const token = sessionStorage.getItem("adminToken");

  // 인증번호 발송
  const sendCode = async () => {
    setLoading(true);
    setError("");
    setHint("");
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await axiosInstance.get(
        `${API_BASE_URL}${ADMIN}/modify-password-req`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSent(true);
      setError("");
      if (res.data.statusMessage) {
        setHint(
          res.data.statusMessage +
            (res.data.result ? ` (개발용 인증코드: ${res.data.result})` : "")
        );
      } else {
        setHint("인증번호가 발송되었습니다.");
      }
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          "인증번호 발송에 실패했습니다. 다시 시도해주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  // 인증번호 검증
  const verifyCode = async () => {
    if (!code) {
      setError("인증번호를 입력하세요.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axiosInstance.patch(
        `${API_BASE_URL}${ADMIN}/verify-new-password`,
        { authCode: code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStep(2);
      setError("");
    } catch (e) {
      setError(e?.response?.data?.message || "인증번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 비밀번호 변경
  const changePw = async () => {
    if (!newPw || !newPw2) {
      setError("새 비밀번호를 모두 입력하세요.");
      return;
    }
    if (newPw !== newPw2) {
      setError("비밀번호를 다시 입력해주세요.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axiosInstance.patch(
        `${API_BASE_URL}${ADMIN}/modify-password`,
        { password: newPw },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      sessionStorage.clear();
      window.location.href = "/";
      onSuccess && onSuccess();
      onOpenChange(false);
    } catch (e) {
      setError(e?.response?.data?.message || "비밀번호 변경에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>비밀번호 변경</DialogTitle>
          <DialogDescription>
            이메일로 인증번호를 발송합니다. 인증번호를 입력 후 비밀번호를
            변경하세요.
          </DialogDescription>
        </DialogHeader>
        {step === 1 && (
          <div className="space-y-4">
            <Input value={email} readOnly className="bg-gray-100" />
            <Button onClick={sendCode} disabled={sent || loading} type="button">
              인증번호 발송
            </Button>
            {sent && (
              <>
                <Input
                  placeholder="인증번호 입력"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={loading}
                />
                <Button onClick={verifyCode} type="button" disabled={loading}>
                  확인
                </Button>
              </>
            )}
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {hint && <div className="text-green-600 text-sm">{hint}</div>}
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <Input
              placeholder="새 비밀번호 입력"
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              disabled={loading}
            />
            <Input
              placeholder="새 비밀번호 확인"
              type="password"
              value={newPw2}
              onChange={(e) => setNewPw2(e.target.value)}
              disabled={loading}
            />
            <Button onClick={changePw} type="button" disabled={loading}>
              확인
            </Button>
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordChangeModal;
