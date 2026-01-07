import { acceptMap } from "@/helper";
import React, { useState, useCallback, useEffect } from "react";
import { useDropzone, Accept, FileRejection } from "react-dropzone";
import { VideoFile } from "../svg";
import { cn } from "@/lib/utils";
import { SingleDropzoneProps } from "../types";

export const SingleDropzone: React.FC<SingleDropzoneProps> = ({
  onFileSelect,
  acceptedFiles = ["image"],
  maxFileSizeMb = 5,
  multiple = false,
  uploadIcon,
  titleClassName,
  subTitleClassName,
  title,
  subTitle,
  files = [],
  setFiles,
  maxFiles,
}) => {
  const [previews, setPreviews] = useState<(string | null)[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // Comprehensive accept map for all major MIME types
  const accept: Accept = acceptedFiles?.reduce((acc, type) => {
    if (acceptMap[type]) {
      acceptMap[type].forEach((mime) => {
        acc[mime] = [];
      });
    }
    return acc;
  }, {} as Accept);

  const onDrop = useCallback(
    (acceptedFilesdrop: File[], fileRejections: FileRejection[]) => {
      setErrors([]); // Clear previous errors
      const validFiles = acceptedFilesdrop.filter(
        (file) => file.size <= maxFileSizeMb * 1024 * 1024
      );
      if (fileRejections.length > 0) {
        const newErrors = fileRejections.flatMap((rejection) => {
          return rejection.errors.map((error) => {
            if (error.code === "file-too-large") {
              return `File "${rejection.file.name}" exceeds the ${maxFileSizeMb}MB size limit.`;
            } else if (error.code === "file-invalid-type") {
              return `File "${
                rejection.file.name
              }" is of an invalid type. Only ${acceptedFiles.join(
                ", "
              )} are allowed.`;
            }
            return `Error with file "${rejection.file.name}": ${error.message}`;
          });
        });
        setErrors(newErrors);
      }
      if (validFiles.length > 0) {
        const newFiles = multiple ? [...files, ...validFiles] : [validFiles[0]];
        setFiles && setFiles(newFiles);
        onFileSelect(newFiles);

        const newPreviews = validFiles.map((file) => {
          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise<string>((resolve) => {
              reader.onloadend = () => resolve(reader.result as string);
            });
          }
          return Promise.resolve(null);
        });
        Promise.all(newPreviews).then((results) => {
          setPreviews(multiple ? [...previews, ...results] : [results[0]]);
        });
      } else if (acceptedFiles.length === 0 && fileRejections.length > 0) {
        setFiles && setFiles([]);
        onFileSelect(null);
      }
    },
    [
      onFileSelect,
      maxFileSizeMb,
      multiple,
      files,
      setFiles,
      previews,
      acceptedFiles,
    ]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    maxSize: maxFileSizeMb * 1024 * 1024,
    multiple: true,
  });

  const handleDelete = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles && setFiles(newFiles);
    setPreviews(newPreviews);
    setErrors([]);
    onFileSelect(newFiles.length > 0 ? newFiles : null);
  };

  function formatFileSize(bytes: number) {
    if (bytes === 1) return "1 byte";
    if (bytes < 1024) return `${bytes} bytes`;

    const units = ["KB", "MB", "GB", "TB", "PB"];
    let i = -1;
    do {
      bytes = bytes / 1024;
      i++;
    } while (bytes >= 1024 && i < units.length - 1);

    return `${bytes.toFixed(2)} ${units[i]}`;
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType.split("/")[0]) {
      case "video":
        return (
          <div className="w-8 h-8 flex justify-center items-center bg-yellow-500/10 text-yellow-500 rounded-sm">
            <VideoFile />
          </div>
        );
      case "audio":
        return (
          <div className="w-8 h-8 flex justify-center items-center bg-blue-500/10 rounded-sm text-blue-500">
            <i className="ti ti-music"></i>
          </div>
        );

      case "text":
        return (
          <div className="w-8 h-8 flex justify-center items-center bg-gray-500/10 rounded-sm text-gray-500">
            <i className="ti ti-file-type-txt"></i>
          </div>
        );
      case "application":
        return (
          <div className="w-8 h-8 flex justify-center items-center bg-orange-500/10 rounded-sm text-orange-500">
            <i className="ti ti-apps"></i>
          </div>
        );
      case "pdf":
        return (
          <div className="w-8 h-8 flex justify-center items-center bg-red-500/10 rounded-sm text-red-500">
            <i className="ti ti-file-type-pdf"></i>
          </div>
        );
      case "word":
        return (
          <div className="w-8 h-8 flex justify-center items-center bg-purple-500/10 rounded-sm text-purple-500">
            <i className="ti ti-file-word"></i>
          </div>
        );
      case "excel":
        return (
          <div className="w-8 h-8 flex justify-center items-center bg-green-500/10 rounded-sm text-green-500">
            <i className="ti ti-file-type-xls"></i>
          </div>
        );
      case "powerpoint":
        return (
          <div className="w-8 h-8 flex justify-center items-center bg-orange-500/10 rounded-sm text-orange-500">
            <i className="ti ti-file-type-ppt"></i>
          </div>
        );
      case "zip":
        return (
          <div className="w-8 h-8 flex justify-center items-center bg-teal-500/10 rounded-sm text-teal-500">
            <i className="ti ti-file-type-xls"></i>
          </div>
        );
      case "json":
        return (
          <div className="w-8 h-8 flex justify-center items-center bg-gray-500/10 rounded-sm text-gray-500">
            <i className="ti ti-json"></i>
          </div>
        );
      case "xml":
        return (
          <div className="w-8 h-8 flex justify-center items-center bg-lime-500/10 rounded-sm text-lime-500">
            <i className="ti ti-file-type-xml"></i>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 flex justify-center items-center bg-gray-500/10 rounded-sm text-gray-500">
            <i className="ti ti-file-type-jpg"></i>
          </div>
        );
    }
  };

  useEffect(() => {
    if (files) {
      const newPreviews = files.map((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          return new Promise<string>((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
          });
        }
        return Promise.resolve(null);
      });
      Promise.all(newPreviews).then((results) => setPreviews(results));
    }
  }, [files]);

  return (
    <section className={cn("container mx-auto min-h-10 h-auto")}>
      <div
        {...getRootProps({
          className: cn(
            "dropzone border-2 border-dashed cursor-pointer border-gray-300 p-6 text-center rounded-lg hover:bg-gray-100 transition-colors",
            files.length === maxFiles ? "pointer-events-none opacity-50" : ""
          ),
        })}
      >
        <input {...getInputProps()} />
        {files.length > 0 && !multiple ? (
          previews[0] ? (
            <img
              src={previews[0]}
              alt={files[0].name}
              className="max-h-48 mx-auto"
            />
          ) : (
            <div className="flex flex-col items-center">
              {getFileIcon(files[0].type)}
              <p className="text-gray-700 mt-2">
                {files[0].name} - {formatFileSize(files[0].size)}
              </p>
            </div>
          )
        ) : (
          <>
            <div className="flex justify-center mb-2">
              {uploadIcon ?? (
                <span className="inline-flex items-center justify-center w-7 h-7 bg-primary text-white rounded-sm">
                  <i className="ti ti-upload"></i>
                </span>
              )}
            </div>
            <p
              className={cn(
                "text-text-primary/80 text-md font-bold",
                titleClassName
              )}
            >
              {title ?? "Drop files here"}
            </p>
            <p
              className={cn("text-text-primary/50 text-xs ", subTitleClassName)}
            >
              {subTitle ??
                "Browse and choose the files you want to upload from your computer"}
            </p>
          </>
        )}
      </div>
      {errors.length > 0 && (
        <div className="mt-2 text-[12px] text-red-500">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
      {multiple && files.length > 0 && (
        <ul className="mt-4 space-y-4">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center space-x-4 p-2 border rounded-lg"
            >
              {previews[index] ? (
                <img
                  src={previews[index]}
                  alt={file.name}
                  className="w-8 h-8 object-cover rounded-sm"
                />
              ) : (
                getFileIcon(file.type)
              )}
              <div className="flex-1">
                <p className="text-gray-700 text-sm">
                  {file.name} - {formatFileSize(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="text-red-500 hover:text-red-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
