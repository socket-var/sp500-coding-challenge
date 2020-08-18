import React from "react";
import "./HistoryTable.css";
import { TableData } from "./App";

interface ProvidedProps {
  data: TableData[];
}

export const HistoryTable = ({ data }: ProvidedProps) => {
  return (
    <table className="history-table">
      <thead className="table-header">
        <tr className="table-row">
          <th>Year</th>
          <th>Total Return</th>
          <th>Cumulative Return</th>
        </tr>
      </thead>
      <tbody className="table-body">
        {data.map(({ year, totalReturn, cumulativeReturn }) => (
          <tr key={year} className="table-row">
            <td>{year}</td>
            <td>{totalReturn}</td>
            <td>{cumulativeReturn}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
