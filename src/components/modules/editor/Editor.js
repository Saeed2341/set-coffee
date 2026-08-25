/**
 * This configuration was generated using the CKEditor 5 Builder.
 * Modified to sync with external value changes.
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import translations from "ckeditor5/translations/fa.js";
import {
  ClassicEditor,
  Autosave,
  Essentials,
  Paragraph,
  Autoformat,
  TextTransformation,
  ImageToolbar,
  ImageUpload,
  ImageInsertViaUrl,
  AutoImage,
  ImageTextAlternative,
  ImageStyle,
  Mention,
  PictureEditing,
  ImageInsert,
  PasteFromOffice,
  Bold,
  Underline,
  Italic,
  Heading,
  Link,
  AutoLink,
  BlockQuote,
  Indent,
  IndentBlock,
  ImageInline,
  ImageBlock,
  ImageResize,
  List,
} from "ckeditor5";
// اگر از Uploadcare استفاده نمی‌کنید، این دو خط را کامنت کنید
// import { Uploadcare, UploadcareImageEdit } from "ckeditor5-premium-features";
// import "ckeditor5-premium-features/ckeditor5-premium-features.css";

import "ckeditor5/ckeditor5.css";

// ===== استفاده از لایسنس GPL برای استفاده رایگان =====
const LICENSE_KEY = "GPL";

const Editor = ({ value = "", onChange }) => {
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const editorRef = useRef(null); // ← ref برای ذخیره‌ی instance ادیتور

  useEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  // ===== همگام‌سازی value با ادیتور =====
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const currentData = editor.getData();
    // فقط اگر مقدار جدید با مقدار فعلی تفاوت داشت، به‌روز کن
    if (currentData !== value) {
      editor.setData(value);
    }
  }, [value]); // ← هر بار value تغییر کند، این useEffect اجرا می‌شود

  const editorConfig = useMemo(() => {
    if (!isLayoutReady) {
      return null;
    }

    return {
      language: "fa",
      translations: [translations],
      direction: "rtl",

      // ===== محتوای اولیه =====
      // root: {
      //   placeholder: "لطفا متن خود را تایپ کنید",
      //   initialData: "<p> </p>", // فضای خالی برای جلوگیری از لیست پیش‌فرض
      // },
      placeholder: "لطفا متن خود را تایپ کنید",
      // ===== نوار ابزار =====
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
          "|",
          "link",
          "insertImage",
          "blockQuote",
          "|",
          "bulletedList",
          "numberedList",
          "outdent",
          "indent",
        ],
        shouldNotGroupWhenFull: false,
      },

      // ===== پلاگین‌ها (حذف Uploadcare و Premium) =====
      plugins: [
        Autoformat,
        AutoImage,
        AutoLink,
        Autosave,
        BlockQuote,
        Bold,
        Essentials,
        Heading,
        // ImageBlock,
        // ImageInline,
        ImageInsert,
        ImageInsertViaUrl,
        ImageResize,
        ImageStyle,
        ImageTextAlternative,
        ImageToolbar,
        ImageUpload,
        Indent,
        IndentBlock,
        Italic,
        Link,
        List,
        Mention,
        Paragraph,
        PasteFromOffice,
        PictureEditing,
        TextTransformation,
        Underline,
        // Uploadcare,
        // UploadcareImageEdit,
      ],

      // ===== لایسنس =====
      licenseKey: LICENSE_KEY,

      // ===== تنظیمات عنوان‌ها =====
      heading: {
        options: [
          {
            model: "paragraph",
            title: "پاراگراف",
            class: "ck-heading_paragraph",
          },
          {
            model: "heading1",
            view: "h1",
            title: "تیتر ۱",
            class: "ck-heading_heading1",
          },
          {
            model: "heading2",
            view: "h2",
            title: "تیتر ۲",
            class: "ck-heading_heading2",
          },
          {
            model: "heading3",
            view: "h3",
            title: "تیتر ۳",
            class: "ck-heading_heading3",
          },
        ],
      },

      // ===== تنظیمات تصویر =====
      image: {
        toolbar: [
          "imageTextAlternative",
          "|",
          "imageStyle:inline",
          "imageStyle:wrapText",
          "imageStyle:breakText",
          "|",
          "resizeImage",
        ],
      },

      // ===== تنظیمات لینک =====
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: "https://",
        decorators: {
          toggleDownloadable: {
            mode: "manual",
            label: "قابل دانلود",
            attributes: {
              download: "file",
            },
          },
        },
      },

      // ===== تنظیمات منشن =====
      mention: {
        feeds: [
          {
            marker: "@",
            feed: [],
          },
        ],
      },
    };
  }, [isLayoutReady]);

  if (!isLayoutReady || !editorConfig) {
    return <p style={{ padding: "20px" }}>در حال بارگذاری ادیتور...</p>;
  }

  return (
    <div className="main-container" style={{ width: "100%" }}>
      <div
        className="editor-container editor-container_classic-editor"
        style={{ width: "100%" }}
      >
        <div className="editor-container__editor" style={{ width: "100%" }}>
          <CKEditor
            editor={ClassicEditor}
            data={value}
            onChange={(event, editor) => {
              const data = editor.getData();
              onChange(data);
            }}
            onReady={(editor) => {
              editorRef.current = editor;
            }}
            config={editorConfig}
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
