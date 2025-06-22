import type { FoodItem } from "../types/foodItem";

// Real API calls (currently using localStorage as a mock)
const API_BASE_URL = '/api/food-items';

export const foodItemApi = {
  // Get all food items
  async getAll(): Promise<FoodItem[]> {
    try {
      // In a real app, this would be a fetch/axios call to your backend
      // const response = await fetch(API_BASE_URL);
      // return await response.json();
      
      // Using localStorage for now
      const saved = localStorage.getItem('foodItems');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error fetching food items:', error);
      throw error;
    }
  },

  // Add a new food item
  async create(item: Omit<FoodItem, 'id'>): Promise<FoodItem> {
    try {
      // In a real app:
      // const response = await fetch(API_BASE_URL, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(item)
      // });
      // return await response.json();
      
      // Using localStorage for now
      const newItem = { ...item, id: Date.now().toString() };
      const items = await this.getAll();
      const updatedItems = [...items, newItem];
      localStorage.setItem('foodItems', JSON.stringify(updatedItems));
      return newItem;
    } catch (error) {
      console.error('Error creating food item:', error);
      throw error;
    }
  },

  // Update an existing food item
  async update(id: string, updates: Partial<FoodItem>): Promise<FoodItem> {
    try {
      // In a real app:
      // const response = await fetch(`${API_BASE_URL}/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // });
      // return await response.json();
      
      // Using localStorage for now
      const items = await this.getAll();
      const index = items.findIndex(item => item.id === id);
      if (index === -1) throw new Error('Food item not found');
      
      const updatedItem = { ...items[index], ...updates };
      items[index] = updatedItem;
      localStorage.setItem('foodItems', JSON.stringify(items));
      return updatedItem;
    } catch (error) {
      console.error('Error updating food item:', error);
      throw error;
    }
  },

  // Delete a food item
  async delete(id: string): Promise<void> {
    try {
      // In a real app:
      // await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      
      // Using localStorage for now
      const items = await this.getAll();
      const updatedItems = items.filter(item => item.id !== id);
      localStorage.setItem('foodItems', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error deleting food item:', error);
      throw error;
    }
  }
};
