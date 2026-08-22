import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CostChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2c2f3d" />
        <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#9199a8' }} tickFormatter={(v) => v.slice(11, 16)} />
        <YAxis tick={{ fontSize: 11, fill: '#9199a8' }} />
        <Tooltip
          contentStyle={{ backgroundColor: '#161822', border: '1px solid #2c2f3d' }}
          formatter={(value) => [`$${value.toFixed(4)}`, 'Cost']}
        />
        <Bar dataKey="totalCostUsd" fill="#4cd07d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CostChart;