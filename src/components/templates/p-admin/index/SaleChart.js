"use client";
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function SaleChart() {
  const data = [
    { date: "02/1/1", sale: 2000 },
    { date: "02/1/2", sale: 3000 },
    { date: "02/1/3", sale: 3800 },
    { date: "02/1/4", sale: 2900 },
    { date: "02/1/5", sale: 4000 },
    { date: "02/1/6", sale: 3500 },
  ];

  return (
    <ResponsiveContainer width="100%" height="92.7%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e8e5e0" />
        <XAxis dataKey="date" stroke="#a09c96" fontSize={12} />
        <YAxis stroke="#a09c96" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e8e5e0",
            borderRadius: "10px",
            color: "#1a1a1a",
            fontFamily: "shabnam",
          }}
          labelStyle={{ color: "#1a1a1a", fontWeight: 600 }}
        />
        <Area
          type="monotone"
          dataKey="sale"
          stroke="#a67c52"
          fill="#a67c52"
          fillOpacity={0.12}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default SaleChart;