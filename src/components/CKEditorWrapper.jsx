import React, { useState, useEffect, useMemo, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Alignment,
  AutoImage,
  AutoLink,
  Autosave,
  BlockQuote,
  Bold,
  Essentials,
  Heading,
  ImageBlock,
  ImageCaption,
  ImageEditing,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  ImageUtils,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  Paragraph,
  SimpleUploadAdapter,
  Strikethrough,
  TodoList,
  Underline,
} from "ckeditor5";
import translations from "ckeditor5/translations/ko.js";
import "ckeditor5/ckeditor5.css";

/**
 * 공통 CKEditor 컴포넌트
 * @param {Object} props
 * @param {string} props.value - 에디터 내용
 * @param {Function} props.onChange - 내용 변경 시 호출되는 함수
 * @param {string} props.boardType - 게시판 타입 (예: 'animal', 'rescue', 'community')
 * @param {string} props.placeholder - 플레이스홀더 텍스트
 * @param {number} props.minHeight - 최소 높이 (기본값: 200)
 * @param {number} props.maxHeight - 최대 높이 (기본값: 400)
 * @param {boolean} props.readOnly - 읽기 전용 모드 (기본값: false)
 * @param {boolean} props.enableImageUpload - 이미지 업로드 활성화 (기본값: false)
 */
const CKEditorWrapper = ({
  value = "",
  onChange,
  boardType = "animal",
  placeholder = "내용을 입력하세요...",
  minHeight = 200,
  maxHeight = 400,
  readOnly = false,
}) => {
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const wrapperRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  // 에디터 높이 고정 함수 + MutationObserver
  const applyFixedHeight = (editor) => {
    const editable = editor.ui.getEditableElement();
    if (editable) {
      editable.style.height = `${minHeight}px`;
      editable.style.minHeight = `${minHeight}px`;
      editable.style.maxHeight = `${maxHeight}px`;
      editable.style.overflowY = "auto";
      editable.style.resize = "none";
    }
    const main = editable.closest(".ck-editor__main");
    if (main) {
      main.style.height = `${minHeight}px`;
    }
    // MutationObserver로 style 변경 감지 시 height 재적용
    if (editable && !observerRef.current) {
      observerRef.current = new MutationObserver(() => {
        editable.style.height = `${minHeight}px`;
        editable.style.minHeight = `${minHeight}px`;
        editable.style.maxHeight = `${maxHeight}px`;
      });
      observerRef.current.observe(editable, {
        attributes: true,
        attributeFilter: ["style"],
      });
    }
  };

  useEffect(() => {
    // 언마운트 시 observer 해제
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  const { editorConfig } = useMemo(() => {
    if (!isLayoutReady) {
      return {};
    }

    return {
      editorConfig: {
        toolbar: {
          items: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "|",
            "link",
            "insertImage",
            "blockQuote",
            "|",
            "alignment",
            "|",
            "bulletedList",
            "numberedList",
            "todoList",
            "outdent",
            "indent",
          ],
          shouldNotGroupWhenFull: true,
        },
        plugins: [
          Alignment,
          AutoImage,
          AutoLink,
          Autosave,
          BlockQuote,
          Bold,
          Essentials,
          Heading,
          ImageBlock,
          ImageCaption,
          ImageEditing,
          ImageInline,
          ImageInsert,
          ImageInsertViaUrl,
          ImageResize,
          ImageStyle,
          ImageTextAlternative,
          ImageToolbar,
          ImageUpload,
          ImageUtils,
          SimpleUploadAdapter,
          Indent,
          IndentBlock,
          Italic,
          Link,
          List,
          Paragraph,
          Strikethrough,
          TodoList,
          Underline,
        ],
        heading: {
          options: [
            {
              model: "paragraph",
              title: "Paragraph",
              class: "ck-heading_paragraph",
            },
            {
              model: "heading1",
              view: "h1",
              title: "Heading 1",
              class: "ck-heading_heading1",
            },
            {
              model: "heading2",
              view: "h2",
              title: "Heading 2",
              class: "ck-heading_heading2",
            },
            {
              model: "heading3",
              view: "h3",
              title: "Heading 3",
              class: "ck-heading_heading3",
            },
            {
              model: "heading4",
              view: "h4",
              title: "Heading 4",
              class: "ck-heading_heading4",
            },
            {
              model: "heading5",
              view: "h5",
              title: "Heading 5",
              class: "ck-heading_heading5",
            },
            {
              model: "heading6",
              view: "h6",
              title: "Heading 6",
              class: "ck-heading_heading6",
            },
          ],
        },
        image: {
          toolbar: [
            "toggleImageCaption",
            "imageTextAlternative",
            "|",
            "imageStyle:inline",
            "imageStyle:wrapText",
            "imageStyle:breakText",
            "|",
            "resizeImage",
          ],
        },
        language: "ko",
        licenseKey: "GPL",
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: "https://",
          decorators: {
            toggleDownloadable: {
              mode: "manual",
              label: "Downloadable",
              attributes: {
                download: "file",
              },
            },
          },
        },
        placeholder: placeholder,
        translations: [translations],
        readOnly: readOnly,
        height: `${minHeight}px`,
      },
    };
  }, [isLayoutReady, placeholder, readOnly]);

  // 커스텀 업로드 어댑터 (Spring Boot API와 연동)
  const CustomUploadAdapter = (loader) => {
    return {
      upload() {
        return loader.file.then((file) => {
          const formData = new FormData();
          formData.append("upload", file);
          formData.append("boardType", boardType);

          const token = localStorage.getItem("token");
          console.log("토큰 확인:", token ? "토큰 있음" : "토큰 없음");

          return fetch(
            "https://api.nyangmong.com/main-service/editor/upload-image",
            {
              method: "POST",
              body: formData,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
            .then((response) => {
              console.log("응답 상태:", response.status, response.statusText);
              if (!response.ok) {
                return response.text().then((text) => {
                  console.error("업로드 실패 상세:", text);
                  throw new Error(
                    `Upload failed: ${response.status} ${response.statusText}`
                  );
                });
              }
              return response.json();
            })
            .then((data) => {
              console.log("업로드 응답:", data);
              return { default: data.url };
            });
        });
      },
    };
  };

  return (
    <div ref={wrapperRef} className="ck-editor-wrapper">
      {editorConfig && (
        <CKEditor
          key={`ckeditor-${readOnly}`} // readOnly 상태가 변경될 때마다 에디터 재생성
          editor={ClassicEditor}
          config={{
            ...editorConfig,
            extraPlugins: [
              function (editor) {
                editor.plugins.get("FileRepository").createUploadAdapter = (
                  loader
                ) => {
                  return CustomUploadAdapter(loader);
                };
              },
            ],
          }}
          data={value}
          onReady={(editor) => {
            applyFixedHeight(editor);
            console.log("CKEditor 초기 readOnly 설정:", readOnly);
          }}
          onFocus={(_, editor) => applyFixedHeight(editor)}
          onBlur={(_, editor) => applyFixedHeight(editor)}
          onChange={(event, editor) => {
            const data = editor.getData();
            onChange && onChange(data);
          }}
        />
      )}
    </div>
  );
};

export default CKEditorWrapper;
