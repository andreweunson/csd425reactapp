import { useEffect, useState, useMemo } from "react";
import { getClassList } from "./services/getProgram";
import ShowClasses from "./assets/components/ShowClasses";
import Loading from "./assets/components/Loading";
import "./App.css";

function App() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setLoading] = useState(true);

  //Initial loading of data by calling the service to fetch the program list
  useEffect(() => {
    getClassList(setClasses).then(() => setLoading(false));
  }, []);

  const memoizedClasses = useMemo(() => classes, [classes]);

  //Render program component only when the async function has fetched the data
  if (isLoading) {
    return <Loading />;
  } else return <ShowClasses classList={memoizedClasses} />;
}

export default App;
