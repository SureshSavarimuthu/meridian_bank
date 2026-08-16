// @/pages/admin/AdminUsersPage.tsx
import { useState } from 'react';
import { Users, Plus, Save, Edit, Trash2, X } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Field';
import { useToast, Toast } from '@/components/ui/Feedback';
import { useNav } from '@/lib/nav';
import { Badge } from '@/components/ui/Badge';

export function AdminUsersPage() {
  const { navigate } = useNav();
  const { toast, showToast } = useToast();
  const [users, setUsers] = useState([
    { id: 1, name: 'Mr. Sharma', role: 'Branch Manager', branch: 'Mumbai Central', status: 'Active', email: 'sharma@bank.com' },
    { id: 2, name: 'Ms. Patel', role: 'Regional Manager', branch: 'West Zone', status: 'Active', email: 'patel@bank.com' },
    { id: 3, name: 'Mr. Iyer', role: 'Loan Officer', branch: 'Mumbai Central', status: 'Active', email: 'iyer@bank.com' },
    { id: 4, name: 'Ms. Rao', role: 'Teller', branch: 'Delhi North', status: 'Inactive', email: 'rao@bank.com' },
  ]);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: '', branch: '', status: 'Active' });

  const handleAddUser = () => {
    if (!formData.name || !formData.email || !formData.role) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
      showToast('User updated successfully', 'success');
    } else {
      setUsers([...users, { id: Math.max(...users.map(u => u.id), 0) + 1, ...formData }]);
      showToast('User created successfully', 'success');
    }
    setFormData({ name: '', email: '', role: '', branch: '', status: 'Active' });
    setEditingUser(null);
    setShowForm(false);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, branch: user.branch, status: user.status });
    setShowForm(true);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
    showToast('User deleted', 'info');
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader
        title="User Management"
        subtitle="Manage system users and their roles"
        icon={<Users className="h-5 w-5" />}
        action={<Button variant="ghost" onClick={() => navigate('admin')}>Back to Admin</Button>}
      />
      
      <Card padding="lg">
        <CardHeader
          title="Users"
          subtitle="Create and manage user accounts"
          action={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => { setShowForm(true); setEditingUser(null); setFormData({ name: '', email: '', role: '', branch: '', status: 'Active' }); }}>Add user</Button>}
        />

        {showForm && (
          <div className="mb-6 rounded-xl border border-ink-200 bg-ink-50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-semibold text-ink-900">{editingUser ? 'Edit User' : 'New User'}</h4>
              <button onClick={() => { setShowForm(false); setEditingUser(null); }} className="text-ink-400 hover:text-ink-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Input label="Name" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <Input label="Email" type="email" placeholder="john@bank.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <Select label="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} options={[
                { value: 'Branch Manager', label: 'Branch Manager' },
                { value: 'Regional Manager', label: 'Regional Manager' },
                { value: 'Loan Officer', label: 'Loan Officer' },
                { value: 'Teller', label: 'Teller' },
              ]} />
              <Select label="Branch" value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} options={[
                { value: 'Mumbai Central', label: 'Mumbai Central' },
                { value: 'Delhi North', label: 'Delhi North' },
                { value: 'Bangalore East', label: 'Bangalore East' },
              ]} />
              <Select label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
              ]} />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setShowForm(false); setEditingUser(null); }}>Cancel</Button>
              <Button leftIcon={<Save className="h-4 w-4" />} onClick={handleAddUser}>{editingUser ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-ink-100 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-100 text-xs font-semibold uppercase tracking-wide text-ink-400">
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Branch</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-ink-50 last:border-0 text-sm">
                  <td className="px-4 py-3 font-medium text-ink-800">{u.name}</td>
                  <td className="px-4 py-3 text-ink-600">{u.email}</td>
                  <td className="px-4 py-3 text-ink-600">{u.role}</td>
                  <td className="px-4 py-3 text-ink-600">{u.branch}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={u.status === 'Active' ? 'success' : 'neutral'}>{u.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEditUser(u)} className="text-brand-600 hover:text-brand-700 mr-2">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDeleteUser(u.id)} className="text-error-600 hover:text-error-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}