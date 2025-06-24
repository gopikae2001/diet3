import React, { useState, useEffect } from "react";
import "../styles/DietPackageForm.css";
import "../styles/Notification.css";
import Header from "../components/Header"; 
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import { foodItemApi } from "../api/foodItemApi";
import type { FoodItem } from "../types/foodItem";

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

interface MealItem {
  foodItemId: string;
  foodItemName: string;
  quantity: number;
  unit: string;
}
interface DietPackageFormProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
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

const DietPackageForm: React.FC<DietPackageFormProps> = ({ sidebarCollapsed, toggleSidebar }) => {
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
  
  // Load saved packages from localStorage on initial render
  const [dietPackages, setDietPackages] = useState<DietPackage[]>(() => {
    try {
      const saved = localStorage.getItem('dietPackages');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load diet packages from localStorage:', error);
      return [];
    }
  });

  // Save packages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('dietPackages', JSON.stringify(dietPackages));
    } catch (error) {
      console.error('Failed to save diet packages to localStorage:', error);
    }
  }, [dietPackages]);

  const [formData, setFormData] = useState({ name: "", type: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [meals, setMeals] = useState({
    breakfast: [] as MealItem[],
    brunch: [] as MealItem[],
    lunch: [] as MealItem[],
    dinner: [] as MealItem[],
    evening: [] as MealItem[],
  });

  const calculateTotals = () => {
    let totalRate = 0;
    let totalNutrition = { calories: 0, protein: 0, carbohydrates: 0, fat: 0 };

    const allMeals = [...meals.breakfast, ...meals.brunch, ...meals.lunch, ...meals.dinner, ...meals.evening];

    allMeals.forEach((meal) => {
      const foodItem = foodItems.find((item) => item.id === meal.foodItemId);
      if (foodItem) {
        totalRate += foodItem.price * meal.quantity;
        totalNutrition.calories += foodItem.calories * meal.quantity;
        totalNutrition.protein += foodItem.protein * meal.quantity;
        totalNutrition.carbohydrates += foodItem.carbohydrates * meal.quantity;
        totalNutrition.fat += foodItem.fat * meal.quantity;
      }
    });

    return { totalRate, totalNutrition };
  };

  const addMealItem = (mealType: string) => {
    const newItem: MealItem = { foodItemId: "", foodItemName: "", quantity: 1, unit: "" };

    setMeals((prev) => ({
      ...prev,
      [mealType]: [...prev[mealType as keyof typeof prev], newItem],
    }));
  };

  const updateMealItem = (mealType: string, index: number, field: string, value: any) => {
    setMeals((prev) => {
      const updatedMeals = { ...prev };
      const mealArray = [...updatedMeals[mealType as keyof typeof updatedMeals]] as MealItem[];
      mealArray[index] = { ...mealArray[index], [field]: value };

      if (field === "foodItemId") {
        const foodItem = foodItems.find((item) => item.id === value);
        if (foodItem) {
          mealArray[index].foodItemName = foodItem.name;
          mealArray[index].unit = foodItem.unit;
        }
      }

      updatedMeals[mealType as keyof typeof updatedMeals] = mealArray as any;
      return updatedMeals;
    });
  };

  const removeMealItem = (mealType: string, index: number) => {
    setMeals((prev) => {
      const updatedMeals = { ...prev };
      const mealArray = [...updatedMeals[mealType as keyof typeof updatedMeals]] as MealItem[];
      mealArray.splice(index, 1);
      updatedMeals[mealType as keyof typeof updatedMeals] = mealArray as any;
      return updatedMeals;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { totalRate, totalNutrition } = calculateTotals();

    const newPackage: DietPackage = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      type: formData.type,
      breakfast: meals.breakfast,
      brunch: meals.brunch,
      lunch: meals.lunch,
      dinner: meals.dinner,
      evening: meals.evening,
      totalRate,
      totalNutrition,
    };

    setDietPackages(prev => {
      let updated;
      if (editingId) {
        updated = prev.map(pkg => pkg.id === editingId ? newPackage : pkg);
        showNotification('Diet package updated successfully!', 'success');
      } else {
        updated = [...prev, newPackage];
        showNotification('Diet package created successfully!', 'success');
      }
      // Update localStorage immediately
      localStorage.setItem('dietPackages', JSON.stringify(updated));
      return updated;
    });

    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", type: "" });
    setMeals({ breakfast: [], brunch: [], lunch: [], dinner: [], evening: [] });
    setEditingId(null);
  };

  const handleEdit = (pkg: DietPackage) => {
    setFormData({ name: pkg.name, type: pkg.type });
    setEditingId(pkg.id);
    setMeals({
      breakfast: pkg.breakfast || [],
      brunch: pkg.brunch || [],
      lunch: pkg.lunch || [],
      dinner: pkg.dinner || [],
      evening: pkg.evening || [],
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      setDietPackages((prev) => {
        const updated = prev.filter((pkg) => pkg.id !== id);
        // Update localStorage immediately
        localStorage.setItem('dietPackages', JSON.stringify(updated));
        showNotification('Diet package deleted successfully!', 'success');
        return updated;
      });
    }
  };

  const MealSection: React.FC<{ title: string; mealType: string; items: MealItem[] }> = ({
    title,
    mealType,
    items,
  }) => (
    <div className="meal-card">
      <h3>
        {title}
        <button 
          type="button" 
          className="add" 
          onClick={() => addMealItem(mealType)}
          style={{
            padding: '8px 12px',
            fontSize: '11px',
            borderRadius: '4px',
            border: '1px solid #0d92ae',
            background: 'transparent',
            color: '#0d92ae',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            marginLeft: '10px'
          }}
        >
          + Add Item
        </button>
      </h3>
      {items.length > 0 ? (
        <div className="meal-items">
          {items.map((item, index) => (
            <div key={index} className="meal-row">
              <select
                value={item.foodItemId}
                onChange={(e) => updateMealItem(mealType, index, "foodItemId", e.target.value)}
                style={{
                  padding: '9px 8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '12px',
                  width: '100%',
                  maxWidth: '250px',
                  flex: '1 1 auto',
                  minWidth: '150px'
                }}
              >
                <option value="">Select Food Item</option>
                {foodItems.map((food) => (
                  <option key={food.id} value={food.id}>{food.name}</option>
                ))}
              </select>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateMealItem(mealType, index, "quantity", parseFloat(e.target.value))}
                style={{
                  padding: '9px 8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  width: '50px',
                  flex: '0 0 auto',
                  textAlign: 'center'
                }}
              />
              <span style={{
                textAlign: 'center',
                minWidth: '40px',
                padding: '0 5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px'
              }}>
                {item.unit}
              </span>
              <button 
                type="button" 
                className="danger" 
                onClick={() => removeMealItem(mealType, index)}
                style={{
                  background: 'none',
                  border: '1px solid #dc3545',
                  color: '#dc3545',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  padding: '6px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  flex: '0 0 auto',
                  width: '30px',
                  height: '34px'
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#666', fontStyle: 'italic', margin: '10px 0 0 0' }}>
          No items added yet. Click "Add Item" to get started.
        </p>
      )}
    </div>
  );

  const { totalRate, totalNutrition } = calculateTotals();

  return (
    <>
    <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
    <div className="dietpackage-container">
      <div className="header">
        <PageHeader title='Diet Package' subtitle='Create your diet package'/>
      </div>

      {/* <div className="form-section">DIET PACKAGE</div> */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="grid-two-cols">
            <div>
              <label>Diet Package Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Diet Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <option value="">Select</option>
                <option value="regular">Regular</option>
                <option value="specialized">Specialized</option>
                <option value="therapeutic">Therapeutic</option>
              </select>
            </div>
          </div>

          <div className="form-section">Meals Configuration</div>
          <div className="grid-two-cols">
            <MealSection title="Breakfast" mealType="breakfast" items={meals.breakfast} />
            <MealSection title="Brunch" mealType="brunch" items={meals.brunch} />
            <MealSection title="Lunch" mealType="lunch" items={meals.lunch} />
            <MealSection title="Evening" mealType="evening" items={meals.evening} />
            <MealSection title="Dinner" mealType="dinner" items={meals.dinner} />
           
          </div>

          <div className="total-section">
            <div>
              <strong>Total Rate:</strong> ₹{totalRate.toFixed(2)}
            </div>
            <div>
              <strong>Total Nutrition:</strong><br />
              Calories: {totalNutrition.calories.toFixed(1)}<br />
              Protein: {totalNutrition.protein.toFixed(1)}g<br />
              Carbs: {totalNutrition.carbohydrates.toFixed(1)}g<br />
              Fat: {totalNutrition.fat.toFixed(1)}g
            </div>
          </div>

          <button type="submit" className="primary">{editingId ? "Update" : "Create"} Diet Package</button>
        </form>
      </div>

      {dietPackages.length > 0 && (
        <div className="table-container">
          <div className="form-section">Diet Packages List</div>
          <table>
            <thead>
              <tr>
                <th>Package Name</th>
                <th>Diet Type</th>
                <th>Total Rate</th>
                <th>Total Calories</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dietPackages.map((pkg) => (
                <tr key={pkg.id}>
                  <td>{pkg.name}</td>
                  <td>{pkg.type}</td>
                  <td>₹{pkg.totalRate.toFixed(2)}</td>
                  <td>{pkg.totalNutrition.calories.toFixed(1)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-text edit" 
                        onClick={() => handleEdit(pkg)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-text reject" 
                        onClick={() => handleDelete(pkg.id)}
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

export default DietPackageForm;
