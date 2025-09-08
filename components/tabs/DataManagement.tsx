import React, { useState } from 'react';
import { DataManagementData } from '../../types';
import { generateSampleData } from '../../services/geminiService';

interface DataManagementProps {
  data: DataManagementData;
  onUpdate: (data: DataManagementData) => void;
}

const DataManagement: React.FC<DataManagementProps> = ({ data, onUpdate }) => {
  const [newColumnName, setNewColumnName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowCount, setRowCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleAddColumn = () => {
    if (newColumnName.trim() === '') return;
    const newColumn = { id: Date.now(), name: newColumnName.trim() };
    onUpdate({
        ...data,
        columns: [...data.columns, newColumn]
    });
    setNewColumnName('');
  };

  const handleRemoveColumn = (columnId: number) => {
    const newColumns = data.columns.filter(c => c.id !== columnId);
    const removedColumn = data.columns.find(c => c.id === columnId);
    if (!removedColumn) return;

    const newRows = data.rows.map(row => {
        const newRow = {...row};
        delete newRow[removedColumn.name];
        return newRow;
    });

    onUpdate({ columns: newColumns, rows: newRows });
  };
  
  const handleAddRow = () => {
    const newRow: Record<string, string> = {};
    data.columns.forEach(col => { newRow[col.name] = '' });
    onUpdate({ ...data, rows: [...data.rows, newRow]});
  };

  const handleCellChange = (rowIndex: number, columnName: string, value: string) => {
    const newRows = [...data.rows];
    newRows[rowIndex][columnName] = value;
    onUpdate({ ...data, rows: newRows });
  };
  
  const handleGenerateData = async () => {
    if (data.columns.length === 0) {
        alert("Please add at least one column before generating data.");
        return;
    }
    setIsGenerating(true);
    try {
        const newRows = await generateSampleData(data.columns, rowCount);
        onUpdate({ ...data, rows: [...data.rows, ...newRows] });
    } catch(error) {
        console.error("Failed to generate sample data:", error);
    } finally {
        setIsGenerating(false);
        setIsModalOpen(false);
    }
  };

  const exportToCSV = () => {
    const headers = data.columns.map(c => c.name).join(',');
    const rows = data.rows.map(row => 
        data.columns.map(col => `"${row[col.name] || ''}"`).join(',')
    ).join('\n');
    
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "research_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Data Management</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-4 items-end mb-6">
            <div className="flex-grow">
                <label htmlFor="new-column" className="block text-sm font-medium text-slate-700">New Column Name</label>
                <input
                    id="new-column"
                    type="text"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    className="mt-1 w-full p-2 border border-slate-300 rounded-md"
                    placeholder="e.g., BloodPressure"
                />
            </div>
            <button onClick={handleAddColumn} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-md hover:bg-primary-700">Add Column</button>
            <button onClick={handleAddRow} className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700">Add Row</button>
            <button onClick={() => setIsModalOpen(true)} className="bg-amber-500 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-600">Generate Sample Data</button>
            <button onClick={exportToCSV} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Export to CSV</button>
        </div>
        
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        {data.columns.map(col => (
                            <th key={col.id} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                <div className="flex items-center justify-between">
                                    {col.name}
                                    <button onClick={() => handleRemoveColumn(col.id)} className="text-red-400 hover:text-red-600">X</button>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {data.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {data.columns.map(col => (
                                <td key={col.id} className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="text"
                                        value={row[col.name] || ''}
                                        onChange={(e) => handleCellChange(rowIndex, col.name, e.target.value)}
                                        className="w-full p-1 border-b border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500 rounded-sm"
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
       {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                    <h3 className="text-lg font-semibold mb-4">Generate Sample Data</h3>
                    <div className="mb-4">
                        <label htmlFor="row-count" className="block text-sm font-medium text-slate-600">Number of rows to generate:</label>
                         <input
                            id="row-count"
                            type="number"
                            value={rowCount}
                            onChange={(e) => setRowCount(parseInt(e.target.value, 10))}
                            className="w-full p-2 mt-1 border border-slate-300 rounded-md"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-200 rounded-md">Cancel</button>
                        <button onClick={handleGenerateData} disabled={isGenerating} className="px-4 py-2 bg-primary-600 text-white rounded-md disabled:bg-primary-300">
                            {isGenerating ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default DataManagement;