import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RequestVolumeChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2c2f3d" />
        <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#9199a8' }} tickFormatter={(v) => v.slice(11, 16)} />
        <YAxis tick={{ fontSize: 11, fill: '#9199a8' }} />
        <Tooltip contentStyle={{ backgroundColor: '#161822', border: '1px solid #2c2f3d' }} />
        <Line type="monotone" dataKey="requestCount" stroke="#5b8def" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RequestVolumeChart;