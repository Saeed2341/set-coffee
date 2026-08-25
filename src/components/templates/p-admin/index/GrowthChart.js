"use client";
import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function GrowthChart() {
  const data = [
    { name: "02/1/1", current: 4000, prev: 2400 },
    { name: "02/2/1", current: 4300, prev: 4000 },
    { name: "02/3/1", current: 5000, prev: 4300 },
    { name: "02/4/1", current: 3800, prev: 5000 },
    { name: "02/5/1", current: 4200, prev: 3800 },
    { name: "02/6/1", current: 3900, prev: 4200 },
  ];

  return (
    <ResponsiveContainer width="100%" height="92.7%">
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e8e5e0" />
        <XAxis dataKey="name" stroke="#a09c96" fontSize={12} />
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
        {/* ===== خط دوره قبل (قهوه‌ای روشن‌تر) ===== */}
        <Line
          type="monotone"
          dataKey="prev"
          stroke="#c4a882"
          strokeWidth={2}
          strokeDasharray="5 5"
        />
        {/* ===== خط دوره فعلی (قهوه‌ای تیره - طلایی) ===== */}
        <Line
          type="monotone"
          dataKey="current"
          stroke="#a67c52"
          strokeWidth={2.5}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default GrowthChart;
