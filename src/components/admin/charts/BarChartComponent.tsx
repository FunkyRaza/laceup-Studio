import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface BarChartComponentProps {
  data: ChartData[];
  title: string;
  color?: string;
  height?: number;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({ 
  data, 
  title, 
  color = '#3b82f6',
  height = 300 
}) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                borderColor: '#374151', 
                borderRadius: '0.5rem',
                color: 'white'
              }} 
              itemStyle={{ color: 'white' }}
              labelStyle={{ color: '#9CA3AF', fontWeight: 'bold' }}
            />
            <Bar 
              dataKey="value" 
              fill={color} 
              radius={[4, 4, 0, 0]}
              strokeWidth={2}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;