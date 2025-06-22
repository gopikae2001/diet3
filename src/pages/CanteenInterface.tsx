import { useState } from "react";
import "../styles/CanteenInterface.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
interface MealOrder {
  id: string;
  patientName: string;
  bed: string;
  ward: string;
  dietType: string;
  foodItems: { name: string; quantity: string; }[];
  specialNotes: string;
  status: "active" | "paused" | "stopped";
  prepared: boolean;
  delivered: boolean;
}
interface CanteenInterfaceProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}
const CanteenInterface: React.FC<CanteenInterfaceProps> = ({ sidebarCollapsed, toggleSidebar }) => {
  const [selectedMeal, setSelectedMeal] = useState<string>("breakfast");
  const [mealOrders, setMealOrders] = useState<MealOrder[]>([
    {
      id: "1",
      patientName: "John Doe",
      bed: "B12",
      ward: "General",
      dietType: "Diabetic Package",
      foodItems: [
        { name: "Oatmeal", quantity: "1 cup" },
        { name: "Banana", quantity: "1 piece" },
        { name: "Green Tea", quantity: "1 cup" },
      ],
      specialNotes: "No sugar, soft food",
      status: "active",
      prepared: false,
      delivered: false,
    },
    {
      id: "2",
      patientName: "Jane Smith",
      bed: "B15",
      ward: "ICU",
      dietType: "Low Sodium Package",
      foodItems: [
        { name: "Scrambled Eggs", quantity: "2 eggs" },
        { name: "Toast", quantity: "2 slices" },
        { name: "Orange Juice", quantity: "1 glass" },
      ],
      specialNotes: "Low sodium only",
      status: "active",
      prepared: true,
      delivered: false,
    },
  ]);

  const handleMarkPrepared = (id: string) => {
    setMealOrders(orders =>
      orders.map(order =>
        order.id === id ? { ...order, prepared: true } : order
      )
    );
  };

  const handleMarkDelivered = (id: string) => {
    setMealOrders(orders =>
      orders.map(order =>
        order.id === id ? { ...order, delivered: true } : order
      )
    );
  };

  const activeOrders = mealOrders.filter(order => order.status === "active");

  // const totalQuantities = activeOrders.reduce((acc, order) => {
  //   order.foodItems.forEach(item => {
  //     if (acc[item.name]) {
  //       acc[item.name] += 1;
  //     } else {
  //       acc[item.name] = 1;
  //     }
  //   });
  //   return acc;
  // }, {} as Record<string, number>);

  return (
    <>
    <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
    <div className="canteen-container">
      <div className="header">
        <PageHeader title="Canteen Interface" subtitle="Meal preparation and delivery management" />
      </div>

        {/* <div className="card">
          <label className="label">Select Meal Type</label>
          <select
            value={selectedMeal}
            onChange={(e) => setSelectedMeal(e.target.value)}
            className="select"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div> */}

      {/* <div className="header">TOTAL QUANTITY SUMMARY - {selectedMeal.toUpperCase()}</div>
      <div className="card grid">
        {Object.entries(totalQuantities).map(([item, quantity]) => (
          <div key={item} className="summary-box">
            <div className="item-name">{item}</div>
            <div className="item-quantity">{quantity} portions</div>
          </div>
        ))}
      </div> */}

      {/* <div className="header">PATIENT MEAL ORDERS - {selectedMeal.toUpperCase()}</div> */}
      <div className="card">
        <table className="meal-table">
          <thead>
            <tr>
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
            {activeOrders.map((order) => (
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
                  <div>
                    <span className="badge">{order.prepared ? "Prepared" : "Pending"}</span>
                    <span className="badge">{order.delivered ? "Delivered" : "Not Delivered"}</span>
                  </div>
                </td>
                <td>
                  <div className="button-group">
                    {!order.prepared && (
                      <button className="btn green" onClick={() => handleMarkPrepared(order.id)}>
                        ✔
                      </button>
                    )}
                    {order.prepared && !order.delivered && (
                      <button className="btn blue" onClick={() => handleMarkDelivered(order.id)}>
                        🚚
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
        <Footer/>
    </>
  );
}
 
export default CanteenInterface;