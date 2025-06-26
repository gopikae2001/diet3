import React, { useEffect, useState } from 'react';
import '../styles/DietPackageForm.css';
import '../styles/DietRequestManagement.css';
import '../styles/DietOrder.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import { useNavigate } from 'react-router-dom';

interface DietRequest {
  id: string;
  patientId: string;
  patientName: string;
  age: string;
  bed: string;
  ward: string;
  floor: string;
  doctor: string;
  doctorNotes: string;
  status: 'Pending' | 'Diet Order Placed' | 'Rejected';
}

interface DietRequestManagementProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const DietRequestManagement: React.FC<DietRequestManagementProps> = ({ sidebarCollapsed, toggleSidebar }) => {
  const [requests, setRequests] = useState<DietRequest[]>([]);
  const navigate = useNavigate();
  const [newRequest, setNewRequest] = useState({
    patientId: '',
    patientName: '',
    age: '',
    bed: '',
    ward: '',
    floor: '',
    doctor: '',
    doctorNotes: '',
    status: 'Pending',
    approval: 'Pending',
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [editRequest, setEditRequest] = useState<typeof newRequest | null>(null);

  useEffect(() => {
    // Fetch diet requests from localStorage or mock data
    const saved = localStorage.getItem('dietRequests');
    if (saved) {
      setRequests(JSON.parse(saved));
    } else {
      // Mock data for demo
      const mock: DietRequest[] = [
        {
          id: '1',
          patientId: 'P001',
          patientName: 'John Doe',
          age: '45',
          bed: '12A',
          ward: 'Cardiology',
          floor: '2',
          doctor: 'Dr. Smith',
          doctorNotes: 'Patient has diabetes. Monitor sugar levels.',
          status: 'Pending',
        },
        {
          id: '2',
          patientId: 'P002',
          patientName: 'Jane Smith',
          age: '60',
          bed: '8B',
          ward: 'Neurology',
          floor: '3',
          doctor: 'Dr. Brown',
          doctorNotes: 'Patient is vegetarian. No dietary restrictions.',
          status: 'Diet Order Placed',
        },
      ];
      setRequests(mock);
      localStorage.setItem('dietRequests', JSON.stringify(mock));
    }
  }, []);

  const handleApprove = (id: string) => {
    const request = requests.find(r => r.id === id);
    if (request) {
      // Update status to approved
      setRequests(prev => {
        const updated = prev.map(r => 
          r.id === id ? { ...r, status: 'Diet Order Placed' as const } : r
        );
        localStorage.setItem('dietRequests', JSON.stringify(updated));
        return updated;
      });
      
      // Navigate to diet order page with patient details
      navigate('/dietorder', { 
        state: { 
          patientId: request.patientId,
          patientName: request.patientName,
          age: request.age,
          bed: request.bed,
          ward: request.ward,
          floor: request.floor,
          doctor: request.doctor,
          doctorNotes: request.doctorNotes
        } 
      });
    }
  };

  const handleView = (req: DietRequest) => {
    // Could show a modal or navigate to a details page
    alert(`Patient: ${req.patientName}\nDoctor: ${req.doctor}\nStatus: ${req.status}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editId && editRequest) {
      setEditRequest({ ...editRequest, [name]: value });
    } else {
      setNewRequest({ ...newRequest, [name]: value });
    }
  };

  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequest.patientId || !newRequest.patientName) return;
    const newReq: DietRequest = {
      id: Date.now().toString(),
      patientId: newRequest.patientId,
      patientName: newRequest.patientName,
      age: newRequest.age,
      bed: newRequest.bed,
      ward: newRequest.ward,
      floor: newRequest.floor,
      doctor: newRequest.doctor,
      doctorNotes: newRequest.doctorNotes,
      status: newRequest.status as DietRequest['status'],
    };
    const updated = [newReq, ...requests];
    setRequests(updated);
    localStorage.setItem('dietRequests', JSON.stringify(updated));
    setNewRequest({ patientId: '', patientName: '', age: '', bed: '', ward: '', floor: '', doctor: '', doctorNotes: '', status: 'Pending', approval: 'Pending' });
  };

  const handleEdit = (id: string) => {
    const req = requests.find(r => r.id === id);
    if (req) {
      setEditId(id);
      setEditRequest({ ...req, approval: req.status === 'Diet Order Placed' ? 'Approved' : req.status });
    }
  };
  const handleEditSave = () => {
    if (!editId || !editRequest) return;
    setRequests(prev => {
      const updated = prev.map(r =>
        r.id === editId
          ? { ...r, ...editRequest, status: editRequest.status as DietRequest['status'] }
          : r
      );
      localStorage.setItem('dietRequests', JSON.stringify(updated));
      return updated;
    });
    setEditId(null);
    setEditRequest(null);
  };
  const handleEditCancel = () => {
    setEditId(null);
    setEditRequest(null);
  };
  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this request?')) return;
    setRequests(prev => {
      const updated = prev.filter(r => r.id !== id);
      localStorage.setItem('dietRequests', JSON.stringify(updated));
      return updated;
    });
  };
  const handleReject = (id: string) => {
    setRequests(prev => {
      const updated = prev.map(req =>
        req.id === id ? { ...req, status: 'Rejected' as 'Rejected' } : req
      );
      localStorage.setItem('dietRequests', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <>
      <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className="dietrequest-container">
        <div className="header">
          <PageHeader title="Diet Request Management" subtitle="Manage and approve diet requests from hospital staff" />
        </div>
        <div className="form-section3">
          <div className="section-header">Add Diet Request</div>
          <form className="form" onSubmit={handleAddRequest} style={{ marginBottom: 0 }}>
            <div className="form-row" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
              <div className="form-group" style={{ minWidth: 300, flex: 1 }}>
                <label>Patient ID</label>
                <input name="patientId" value={newRequest.patientId} onChange={handleInputChange} required className="form-control" style={{ minWidth: '100%' }} />
              </div>
              <div className="form-group" style={{ minWidth: 300, flex: 1 }}>
                <label>Patient Name</label>
                <input name="patientName" value={newRequest.patientName} onChange={handleInputChange} required className="form-control" style={{ minWidth: '100%' }} />
              </div>
              <div className="form-group" style={{ minWidth: 300, flex: 1 }}>
                <label>Age</label>
                <input name="age" value={newRequest.age} onChange={handleInputChange} className="form-control" style={{ minWidth: '100%' }} />
              </div>
              <div className="form-group" style={{ minWidth: 300, flex: 1 }}>
                <label>Bed</label>
                <input name="bed" value={newRequest.bed} onChange={handleInputChange} className="form-control" style={{ minWidth: '100%' }} />
              </div>
              <div className="form-group" style={{ minWidth: 300, flex: 1 }}>
                <label>Ward</label>
                <input name="ward" value={newRequest.ward} onChange={handleInputChange} className="form-control" style={{ minWidth: '100%' }} />
              </div>
              <div className="form-group" style={{ minWidth: 300, flex: 1 }}>
                <label>Floor</label>
                <input name="floor" value={newRequest.floor} onChange={handleInputChange} className="form-control" style={{ minWidth: '100%' }} />
              </div>
              <div className="form-group" style={{ minWidth: 300, flex: 1 }}>
                <label>Consulting Doctor</label>
                <input name="doctor" value={newRequest.doctor} onChange={handleInputChange} className="form-control" style={{ minWidth: '100%' }} />
              </div>
              <div className="form-group" style={{ minWidth: 300, flex: 1 }}>
                <label>Doctor Notes</label>
                <input name="doctorNotes" value={newRequest.doctorNotes} onChange={handleInputChange} className="form-control" style={{ minWidth: '100%' }} />
              </div>
            </div>
            <div className="btn-text">
              <button className="primary" type="submit">Add Diet Request</button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DietRequestManagement; 