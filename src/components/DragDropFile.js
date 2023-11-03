import React, { useEffect } from "react";
import "./DragDropFile.css";
import { observer } from "mobx-react-lite";
import dragFileStore from "../stores/DragFileStore";
import * as XLSX from "xlsx";

const DragDropFile = observer(() => {
  const { workHoursList, file } = dragFileStore;
  const [dragActive, setDragActive] = React.useState(false);

  // ref
  const inputRef = React.useRef(null);

  const readExcel = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = reader.result;
      const workBook = XLSX.read(data, { type: "binary" });
      workBook.SheetNames.forEach((sheetName) => {
        console.log(`sheet name : ${sheetName}`);
        const row = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
        workHoursList(row);
      });
    };
    reader.readAsBinaryString(dragFileStore.file);
  };

  // handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      dragFileStore.fileChange(e.dataTransfer.files[0]);
    }
  };

  // triggers when file is selected with click
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      dragFileStore.fileChange(e.target.files[0]);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  if (file) {
    readExcel();
  }

  return (
    <>
      <form
        id="form-file-upload"
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          id="input-file-upload"
          onChange={handleChange}
          accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
        <label
          id="label-file-upload"
          htmlFor="input-file-upload"
          className={dragActive ? "drag-active" : ""}
        >
          <div>
            <p>Drag and drop your file here or</p>
            <button className="upload-button" onClick={onButtonClick}>
              Upload a file
            </button>
          </div>
        </label>
        {dragActive && (
          <div
            id="drag-file-element"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </form>
      <div>업로드 된 파일명 : {file && file.name}</div>
    </>
  );
});

export default DragDropFile;
