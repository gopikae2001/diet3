import { useState, useEffect } from "react";
import '../styles/Dietician.css';
import '../styles/Notification.css';

import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
type Status = "active" | "paused" | "stopped";
type ApprovalStatus = "pending" | "approved" | "rejected";

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

interface DietOrder {
  id: string;
  patientName: string;
  patientId: string;
  bed: string;
  ward: string;
  dietPackage: string; // This is the package ID
  packageName?: string; // This will store the package name for display
  startDate: string;
  endDate?: string;
  doctorNotes: string;
  status: Status;
  approvalStatus: ApprovalStatus;
  dieticianInstructions?: string;
}
interface DieticianInterface {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}
const DieticianInterface: React.FC<DieticianInterface> = ({ sidebarCollapsed, toggleSidebar }) => {
  const [pendingOrders, setPendingOrders] = useState<DietOrder[]>([]);
  const [dietPackages, setDietPackages] = useState<DietPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<DietOrder | null>(null);
  const [instructions, setInstructions] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<DietPackage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string>("");
  const [showCustomDietForm, setShowCustomDietForm] = useState(false);
  const [customDietForm, setCustomDietForm] = useState({
    patientName: '',
    dietPackage: '',
    rate: '',
    startDate: '',
    endDate: '',
    status: 'active',
    approvalStatus: 'pending',
  });

  // Load orders and packages from localStorage on component mount
  useEffect(() => {
    try {
      // Load orders
      const savedOrders = localStorage.getItem('dietOrders');
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        setPendingOrders(parsedOrders);
      }

      // Load diet packages
      const savedPackages = localStorage.getItem('dietPackages');
      if (savedPackages) {
        const parsedPackages = JSON.parse(savedPackages);
        setDietPackages(parsedPackages);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update selected package when order changes
  useEffect(() => {
    if (selectedOrder) {
      const pkg = dietPackages.find(p => p.id === selectedOrder.dietPackage);
      setSelectedPackage(pkg || null);
      setEditingPackageId(selectedOrder.dietPackage || '');
      setInstructions(selectedOrder.dieticianInstructions || '');
    }
  }, [selectedOrder, dietPackages]);

  const updateOrders = (updatedOrders: DietOrder[]) => {
    setPendingOrders(updatedOrders);
    try {
      localStorage.setItem('dietOrders', JSON.stringify(updatedOrders));
    } catch (error) {
      console.error('Failed to save orders:', error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (selectedOrder) {
      setEditingPackageId(selectedOrder.dietPackage);
    }
  };

  const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPackageId = e.target.value;
    setEditingPackageId(newPackageId);
    const newPackage = dietPackages.find(pkg => pkg.id === newPackageId);
    if (newPackage) {
      setSelectedPackage(newPackage);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const handleSaveChanges = () => {
    if (selectedOrder) {
      const updatedOrder = {
        ...selectedOrder,
        dietPackage: editingPackageId,
        packageName: dietPackages.find(pkg => pkg.id === editingPackageId)?.name || ''
      };
      
      const updatedOrders = pendingOrders.map(order => 
        order.id === selectedOrder.id ? updatedOrder : order
      );
      
      setPendingOrders(updatedOrders);
      setSelectedOrder(updatedOrder);
      localStorage.setItem('dietOrders', JSON.stringify(updatedOrders));
      setIsEditing(false);
      showNotification('Diet package updated successfully!', 'success');
      setSelectedOrder(null); // Close the review order page after saving
    }
  };

  const handleApprove = (id: string) => {
    try {
      const orderToApprove = pendingOrders.find(order => order.id === id);
      if (!orderToApprove) return;

      const approvedOrder = {
        ...orderToApprove,
        approvalStatus: "approved" as const,
        dieticianInstructions: instructions,
        status: "active" as const
      };
      
      // Get current canteen orders
      const existingCanteenOrders = JSON.parse(localStorage.getItem('canteenOrders') || '[]');
      
      // Check if order already exists in canteen orders
      const orderIndex = existingCanteenOrders.findIndex((o: any) => o.id === id);
      
      // Always fetch the correct package for this order
      const pkg = dietPackages.find(p => p.id === approvedOrder.dietPackage);
      const pkgName = pkg?.name;
      const canteenOrder = {
        ...approvedOrder,
        dietPackageName: pkgName || 'N/A',
        prepared: false,
        delivered: false,
        mealItems: pkg ? {
          breakfast: pkg.breakfast || [],
          brunch: pkg.brunch || [],
          lunch: pkg.lunch || [],
          evening: pkg.evening || [],
          dinner: pkg.dinner || []
        } : {}
      };

      // Update or add the order to canteen orders
      let updatedCanteenOrders;
      if (orderIndex >= 0) {
        updatedCanteenOrders = [...existingCanteenOrders];
        updatedCanteenOrders[orderIndex] = canteenOrder;
      } else {
        updatedCanteenOrders = [...existingCanteenOrders, canteenOrder];
      }
      
      // Save to localStorage
      localStorage.setItem('canteenOrders', JSON.stringify(updatedCanteenOrders));
      
      // Update the orders list
      const updatedOrders = pendingOrders.map(order => 
        order.id === id ? approvedOrder : order
      );
      
      updateOrders(updatedOrders);
      setSelectedOrder(null);
      setInstructions("");
      
      // Show success notification
      showNotification('Order approved and sent to canteen!', 'success');
      
      // Trigger custom event to notify canteen interface
      window.dispatchEvent(new Event('canteenOrdersUpdated'));
      
    } catch (error) {
      console.error('Error approving order:', error);
      showNotification('Failed to approve order. Please try again.', 'error');
    }
  };

  const handleReject = (id: string) => {
    const updatedOrders = pendingOrders.map(order => {
      if (order.id === id) {
        return {
          ...order,
          approvalStatus: "rejected" as const,
          dieticianInstructions: instructions,
          status: "stopped" as const
        };
      }
      return order;
    });
    updateOrders(updatedOrders);
    setSelectedOrder(null);
    setInstructions("");
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      const updatedOrders = pendingOrders.filter(order => order.id !== id);
      updateOrders(updatedOrders);
      
      // Clear the selected order if it's the one being deleted
      if (selectedOrder?.id === id) {
        setSelectedOrder(null);
        setInstructions("");
      }
    }
  };

  const handlePause = (id: string) => {
    const updatedOrders = pendingOrders.map(order => {
      if (order.id === id) {
        return {
          ...order,
          status: 'paused' as const
        };
      }
      return order;
    });
    updateOrders(updatedOrders);
  };

  const handleRestart = (id: string) => {
    const updatedOrders = pendingOrders.map(order => {
      if (order.id === id) {
        return {
          ...order,
          status: 'active' as const
        };
      }
      return order;
    });
    updateOrders(updatedOrders);
    showNotification('Diet order restarted!', 'success');
  };

  // Autofill rate when package changes
  const handleCustomDietPackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pkgId = e.target.value;
    const pkg = dietPackages.find(p => p.id === pkgId);
    setCustomDietForm(prev => ({
      ...prev,
      dietPackage: pkgId,
      rate: pkg ? pkg.totalRate.toString() : ''
    }));
  };
  const handleCustomDietInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomDietForm(prev => ({ ...prev, [name]: value }));
  };
  const handleCustomDietSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDietForm.patientName || !customDietForm.dietPackage || !customDietForm.startDate) {
      showNotification('Please fill all required fields', 'error');
      return;
    }
    const pkg = dietPackages.find(p => p.id === customDietForm.dietPackage);
    const newOrder = {
      id: Date.now().toString(),
      patientName: customDietForm.patientName,
      patientId: '',
      bed: '',
      ward: '',
      dietPackage: customDietForm.dietPackage,
      packageName: pkg ? pkg.name : '',
      startDate: customDietForm.startDate,
      endDate: customDietForm.endDate,
      doctorNotes: '',
      status: customDietForm.status as Status,
      approvalStatus: customDietForm.approvalStatus as ApprovalStatus,
      dieticianInstructions: '',
    };
    const updatedOrders = [...pendingOrders, newOrder];
    updateOrders(updatedOrders);
    setShowCustomDietForm(false);
    setCustomDietForm({
      patientName: '',
      dietPackage: '',
      rate: '',
      startDate: '',
      endDate: '',
      status: 'active',
      approvalStatus: 'pending',
    });
    showNotification('Custom diet order added!', 'success');
  };

  return (
    <>
    <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
    <div className="dietician-container">
      <div className="header" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <PageHeader title="Dietician Interface" subtitle="Review and approve diet orders from doctors"/>
        <button
          className="add-custom-diet-btn"
          onClick={() => setShowCustomDietForm(f => !f)}
        >
          + Add Custom Diet
        </button>
      </div>

      {showCustomDietForm && (
        <div className="form-section" style={{marginBottom:'2rem'}}>
          <div className="section-header">Add Custom Diet Order</div>
          <form className="form" onSubmit={handleCustomDietSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Patient Name</label>
                <input
                  type="text"
                  name="patientName"
                  className="form-control"
                  value={customDietForm.patientName}
                  onChange={handleCustomDietInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Diet Package</label>
                <select
                  name="dietPackage"
                  className="form-control"
                  value={customDietForm.dietPackage}
                  onChange={handleCustomDietPackageChange}
                  required
                >
                  <option value="">Select a package</option>
                  {dietPackages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>{pkg.name} ({pkg.type})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Rate</label>
                <input
                  type="text"
                  name="rate"
                  className="form-control"
                  value={customDietForm.rate}
                  readOnly
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-control"
                  value={customDietForm.startDate}
                  onChange={handleCustomDietInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  className="form-control"
                  value={customDietForm.endDate}
                  onChange={handleCustomDietInputChange}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  className="form-control"
                  value={customDietForm.status}
                  onChange={handleCustomDietInputChange}
                  required
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="stopped">Stopped</option>
                </select>
              </div>
              <div className="form-group">
                <label>Approval</label>
                <select
                  name="approvalStatus"
                  className="form-control"
                  value={customDietForm.approvalStatus}
                  onChange={handleCustomDietInputChange}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button className="btn-text approve" type="submit">Add Order</button>
              <button className="btn-text" type="button" onClick={() => setShowCustomDietForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Bed/Ward</th>
              <th>Diet Package</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                  Loading orders...
                </td>
              </tr>
            ) : pendingOrders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                  No diet orders found.
                </td>
              </tr>
            ) : (
              pendingOrders.map(order => (
              <tr key={order.id}>
                <td>
                  <div className="patient-name">{order.patientName}</div>
                  <div className="patient-id">ID: {order.patientId}</div>
                </td>
                <td>{order.bed} / {order.ward}</td>
                <td>{order.packageName || 'N/A'}</td>
                <td>{new Date(order.startDate).toLocaleDateString()}</td>
                <td>{order.endDate ? new Date(order.endDate).toLocaleDateString() : '-'}</td>
                <td>
                  <span className={`status-badge ${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-text edit" 
                      onClick={() => setSelectedOrder(order)}
                    >
                      Edit
                    </button>
                    <button 
                      className={`btn-text ${order.approvalStatus === 'approved' ? 'approved' : 'approve'}`} 
                      onClick={() => order.approvalStatus !== 'approved' && handleApprove(order.id)}
                      disabled={order.approvalStatus === 'approved'}
                    >
                      {order.approvalStatus === 'approved' ? 'Approved' : 'Approve'}
                    </button>
                    <button 
                      className={`btn-text ${order.status === 'paused' ? 'restart' : 'pause'}`}
                      onClick={() => order.status === 'paused' ? handleRestart(order.id) : handlePause(order.id)}
                    >
                      {order.status === 'paused' ? 'Restart' : 'Pause'}
                    </button>
                    <button 
                      className="btn-text reject" 
                      onClick={() => handleReject(order.id)}
                    >
                      Reject
                    </button>
                    <button 
                      className="btn-text reject" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(order.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="review-section">
          <div className="section-header">REVIEW ORDER - {selectedOrder.patientName}</div>
          <div className="review-content">
            <div className="form-row">
              <div>
                <label>Patient Name</label>
                <input type="text" value={selectedOrder.patientName} readOnly className="form-control" />
              </div>
              <div>
                <label>Bed / Ward</label>
                <input type="text" value={`${selectedOrder.bed} / ${selectedOrder.ward}`} readOnly className="form-control" />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Diet Package</label>
                {isEditing ? (
                  <select 
                    value={editingPackageId}
                    onChange={handlePackageChange}
                    className="form-control"
                  >
                    <option value="">Select a package</option>
                    {dietPackages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} ({pkg.type})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input 
                    type="text" 
                    value={selectedPackage?.name || 'Package not found'} 
                    readOnly 
                    className="form-control"
                  />
                )}
              </div>
              <div>
                <label>Package Type</label>
                <input 
                  type="text" 
                  value={selectedPackage?.type || 'N/A'} 
                  readOnly 
                  className="form-control"
                />
              </div>
            </div>

            {selectedPackage && (
              <div className="meal-items-section">
                <h4>Meal Items</h4>
                {['breakfast', 'brunch', 'lunch', 'evening', 'dinner'].map((mealType) => {
                  const items = selectedPackage[mealType as keyof DietPackage] as MealItem[];
                  if (!items || items.length === 0) return null;
                  
                  return (
                    <div key={mealType} className="meal-type">
                      <h5>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h5>
                      <table className="meal-items-table">
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => (
                            <tr key={`${mealType}-${index}`}>
                              <td>{item.foodItemName}</td>
                              <td>{item.quantity}</td>
                              <td>{item.unit}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="form-group">
              <label>Dietician Instructions</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Enter special instructions (e.g., no sugar, soft food)"
                rows={3}
              />
            </div>

            <div className="form-actions">
              {isEditing ? (
                <>
                  <button className="btn-text approve" onClick={handleSaveChanges}>
                    Save Changes
                  </button>
                  <button className="btn-text" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-text edit" onClick={handleEditClick}>
                    Change Package
                  </button>
                  <button className="btn-text approve" onClick={handleSaveChanges}>
                    Save Changes
                  </button>
                  <button className="btn" onClick={() => setSelectedOrder(null)}>Close</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
}
export default DieticianInterface;