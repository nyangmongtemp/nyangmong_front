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

const EmailChangeModal = ({ open, onOpenChange, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [newEmail, setNewEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState("");

  // 세션스토리지에서 토큰 가져오기
  const token = sessionStorage.getItem("adminToken");

  // 인증번호 발송
  const sendCode = async () => {
    if (!newEmail) {
      setError("새 이메일을 입력하세요.");
      return;
    }
    setLoading(true);
    setError("");
    setHint("");
    try {
      const res = await axiosInstance.get(
        `${API_BASE_URL}${ADMIN}/modify-email`,
        {
          params: { newEmail },
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

  // 인증번호 검증 및 이메일 변경
  const verifyCode = async () => {
    if (!code) {
      setError("인증번호를 입력하세요.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.patch(
        `${API_BASE_URL}${ADMIN}/verify-new-email`,
        { email: newEmail, authCode: code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // 성공 시 isFirst를 false로 저장
      sessionStorage.setItem("adminIsFirst", "false");
      localStorage.setItem("admin_isFirst", "false");
      sessionStorage.removeItem("forceEmailChange");
      // 성공 시 로그아웃 및 메인 이동
      sessionStorage.clear();
      window.location.href = "/admin";
      onSuccess && onSuccess(newEmail);
      onOpenChange(false);
    } catch (e) {
      setError(e?.response?.data?.message || "인증번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>이메일 변경</DialogTitle>
          <DialogDescription>
            새로운 이메일로 인증번호를 발송합니다. 인증번호를 입력해 주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="새 이메일 입력"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            disabled={sent || loading}
          />
          <Button
            onClick={sendCode}
            disabled={sent || !newEmail || loading}
            type="button"
          >
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
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailChangeModal;
