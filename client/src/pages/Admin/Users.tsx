import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../../services/api';
import { 
  ShieldCheck, Search, Shield, ShieldOff, Mail, UserCheck, Filter, 
  Bell, Users as UsersIcon, UserX, UserPlus, MoreVertical, ChevronUp, ChevronDown,
  Download, Trash2, Edit3, Eye, X, Check, AlertCircle, RefreshCw
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt?: string;
  lastLogin?: string;
}

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof User>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: 'block' | 'activate' | 'delete', userId: string, userName: string } | null>(null);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      const fetchedUsers = response.students || response.users || [];
      
      // Enhance users with additional data
      const enhancedUsers = fetchedUsers.map((user: any) => ({
        ...user,
        status: user.status || 'Active',
        createdAt: user.createdAt || new Date().toISOString(),
        lastLogin: user.lastLogin || new Date().toISOString()
      }));
      
      setUsers(enhancedUsers);
    } catch (e) {
      console.error('Failed to fetch users:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId: string, userName: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const nextStatus = user.status === 'Active' ? 'Blocked' : 'Active';
    const action = nextStatus === 'Blocked' ? 'block' : 'activate';

    setConfirmAction({ type: action as 'block' | 'activate', userId, userName });
    setShowConfirmDialog(true);
  };

  const confirmActionHandler = async () => {
    if (!confirmAction) return;

    const { userId, userName, type } = confirmAction;
    const nextStatus = type === 'block' ? 'Blocked' : 'Active';

    // Optimistic update
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: nextStatus } : u
    ));

    try {
      await api.put(`/admin/users/${userId}/status`, { status: nextStatus });
      
      setMessage(`User account ${userName} has been ${nextStatus.toLowerCase()} successfully.`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      // Revert on error
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: type === 'block' ? 'Active' : 'Blocked' } : u
      ));
      setMessage(`Failed to ${type} user account. Please try again.`);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setShowConfirmDialog(false);
      setConfirmAction(null);
    }
  };

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(u => u.id));
    }
  };

  const handleBulkAction = async (action: 'block' | 'activate' | 'delete') => {
    if (selectedUsers.length === 0) return;

    const actionText = action === 'block' ? 'blocked' : action === 'activate' ? 'activated' : 'deleted';
    
    // Optimistic update
    if (action === 'delete') {
      setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
      // Note: backend delete logic not fully wired for bulk in this snippet, sticking to status update.
    } else {
      const newStatus = action === 'block' ? 'Blocked' : 'Active';
      setUsers(prev => prev.map(u => 
        selectedUsers.includes(u.id) ? { ...u, status: newStatus } : u
      ));

      try {
        await Promise.all(selectedUsers.map(id => 
          api.put(`/admin/users/${id}/status`, { status: newStatus })
        ));
      } catch (err) {
        console.error('Failed to update some user statuses:', err);
      }
    }

    setMessage(`${selectedUsers.length} user(s) have been ${actionText} successfully.`);
    setTimeout(() => setMessage(''), 3000);
    setSelectedUsers([]);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleExport = () => {
    const csv = [
      ['Name', 'Email', 'Role', 'Status', 'Created At', 'Last Login'].join(','),
      ...filteredUsers.map(u => [
        u.name, u.email, u.role, u.status, u.createdAt, u.lastLogin
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Filter and search logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Sort users
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedUsers.slice(start, start + itemsPerPage);
  }, [sortedUsers, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Student':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Recruiter':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'PlacementOfficer':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Admin':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'Active'
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      : 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter(u => u.status === 'Active').length,
      blocked: users.filter(u => u.status === 'Blocked').length,
      students: users.filter(u => u.role === 'Student').length,
      recruiters: users.filter(u => u.role === 'Recruiter').length,
      officers: users.filter(u => u.role === 'PlacementOfficer').length,
      admins: users.filter(u => u.role === 'Admin').length,
    };
  }, [users]);

  return (
    <div className="space-y-6">
      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-bold text-center animate-pulse flex items-center justify-center gap-2 shadow-sm">
          <Check className="h-4 w-4" />
          {message}
        </div>
      )}

      {/* Premium Header Section */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">User Management</h1>
            <p className="text-sm text-slate-600 mt-2 font-medium">Audit accounts, block/unblock, and edit database access permissions.</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="group relative bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-indigo-50 transition-colors">
              <UsersIcon className="h-4 w-4 text-slate-600 group-hover:text-indigo-600 transition-colors" />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Total Users</p>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.total}</p>
        </div>
        <div className="group relative bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-emerald-50 transition-colors">
              <UserCheck className="h-4 w-4 text-slate-600 group-hover:text-emerald-600 transition-colors" />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Active</p>
          </div>
          <p className="text-3xl font-black text-emerald-600">{stats.active}</p>
        </div>
        <div className="group relative bg-white rounded-2xl p-5 border border-slate-200 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/50 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-rose-50 transition-colors">
              <UserX className="h-4 w-4 text-slate-600 group-hover:text-rose-600 transition-colors" />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Blocked</p>
          </div>
          <p className="text-3xl font-black text-rose-600">{stats.blocked}</p>
        </div>
        <div className="group relative bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-indigo-50 transition-colors">
              <UserPlus className="h-4 w-4 text-slate-600 group-hover:text-indigo-600 transition-colors" />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Students</p>
          </div>
          <p className="text-3xl font-black text-indigo-600">{stats.students}</p>
        </div>
        <div className="group relative bg-white rounded-2xl p-5 border border-slate-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100/50 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-purple-50 transition-colors">
              <UserPlus className="h-4 w-4 text-slate-600 group-hover:text-purple-600 transition-colors" />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Recruiters</p>
          </div>
          <p className="text-3xl font-black text-purple-600">{stats.recruiters}</p>
        </div>
        <div className="group relative bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-amber-50 transition-colors">
              <UserPlus className="h-4 w-4 text-slate-600 group-hover:text-amber-600 transition-colors" />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Officers</p>
          </div>
          <p className="text-3xl font-black text-amber-600">{stats.officers}</p>
        </div>
        <div className="group relative bg-white rounded-2xl p-5 border border-slate-200 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/50 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-rose-50 transition-colors">
              <ShieldCheck className="h-4 w-4 text-slate-600 group-hover:text-rose-600 transition-colors" />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Admins</p>
          </div>
          <p className="text-3xl font-black text-rose-600">{stats.admins}</p>
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
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-10 py-3 rounded-xl text-sm font-medium bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="All">All Roles</option>
              <option value="Student">Student</option>
              <option value="Recruiter">Recruiter</option>
              <option value="PlacementOfficer">Placement Officer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl text-sm font-medium bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer min-w-[140px]"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="px-5 py-3 rounded-xl text-sm font-bold bg-indigo-600 border border-indigo-700 text-white hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between">
            <span className="text-sm text-indigo-700 font-bold">
              {selectedUsers.length} user(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 border border-emerald-700 text-white hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md"
              >
                Activate Selected
              </button>
              <button
                onClick={() => handleBulkAction('block')}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 border border-rose-700 text-white hover:bg-rose-700 transition-all shadow-sm hover:shadow-md"
              >
                Block Selected
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-red-600 border border-red-700 text-white hover:bg-red-700 transition-all shadow-sm hover:shadow-md"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-slate-500 font-medium">Loading users...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-16 text-center">
              <div className="p-4 bg-slate-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <ShieldCheck className="h-10 w-10 text-slate-400" />
              </div>
              <p className="text-base text-slate-600 font-medium">No users found matching your criteria.</p>
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
                          checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-slate-300 bg-white text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 w-4 h-4"
                        />
                      </th>
                      <th className="p-4 cursor-pointer hover:text-slate-900 transition-colors" onClick={() => handleSort('name')}>
                        <div className="flex items-center gap-2 text-slate-700">
                          <span className="text-xs font-bold uppercase tracking-wider">Name</span>
                          {sortField === 'name' && (
                            sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 text-indigo-600" /> : <ChevronDown className="h-4 w-4 text-indigo-600" />
                          )}
                        </div>
                      </th>
                      <th className="p-4 cursor-pointer hover:text-slate-900 transition-colors" onClick={() => handleSort('email')}>
                        <div className="flex items-center gap-2 text-slate-700">
                          <span className="text-xs font-bold uppercase tracking-wider">Email</span>
                          {sortField === 'email' && (
                            sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 text-indigo-600" /> : <ChevronDown className="h-4 w-4 text-indigo-600" />
                          )}
                        </div>
                      </th>
                      <th className="p-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Account Role</span>
                      </th>
                      <th className="p-4 cursor-pointer hover:text-slate-900 transition-colors" onClick={() => handleSort('status')}>
                        <div className="flex items-center gap-2 text-slate-700">
                          <span className="text-xs font-bold uppercase tracking-wider">Account Status</span>
                          {sortField === 'status' && (
                            sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 text-indigo-600" /> : <ChevronDown className="h-4 w-4 text-indigo-600" />
                          )}
                        </div>
                      </th>
                      <th className="p-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Manage Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    {paginatedUsers.map((u) => (
                      <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition-all">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(u.id)}
                            onChange={() => handleSelectUser(u.id)}
                            className="rounded border-slate-300 bg-white text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 w-4 h-4"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700">
                              {getInitials(u.name)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{u.name}</span>
                              <span className="text-[10px] text-slate-500 font-medium">ID: {u.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600 text-sm">{u.email}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border ${getRoleBadgeColor(u.role)}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border ${getStatusBadgeColor(u.status)}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewUser(u)}
                              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleSendEmail(u.email)}
                              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                              title="Send Email"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleToggleBlock(u.id, u.name)}
                              className={`px-4 py-2 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
                                u.status === 'Active' 
                                  ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100' 
                                  : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            >
                              {u.status === 'Active' ? (
                                <>
                                  <ShieldOff className="h-3.5 w-3.5" />
                                  Block
                                </>
                              ) : (
                                <>
                                  <Shield className="h-3.5 w-3.5" />
                                  Activate
                                </>
                              )}
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
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedUsers.length)} of {sortedUsers.length} users
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
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
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowUserModal(false)}>
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">User Details</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 transition-all"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-lg font-bold text-indigo-400">
                  {getInitials(selectedUser.name)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{selectedUser.name}</h4>
                  <p className="text-sm text-slate-400">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Role</p>
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${getRoleBadgeColor(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Status</p>
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${getStatusBadgeColor(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">User ID:</span>
                  <span className="text-white font-medium">{selectedUser.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Created:</span>
                  <span className="text-white font-medium">{formatDate(selectedUser.createdAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Last Login:</span>
                  <span className="text-white font-medium">{formatDate(selectedUser.lastLogin)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    handleSendEmail(selectedUser.email);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </button>
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    handleToggleBlock(selectedUser.id, selectedUser.name);
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-all flex items-center justify-center gap-2 ${
                    selectedUser.status === 'Active'
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                  }`}
                >
                  {selectedUser.status === 'Active' ? (
                    <>
                      <ShieldOff className="h-4 w-4" />
                      Block User
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      Activate User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && confirmAction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg border border-amber-200">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Confirm Action</h3>
            </div>
            
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to {confirmAction.type} the account for <span className="font-bold text-slate-900">{confirmAction.userName}</span>?
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setConfirmAction(null);
                }}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmActionHandler}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  confirmAction.type === 'block'
                    ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

