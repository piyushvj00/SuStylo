// // components/Pages/Tables/Tables.js
// import React, { useState, useEffect } from 'react';
// import axiosInstance from '../../../config/AxiosInstance';
// import { Plus, Edit, Trash2, Loader, Search, Users } from 'lucide-react';

// const Tables = () => {
//   const [tables, setTables] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingTable, setEditingTable] = useState(null);
//   const [businesses, setBusinesses] = useState([]);
//   const [branches, setBranches] = useState([]);

//   const [formData, setFormData] = useState({
//     tableNumber: '',
//     seatingCapacity: 2,
//     category: 'Normal',
//     customCategory: '',
//     price: 0,
//     businessId: '',
//     branchId: '',
//     isAvailable: true
//   });

//   useEffect(() => {
//     fetchTables();
//     fetchBusinesses();
//   }, []);

//   const fetchTables = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.post('/business/get-all', {
//         model: 'Table'
//       });
//       if (response.data.success) {
//         setTables(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching tables:', error);
//       alert('Failed to fetch tables');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchBusinesses = async () => {
//     try {
//       const response = await axiosInstance.post('/business/get-all', {
//         model: 'Business'
//       });
//       if (response.data.success) {
//         setBusinesses(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching businesses:', error);
//     }
//   };

//   const fetchBranches = async (businessId) => {
//     try {
//       const response = await axiosInstance.post('/business/get-all', {
//         model: 'Branch',
//         businessId
//       });
//       if (response.data.success) {
//         setBranches(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching branches:', error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         model: 'Table',
//         ...formData
//       };

//       if (editingTable) {
//         payload.id = editingTable._id;
//         await axiosInstance.put('/business/update', payload);
//         alert('Table updated successfully');
//       } else {
//         await axiosInstance.post('/business/create', payload);
//         alert('Table created successfully');
//       }

//       setShowModal(false);
//       resetForm();
//       fetchTables();
//     } catch (error) {
//       console.error('Error saving table:', error);
//       alert('Failed to save table');
//     }
//   };

//   const handleEdit = (table) => {
//     setEditingTable(table);
//     setFormData({
//       tableNumber: table.tableNumber,
//       seatingCapacity: table.seatingCapacity,
//       category: table.category,
//       customCategory: table.customCategory || '',
//       price: table.price,
//       businessId: table.businessId,
//       branchId: table.branchId || '',
//       isAvailable: table.isAvailable
//     });
//     if (table.businessId) {
//       fetchBranches(table.businessId);
//     }
//     setShowModal(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this table?')) return;

//     try {
//       await axiosInstance.delete('/business/delete', {
//         data: { model: 'Table', id }
//       });
//       alert('Table deleted successfully');
//       fetchTables();
//     } catch (error) {
//       console.error('Error deleting table:', error);
//       alert('Failed to delete table');
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       tableNumber: '',
//       seatingCapacity: 2,
//       category: 'Normal',
//       customCategory: '',
//       price: 0,
//       businessId: '',
//       branchId: '',
//       isAvailable: true
//     });
//     setEditingTable(null);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="flex items-center space-x-2">
//           <Loader className="h-6 w-6 animate-spin text-green-600" />
//           <span className="text-gray-600">Loading tables...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-6 flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Tables</h1>
//             <p className="text-gray-600 mt-2">
//               Manage restaurant tables and seating
//             </p>
//           </div>
//           <button
//             onClick={() => setShowModal(true)}
//             className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
//           >
//             <Plus className="h-5 w-5" />
//             <span>Add Table</span>
//           </button>
//         </div>

//         {/* Tables Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {tables.map((table) => (
//             <div key={table._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Table {table.tableNumber}
//                   </h3>
//                   <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                     table.category === 'Premium' 
//                       ? 'bg-yellow-100 text-yellow-800'
//                       : 'bg-gray-100 text-gray-800'
//                   }`}>
//                     {table.category}
//                   </span>
//                 </div>

//                 <div className="space-y-3 mb-4">
//                   <div className="flex items-center text-sm text-gray-600">
//                     <Users className="h-4 w-4 mr-2" />
//                     <span>Seats: {table.seatingCapacity} people</span>
//                   </div>

//                   <div className="text-sm text-gray-600">
//                     <span className="font-medium">Price:</span> ₹{table.price}
//                   </div>

