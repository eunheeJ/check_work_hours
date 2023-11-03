import { makeAutoObservable } from "mobx";

class DragFileStore {
  file = "";
  work_hours_list = [];
  totalWorkHour = 0;
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  fileChange(fileInfo) {
    this.file = fileInfo;
  }
  workHoursList(arr) {
    this.work_hours_list = arr;
  }
}

const dragFileStore = new DragFileStore();
export default dragFileStore;
