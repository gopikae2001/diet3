import React, { useState, useEffect } from "react";
// import "./DietOrderForm.css";
import '../styles/DietOrder.css'
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
interface DietOrder {
  id: string;
  patientName: string;
  patientId: string;
  bed: string;
  ward: string;
  dietPackage: string;
  packageName?: string; // Added for displaying the package name
  packageRate?: number; // Added for storing the package rate
  startDate: string;
  endDate: string;
  doctorNotes: string;
  status: "active" | "paused" | "stopped";
  approvalStatus: "pending" | "approved" | "rejected";
}
interface DietOrderFormProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

interface MealItem {
  foodItemId: string;
  foodItemName: string;
  quantity: number;
  unit: string;
}

interface DietPackage {
  id: string;
  name: string;
  type: string;
  breakfast: MealItem[];
  brunch: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  evening: MealItem[];
  totalRate: number;
  totalNutrition: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
  };
}

// Function to load diet packages from localStorage
const loadDietPackages = (): DietPackage[] => {
  try {
    const saved = localStorage.getItem('dietPackages');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load diet packages:', error);
    return [];
  }
};

import { useLocation } from 'react-router-dom';

const DietOrderForm: React.FC<DietOrderFormProps> = ({ sidebarCollapsed, toggleSidebar }) => {
  const location = useLocation();
  // Load saved orders and diet packages from localStorage on initial render
  const [dietPackages, setDietPackages] = useState<DietPackage[]>(() => loadDietPackages());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error' | ''}>({message: '', type: ''});
  const [orders, setOrders] = useState<DietOrder[]>(() => {
    try {
      const saved = localStorage.getItem('dietOrders');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load diet orders from localStorage:', error);
      return [];
    }
  });

  // Save orders to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('dietOrders', JSON.stringify(orders));
    } catch (error) {
      console.error('Failed to save diet orders to localStorage:', error);
    }
  }, [orders]);

  // Listen for changes to diet packages in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setDietPackages(loadDietPackages());
    };

    // Listen for custom event when packages are updated
    window.addEventListener('dietPackagesUpdated', handleStorageChange);
    
    // Also check for changes periodically (in case the event isn't caught)
    const interval = setInterval(handleStorageChange, 2000);
    
    return () => {
      window.removeEventListener('dietPackagesUpdated', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  interface FormState {
    patientName: string;
    patientId: string;
    bed: string;
    ward: string;
    floor?: string;
    dietPackage: string;
    packageRate: string;
    startDate: string;
    endDate: string;
    doctorNotes: string;
    status: "active" | "paused" | "stopped";
    approvalStatus: "pending" | "approved" | "rejected";
  }

  // Initialize form with default values or values from location state
  const [form, setForm] = useState<FormState>(() => {
    const state = location.state || {};
    return {
      patientName: state.patientName || "",
      patientId: state.patientId || "",
      bed: state.bed || "",
      ward: state.ward || "",
      floor: state.floor || "",
      dietPackage: "",
      packageRate: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      doctorNotes: state.doctorNotes || "",
      status: "active",
      approvalStatus: "pending"
    };
  });
  
  const [selectedPackageDetails, setSelectedPackageDetails] = useState<DietPackage | null>(null);

  // Update selected package details when dietPackage changes
  useEffect(() => {
    if (form.dietPackage) {
      const pkg = dietPackages.find(p => p.id === form.dietPackage);
      setSelectedPackageDetails(pkg || null);
    } else {
      setSelectedPackageDetails(null);
    }
  }, [form.dietPackage, dietPackages]);

  // Listen for changes to diet packages in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setDietPackages(loadDietPackages());
    };

    // Listen for custom event when packages are updated
    window.addEventListener('dietPackagesUpdated', handleStorageChange);
    
    // Also check for changes periodically (in case the event isn't caught)
    const interval = setInterval(handleStorageChange, 2000);
    
    return () => {
      window.removeEventListener('dietPackagesUpdated', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Update form state
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Update selected package details and rate when diet package changes
    if (name === 'dietPackage') {
      const selected = dietPackages.find(pkg => pkg.id === value);
      setSelectedPackageDetails(selected || null);
      
      // Update the rate field when a package is selected
      if (selected) {
        setForm(prev => ({
          ...prev,
          packageRate: selected.totalRate.toString()
        }));
      } else {
        setForm(prev => ({
          ...prev,
          packageRate: ""
        }));
      }
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(prev => {
        const updated = prev.filter(order => order.id !== id);
        if (updated.length < prev.length) {
          showNotification('Order deleted successfully!', 'success');
        }
        return updated;
      });
    }
  };

  const resetForm = () => {
    setForm({
      patientName: "",
      patientId: "",
      bed: "",
      ward: "",
      dietPackage: "",
      packageRate: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      doctorNotes: "",
      status: "active",
      approvalStatus: "pending"
    });
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const handleEdit = (order: DietOrder) => {
    setForm({
      patientName: order.patientName,
      patientId: order.patientId,
      bed: order.bed,
      ward: order.ward,
      dietPackage: order.dietPackage,
      packageRate: order.packageRate?.toString() || "",
      startDate: order.startDate,
      endDate: order.endDate || "",
      doctorNotes: order.doctorNotes,
      status: order.status,
      approvalStatus: order.approvalStatus
    });
    setEditingId(order.id);
    showNotification('Editing order...', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPackage = dietPackages.find(pkg => pkg.id === form.dietPackage);
    const newOrder: DietOrder = {
      id: editingId || Date.now().toString(),
      ...form,
      packageName: selectedPackage ? `${selectedPackage.name}${selectedPackage.type ? ` (${selectedPackage.type})` : ''}` : undefined,
      packageRate: selectedPackage?.totalRate,
    };
    setOrders(prev => {
      if (editingId) {
        const updated = prev.map(order => order.id === editingId ? newOrder : order);
        showNotification('Order updated successfully!', 'success');
        return updated;
      } else {
        return [...prev, newOrder];
      }
    });
    setEditingId(null);
    resetForm();
    showNotification(editingId ? 'Order updated successfully!' : 'Order created successfully!', 'success');
  };

  // Notification styles
  const notificationStyles: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '4px',
    color: 'white',
    backgroundColor: notification.type === 'error' ? '#ef4444' : '#10B981',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transform: notification.message ? 'translateX(0)' : 'translateX(120%)',
    transition: 'transform 0.3s ease-in-out',
  };

  return (
    <>
    <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
    {notification.message && (
      <div style={notificationStyles}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        {notification.message}
      </div>
    )}
    <div className="dietorder-container">
        <div className="header">
        <PageHeader title="Diet Order" subtitle="Meal preparation and delivery management" />
      </div>
      <div className="form-section3">
        {/* <div className="section-header">Diet Order</div> */}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Patient Name</label>
              <input name="patientName" value={form.patientName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Patient ID</label>
              <input name="patientId" value={form.patientId} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Bed</label>
              <input name="bed" value={form.bed} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Ward</label>
              <input name="ward" value={form.ward} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Diet Package</label>
            <div>
              <select 
                name="dietPackage" 
                value={form.dietPackage} 
                onChange={handleChange}
                required
                style={{ width: '100%' }}
              >
                <option value="">Select a package</option>
                {dietPackages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} {pkg.type ? `(${pkg.type})` : ''}
                  </option>
                ))}
                {dietPackages.length === 0 && (
                  <option value="" disabled>No diet packages available. Please create one first.</option>
                )}
              </select>
              
              <div className="form-row" style={{ marginTop: '15px' }}>
                <div className="form-group">
                  <label>Package Rate (₹)</label>
                  <input 
                    type="text" 
                    name="packageRate" 
                    value={form.packageRate ? `₹${parseFloat(form.packageRate).toFixed(2)}` : ''} 
                    readOnly 
                    style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              {selectedPackageDetails && (
                <div className="package-meals" style={{ 
                  marginTop: '15px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '10px',
                  backgroundColor: '#f9f9f9',
                  marginBottom: '15px'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Meal Plan:</h4>
                  
                  {selectedPackageDetails.breakfast.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                      <h5 style={{ margin: '0 0 5px 0', color: '#555' }}>Breakfast</h5>
                      <ul style={{ margin: '0', paddingLeft: '20px' }}>
                        {selectedPackageDetails.breakfast.map((item, idx) => (
                          <li key={`breakfast-${idx}`}>
                            {item.quantity} {item.unit} {item.foodItemName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedPackageDetails.brunch.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                      <h5 style={{ margin: '0 0 5px 0', color: '#555' }}>Brunch</h5>
                      <ul style={{ margin: '0', paddingLeft: '20px' }}>
                        {selectedPackageDetails.brunch.map((item, idx) => (
                          <li key={`brunch-${idx}`}>
                            {item.quantity} {item.unit} {item.foodItemName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedPackageDetails.lunch.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                      <h5 style={{ margin: '0 0 5px 0', color: '#555' }}>Lunch</h5>
                      <ul style={{ margin: '0', paddingLeft: '20px' }}>
                        {selectedPackageDetails.lunch.map((item, idx) => (
                          <li key={`lunch-${idx}`}>
                            {item.quantity} {item.unit} {item.foodItemName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedPackageDetails.dinner.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                      <h5 style={{ margin: '0 0 5px 0', color: '#555' }}>Dinner</h5>
                      <ul style={{ margin: '0', paddingLeft: '20px' }}>
                        {selectedPackageDetails.dinner.map((item, idx) => (
                          <li key={`dinner-${idx}`}>
                            {item.quantity} {item.unit} {item.foodItemName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedPackageDetails.evening.length > 0 && (
                    <div>
                      <h5 style={{ margin: '0 0 5px 0', color: '#555' }}>Evening</h5>
                      <ul style={{ margin: '0', paddingLeft: '20px' }}>
                        {selectedPackageDetails.evening.map((item, idx) => (
                          <li key={`evening-${idx}`}>
                            {item.quantity} {item.unit} {item.foodItemName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #e0e0e0' }}>
                    <p style={{ margin: '5px 0', fontWeight: '500' }}>Nutritional Information:</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px' }}>
                      <div>Calories: {selectedPackageDetails.totalNutrition.calories.toFixed(0)} kcal</div>
                      <div>Protein: {selectedPackageDetails.totalNutrition.protein.toFixed(1)}g</div>
                      <div>Carbs: {selectedPackageDetails.totalNutrition.carbohydrates.toFixed(1)}g</div>
                      <div>Fat: {selectedPackageDetails.totalNutrition.fat.toFixed(1)}g</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input 
                type="date" 
                name="endDate" 
                value={form.endDate} 
                min={form.startDate}
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Doctor Notes</label>
            <textarea name="doctorNotes" rows={3} value={form.doctorNotes} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="stopped">Stopped</option>
              </select>
            </div>
            <div className="form-group">
              <label>Approval</label>
              <select name="approvalStatus" value={form.approvalStatus} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <button className="primary" type="submit">
            {editingId ? 'Update Order' : 'Create Diet Order'}
          </button>
        </form>
      </div>

      {orders.length > 0 && (
        <div className="form-section3">
          <div className="section-header">Diet Orders</div>
          <table className="order-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Patient</th>
                <th>Bed/Ward</th>
                <th>Package</th>
                <th>Rate</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Approval</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, index) => (
                <tr key={o.id}>
                  <td>{index + 1}</td>
                  <td>{o.patientName}</td>
                  <td>{o.bed} / {o.ward}</td>
                  <td>{o.packageName || dietPackages.find(p => p.id === o.dietPackage)?.name || "Unknown"}</td>
                  <td>₹{o.packageRate?.toFixed(2) || dietPackages.find(p => p.id === o.dietPackage)?.totalRate?.toFixed(2) || '0.00'}</td>
                  <td>{new Date(o.startDate).toLocaleDateString()}</td>
                  <td>{o.endDate ? new Date(o.endDate).toLocaleDateString() : '-'}</td>
                  <td><span className={`status-badge status-${o.status}`}>{o.status}</span></td>
                  <td><span className="status-badge">{o.approvalStatus}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-text edit"
                        onClick={() => handleEdit(o)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-text reject"
                        onClick={() => handleDelete(o.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
}
export default DietOrderForm;