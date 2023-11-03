import DragDropFile from "./components/DragDropFile";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WorkHours from "./components/WorkHours";
import dragFileStore from "./stores/DragFileStore";
import { observer } from "mobx-react-lite";

const App = observer(() => {
  const workHoursList = dragFileStore.work_hours_list;

  return (
    <div>
      <Header />
      <DragDropFile />
      <Footer />
      {workHoursList.length > 0 && <WorkHours />}
    </div>
  );
});

export default App;
