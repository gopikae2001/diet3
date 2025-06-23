import { useState, useEffect } from "react";
import "../styles/CanteenInterface.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";

interface FoodItem {
  name: string;
  quantity: string;
}

interface MealItemDetail {
  foodItemName: string;
  quantity: number;
  unit: string;
}

interface MealWithStatus {
  items: MealItemDetail[];
  status: Status;
}

interface MealItems {
  breakfast?: MealWithStatus;
  brunch?: MealWithStatus;
  lunch?: MealWithStatus;
  evening?: MealWithStatus;
  dinner?: MealWithStatus;
}

type Status = "pending" | "active" | "paused" | "stopped" | "prepared" | "delivered";

interface MealOrder {
  id: string;
  patientName: string;
  bed: string;
  ward: string;
  dietPackageName?: string;
  dietType: string;
  foodItems: FoodItem[];
  specialNotes: string;
  status: Status;
  prepared: boolean;
  delivered: boolean;
  dieticianInstructions?: string;
  mealItems?: MealItems;
}

interface CanteenInterfaceProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const CanteenInterface: React.FC<CanteenInterfaceProps> = ({ sidebarCollapsed, toggleSidebar }) => {
  const [selectedMeal, setSelectedMeal] = useState<string>("breakfast");
  const [mealOrders, setMealOrders] = useState<MealOrder[]>([]);

  const loadOrders = () => {
    const savedCanteenOrders = localStorage.getItem('canteenOrders');
    if (savedCanteenOrders) {
      const parsedOrders: MealOrder[] = JSON.parse(savedCanteenOrders);
      
      const transformedOrders = parsedOrders.map(order => {
        const mealKey = selectedMeal as keyof MealItems;
        let foodItems: FoodItem[] = [];
        let mealStatus: Status = 'pending';
        let mealItems: MealItems = {};
        if (order.mealItems && order.mealItems[mealKey]) {
          if ('items' in order.mealItems[mealKey]) {
            foodItems = (order.mealItems[mealKey] as MealWithStatus).items.map(item => ({
              name: item.foodItemName,
              quantity: `${item.quantity} ${item.unit}`
            }));
            mealStatus = (order.mealItems[mealKey] as MealWithStatus).status;
            mealItems = order.mealItems as MealItems;
          } else {
            const items = (order.mealItems[mealKey] as MealItemDetail[]);
            foodItems = items.map(item => ({
              name: item.foodItemName,
              quantity: `${item.quantity} ${item.unit}`
            }));
            mealStatus = 'pending';
            mealItems = {
              ...order.mealItems,
              [mealKey]: { items, status: 'pending' as Status }
            };
          }
        }
        return {
          id: order.id,
          patientName: order.patientName,
          bed: order.bed,
          ward: order.ward,
          dietPackageName: order.dietPackageName,
          dietType: order.dietPackageName || 'N/A',
          foodItems: foodItems,
          specialNotes: order.dieticianInstructions || '',
          status: mealStatus,
          prepared: mealStatus === 'prepared',
          delivered: mealStatus === 'delivered',
          dieticianInstructions: order.dieticianInstructions,
          mealItems: mealItems,
        };
      });

      setMealOrders(transformedOrders);
    }
  };

  useEffect(() => {
    loadOrders();
    
    const handleStorageChange = () => {
      loadOrders();
    };

    window.addEventListener('canteenOrdersUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('canteenOrdersUpdated', handleStorageChange);
    };
  }, [selectedMeal]);


  const updateAndSaveOrders = (updatedOrders: MealOrder[]) => {
    setMealOrders(updatedOrders);
    const savedCanteenOrders = localStorage.getItem('canteenOrders');
    if (savedCanteenOrders) {
      const originalOrders: MealOrder[] = JSON.parse(savedCanteenOrders);
      const newOriginalOrders = originalOrders.map(originalOrder => {
        const updatedOrder = updatedOrders.find(uo => uo.id === originalOrder.id);
        if (updatedOrder) {
          const status: Status = (['pending', 'active', 'paused', 'stopped', 'prepared', 'delivered'].includes(updatedOrder.status) ? updatedOrder.status : 'pending') as Status;
          return {
            id: originalOrder.id,
            patientName: originalOrder.patientName,
            bed: originalOrder.bed,
            ward: originalOrder.ward,
            dietPackageName: originalOrder.dietPackageName,
            dietType: originalOrder.dietType,
            foodItems: originalOrder.foodItems,
            specialNotes: originalOrder.specialNotes,
            status,
            prepared: updatedOrder.prepared,
            delivered: updatedOrder.delivered,
            dieticianInstructions: originalOrder.dieticianInstructions,
            mealItems: originalOrder.mealItems,
          };
        }
        return originalOrder;
      });
      localStorage.setItem('canteenOrders', JSON.stringify(newOriginalOrders));
    }
  };

