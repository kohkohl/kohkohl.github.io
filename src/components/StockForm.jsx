import React, { useEffect, useState, useContext, useCallback } from "react";
import "./StockStyling.css";
import StockContext from "../contexts/StockContext";

function StockForm() {

  const [StockSymbol, setStockSymbol] = useState("");
  const [Quantity, setQuantity] = useState('');
  const [PurchasePrice, setPurchasePrice] = useState('');
  const [CurrentPrice, setCurrentPrice] = useState('');
  const contextValue = useContext(StockContext);
  const [displayedStocks, setDisplayedStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateStockWithPrice = useCallback((symbol, currentPrice) => {
    const lastStock = contextValue.stockList[contextValue.stockList.length - 1];
    if (lastStock && lastStock.symbol === symbol) {
      const profitLoss = ((currentPrice - lastStock["purchase-price"]) * lastStock["quantity"]).toFixed(2);
      const updatedStock = {
        ...lastStock,
        "current-price": currentPrice.toFixed(2),
        "profit-loss": profitLoss,
      };
      setDisplayedStocks((prevStocks) => [...prevStocks, updatedStock]); // Append new stock data
    }
  }, [contextValue.stockList]);


  function addStock (newStock)  {
    const updatedStockList = [...contextValue.stockList, newStock];

    contextValue.setStockList(updatedStockList);

  } 

  function handleSubmit(e) {
    e.preventDefault();
    if (StockSymbol && Quantity && PurchasePrice) {
        const newStock = {
            "symbol": StockSymbol,
            "quantity": Number(Quantity),
            "purchase-price": Number(PurchasePrice),
            "current-price": "",
            "profit-loss": "",
          }; 
      addStock(newStock);
      setStockSymbol('');
      setQuantity('');
      setPurchasePrice('');
    }
  };

  const APIcall = useCallback(async (latestSymbol) => {
    setIsLoading(true); // Set loading state to true before making the API call
    try {
      const response = await fetch(
        "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" +
          latestSymbol +
          "&apikey=Q729SADGZ7XUYKRC"
      );
      const data = await response.json();
      const currentPrice = parseFloat(data["Global Quote"]["05. price"]);
      setCurrentPrice(currentPrice);
    //   setCurrentPrice(data["Global Quote"]["05. price"]);
    //   console.log(currentPrice);
      updateStockWithPrice(latestSymbol, currentPrice);
    //   console.log("Current price is ", currentPrice);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Set loading state to false after the API call is completed
    }
  }, [updateStockWithPrice]);


  useEffect(() => {

    if (contextValue.stockList.length > 0) {
        const latestSymbol = contextValue.stockList[contextValue.stockList.length -1]["symbol"];
        // console.log("Try try there", latestSymbol);
        APIcall(latestSymbol);
    }}, [
    contextValue.stockList, APIcall
    // 5. Think about when you want useEffect to run again
    //    Which variables, when modified, should trigger useEffect?
  ]);

  
    return (
        <div>
        <form id="user-input" onSubmit = {handleSubmit} className="for-submission">
          <input 
          type="text" 
          value={StockSymbol} 
          id="symbol" 
          onChange={(event) => setStockSymbol(event.target.value)} 
          placeholder = "Stock Symbol"
          required />
          <input 
          type="number" 
          value={Quantity} 
          id="quantity" 
          onChange={(event) => setQuantity(event.target.value)} 
          placeholder = "Quantity"
          required />
          <input 
          type="number" 
          value={PurchasePrice} 
          id="purchase-price" 
          onChange={(event) => setPurchasePrice(event.target.value)} 
          placeholder = "Purchase Price"
          required />
          <button onClick={handleSubmit} type="submit" id="submission-button">Add Stock</button>
          

      </form>
      {contextValue.stockList.length === 0 && <p>There are no stocks currently</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        displayedStocks.length > 0 && (
          <div>
            {displayedStocks.map((stock, index) => (
              <div key={`${stock.symbol}-${index}`} className = "results"> 
                 <span>Symbol: {stock.symbol}</span>
                  <span>Quantity: {stock.quantity}</span>
                  <span>Purchase Price: {stock["purchase-price"]}</span>
                  <span>Current Price: {stock["current-price"]}</span>
                  <span className={stock["profit-loss"] >= 0 ? "stock-profit" : "stock-loss"}>
                    Profit/Loss: {stock["profit-loss"]}
                  </span>
              </div>
            ))}
          </div>
        )
      )}

      </div>


    );
    } 
  
    export default StockForm;

