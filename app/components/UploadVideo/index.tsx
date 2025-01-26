"use client";

import { ChangeEvent, DragEvent } from "react";
import styles from "./styles.module.css";
import { cn } from "@/lib/utils";

interface Props {
  onUpload: (file: File) => void;
}

export default function UploadVideo({ onUpload }: Props) {
  const dropHandler = (ev: DragEvent<HTMLLabelElement>) => {
    // TODO: perform validation if we support file's extension
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      const item = ev.dataTransfer.items[0]
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (!file) throw Error("No file returned by getAsFile");
        onUpload(file)
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      onUpload(ev.dataTransfer.files[0])
    }
  }

  const onUploadVideo = (event: ChangeEvent<HTMLInputElement>) => {
    // TODO: perform validation if we support file's extension
    const { files } = event.target;
    if (!files) return;
    onUpload(files[0]);
  };

  return (
    <div>
      <label
        onDrop={dropHandler}
        onDragOver={e => e.preventDefault()}
        className={cn(
          styles.dropZone,
          'h-full',
          'w-full',
          'border-dashed',
          'border-current',
          'border-4',
          'rounded-lg',
          'flex',
          'items-center',
          'justify-center',
          'cursor-pointer',
        )}
        htmlFor="input"
      >
        <p>
          Click to upload a video or drag a file here!
        </p>
      </label>
      <input
        className="hidden"
        type="file"
        id="input"
        name="input_video"
        onChange={onUploadVideo}
      />
    </div>
  );
}
