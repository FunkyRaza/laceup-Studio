import React from 'react';

interface PremiumCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const PremiumCard: React.FC<PremiumCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendPositive = true,
  children,
  className = '' 
}) => {
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
          {trend && (
            <p className={`text-xs mt-2 ${trendPositive ? 'text-green-400' : 'text-red-400'}`}>
              {trendPositive ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-lg text-primary">
          {icon}
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default PremiumCard;