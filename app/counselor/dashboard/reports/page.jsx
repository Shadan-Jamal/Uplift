"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ReportsDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    reviewed: 0,
    resolved: 0,
    dismissed: 0
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReports: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (session?.user?.email !== process.env.NEXT_PUBLIC_SUPER_ADMIN) {
      router.push('/counselor/dashboard');
      return;
    }
    fetchReports();
  }, [session, selectedStatus, pagination.currentPage]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/reports?status=${selectedStatus}&page=${pagination.currentPage}&limit=20`
      );
      
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports);
        setStats(data.stats);
        setPagination(data.pagination);
      } else {
        console.error('Failed to fetch reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      setUpdating(true);
      const response = await fetch('/api/reports', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId,
          status: newStatus,
          reviewNotes: reviewNotes
        }),
      });

      if (response.ok) {
        setShowReviewModal(false);
        setSelectedReport(null);
        setReviewNotes('');
        fetchReports(); // Refresh the list
      } else {
        console.error('Failed to update report');
      }
    } catch (error) {
      console.error('Error updating report:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  };

  if (session?.user?.email !== process.env.NEXT_PUBLIC_SUPER_ADMIN) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl lg:bg-gradient-to-br from-[#eba1c2] via-[#f8fcff] to-[#b18deb] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="my-16 mx-aut">
          <h1 className="text-3xl font-bold text-[#cc6694] mb-2 text-center">Reports Dashboard</h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="bg-white rounded-lg p-6 shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-lg p-6 shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reviewed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.reviewed}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-lg p-6 shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-lg p-6 shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dismissed</p>
                <p className="text-2xl font-bold text-gray-600">{stats.dismissed}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a8738b] text-[#a8738b] text-sm md:text-base"
            >
              <option className='text-[#a8738b]' value="all">All Reports</option>
              <option className='text-[#a8738b]' value="pending">Pending</option>
              <option className='text-[#a8738b]' value="reviewed">Reviewed</option>
              <option className='text-[#a8738b]' value="resolved">Resolved</option>
              <option className='text-[#a8738b]' value="dismissed">Dismissed</option>
            </select>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#a8738b] mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No reports found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-[10px] md:text-[11px] lg:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-[10px] md:text-[11px] lg:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Email
                    </th>
                    <th className="px-6 py-3 text-left text-[10px] md:text-[11px] lg:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reported By
                    </th>
                    <th className="px-6 py-3 text-left text-[10px] md:text-[11px] lg:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-[10px] md:text-[11px] lg:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-[10px] md:text-[11px] lg:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-[10px] md:text-[11px] lg:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-[12px] md:text-[13px] font-medium text-gray-900">
                        {report.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[12px] md:text-[13px] text-gray-500">
                        {report.studentEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[12px] md:text-[13px] text-gray-500">
                        {report.reportedBy}
                      </td>
                      <td className="px-6 py-4 text-[12px] md:text-[13px] text-gray-500 max-w-xs truncate">
                        {report.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-[10px] md:text-[11px] lg:text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(report.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setShowReviewModal(true);
                          }}
                          className="cursor-pointer text-[#a8738b] hover:text-[#9d92f] mr-3"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalReports} total reports)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={!pagination.hasPrevPage}
                className="cursor-pointer px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={!pagination.hasNextPage}
                className="cursor-pointer px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[70vh] md:max-w-2xl mx-4 md:max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-lg font-semibold text-[#a8738b] mb-4">Review Report</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <p className="text-sm text-gray-900">{selectedReport.studentId}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Email</label>
                <p className="text-sm text-gray-900">{selectedReport.studentEmail}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reported By</label>
                <p className="text-sm text-gray-900">{selectedReport.reportedBy}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">{selectedReport.reason}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                <span className={`inline-flex px-2 py-1 text-[10px] md:text-[11px] lg:text-xs font-semibold rounded-full ${getStatusColor(selectedReport.status)}`}>
                  {selectedReport.status}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Date</label>
                <p className="text-sm text-gray-900">{formatDate(selectedReport.createdAt)}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Notes (Optional)
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8738b] focus:border-transparent placeholder:text-gray-500 text-gray-900"
                rows="3"
                placeholder="Add any notes about this report..."
              />
            </div>

            <div 
            className="grid grid-rows-2 place-content-center gap-4
            md:flex md:justify-end md:gap-3">
               
              <div className='grid grid-cols-3 gap-3'>
                    <button
                        onClick={() => handleStatusUpdate(selectedReport._id, 'reviewed')}
                        disabled={updating}
                        className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 text-xs md:text-sm"
                    >
                        {updating ? 'Updating...' : 'Mark as Reviewed'}
                    </button>
                    
                    <button
                        onClick={() => handleStatusUpdate(selectedReport._id, 'resolved')}
                        disabled={updating}
                        className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 text-xs md:text-sm"
                    >
                        {updating ? 'Updating...' : 'Mark as Resolved'}
                    </button>
                    
                    <button
                        onClick={() => handleStatusUpdate(selectedReport._id, 'dismissed')}
                        disabled={updating}
                        className="cursor-pointer px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 text-xs md:text-sm"
                    >
                        {updating ? 'Updating...' : 'Dismiss'}
                    </button>
              </div>
              <div>
                    <button
                        onClick={() => {
                        setShowReviewModal(false);
                        setSelectedReport(null);
                        setReviewNotes('');
                        }}
                        className="cursor-pointer px-3 py-1 md:px-4 md:py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm md:text-base"
                        disabled={updating}
                    >
                        Cancel
                    </button>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
