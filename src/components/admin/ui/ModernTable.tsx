import React from 'react';

interface Column<T = any> {
  key: string;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
  className?: string;
}

interface ModernTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  rowKey?: string;
  onRowClick?: (record: T) => void;
  emptyText?: string;
}

const ModernTable = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  rowKey = 'id',
  onRowClick,
  emptyText = 'No data available'
}: ModernTableProps<T>) => {
  if (loading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <div className="animate-pulse p-6">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center py-3 border-b border-gray-700">
              {[...Array(columns.length)].map((_, j) => (
                <div key={j} className="flex-1 px-4">
                  <div className="h-4 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-750">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.length > 0 ? (
              data.map((record, index) => (
                <tr
                  key={record[rowKey] || index}
                  className={`hover:bg-gray-750 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick && onRowClick(record)}
                >
                  {columns.map((column) => (
                    <td
                      key={`${record[rowKey] || index}-${column.key}`}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-300 ${column.className || ''}`}
                    >
                      {column.render
                        ? column.render(record[column.key], record)
                        : record[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500 text-sm"
                >
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModernTable;