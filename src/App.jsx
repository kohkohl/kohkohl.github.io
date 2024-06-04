import { useState } from "react";
import "./App.css";
import StockContext from "./contexts/StockContext.js";
import StockForm from "./components/StockForm.jsx";


function App() {
  const [stockList, setStockList] = useState([]);
  const value = {stockList, setStockList}


  return (
    <StockContext.Provider value = {value}>
      <div>
        <h1>Stock Management App</h1>
        <StockForm />
      </div>
    </StockContext.Provider>
  );
}



export default App;
