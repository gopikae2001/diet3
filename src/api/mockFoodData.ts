import type { FoodItem } from "../types/foodItem";

export const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Apple',
    foodType: 'Fruit',
    category: 'Fruits',
    calories: 95,
    protein: 0.5,
    carbohydrates: 25,
    fat: 0.3,
    price: 30,
    unit: 'piece',
    quantity: 1
  },
  {
    id: '2',
    name: 'Chicken Breast',
    foodType: 'Protein',
    category: 'Meat',
    calories: 165,
    protein: 31,
    carbohydrates: 0,
    fat: 3.6,
    price: 200,
    unit: '100g',
    quantity: 1
  },
  {
    id: '3',
    name: 'Brown Rice',
    foodType: 'Grain',
    category: 'Grains',
    calories: 112,
    protein: 2.6,
    carbohydrates: 23.5,
    fat: 0.9,
    price: 50,
    unit: 'cup',
    quantity: 1
  },
  {
    id: '4',
    name: 'Spinach',
    foodType: 'Vegetable',
    category: 'Vegetables',
    calories: 7,
    protein: 0.9,
    carbohydrates: 1.1,
    fat: 0.1,
    price: 20,
    unit: 'cup',
    quantity: 1
  },
  {
    id: '5',
    name: 'Almonds',
    foodType: 'Nut',
    category: 'Nuts & Seeds',
    calories: 576,
    protein: 21,
    carbohydrates: 22,
    fat: 49,
    price: 500,
    unit: '100g',
    quantity: 1
  }
];

// Helper function to initialize mock data in localStorage
export const initializeMockData = () => {
  if (typeof window !== 'undefined' && !localStorage.getItem('foodItems')) {
    localStorage.setItem('foodItems', JSON.stringify(mockFoodItems));
  }
};
