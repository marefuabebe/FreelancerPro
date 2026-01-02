import { useEffect, useState } from 'react';
import { getReports } from '../../api/adminApi.js';
import { FileBarChart, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Reports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                const { data } = await getReports();
                if (mounted) setReports((data.data || data).items || []);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load reports');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false };
    }, []);

    const handleExport = () => {
        if (!reports.length) {
            toast.error('No reports to export');
            return;
        }

        const headers = ['ID', 'Title', 'Type', 'Status', 'Date'];
        const csvContent = [
            headers.join(','),
            ...reports.map(r => [
                r.id,
                `"${r.title}"`,
                r.type,
                r.status,
                new Date(r.createdAt).toLocaleDateString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `reports_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownload = (report) => {
        const reportData = JSON.stringify(report.data, null, 2);
        const blob = new Blob([reportData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderReportPreview = (report) => {
        if (!report.data) return null;
        if (report.type === 'financial') {
            return (
                <div className="mt-4 space-y-2">
                    <p className="text-2xl font-bold text-gray-900">${report.data.revenue?.toLocaleString() || 0}</p>
                    <p className="text-sm text-gray-500">Total Revenue ({report.data.period})</p>
                </div>
            );
        }
        if (report.type === 'activity' || report.type === 'growth') {
            return (
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-lg font-semibold text-gray-900">{report.data.newUsers || report.data.newUsersLastWeek || 0}</p>
                        <p className="text-xs text-gray-500">New Users</p>
                    </div>
                    {report.data.newJobs !== undefined && (
                        <div>
                            <p className="text-lg font-semibold text-gray-900">{report.data.newJobs || 0}</p>
                            <p className="text-xs text-gray-500">New Jobs</p>
                        </div>
                    )}
                    {report.data.totalUsers !== undefined && (
                        <div>
                            <p className="text-lg font-semibold text-gray-900">{report.data.totalUsers || 0}</p>
                            <p className="text-xs text-gray-500">Total Users</p>
                        </div>
                    )}
                </div>
            );
        }
        if (report.type === 'market') {
            return (
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Active Jobs</span>
                        <span className="font-medium text-gray-900">{report.data.activeJobs || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Completed</span>
                        <span className="font-medium text-gray-900">{report.data.completedJobs || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(report.data.activeJobs / (report.data.totalJobs || 1)) * 100}%` }}
                        ></div>
                    </div>
                </div>
            );
        }
        return null;
    };

    if (loading) return <div className="p-6">Loading reports...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">System Reports</h2>
                <button
                    onClick={handleExport}
                    className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Export All List
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {reports.map((report) => (
                    <div key={report.id} className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className={`rounded-full p-3 ${report.type === 'financial' ? 'bg-green-100 text-green-600' :
                                    report.type === 'growth' ? 'bg-purple-100 text-purple-600' :
                                        'bg-blue-100 text-blue-600'
                                    }`}>
                                    <FileBarChart className="h-6 w-6" />
                                </div>
                                <span className={`rounded-full px-2 py-1 text-xs font-medium ${report.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {report.status}
                                </span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                            <p className="mt-1 text-sm text-gray-500 capitalize">{report.type} Report</p>

                            {/* Dynamic Data Content */}
                            {renderReportPreview(report)}
                        </div>
                        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                            <span className="text-xs text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</span>
                            <button
                                onClick={() => handleDownload(report)}
                                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-200 rounded px-3 py-1 hover:bg-blue-50 transition-colors"
                            >
                                <Download className="h-3 w-3 mr-1" />
                                Download JSON
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