  const handleMarkActive = (id: string) => {
    const updatedOrders = mealOrders.map(order => {
      if (order.id === id && order.mealItems && order.mealItems[selectedMeal as keyof MealItems]) {
        return {
          ...order,
          mealItems: {
            ...order.mealItems,
            [selectedMeal]: {
              ...order.mealItems[selectedMeal as keyof MealItems],
              status: 'active' as Status
            }
          }
        };
      }
      return order;
    });
    updateAndSaveOrders(updatedOrders);
  };

  const handleMarkPrepared = (id: string) => {
    const updatedOrders = mealOrders.map(order => {
      if (order.id === id && order.mealItems && order.mealItems[selectedMeal as keyof MealItems]) {
        return {
          ...order,
          mealItems: {
            ...order.mealItems,
            [selectedMeal]: {
              ...order.mealItems[selectedMeal as keyof MealItems],
              status: 'prepared' as Status
            }
          }
        };
      }
      return order;
    });
    updateAndSaveOrders(updatedOrders);
  };

  const handleMarkDelivered = (id: string) => {
    const updatedOrders = mealOrders.map(order => {
      if (order.id === id && order.mealItems && order.mealItems[selectedMeal as keyof MealItems]) {
        return {
          ...order,
          mealItems: {
            ...order.mealItems,
            [selectedMeal]: {
              ...order.mealItems[selectedMeal as keyof MealItems],
              status: 'delivered' as Status
            }
          }
        };
      }
      return order;
    });
    updateAndSaveOrders(updatedOrders);
  };

  const totalQuantities = mealOrders.reduce((acc, order) => {
    order.foodItems.forEach(item => {
      const quantityMatch = item.quantity.match(/^(\d+)/);
      const quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : 0;
      if (acc[item.name]) {
        acc[item.name] += quantity;
      } else {
        acc[item.name] = quantity;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
    <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
    <div className="canteen-container">
      <div className="header">
        <PageHeader title="Canteen Interface" subtitle="Meal preparation and delivery management" />
      </div>

      <div className="card">
        <label className="label">Select Meal Type</label>
        <select
          value={selectedMeal}
          onChange={(e) => setSelectedMeal(e.target.value)}
          className="select"
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="brunch">Brunch</option>
          <option value="evening">Evening</option>
        </select>
      </div>

      <div className="header">TOTAL QUANTITY SUMMARY - {selectedMeal.toUpperCase()}</div>
      <div className="card grid">
        {Object.entries(totalQuantities).map(([item, quantity]) => (
          <div key={item} className="summary-box">
            <div className="item-name">{item}</div>
            <div className="item-quantity">{quantity} portions</div>
          </div>
        ))}
      </div>

      <div className="header">PATIENT MEAL ORDERS - {selectedMeal.toUpperCase()}</div>
      <div className="card">
        <table className="meal-table">
          <thead>
            <tr style={{ backgroundColor: '#038ba4', color: 'white' }}>
              <th>Patient</th>
              <th>Bed/Ward</th>
              <th>Diet Type</th>
              <th>Food Items</th>
              <th>Special Notes</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mealOrders.map((order) => {
              const mealStatus = order.mealItems && order.mealItems[selectedMeal as keyof MealItems]?.status || 'pending';
              return (
                <tr key={order.id}>
                  <td>{order.patientName}</td>
                  <td>{order.bed} / {order.ward}</td>
                  <td>{order.dietType}</td>
                  <td>
                    <ul>
                      {order.foodItems.map((item, index) => (
                        <li key={index}>{item.name} - {item.quantity}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    {order.specialNotes && (
                      <span className="badge warning">{order.specialNotes}</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge status-${mealStatus}`}>{mealStatus.charAt(0).toUpperCase() + mealStatus.slice(1)}</span>
                  </td>
                  <td>
                    <div className="button-group">
                      <button
                        className="btn green"
                        disabled={mealStatus !== 'pending'}
                        onClick={() => handleMarkActive(order.id)}
                      >
                        Active
                      </button>
                      <button
                        className="btn green"
                        disabled={mealStatus !== 'active'}
                        onClick={() => handleMarkPrepared(order.id)}
                      >
                        Prepared
                      </button>
                      <button
                        className="btn blue"
                        disabled={mealStatus !== 'prepared'}
                        onClick={() => handleMarkDelivered(order.id)}
                      >
                        Delivered
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
        <Footer/>
    </>
  );
}
 
export default CanteenInterface;