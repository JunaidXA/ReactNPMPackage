import React, { useEffect, useMemo, useRef } from "react";
import { MarkdownTextRendererProps } from "../types";
import JoditEditor from "jodit-react";
import { cn } from "@/lib/utils";

export interface WysiwygEditorProps {
  name?: string;
  label?: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  maxLength?: number;
  error?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  iconClassName?: string;
  subTitle?: string;
  rows?: number;
}

// comment here
const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  name,
  label,
  value,
  onChange,
  placeholder,
  required,
  readOnly,
  disabled,
  maxLength,
  error,
  className,
  labelClassName,
  subTitle,
  rows = 5,
}) => {
  const textareaRef = useRef(null);

  const config = useMemo(
    () => ({
      readonly: readOnly || disabled || false,
      placeholder: placeholder || "",
      height: rows * 24 + 50,
      padding: "8px 11px",
      limitChars: maxLength || undefined,
      showCharsCounter: !!maxLength,
      useSearch: false,
      // toolbarButtonSize: "small",
      disablePlugins: "add-new-line",
      showWordsCounter: false,
      showXPathInStatusbar: false,
      defaultActionOnPaste: "insert_only_text" as const,
      askBeforePasteFromWord: false,
      askBeforePasteHTML: false,
      processPasteHTML: true,
      buttons: "bold,italic,underline",
    }),
    [readOnly, disabled, placeholder, rows, maxLength]
  );

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-text-primary font-medium text-md mb-2 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div
        className={cn("rounded-[5.6px]", error ? "border border-red-500" : "")}
      >
        <JoditEditor
          ref={textareaRef}
          value={value}
          config={config}
          className={cn(readOnly && "pointer-events-none")}
          onChange={(newContent) => onChange(newContent)}
        />
      </div>
      {subTitle && <div className="text-xs text-gray-700">{subTitle}</div>}
      {error && <p className="text-[12px] text-error-maindark mt-1">{error}</p>}
    </div>
  );
};

const MarkdownTextRenderer: React.FC<MarkdownTextRendererProps> = ({
  text,
  highlight = "",
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, []);

  const escapeRegExp = (string: string) =>
    string?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const getHighlightedMessage = (html: string, highlightText: string) => {
    if (!highlightText.trim()) return html;

    const escapedHighlight = escapeRegExp(highlightText);

    // Avoid highlighting inside HTML tags/attributes
    return html.replace(
      new RegExp(`(>[^<]*)(${escapedHighlight})([^<]*<)`, "gi"),
      (_match, before, highlightPart, after) =>
        `${before}<mark>${highlightPart}</mark>${after}`
    );
  };

  const finalHtml = getHighlightedMessage(text, highlight);

  return (
    <div ref={scrollRef} dangerouslySetInnerHTML={{ __html: finalHtml }} />
  );
};

export { WysiwygEditor, MarkdownTextRenderer };