//                   {table.customCategory && (
//                     <div className="text-sm text-gray-600">
//                       <span className="font-medium">Type:</span> {table.customCategory}
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//                   <span className={`inline-flex items-center ${
//                     table.isAvailable ? 'text-green-600' : 'text-red-600'
//                   }`}>
//                     <div className={`w-2 h-2 rounded-full mr-2 ${
//                       table.isAvailable ? 'bg-green-500' : 'bg-red-500'
//                     }`} />
//                     {table.isAvailable ? 'Available' : 'Occupied'}
//                   </span>
//                 </div>

//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => handleEdit(table)}
//                     className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
//                   >
//                     <Edit className="h-4 w-4" />
//                     <span>Edit</span>
//                   </button>
//                   <button
//                     onClick={() => handleDelete(table._id)}
//                     className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     <span>Delete</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {tables.length === 0 && (
//           <div className="text-center py-12">
//             <div className="text-gray-400 mb-4">
//               <Users className="h-12 w-12 mx-auto" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No tables found</h3>
//             <p className="text-gray-500">Get started by creating your first table.</p>
//           </div>
//         )}

//         {/* Create/Edit Modal */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-bold text-gray-900">
//                     {editingTable ? 'Edit Table' : 'Create Table'}
//                   </h2>
//                   <button
//                     onClick={() => {
//                       setShowModal(false);
//                       resetForm();
//                     }}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Table Number *
//                       </label>
//                       <input
//                         type="text"
//                         required
//                         value={formData.tableNumber}
//                         onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Seating Capacity *
//                       </label>
//                       <input
//                         type="number"
//                         required
//                         min="1"
//                         value={formData.seatingCapacity}
//                         onChange={(e) => setFormData({ ...formData, seatingCapacity: parseInt(e.target.value) })}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Category *
//                     </label>
//                     <select
//                       required
//                       value={formData.category}
//                       onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     >
//                       <option value="Normal">Normal</option>
//                       <option value="Premium">Premium</option>
//                     </select>
//                   </div>

//                   {formData.category === 'Premium' && (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Custom Category
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.customCategory}
//                         onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                         placeholder="e.g., VIP, Family, etc."
//                       />
//                     </div>
//                   )}

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Price (₹) *
//                     </label>
//                     <input
//                       type="number"
//                       required
//                       min="0"
//                       step="0.01"
//                       value={formData.price}
//                       onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Business *
//                       </label>
//                       <select
//                         required
//                         value={formData.businessId}
//                         onChange={(e) => {
//                           setFormData({ ...formData, businessId: e.target.value, branchId: '' });
//                           fetchBranches(e.target.value);
//                         }}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                       >
//                         <option value="">Select Business</option>
//                         {businesses.map(business => (
//                           <option key={business._id} value={business._id}>
//                             {business.businessName}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Branch (Optional)
//                       </label>
//                       <select
//                         value={formData.branchId}
//                         onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                       >
//                         <option value="">All Branches</option>
//                         {branches.map(branch => (
//                           <option key={branch._id} value={branch._id}>
//                             {branch.branchName}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={formData.isAvailable}
//                       onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
//                       className="rounded border-gray-300 text-green-600 focus:ring-green-500"
//                     />
//                     <label className="ml-2 text-sm text-gray-700">
//                       Table is available
//                     </label>
//                   </div>

//                   <div className="flex space-x-3 pt-4">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setShowModal(false);
//                         resetForm();
//                       }}
//                       className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                     >
//                       {editingTable ? 'Update' : 'Create'} Table
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Tables;



