import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { FileDown } from 'lucide-react';
import { api } from '../../services/api';

export const Reports: React.FC = () => {
  const [placementRatioData, setPlacementRatioData] = useState([
    { name: 'Placed Students', value: 0 },
    { name: 'Unplaced Students', value: 0 }
  ]);
  const [packagesData, setPackagesData] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/auth/students');
        const st = res.students || [];
        setStudents(st);

        // Currently no placement data is attached to students in DB, so all are unplaced
        setPlacementRatioData([
          { name: 'Placed Students', value: 0 },
          { name: 'Unplaced Students', value: st.length }
        ]);

        const deptMap: any = {};
        st.forEach((s: any) => {
          const branch = s.profile?.branch || 'Unknown';
          if (!deptMap[branch]) deptMap[branch] = { Min: 0, Avg: 0, Max: 0, count: 0, total: 0 };
        });
        
        const pData = Object.keys(deptMap).map(b => ({
          name: b,
          Min: deptMap[b].Min,
          Avg: deptMap[b].Avg,
          Max: deptMap[b].Max
        }));
        
        setPackagesData(pData.length > 0 ? pData : [
          { name: 'MCA', Min: 0, Avg: 0, Max: 0 },
          { name: 'CSE', Min: 0, Avg: 0, Max: 0 },
          { name: 'ECE', Min: 0, Avg: 0, Max: 0 }
        ]);
      } catch (e) {
        console.error(e);
      }
    };
    fetchStudents();
  }, []);

  const PIE_COLORS = ['#6366f1', '#f59e0b'];

  const handleDownloadReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,Name,Email,Branch,CGPA,Placement Status\n";
    students.forEach(s => {
      csvContent += `${s.name},${s.email},${s.profile?.branch || 'N/A'},${s.profile?.cgpa || 'N/A'},Unplaced\n`;
    });

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
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Campus Placement Analytics Reports</h3>
          <p className="text-xs text-slate-500 mt-1">Review department metrics, hiring distributions, and download full spreadsheets.</p>
        </div>
        <button
          onClick={handleDownloadReport}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center space-x-1.5"
        >
          <FileDown className="h-4 w-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Placed vs Unplaced ratio chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-center">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-left">Overall Placement Ratio</h4>
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
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Salary Packages (LPA) Range by Dept</h4>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={packagesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
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
