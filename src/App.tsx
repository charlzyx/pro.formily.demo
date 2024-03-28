import "./App.css";

import CascaderPlus from "./demos/CascaderPlus";
import ProArrayTableWithShadow from "./demos/ProArrayTableWithShadow";
import QueryList from "./demos/QueryList";
import ShadowFormAll from "./demos/ShadowFormAll";
import ProArrayTable from "./demos/ProArrayTable";
import ProEnum from "./demos/ProEnum";
import QueryListAdd from "./demos/QueryListAdd";
import { useMemo, useState } from "react";

const Demos = {
  CascaderPlus,
  ProArrayTableWithShadow,
  QueryList,
  ShadowFormAll,
  ProArrayTable,
  ProEnum,
  QueryListAdd,
};
const list = Object.keys(Demos);
console.log("🚀 ~ list:", list);
const App = () => {
  const [demo, setDemo] = useState(list[0]);

  const Demo = useMemo(() => {
    return Demos[demo as keyof typeof Demos];
  }, [demo]);
  return (
    <div>
      <ul>
        {list.map((item) => (
          <li key={item} style={{ color: item === demo ? "red" : "black" }}>
            <button type="button" onClick={() => setDemo(item)}>
              {item}
            </button>
          </li>
        ))}
      </ul>
      <div>
        <Demo></Demo>
      </div>
    </div>
  );
};

export default App;
