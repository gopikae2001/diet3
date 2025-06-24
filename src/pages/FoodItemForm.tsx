import { useState, useEffect } from "react";
import { foodItemApi } from "../api/foodItemApi";
import { initializeMockData } from "../api/mockFoodData";
import "../styles/fooditemform.css"; // Create this CSS file
import Footer from "../components/Footer";
import Header from "../components/Header";
import PageHeader from "../components/PageHeader";

// Import the FoodItem type from types file
import type { FoodItem } from '../types/foodItem';
// Define form data type separately to allow quantity as string | number
interface FoodItemFormData {
  name: string;
  foodType: string;
  category: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  price: number;
  unit: string;
  quantity: string | number;
}

interface FoodItemFormProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}
const FoodItemForm: React.FC<FoodItemFormProps> = ({ sidebarCollapsed, toggleSidebar }) => {
  // Initialize mock data on component mount
  useEffect(() => {
    initializeMockData();
  }, []);

  // Load food items using the API
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  
  useEffect(() => {
    const loadFoodItems = async () => {
      try {
        const items = await foodItemApi.getAll();
        setFoodItems(items);
      } catch (error) {
        console.error('Failed to load food items:', error);
      }
    };
    
    loadFoodItems();
  }, []);
  const [showCustomUnit, setShowCustomUnit] = useState<boolean>(false);
  const [customUnit, setCustomUnit] = useState<string>('');
  const [formData, setFormData] = useState<FoodItemFormData>({
    name: "",
    foodType: "",
    category: "",
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    price: 0,
    unit: "",
    quantity: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string; show: boolean}>({message: '', show: false});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : parseFloat(value);
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(numValue) ? 0 : numValue
    }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string for manual entry
    if (value === '' || /^\d+$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        quantity: value
      }));
    }
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setShowCustomUnit(value === 'other');
    
    if (value === 'other') {
      setFormData(prev => ({
        ...prev,
        unit: customUnit
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        unit: value
      }));
      setCustomUnit('');
    }
  };
  
  const handleCustomUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomUnit(value);
    setFormData(prev => ({
      ...prev,
      unit: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate quantity
    const quantity = typeof formData.quantity === 'string' ? parseInt(formData.quantity) : formData.quantity;
    if (isNaN(quantity) || quantity < 1) {
      setNotification({ message: 'Please enter a valid quantity (1 or more).', show: true });
      setTimeout(() => setNotification({ message: '', show: false }), 3000);
      return;
    }
    const newItem: FoodItem = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      foodType: formData.foodType,
      category: formData.category,
      calories: formData.calories,
      protein: formData.protein,
      carbohydrates: formData.carbohydrates,
      fat: formData.fat,
      price: formData.price,
      unit: formData.unit,
      quantity: quantity,
    };

    try {
      if (editingId) {
        await foodItemApi.update(editingId, newItem);
        setFoodItems(items => items.map(item => item.id === editingId ? newItem : item));
        setEditingId(null);
        setNotification({ message: 'Item updated successfully!', show: true });
      } else {
        const createdItem = await foodItemApi.create(newItem);
        setFoodItems(items => [...items, createdItem]);
        setNotification({ message: 'Item added successfully!', show: true });
      }
      // Hide notification after 3 seconds
      setTimeout(() => setNotification({ message: '', show: false }), 3000);
    } catch (error) {
      console.error('Failed to save food item:', error);
      setNotification({ message: 'Failed to save item. Please try again.', show: true });
      setTimeout(() => setNotification({ message: '', show: false }), 3000);
    }
    resetForm();
  };

  const handleEdit = (item: FoodItem) => {
    const { id, ...itemData } = item;
    setFormData({
      ...itemData,
      quantity: String(itemData.quantity)
    });
    setEditingId(id);
    // Handle custom unit display
    if (!['g', 'ml', 'cup', 'tbsp', 'tsp', 'piece'].includes(item.unit)) {
      setShowCustomUnit(true);
      setCustomUnit(item.unit);
    } else {
      setShowCustomUnit(false);
      setCustomUnit('');
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      foodType: "",
      category: "",
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      price: 0,
      unit: "",
      quantity: '',
    });
    setEditingId(null);
    setShowCustomUnit(false);
    setCustomUnit('');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await foodItemApi.delete(id);
        setFoodItems(items => items.filter(item => item.id !== id));
        setNotification({ message: 'Item deleted successfully!', show: true });
        setTimeout(() => setNotification({ message: '', show: false }), 3000);
        
        // Reset form if the deleted item was being edited
        if (editingId && editingId === id) {
          resetForm();
        }
      } catch (error) {
        console.error('Failed to delete food item:', error);
        setNotification({ message: 'Failed to delete item. Please try again.', show: true });
        setTimeout(() => setNotification({ message: '', show: false }), 3000);
      }
    }
  };

  return (
    <>
      <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      {notification.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#10B981',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          {notification.message}
        </div>
      )}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `
      }} />
      <div className="fooditem-container">
        <div className="header">
          <PageHeader title='Food Item' subtitle="Create and manage food items for diet packages" />
          {/* <h3>Food Item</h3>
        <p>Create and manage food items for diet packages</p> */}
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label>Food Item Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Food Type</label>
              <select
                name="foodType"
                value={formData.foodType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Solid">Solid</option>
                <option value="Liquid">Liquid</option>
                <option value="Semi-Solid">Semi-Solid</option>
              </select>
            </div>

          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Food Item Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="proteins">Proteins</option>
                <option value="grains">Grains</option>
                <option value="dairy">Dairy</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Unit</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleUnitChange}
                required
              >
                <option value="">Select Unit</option>
                <option value="gram">Gram (g)</option>
                <option value="ml">Milliliter (ml)</option>
                <option value="piece">Piece</option>
                <option value="cup">Cup</option>
                <option value="other">Other (specify)</option>
              </select>
              {showCustomUnit && (
                <input
                  type="text"
                  name="customUnit"
                  value={customUnit}
                  onChange={handleCustomUnitChange}
                  placeholder="Enter custom unit"
                  required={formData.unit === 'other'}
                />
              )}
            </div>
          </div>
          <div className="form-group">
              <label>Quantity</label>
              <input
                type="text"
                name="quantity"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.quantity}
                onChange={handleQuantityChange}
                placeholder="Enter quantity"
                required
              />
            </div>


          <div className="sub-header">Nutritional Information</div>
          <div className="nutritional-section">
            <div className="form-row">
              <div className="form-group">
                <label>Calories (kcal)</label>
                <input 
                  type="number" 
                  name="calories"
                  value={formData.calories === 0 ? '' : formData.calories} 
                  onChange={handleNumberInputChange} 
                  min="0" 
                  step="0.1" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Protein (g)</label>
                <input 
                  type="number" 
                  name="protein"
                  value={formData.protein === 0 ? '' : formData.protein} 
                  onChange={handleNumberInputChange} 
                  min="0" 
                  step="0.1" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Carbs (g)</label>
                <input 
                  type="number" 
                  name="carbohydrates"
                  value={formData.carbohydrates === 0 ? '' : formData.carbohydrates} 
                  onChange={handleNumberInputChange} 
                  min="0" 
                  step="0.1" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Fat (g)</label>
                <input 
                  type="number" 
                  name="fat"
                  value={formData.fat === 0 ? '' : formData.fat} 
                  onChange={handleNumberInputChange} 
                  min="0" 
                  step="0.1" 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Price per Unit</label>
            <input 
              type="number"
              name="price"
              step="0.01" 
              min="0"
              value={formData.price === 0 ? '' : formData.price} 
              onChange={handleNumberInputChange} 
              required 
            />
          </div>

          <button type="submit" className="btn">
            {editingId ? "Update" : "Add"} Food Item
          </button>
        </form>

        {foodItems.length > 0 && (
          <div className="table-section">
            <h4>Food Items List</h4>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Food Type</th>
                  <th>Category</th>
                  <th>Calories</th>
                  <th>Protein (g)</th>
                  <th>Carbs (g)</th>
                  <th>Fat (g)</th>
                  <th>Price</th>
                  <th>Unit</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {foodItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.foodType}</td>
                    <td>{item.category}</td>
                    <td>{item.calories}</td>
                    <td>{item.protein}</td>
                    <td>{item.carbohydrates}</td>
                    <td>{item.fat}</td>
                    <td>₹{item.price}</td>
                    <td>{item.unit}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <button 
                        onClick={() => handleEdit(item)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default FoodItemForm;