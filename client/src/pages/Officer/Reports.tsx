import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { FileDown } from 'lucide-react';

export const Reports: React.FC = () => {
  
  // Mock metrics
  const placementRatioData = [
    { name: 'Placed Students', value: 150 },
    { name: 'Unplaced Students', value: 32 }
  ];

  const packagesData = [
    { name: 'MCA', Min: 5.2, Avg: 8.5, Max: 18.0 },
    { name: 'CSE', Min: 6.0, Avg: 12.0, Max: 24.0 },
    { name: 'ECE', Min: 4.8, Avg: 7.2, Max: 14.5 }
  ];

  const PIE_COLORS = ['#6366f1', '#f59e0b'];

  const handleDownloadReport = () => {
    // Basic CSV mock download helper
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Department,Min Package (LPA),Avg Package (LPA),Max Package (LPA)\n"
      + "MCA,5.2,8.5,18.0\n"
      + "CSE,6.0,12.0,24.0\n"
      + "ECE,4.8,7.2,14.5\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Campus_Placement_Report_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Campus Placement Analytics Reports</h3>
          <p className="text-xs text-slate-400 mt-1">Review department metrics, hiring distributions, and download full spreadsheets.</p>
        </div>
        <button
          onClick={handleDownloadReport}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10 flex items-center space-x-1.5"
        >
          <FileDown className="h-4 w-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Placed vs Unplaced ratio chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-center">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider text-left">Overall Placement Ratio</h4>
          <div className="h-60 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={placementRatioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {placementRatioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Packages distribution bar chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Salary Packages (LPA) Range by Dept</h4>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={packagesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e2e42" />
                <XAxis dataKey="name" stroke="#8787aa" fontSize={11} />
                <YAxis stroke="#8787aa" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1b1b2a', border: '1px solid #2e2e42', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="Min" name="Min Salary" fill="#ef4444" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Avg" name="Avg Salary" fill="#6366f1" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Max" name="Max Salary" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
