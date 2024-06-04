import { createContext } from 'react';

const StockContext = createContext();

export default StockContext;
// export const StockProvider = ({ children }) => {
//     const [stocks, setStocks] = useState([]);
  
//     const addStock = (newStock) => {
//       setStocks(prevStocks => [...prevStocks, newStock]);
//     };
  
//     const value = {
//       stocks,
//       addStock,
//     };
  
//     return (
//       <StockContext.Provider value={value}>
//         {children}
//       </StockContext.Provider>
//     );
//   };

