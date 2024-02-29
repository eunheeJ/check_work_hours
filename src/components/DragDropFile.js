import React from "react";
import "./DragDropFile.css";
import { observer } from "mobx-react-lite";
import dragFileStore from "../stores/DragFileStore";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

const DragDropFile = observer(() => {
  const { workHoursList, file } = dragFileStore;
  const [dragActive, setDragActive] = React.useState(false);

  // ref
  const inputRef = React.useRef(null);
  const findWorkDate = (obj,columnEn)=>{
    console.log("obj",obj)
    console.log("columnEn",columnEn)
    let i = 2
    let column = columnEn +`${i}`
    let workDateArr = []
    
    while(column in obj){
      console.log("???")
      if("w" in obj[column]&&"v" in obj[column]){
        workDateArr.push({column:column, date:obj[column]["w"], idx:obj[column]["v"]})
      }
      i+=1
      column = columnEn + `${i}`
      if (i>=1000){
        break
      }
    }
    const date = dayjs()
    const firstMonday = dayjs().subtract(date.get("d")-1, 'd').format("YYYY-MM-DD")
    const thisWeek = workDateArr.filter((d)=>dayjs(d.date).isAfter(firstMonday,'date')||dayjs(d.date).isSame(firstMonday,'date'))
    return thisWeek.map(v=>v.idx)
  }
  const findWorkDateColumn = (obj) =>{
    for (let i=65;i<91;i++){
      const column=String.fromCharCode(i)+"1"
      if(column in obj && "w" in obj[column]){
        if(obj[column]["w"]==="근태일자"){
          const columnName = column.slice(0,-1)
          return findWorkDate(obj,columnName)
        }
      }
      if(!(column in obj )){
        break
      }
    }
    return []
  }
  const readExcel = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = reader.result;
      const workBook = XLSX.read(data, { type: "binary" });
      workBook.SheetNames.forEach((sheetName) => {
        const thisWeekColumn = findWorkDateColumn(workBook.Sheets[sheetName])


        const row = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
        const newThisWeekFilterRow = row.filter(r=>thisWeekColumn.indexOf(r["근태일자"])>-1)
        workHoursList(newThisWeekFilterRow);
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
          onChange={handleChange}s
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
