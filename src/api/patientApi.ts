// Mock patient data
const patients = [
  { id: '1', name: 'John Doe', cardNo: 'CARD001', mobile: '9876543210' },
  { id: '2', name: 'Jane Smith', cardNo: 'CARD002', mobile: '9876543211' },
  { id: '3', name: 'Robert Johnson', cardNo: 'CARD003', mobile: '9876543212' },
  { id: '4', name: 'Emily Davis', cardNo: 'CARD004', mobile: '9876543213' },
  { id: '5', name: 'Michael Brown', cardNo: 'CARD005', mobile: '9876543214' },
];

// Search patients by name, card number, or mobile
export const searchPatients = (query: string) => {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  return patients.filter(patient => 
    patient.name.toLowerCase().includes(lowerQuery) ||
    patient.cardNo.toLowerCase().includes(lowerQuery) ||
    patient.mobile.includes(query)
  );
};

// Get all patients
export const getAllPatients = () => {
  return patients;
};
