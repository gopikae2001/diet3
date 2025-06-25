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

const DietRequestApproval: React.FC = () => {
  const [requests, setRequests] = useState<DietRequest[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editRequest, setEditRequest] = useState<Partial<DietRequest> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('dietRequests');
    if (saved) {
      setRequests(JSON.parse(saved));
    }
  }, []);

  const handleApprove = (id: string) => {
    const request = requests.find(r => r.id === id);
    if (request) {
      setRequests(prev => {
        const updated = prev.map(r =>
          r.id === id ? { ...r, status: 'Diet Order Placed' as const } : r
        );
        localStorage.setItem('dietRequests', JSON.stringify(updated));
        return updated;
      });
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
    alert(`Patient: ${req.patientName}\nDoctor: ${req.doctor}\nStatus: ${req.status}`);
  };

  const handleEdit = (id: string) => {
    const req = requests.find(r => r.id === id);
    if (req) {
      setEditId(id);
      setEditRequest({ ...req });
    }
  };
  const handleEditSave = () => {
    if (!editId || !editRequest) return;
    setRequests(prev => {
      const updated = prev.map(r =>
        r.id === editId ? { ...r, ...editRequest } : r
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
        req.id === id ? { ...req, status: 'Rejected' as const } : req
      );
      localStorage.setItem('dietRequests', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <>
      <Header sidebarCollapsed={false} toggleSidebar={() => {}} />
      <div className="dietrequest-container">
        <div className="header">
          <PageHeader title="Diet Request Approval" subtitle="Review and approve patient diet requests" />
        </div>
        <div className="form-section">
          <div className="section-header">Requested Patients</div>
          <div className="dietrequest-table-container">
            <table className="dietrequest-table">
              <thead>
                <tr style={{ backgroundColor: '#038ba4', color: 'white' }}>
                  <th>S.No</th>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Bed</th>
                  <th>Ward</th>
                  <th>Floor</th>
                  <th>Consulting Doctor</th>
                  <th>Doctor Notes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr><td colSpan={11} style={{ textAlign: 'center' }}>No diet requests found.</td></tr>
                ) : (
                  requests.map((req, index) => (
                    <tr key={req.id}>
                      <td>{index + 1}</td>
                      {editId === req.id ? (
                        <>
                          <td><input name="patientId" value={editRequest?.patientId || ''} onChange={e => setEditRequest({ ...editRequest, patientId: e.target.value })} className="form-control" style={{ minWidth: 120 }} /></td>
                          <td><input name="patientName" value={editRequest?.patientName || ''} onChange={e => setEditRequest({ ...editRequest, patientName: e.target.value })} className="form-control" style={{ minWidth: 120 }} /></td>
                          <td><input name="age" value={editRequest?.age || ''} onChange={e => setEditRequest({ ...editRequest, age: e.target.value })} className="form-control" style={{ minWidth: 80 }} /></td>
                          <td><input name="bed" value={editRequest?.bed || ''} onChange={e => setEditRequest({ ...editRequest, bed: e.target.value })} className="form-control" style={{ minWidth: 80 }} /></td>
                          <td><input name="ward" value={editRequest?.ward || ''} onChange={e => setEditRequest({ ...editRequest, ward: e.target.value })} className="form-control" style={{ minWidth: 100 }} /></td>
                          <td><input name="floor" value={editRequest?.floor || ''} onChange={e => setEditRequest({ ...editRequest, floor: e.target.value })} className="form-control" style={{ minWidth: 80 }} /></td>
                          <td><input name="doctor" value={editRequest?.doctor || ''} onChange={e => setEditRequest({ ...editRequest, doctor: e.target.value })} className="form-control" style={{ minWidth: 120 }} /></td>
                          <td><input name="doctorNotes" value={editRequest?.doctorNotes || ''} onChange={e => setEditRequest({ ...editRequest, doctorNotes: e.target.value })} className="form-control" style={{ minWidth: 120 }} /></td>
                          <td>
                            <span className={`badge status-${req.status.replace(/\s/g, '').toLowerCase()}`}>{req.status}</span>
                          </td>
                          <td>
                            <button className="btn-text" style={{ fontSize: 12 }} onClick={handleEditSave}>Save</button>
                            <button className="btn-text" style={{ fontSize: 12 }} onClick={handleEditCancel}>Cancel</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{req.patientId}</td>
                          <td>{req.patientName}</td>
                          <td>{req.age}</td>
                          <td>{req.bed}</td>
                          <td>{req.ward}</td>
                          <td>{req.floor}</td>
                          <td>{req.doctor}</td>
                          <td>{req.doctorNotes}</td>
                          <td>
                            <span className={`badge status-${req.status.replace(/\s/g, '').toLowerCase()}`}>{req.status}</span>
                          </td>
                          <td style={{ display: 'flex', gap: 10 }}>
                            <button className="btn-text" style={{ fontSize: 12 }} onClick={() => handleView(req)}>View</button>
                            <button className="btn-text" style={{ background: '#0d92ae', color: '#fff' }} onClick={() => handleApprove(req.id)}>Approve</button>
                            <button className="btn-text" style={{ background: '#fbc02d', color: '#fff' }} onClick={() => handleEdit(req.id)}>Edit</button>
                            <button className="btn-text" style={{ background: '#e53935', color: '#fff' }} onClick={() => handleReject(req.id)}>Reject</button>
                            <button className="btn-text" style={{ background: '#757575', color: '#fff' }} onClick={() => handleDelete(req.id)}>Delete</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DietRequestApproval; 