import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Card, Button, FormGroup, PageHeader, Table } from '../styles/CommonStyles';
import { ConfirmModal, InputModal, Modal } from './Modal';
import { theme } from '../styles/theme';
import { useToast } from '../contexts/ToastContext';
import { MdPerson, MdEmail, MdLock, MdAdminPanelSettings, MdVisibility, MdEdit, MdCheck, MdDelete, MdRefresh, MdCheckCircle, MdCancel } from 'react-icons/md';
import { TableSkeleton } from './LoadingSkeleton';
import EmptyState from './EmptyState';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    body.dark-theme & {
      color: #e5e5e5;
    }
  }
`;

function Users() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModal, setEditModal] = useState({ isOpen: false, user: null });
  const [editUser, setEditUser] = useState({ username: '', email: '', role: '', active: true });
  const [resetPasswordModal, setResetPasswordModal] = useState({ isOpen: false, userId: null, userName: '' });
  const [newPassword, setNewPassword] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null, userName: '' });
  const [bulkDeleteModal, setBulkDeleteModal] = useState({ isOpen: false });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'data_entry'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await axios.get('/api/users', {
        headers: { 'x-auth-token': token }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/auth/register', newUser, {
        headers: { 'x-auth-token': token }
      });
      setShowAddModal(false);
      setNewUser({ username: '', email: '', password: '', role: 'data_entry' });
      showToast('User added successfully', 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.msg || 'Error adding user', 'error');
    }
  };

  const handleResetPasswordClick = (user) => {
    setResetPasswordModal({
      isOpen: true,
      userId: user._id,
      userName: user.username
    });
    setNewPassword('');
  };

  const handleResetPasswordSubmit = async () => {
    if (!newPassword || newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'warning');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.post(`/api/users/${resetPasswordModal.userId}/reset-password`,
        { newPassword },
        { headers: { 'x-auth-token': token } }
      );

      // Close modal first
      setResetPasswordModal({ isOpen: false, userId: null, userName: '' });
      setNewPassword('');

      // Show toast after a brief delay to ensure modal is closed
      setTimeout(() => {
        showToast('Password reset successfully', 'success');
      }, 100);
    } catch (err) {
      console.error('Reset password error:', err);
      showToast(err.response?.data?.message || 'Error resetting password', 'error');
    }
  };

  const handleEditClick = (user) => {
    setEditUser({
      username: user.username,
      email: user.email,
      role: user.role,
      active: user.active
    });
    setEditModal({ isOpen: true, user });
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      await axios.put(`/api/users/${editModal.user._id}`, editUser, {
        headers: { 'x-auth-token': token }
      });
      showToast('User updated successfully', 'success');
      setEditModal({ isOpen: false, user: null });
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.msg || 'Failed to update user', 'error');
    }
  };

  const handleDeleteClick = (user) => {
    setDeleteModal({
      isOpen: true,
      userId: user._id,
      userName: user.username
    });
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/users/${deleteModal.userId}`, {
        headers: { 'x-auth-token': token }
      });

      // Close modal first
      setDeleteModal({ isOpen: false, userId: null, userName: '' });

      // Show toast after a brief delay
      setTimeout(() => {
        showToast('User deleted successfully', 'success');
      }, 100);

      fetchUsers();
    } catch (err) {
      showToast('Error deleting user', 'error');
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map(user => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedUsers.length === 0) {
      showToast('Please select users to delete', 'warning');
      return;
    }
    setBulkDeleteModal({ isOpen: true });
  };

  const confirmBulkDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.delete('/api/users',
        {
          headers: { 'x-auth-token': token },
          data: { userIds: selectedUsers }
        }
      );

      // Close modal first
      setBulkDeleteModal({ isOpen: false });
      setSelectedUsers([]);

      // Show toast after a brief delay
      setTimeout(() => {
        showToast(res.data.msg || 'Users deleted successfully', 'success');
      }, 100);

      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.msg || 'Error deleting users', 'error');
    }
  };

  return (
    <div>
      <PageHeader>
        <h1>User Management</h1>
        <p>Manage system users and their permissions</p>
      </PageHeader>

      <Card>
        <Header>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>User Accounts</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            {selectedUsers.length > 0 && (
              <Button
                $variant="danger"
                onClick={handleBulkDeleteClick}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <MdDelete size={18} /> Delete Selected ({selectedUsers.length})
              </Button>
            )}
            <Button $variant="primary" onClick={() => setShowAddModal(true)}>
              + Add User
            </Button>
          </div>
        </Header>

        {loading ? (
          <TableSkeleton rows={5} />
        ) : users.length === 0 ? (
          <EmptyState
            icon={<MdPerson size={48} />}
            title="No Users Found"
            description="There are no users in the system yet. Add your first user to get started."
            action={() => setShowAddModal(true)}
            actionText="Add First User"
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedUsers.length === users.length && users.length > 0}
                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                </th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                  </td>
                  <td style={{ fontWeight: 500 }}>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: user.role === 'admin' ? theme.colors.primary + '20' : theme.colors.gray200,
                      color: user.role === 'admin' ? theme.colors.primary : theme.colors.gray700
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</td>
                  <td>
                    {user.active ? (
                      <MdCheckCircle size={20} style={{ color: '#10b981' }} />
                    ) : (
                      <MdCancel size={20} style={{ color: '#ef4444' }} />
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button
                        $variant="primary"
                        $size="small"
                        onClick={() => handleEditClick(user)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <MdEdit size={16} /> Edit
                      </Button>
                      <Button
                        $variant="secondary"
                        $size="small"
                        onClick={() => handleResetPasswordClick(user)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <MdRefresh size={16} /> Reset Password
                      </Button>
                      <Button
                        $variant="danger"
                        $size="small"
                        onClick={() => handleDeleteClick(user)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <MdDelete size={16} /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New User"
        icon={<MdPerson size={28} />}
        footer={
          <>
            <Button $variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button $variant="primary" onClick={handleAddUser}>
              <MdCheck /> Add User
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddUser}>
          <FormGroup>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MdPerson /> Username</label>
            <input
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              placeholder="Enter username"
              required
            />
          </FormGroup>
          <FormGroup>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MdEmail /> Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="user@example.com"
              required
            />
          </FormGroup>
          <FormGroup>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MdLock /> Password</label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              placeholder="Minimum 6 characters"
              required
              minLength={6}
            />
          </FormGroup>
          <FormGroup>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MdAdminPanelSettings /> Role</label>
            <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
              <option value="data_entry">Data Entry</option>
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
          </FormGroup>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, user: null })}
        title={`Edit User: ${editModal.user?.username}`}
        icon={<MdEdit size={28} />}
        footer={
          <>
            <Button $variant="secondary" onClick={() => setEditModal({ isOpen: false, user: null })}>
              Cancel
            </Button>
            <Button $variant="primary" onClick={handleEditUser}>
              <MdCheck /> Save Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditUser}>
          <FormGroup>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MdPerson /> Username</label>
            <input
              value={editUser.username}
              onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
              placeholder="Enter username"
              required
            />
          </FormGroup>
          <FormGroup>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MdEmail /> Email</label>
            <input
              type="email"
              value={editUser.email}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              placeholder="user@example.com"
              required
            />
          </FormGroup>
          <FormGroup>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MdAdminPanelSettings /> Role</label>
            <select value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}>
              <option value="data_entry">Data Entry</option>
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
          </FormGroup>
          <FormGroup>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MdCheckCircle /> Account Status
            </label>
            <select 
              value={editUser.active ? 'active' : 'inactive'} 
              onChange={(e) => setEditUser({ ...editUser, active: e.target.value === 'active' })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </FormGroup>
        </form>
      </Modal>

      {/* Reset Password Modal */}
      <InputModal
        isOpen={resetPasswordModal.isOpen}
        onClose={() => setResetPasswordModal({ isOpen: false, userId: null, userName: '' })}
        onSubmit={handleResetPasswordSubmit}
        title={`Reset Password for ${resetPasswordModal.userName}`}
        icon={<MdLock size={28} />}
        label={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MdLock /> New Password</span>}
        placeholder="Enter new password (min. 6 characters)"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        type="password"
        submitText={<span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MdRefresh /> Reset Password</span>}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, userId: null, userName: '' })}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete user "${deleteModal.userName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={bulkDeleteModal.isOpen}
        onClose={() => setBulkDeleteModal({ isOpen: false })}
        onConfirm={confirmBulkDelete}
        title="Delete Multiple Users"
        message={`Are you sure you want to delete ${selectedUsers.length} user(s)? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}

export default Users;