// components/Pages/Tables/Tables.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { Plus, Edit, Trash2, Loader, Search, Users, Building } from 'lucide-react';

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [businessLoading, setBusinessLoading] = useState(false);

  const [formData, setFormData] = useState({
    tableNumber: '',
    seatingCapacity: 2,
    category: 'Normal',
    customCategory: '',
    price: 0,
    businessId: '',
    branchId: '',
    isAvailable: true
  });

  useEffect(() => {
    fetchTables();
    fetchBusinesses();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/business/get-all', {
        model: 'Table'
      });
      if (response.data.success) {
        setTables(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
      alert('Failed to fetch tables');
    } finally {
      setLoading(false);
    }
  };

  // Fetch businesses from the new API
  const fetchBusinesses = async () => {
    try {
      setBusinessLoading(true);
      const response = await axiosInstance.post('/details/list', {
        page: 1,
        limit: 100
      });
      if (response.data.success) {
        setBusinesses(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      alert('Failed to fetch businesses');
    } finally {
      setBusinessLoading(false);
    }
  };

  // Extract branches from selected business
  const fetchBranches = (businessId) => {
    const selectedBusiness = businesses.find(business => business._id === businessId);
    if (selectedBusiness && selectedBusiness.branches) {
      setBranches(selectedBusiness.branches);
    } else {
      setBranches([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        model: 'Table',
        ...formData
      };

      if (editingTable) {
        payload.id = editingTable._id;
        await axiosInstance.put('/business/update', payload);
        alert('Table updated successfully');
      } else {
        await axiosInstance.post('/business/create', payload);
        alert('Table created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchTables();
    } catch (error) {
      console.error('Error saving table:', error);
      alert('Failed to save table');
    }
  };

  const handleEdit = (table) => {
    setEditingTable(table);
    setFormData({
      tableNumber: table.tableNumber,
      seatingCapacity: table.seatingCapacity,
      category: table.category,
      customCategory: table.customCategory || '',
      price: table.price,
      businessId: table.businessId,
      branchId: table.branchId || '',
      isAvailable: table.isAvailable
    });
    if (table.businessId) {
      fetchBranches(table.businessId);
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this table?')) return;

    try {
      await axiosInstance.delete('/business/delete', {
        data: { model: 'Table', id }
      });
      alert('Table deleted successfully');
      fetchTables();
    } catch (error) {
      console.error('Error deleting table:', error);
      alert('Failed to delete table');
    }
  };

  const resetForm = () => {
    setFormData({
      tableNumber: '',
      seatingCapacity: 2,
      category: 'Normal',
      customCategory: '',
      price: 0,
      businessId: '',
      branchId: '',
      isAvailable: true
    });
    setEditingTable(null);
    setBranches([]);
  };

  // Get business name by ID
  const getBusinessName = (businessId) => {
    const business = businesses.find(b => b._id === businessId);
    return business ? business.name : 'Unknown Business';
  };

  // Get branch name by ID
  const getBranchName = (branchId) => {
    if (!branchId) return 'All Branches';
    // Search through all businesses for the branch
    for (let business of businesses) {
      if (business.branches) {
        const branch = business.branches.find(b => b._id === branchId);
        if (branch) return branch.name;
      }
    }
    return 'Unknown Branch';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="h-6 w-6 animate-spin text-green-600" />
          <span className="text-gray-600">Loading tables...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tables</h1>
            <p className="text-gray-600 mt-2">
              Manage restaurant tables and seating
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Table</span>
          </button>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {tables.map((table) => (
            <div key={table._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Table {table.tableNumber}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${table.category === 'Premium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                    }`}>
                    {table.category}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Seats: {table.seatingCapacity} people</span>
                  </div>

                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Price:</span> ₹{table.price}
                  </div>

                  {table.customCategory && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Type:</span> {table.customCategory}
                    </div>
                  )}

                  {/* Business and Branch Info */}
                  <div className="flex items-center text-sm text-gray-500">
                    <Building className="h-4 w-4 mr-1" />
                    {/* <span className="truncate">{getBusinessName(table.businessId)}</span> */}
                    {/* <span className="mx-1">•</span> */}
                    <span>{getBranchName(table.branchId)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className={`inline-flex items-center ${table.isAvailable ? 'text-green-600' : 'text-red-600'
                    }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${table.isAvailable ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    {table.isAvailable ? 'Available' : 'Occupied'}
                  </span>
                </div>

                <div className="flex space-x-2 ">
                  <button
                    onClick={() => handleEdit(table)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(table._id)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tables.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tables found</h3>
            <p className="text-gray-500">Get started by creating your first table.</p>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingTable ? 'Edit Table' : 'Create Table'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Table Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.tableNumber}
                        onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Seating Capacity *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.seatingCapacity}
                        onChange={(e) => setFormData({ ...formData, seatingCapacity: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>

                  {formData.category === 'Premium' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Custom Category
                      </label>
                      <input
                        type="text"
                        value={formData.customCategory}
                        onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., VIP, Family, etc."
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business *
                      </label>
                      <select
                        required
                        value={formData.businessId}
                        onChange={(e) => {
                          setFormData({ ...formData, businessId: e.target.value, branchId: '' });
                          fetchBranches(e.target.value);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select Business</option>
                        {businessLoading ? (
                          <option value="" disabled>Loading businesses...</option>
                        ) : (
                          businesses.map(business => (
                            <option key={business._id} value={business._id}>
                              {business.name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Branch (Optional)
                      </label>
                      <select
                        value={formData.branchId}
                        onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">All Branches</option>
                        {branches.map(branch => (
                          <option key={branch._id} value={branch._id}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Table is available
                    </label>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {editingTable ? 'Update' : 'Create'} Table
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tables;