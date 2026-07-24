import React, { useEffect, useState, useMemo } from 'react';
import { 
  Users, Search, Filter, Mail, UserCheck, UserX, 
  Download, Eye, GraduationCap, Building2, Award,
  ChevronUp, ChevronDown, Trash2
} from 'lucide-react';
import { api } from '../../services/api';

interface Student {
  id: string;
  name: string;
  email: string;
  branch: string;
  cgpa: number;
  year: string;
  placementStatus: string;
  company?: string;
  package?: string;
  skills: string[];
}

export const ManageStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Student>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const itemsPerPage = 10;

  const fetchStudents = async () => {
    try {
      const response = await api.get('/auth/students');
      const mappedStudents = (response.students || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        branch: s.profile?.branch || '',
        cgpa: s.profile?.cgpa || 0,
        year: s.profile?.education?.[0]?.year || '',
        placementStatus: 'Pending', // We will derive this later when we join with applications
        skills: s.profile?.skills || []
      }));
      setStudents(mappedStudents);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === paginatedStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(paginatedStudents.map(s => s.id));
    }
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleExport = () => {
    const csv = [
      ['Name', 'Email', 'Branch', 'CGPA', 'Year', 'Placement Status', 'Company', 'Package'].join(','),
      ...filteredStudents.map(s => [
        s.name, s.email, s.branch, s.cgpa, s.year, s.placementStatus, s.company || 'N/A', s.package || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (window.confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
      try {
        await api.delete(`/auth/students/${studentId}`);
        setStudents(prev => prev.filter(s => s.id !== studentId));
        setMessage(`Student ${studentName} has been deleted successfully.`);
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Failed to delete student:', error);
        alert('Failed to delete student. Please try again.');
      }
    }
  };

  // Filter and search logic
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.branch?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBranch = branchFilter === 'All' || student.branch === branchFilter;
      const matchesStatus = statusFilter === 'All' || student.placementStatus === statusFilter;
      
      return matchesSearch && matchesBranch && matchesStatus;
    });
  }, [students, searchQuery, branchFilter, statusFilter]);

  // Sort students
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredStudents, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedStudents.slice(start, start + itemsPerPage);
  }, [sortedStudents, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, branchFilter, statusFilter]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Placed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Not Placed':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'In Process':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const stats = useMemo(() => {
    return {
      total: students.length,
      placed: students.filter(s => s.placementStatus === 'Placed').length,
      notPlaced: students.filter(s => s.placementStatus === 'Not Placed').length,
      inProcess: students.filter(s => s.placementStatus === 'In Process').length,
      avgCgpa: students.length > 0 
        ? (students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / students.length).toFixed(2)
        : '0.00'
    };
  }, [students]);

  return (
    <div className="space-y-6">
      {message && (
        <div className="p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-sm text-emerald-400 font-semibold text-center  flex items-center justify-center gap-2">
          <UserCheck className="h-4 w-4" />
          {message}
        </div>
      )}

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Manage Students</h1>
          <p className="text-sm text-slate-400 mt-1">Track student records, placement status, and academic performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl border border-slate-700 bg-slate-900/50 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30  relative ">
            <Mail className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <GraduationCap className="h-5 w-5 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Officer Mode</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="group relative bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/50   hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-indigo-50 ">
              <Users className="h-4 w-4 text-slate-600 group-hover:text-indigo-600 " />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Total Students</p>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.total}</p>
        </div>
        <div className="group relative bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50   hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-emerald-50 ">
              <UserCheck className="h-4 w-4 text-slate-600 group-hover:text-emerald-600 " />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Placed</p>
          </div>
          <p className="text-3xl font-black text-emerald-600">{stats.placed}</p>
        </div>
        <div className="group relative bg-white rounded-2xl p-5 border border-slate-200 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/50   hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-rose-50 ">
              <UserX className="h-4 w-4 text-slate-600 group-hover:text-rose-600 " />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Not Placed</p>
          </div>
          <p className="text-3xl font-black text-rose-600">{stats.notPlaced}</p>
        </div>
        <div className="group relative bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/50   hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-amber-50 ">
              <Award className="h-4 w-4 text-slate-600 group-hover:text-amber-600 " />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">In Process</p>
          </div>
          <p className="text-3xl font-black text-amber-600">{stats.inProcess}</p>
        </div>
        <div className="group relative bg-white rounded-2xl p-5 border border-slate-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100/50   hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-purple-50 ">
              <GraduationCap className="h-4 w-4 text-slate-600 group-hover:text-purple-600 " />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Avg CGPA</p>
          </div>
          <p className="text-3xl font-black text-purple-600">{stats.avgCgpa}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or branch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 "
            />
          </div>

          {/* Branch Filter */}
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="pl-10 pr-10 py-3 rounded-xl text-sm font-medium bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20  appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="All">All Branches</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil Engineering">Civil Engineering</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl text-sm font-medium bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20  appearance-none cursor-pointer min-w-[140px]"
            >
              <option value="All">All Status</option>
              <option value="Placed">Placed</option>
              <option value="Not Placed">Not Placed</option>
              <option value="In Process">In Process</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="px-5 py-3 rounded-xl text-sm font-bold bg-indigo-600 border border-indigo-700 text-white hover:bg-indigo-700  flex items-center gap-2 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full  mx-auto mb-4"></div>
          <p className="text-sm text-slate-500 font-medium">Loading students...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredStudents.length === 0 ? (
            <div className="p-16 text-center">
              <div className="p-4 bg-slate-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-10 w-10 text-slate-400" />
              </div>
              <p className="text-base text-slate-600 font-medium">No students found matching your criteria.</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter settings</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-4 w-12">
                        <input
                          type="checkbox"
                          checked={selectedStudents.length === paginatedStudents.length && paginatedStudents.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-slate-300 bg-white text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 w-4 h-4"
                        />
                      </th>
                      <th className="p-4 cursor-pointer hover:text-slate-900 " onClick={() => handleSort('name')}>
                        <div className="flex items-center gap-2 text-slate-700">
                          <span className="text-xs font-bold uppercase tracking-wider">Name</span>
                          {sortField === 'name' && (
                            sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 text-indigo-600" /> : <ChevronDown className="h-4 w-4 text-indigo-600" />
                          )}
                        </div>
                      </th>
                      <th className="p-4 cursor-pointer hover:text-slate-900 " onClick={() => handleSort('branch')}>
                        <div className="flex items-center gap-2 text-slate-700">
                          <span className="text-xs font-bold uppercase tracking-wider">Branch</span>
                          {sortField === 'branch' && (
                            sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 text-indigo-600" /> : <ChevronDown className="h-4 w-4 text-indigo-600" />
                          )}
                        </div>
                      </th>
                      <th className="p-4 cursor-pointer hover:text-slate-900 " onClick={() => handleSort('cgpa')}>
                        <div className="flex items-center gap-2 text-slate-700">
                          <span className="text-xs font-bold uppercase tracking-wider">CGPA</span>
                          {sortField === 'cgpa' && (
                            sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 text-indigo-600" /> : <ChevronDown className="h-4 w-4 text-indigo-600" />
                          )}
                        </div>
                      </th>
                      <th className="p-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Placement Status</span>
                      </th>
                      <th className="p-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Company</span>
                      </th>
                      <th className="p-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    {paginatedStudents.map((student) => (
                      <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50 ">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => handleSelectStudent(student.id)}
                            className="rounded border-slate-300 bg-white text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 w-4 h-4"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700">
                              {getInitials(student.name)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{student.name}</span>
                              <span className="text-[10px] text-slate-500 font-medium">{student.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600 text-sm font-medium">{student.branch || 'Not specified'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-bold text-slate-900">{student.cgpa || 'N/A'}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border ${getStatusBadgeColor(student.placementStatus)}`}>
                            {student.placementStatus || 'Pending'}
                          </span>
                        </td>
                        <td className="p-4">
                          {student.company ? (
                            <div>
                              <span className="text-sm font-medium text-slate-900">{student.company}</span>
                              <span className="text-xs text-slate-500 block">{student.package}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(student)}
                              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 "
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleSendEmail(student.email)}
                              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 "
                              title="Send Email"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id, student.name)}
                              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 "
                              title="Delete Student"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                  <div className="text-sm text-slate-600 font-medium">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedStudents.length)} of {sortedStudents.length} students
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed "
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold  ${
                          currentPage === page
                            ? 'bg-indigo-600 border border-indigo-700 text-white shadow-md'
                            : 'bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed "
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Student Detail Modal */}
      {showDetailModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Student Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 "
              >
                <Eye className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center text-lg font-bold text-indigo-700">
                  {getInitials(selectedStudent.name)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{selectedStudent.name}</h4>
                  <p className="text-sm text-slate-500">{selectedStudent.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Branch</p>
                  <p className="text-sm font-bold text-slate-900">{selectedStudent.branch || 'Not specified'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">CGPA</p>
                  <p className="text-sm font-bold text-slate-900">{selectedStudent.cgpa || 'N/A'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Year</p>
                  <p className="text-sm font-bold text-slate-900">{selectedStudent.year || 'Not specified'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Status</p>
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${getStatusBadgeColor(selectedStudent.placementStatus)}`}>
                    {selectedStudent.placementStatus || 'Pending'}
                  </span>
                </div>
              </div>

              {selectedStudent.company && (
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-[10px] uppercase tracking-wider text-indigo-600 font-bold mb-1">Placement Details</p>
                  <p className="text-sm font-bold text-slate-900">{selectedStudent.company}</p>
                  <p className="text-xs text-slate-600">{selectedStudent.package}</p>
                </div>
              )}

              {selectedStudent.skills?.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleSendEmail(selectedStudent.email);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 border border-indigo-700 text-white hover:bg-indigo-700  flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
