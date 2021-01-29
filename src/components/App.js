import React, { useState } from "react";
import './App.css';
import Form from './Form'
import Table from './Table'

function App() {
  // this controls the state for the table's data; fields are updated via the form addTableData prop
  const [tableData, setTableData] = useState([]);
  function addTableData(tableData) {
    setTableData(prevData => tableData);
  }


  return (
    <div className="App">
      <h1>NFL Table App</h1>
      <Form addTableData={addTableData} />
      <Table data={tableData} />
    </div>
  );
}

export default App;
