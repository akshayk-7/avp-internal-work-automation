import React, { useState, useEffect } from 'react';
import { clientService } from '../../services/api';
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Check,
    X,
    MoreVertical
} from 'lucide-react';

const ClientWorklist = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: '',
        status: '',
        assigned_to: ''
    });
    const [selectedClients, setSelectedClients] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await clientService.getAll(filters);
            setClients(response.data.data);
            // setTotalPages(response.data.pagination.totalPages); // Assuming backend returns pagination
            setTotalPages(Math.ceil(response.data.count / filters.limit) || 1);
        } catch (error) {
            console.error('Failed to fetch clients', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setFilters({ ...filters, page: newPage });
        }
    };

    const toggleSelectAll = () => {
        if (selectedClients.length === clients.length) {
            setSelectedClients([]);
        } else {
            setSelectedClients(clients.map(c => c.id));
        }
    };

    const toggleSelectClient = (id) => {
        if (selectedClients.includes(id)) {
            setSelectedClients(selectedClients.filter(cId => cId !== id));
        } else {
            setSelectedClients([...selectedClients, id]);
        }
    };

    // Bulk Actions placeholders
    const handleBulkAction = async (action) => {
        alert(`Bulk Action: ${action} on ${selectedClients.length} items`);
        // Implement API call here
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {/* Header & Filters */}
            <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <h2 className="text-lg font-semibold text-gray-800">Client Worklist</h2>

                <div className="flex space-x-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            name="search"
                            placeholder="Search PAN or Name"
                            className="pl-10 pr-4 py-2 border rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={filters.search}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <select
                        name="status"
                        className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={filters.status}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Status</option>
                        <option value="Filed">Filed</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* Bulk Actions Toolbar */}
            {selectedClients.length > 0 && (
                <div className="bg-indigo-50 px-4 py-2 flex items-center justify-between">
                    <span className="text-sm text-indigo-700 font-medium">{selectedClients.length} selected</span>
                    <div className="space-x-2">
                        <button
                            onClick={() => handleBulkAction('mark_filed')}
                            className="px-3 py-1 bg-white border border-indigo-200 text-indigo-600 text-xs rounded hover:bg-indigo-50"
                        >
                            Mark Filed
                        </button>
                        <button
                            onClick={() => handleBulkAction('reassign')}
                            className="px-3 py-1 bg-white border border-indigo-200 text-indigo-600 text-xs rounded hover:bg-indigo-50"
                        >
                            Reassign
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="p-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                                        checked={selectedClients.length === clients.length && clients.length > 0}
                                        onChange={toggleSelectAll}
                                    />
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">Client details</th>
                            <th scope="col" className="px-6 py-3">PAN</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Assigned To</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4">Loading...</td>
                            </tr>
                        ) : clients.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4">No clients found</td>
                            </tr>
                        ) : (
                            clients.map((client) => (
                                <tr key={client.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="w-4 p-4">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                                                checked={selectedClients.includes(client.id)}
                                                onChange={() => toggleSelectClient(client.id)}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {client.full_name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {client.pan}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${client.itr_filed
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {client.itr_filed ? 'Filed' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {client.assigned_oa_name || 'Unassigned'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-gray-500 hover:text-indigo-600">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                    <button
                        onClick={() => handlePageChange(filters.page - 1)}
                        disabled={filters.page === 1}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => handlePageChange(filters.page + 1)}
                        disabled={filters.page === totalPages}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{(filters.page - 1) * filters.limit + 1}</span> to <span className="font-medium">{Math.min(filters.page * filters.limit, clients.length * totalPages)}</span> of <span className="font-medium">Many</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button
                                onClick={() => handlePageChange(filters.page - 1)}
                                disabled={filters.page === 1}
                                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                            >
                                <span className="sr-only">Previous</span>
                                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <button
                                href="#"
                                aria-current="page"
                                className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {filters.page}
                            </button>
                            <button
                                onClick={() => handlePageChange(filters.page + 1)}
                                disabled={filters.page === totalPages}
                                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                            >
                                <span className="sr-only">Next</span>
                                <ChevronRight className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientWorklist;
