// import { useState } from 'react';
// import { ShieldCheck, ChevronLeft, Users, KeyRound, FileCheck, Percent, Lock, BarChart3, Settings, Plus, Save, Building2, Edit, Trash2, X, Check, ToggleLeft, ToggleRight } from 'lucide-react';
// import { PageHeader } from '@/components/PageHeader';
// import { Card, CardHeader } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Input, Select, Checkbox } from '@/components/ui/Field';
// import { useToast, Toast } from '@/components/ui/Feedback';
// import { useNav } from '@/lib/nav';
// import { Badge } from '@/components/ui/Badge';
// import { classNames } from '@/lib/format';

// const menuItems = [
//   { label: 'Dashboard', icon: <BarChart3 className="h-4 w-4" /> },
//   { label: 'User Management', icon: <Users className="h-4 w-4" /> },
//   { label: 'Role Management', icon: <KeyRound className="h-4 w-4" /> },
//   { label: 'Approval Matrix', icon: <FileCheck className="h-4 w-4" /> },
//   { label: 'Interest Rates', icon: <Percent className="h-4 w-4" /> },
//   { label: 'Security', icon: <Lock className="h-4 w-4" /> },
//   { label: 'System Config', icon: <Settings className="h-4 w-4" /> },
// ];

// // ============================================
// // USER MANAGEMENT SECTION
// // ============================================
// function UserManagement({ toast, showToast }: any) {
//   const [users, setUsers] = useState([
//     { id: 1, name: 'Mr. Sharma', role: 'Branch Manager', branch: 'Mumbai Central', status: 'Active', email: 'sharma@bank.com' },
//     { id: 2, name: 'Ms. Patel', role: 'Regional Manager', branch: 'West Zone', status: 'Active', email: 'patel@bank.com' },
//     { id: 3, name: 'Mr. Iyer', role: 'Loan Officer', branch: 'Mumbai Central', status: 'Active', email: 'iyer@bank.com' },
//     { id: 4, name: 'Ms. Rao', role: 'Teller', branch: 'Delhi North', status: 'Inactive', email: 'rao@bank.com' },
//   ]);
//   const [editingUser, setEditingUser] = useState<any>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({ name: '', email: '', role: '', branch: '', status: 'Active' });

//   const handleAddUser = () => {
//     if (!formData.name || !formData.email || !formData.role) {
//       showToast('Please fill all required fields', 'error');
//       return;
//     }
//     if (editingUser) {
//       setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
//       showToast('User updated successfully', 'success');
//     } else {
//       setUsers([...users, { id: Math.max(...users.map(u => u.id), 0) + 1, ...formData }]);
//       showToast('User created successfully', 'success');
//     }
//     setFormData({ name: '', email: '', role: '', branch: '', status: 'Active' });
//     setEditingUser(null);
//     setShowForm(false);
//   };

//   const handleEditUser = (user: any) => {
//     setEditingUser(user);
//     setFormData({ name: user.name, email: user.email, role: user.role, branch: user.branch, status: user.status });
//     setShowForm(true);
//   };

//   const handleDeleteUser = (id: number) => {
//     setUsers(users.filter(u => u.id !== id));
//     showToast('User deleted', 'info');
//   };

//   return (
//     <Card padding="lg">
//       <CardHeader
//         title="User Management"
//         subtitle="Manage system users and roles"
//         icon={<Users className="h-5 w-5" />}
//         action={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => { setShowForm(true); setEditingUser(null); setFormData({ name: '', email: '', role: '', branch: '', status: 'Active' }); }}>Add user</Button>}
//       />

//       {showForm && (
//         <div className="mb-6 rounded-xl border border-ink-200 bg-ink-50 p-4">
//           <div className="mb-4 flex items-center justify-between">
//             <h4 className="font-semibold text-ink-900">{editingUser ? 'Edit User' : 'New User'}</h4>
//             <button onClick={() => { setShowForm(false); setEditingUser(null); }} className="text-ink-400 hover:text-ink-600">
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//             <Input label="Name" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
//             <Input label="Email" type="email" placeholder="john@bank.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
//             <Select label="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} options={[
//               { value: 'Branch Manager', label: 'Branch Manager' },
//               { value: 'Regional Manager', label: 'Regional Manager' },
//               { value: 'Loan Officer', label: 'Loan Officer' },
//               { value: 'Teller', label: 'Teller' },
//             ]} />
//             <Select label="Branch" value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} options={[
//               { value: 'Mumbai Central', label: 'Mumbai Central' },
//               { value: 'Delhi North', label: 'Delhi North' },
//               { value: 'Bangalore East', label: 'Bangalore East' },
//             ]} />
//             <Select label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} options={[
//               { value: 'Active', label: 'Active' },
//               { value: 'Inactive', label: 'Inactive' },
//             ]} />
//           </div>
//           <div className="mt-4 flex justify-end gap-2">
//             <Button variant="outline" onClick={() => { setShowForm(false); setEditingUser(null); }}>Cancel</Button>
//             <Button leftIcon={<Save className="h-4 w-4" />} onClick={handleAddUser}>{editingUser ? 'Update' : 'Create'}</Button>
//           </div>
//         </div>
//       )}

//       <div className="rounded-xl border border-ink-100 overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="border-b border-ink-100 text-xs font-semibold uppercase tracking-wide text-ink-400">
//               <th className="px-4 py-3 text-left">User</th>
//               <th className="px-4 py-3 text-left">Email</th>
//               <th className="px-4 py-3 text-left">Role</th>
//               <th className="px-4 py-3 text-left">Branch</th>
//               <th className="px-4 py-3 text-center">Status</th>
//               <th className="px-4 py-3 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((u) => (
//               <tr key={u.id} className="border-b border-ink-50 last:border-0 text-sm">
//                 <td className="px-4 py-3 font-medium text-ink-800">{u.name}</td>
//                 <td className="px-4 py-3 text-ink-600">{u.email}</td>
//                 <td className="px-4 py-3 text-ink-600">{u.role}</td>
//                 <td className="px-4 py-3 text-ink-600">{u.branch}</td>
//                 <td className="px-4 py-3 text-center">
//                   <Badge variant={u.status === 'Active' ? 'success' : 'neutral'}>{u.status}</Badge>
//                 </td>
//                 <td className="px-4 py-3 text-right">
//                   <button onClick={() => handleEditUser(u)} className="text-brand-600 hover:text-brand-700 mr-2">
//                     <Edit className="h-4 w-4" />
//                   </button>
//                   <button onClick={() => handleDeleteUser(u.id)} className="text-error-600 hover:text-error-700">
//                     <Trash2 className="h-4 w-4" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </Card>
//   );
// }

// // ============================================
// // ROLE MANAGEMENT SECTION
// // ============================================
// function RoleManagement({ showToast }: any) {
//   const roles = [
//     { id: 1, name: 'Branch Manager', perms: 24, desc: 'Full branch operations' },
//     { id: 2, name: 'Loan Officer', perms: 12, desc: 'Loan processing and approvals' },
//     { id: 3, name: 'Regional Manager', perms: 18, desc: 'Multi-branch oversight' },
//     { id: 4, name: 'Teller', perms: 6, desc: 'Counter operations' },
//   ];

//   const allPermissions = [
//     'ACCOUNT_VIEW', 'ACCOUNT_CREATE', 'ACCOUNT_UPDATE',
//     'FD_CREATE', 'FD_VIEW', 'FD_RENEW',
//     'RD_CREATE', 'RD_VIEW', 'RD_PAY',
//     'LOAN_APPLY', 'LOAN_APPROVE', 'LOAN_REJECT',
//     'TRANSACTION_INITIATE', 'TRANSACTION_APPROVE',
//     'DOCUMENT_VERIFY', 'RISK_ASSESS', 'DISBURSE',
//     'ADMIN_CONFIG', 'USER_MANAGE', 'REPORT_VIEW',
//   ];

//   const [selectedRole, setSelectedRole] = useState(roles[0]);
//   const [permissions, setPermissions] = useState<string[]>(['ACCOUNT_VIEW', 'ACCOUNT_CREATE', 'LOAN_APPROVE', 'DOCUMENT_VERIFY', 'RISK_ASSESS', 'DISBURSE']);

//   const togglePermission = (perm: string) => {
//     setPermissions(permissions.includes(perm) ? permissions.filter(p => p !== perm) : [...permissions, perm]);
//   };

//   return (
//     <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//       <Card padding="md" className="lg:col-span-1 h-fit">
//         <h3 className="mb-3 font-display text-sm font-bold text-ink-900">Roles</h3>
//         <div className="space-y-2">
//           {roles.map((r) => (
//             <button
//               key={r.id}
//               onClick={() => setSelectedRole(r)}
//               className={classNames('w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
//                 selectedRole.id === r.id ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50'
//               )}
//             >
//               <div className="font-medium">{r.name}</div>
//               <div className="text-xs text-ink-400">{r.perms} permissions</div>
//             </button>
//           ))}
//         </div>
//         <Button fullWidth variant="outline" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} className="mt-4" onClick={() => showToast('Add role form opening...', 'info')}>
//           New Role
//         </Button>
//       </Card>

//       <Card padding="lg" className="lg:col-span-2">
//         <div className="mb-4">
//           <h3 className="font-display text-base font-bold text-ink-900">{selectedRole.name}</h3>
//           <p className="text-sm text-ink-500">{selectedRole.desc}</p>
//         </div>

//         <div className="space-y-3">
//           <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
//             {allPermissions.map((perm) => (
//               <label key={perm} className="flex items-center gap-2 rounded-lg border border-ink-100 p-3 cursor-pointer hover:bg-ink-50 transition-colors">
//                 <Checkbox
//                   checked={permissions.includes(perm)}
//                   onChange={() => togglePermission(perm)}
//                 />
//                 <span className="text-sm font-medium text-ink-700">{perm.replace('_', ' ')}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         <div className="mt-6 flex justify-end gap-2">
//           <Button onClick={() => showToast('Role permissions saved', 'success')} leftIcon={<Save className="h-4 w-4" />}>
//             Save Permissions
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// }

// // ============================================
// // SYSTEM CONFIG SECTION
// // ============================================
// function SystemConfig({ showToast }: any) {
//   const [config, setConfig] = useState({
//     maxLoanAmount: '2500000',
//     minLoanAmount: '10000',
//     defaultSLA: '24',
//     sessionTimeout: '30',
//     dailyTransactionLimit: '1000000',
//     maintenanceMode: false,
//     twoFactorAuth: true,
//     auditLogging: true,
//   });

//   return (
//     <div className="space-y-6">
//       <Card padding="lg">
//         <CardHeader title="Loan Settings" icon={<Building2 className="h-5 w-5" />} />
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           <Input
//             label="Maximum Loan Amount"
//             type="number"
//             value={config.maxLoanAmount}
//             onChange={(e) => setConfig({ ...config, maxLoanAmount: e.target.value })}
//             leftIcon={<span className="text-xs font-semibold text-ink-500">₹</span>}
//           />
//           <Input
//             label="Minimum Loan Amount"
//             type="number"
//             value={config.minLoanAmount}
//             onChange={(e) => setConfig({ ...config, minLoanAmount: e.target.value })}
//             leftIcon={<span className="text-xs font-semibold text-ink-500">₹</span>}
//           />
//           <Input
//             label="Default SLA (hours)"
//             type="number"
//             value={config.defaultSLA}
//             onChange={(e) => setConfig({ ...config, defaultSLA: e.target.value })}
//           />
//         </div>
//       </Card>

//       <Card padding="lg">
//         <CardHeader title="System Settings" icon={<Settings className="h-5 w-5" />} />
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//           <Input
//             label="Session Timeout (minutes)"
//             type="number"
//             value={config.sessionTimeout}
//             onChange={(e) => setConfig({ ...config, sessionTimeout: e.target.value })}
//           />
//           <Input
//             label="Daily Transaction Limit"
//             type="number"
//             value={config.dailyTransactionLimit}
//             onChange={(e) => setConfig({ ...config, dailyTransactionLimit: e.target.value })}
//             leftIcon={<span className="text-xs font-semibold text-ink-500">₹</span>}
//           />
//         </div>
//       </Card>

//       <Card padding="lg">
//         <CardHeader title="Security & Features" icon={<Lock className="h-5 w-5" />} />
//         <div className="space-y-4">
//           {[
//             { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Restrict user access for system maintenance' },
//             { key: 'twoFactorAuth', label: 'Two-Factor Authentication', desc: 'Require 2FA for all users' },
//             { key: 'auditLogging', label: 'Audit Logging', desc: 'Log all admin operations' },
//           ].map((s) => (
//             <div key={s.key} className="flex items-center justify-between border-b border-ink-100 pb-3 last:border-0">
//               <div>
//                 <p className="font-medium text-ink-900">{s.label}</p>
//                 <p className="text-xs text-ink-500">{s.desc}</p>
//               </div>
//               <button
//                 onClick={() => setConfig({ ...config, [s.key]: !config[s.key as keyof typeof config] })}
//                 className={classNames('relative inline-flex h-6 w-11 items-center rounded-full transition-colors', config[s.key as keyof typeof config] ? 'bg-success-600' : 'bg-ink-200')}
//               >
//                 <span className={classNames('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', config[s.key as keyof typeof config] ? 'translate-x-6' : 'translate-x-1')} />
//               </button>
//             </div>
//           ))}
//         </div>
//       </Card>

//       <div className="flex justify-end gap-2">
//         <Button variant="outline" onClick={() => showToast('Changes discarded', 'info')}>Discard</Button>
//         <Button leftIcon={<Save className="h-4 w-4" />} onClick={() => showToast('System configuration saved', 'success')}>
//           Save Configuration
//         </Button>
//       </div>
//     </div>
//   );
// }

// // ============================================
// // MAIN ADMIN PAGE
// // ============================================
// export function AdminPage() {
//   const { navigate } = useNav();
//   const { toast, showToast } = useToast();
//   const [activeTab, setActiveTab] = useState('Dashboard');

//   return (
//     <div>
//       <Toast toast={toast} />
//       <PageHeader
//         title="System Administration"
//         subtitle="Configure banking system parameters, users, roles, and approvals"
//         icon={<ShieldCheck className="h-5 w-5" />}
//         action={<Button variant="ghost" leftIcon={<ChevronLeft className="h-4 w-4" />} onClick={() => navigate('dashboard')}>Back</Button>}
//       />

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
//         <Card padding="sm" className="lg:col-span-1 h-fit">
//           <nav className="space-y-1 p-2">
//             {menuItems.map((item) => (
//               <button key={item.label} onClick={() => setActiveTab(item.label)}
//                 className={classNames('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
//                   activeTab === item.label ? 'bg-brand-50 text-brand-700' : 'text-ink-500 hover:bg-ink-50 hover:text-ink-900')}>
//                 {item.icon}
//                 <span className="truncate">{item.label}</span>
//               </button>
//             ))}
//           </nav>
//         </Card>

//         <div className="space-y-6 lg:col-span-3">
//           {activeTab === 'Dashboard' && (
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//               {[
//                 { label: 'Total Customers', value: '12,847', icon: <Users className="h-5 w-5" />, color: 'bg-brand-50 text-brand-600' },
//                 { label: 'Active Loans', value: '3,421', icon: <Building2 className="h-5 w-5" />, color: 'bg-accent-100 text-accent-700' },
//                 { label: 'Pending Approvals', value: '5', icon: <FileCheck className="h-5 w-5" />, color: 'bg-warning-100 text-warning-700' },
//                 { label: 'Total Deposits', value: '₹4.8T', icon: <Percent className="h-5 w-5" />, color: 'bg-success-100 text-success-600' },
//               ].map((s) => (
//                 <Card key={s.label} padding="md">
//                   <div className={classNames('mb-3 flex h-11 w-11 items-center justify-center rounded-xl', s.color)}>{s.icon}</div>
//                   <p className="font-display text-2xl font-extrabold text-ink-900">{s.value}</p>
//                   <p className="text-sm text-ink-500">{s.label}</p>
//                 </Card>
//               ))}
//             </div>
//           )}

//           {activeTab === 'User Management' && <UserManagement toast={toast} showToast={showToast} />}

//           {activeTab === 'Role Management' && <RoleManagement showToast={showToast} />}

//           {activeTab === 'System Config' && <SystemConfig showToast={showToast} />}

//           {activeTab === 'Approval Matrix' && (
//             <Card padding="lg">
//               <CardHeader title="Approval Matrix Configuration" subtitle="Define approval levels for loan types and amounts" icon={<FileCheck className="h-5 w-5" />}
//                 action={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => showToast('Add approval rule')}>Add row</Button>} />
//               <div className="space-y-4">
//                 <div className="rounded-xl border border-ink-100 overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b border-ink-100 text-xs font-semibold uppercase tracking-wide text-ink-400">
//                         <th className="px-4 py-3 text-left">Loan Type</th>
//                         <th className="px-4 py-3 text-right">Min-Max Amount</th>
//                         <th className="px-4 py-3 text-center">Approval Levels</th>
//                         <th className="px-4 py-3 text-left">Required Roles</th>
//                         <th className="px-4 py-3 text-center">SLA Hours</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {[
//                         { type: 'Personal', range: '₹0 – ₹200K', levels: '1', role: 'Branch Manager', sla: '24' },
//                         { type: 'Personal', range: '₹200K – ₹500K', levels: '2', role: 'BM → RM', sla: '48' },
//                         { type: 'Home', range: '₹500K – ₹50L', levels: '3', role: 'BM → RM → CC', sla: '72' },
//                         { type: 'Auto', range: '₹0 – ₹30L', levels: '2', role: 'LO → BM', sla: '48' },
//                       ].map((row, i) => (
//                         <tr key={i} className="border-b border-ink-50 last:border-0 text-sm">
//                           <td className="px-4 py-3 font-medium text-ink-800">{row.type}</td>
//                           <td className="px-4 py-3 text-right text-ink-600">{row.range}</td>
//                           <td className="px-4 py-3 text-center text-ink-600">{row.levels}</td>
//                           <td className="px-4 py-3 text-ink-600">{row.role}</td>
//                           <td className="px-4 py-3 text-center text-ink-600">{row.sla}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <Button onClick={() => showToast('Approval matrix saved', 'success')} leftIcon={<Save className="h-4 w-4" />}>Save matrix</Button>
//               </div>
//             </Card>
//           )}

//           {activeTab === 'Interest Rates' && (
//             <Card padding="lg">
//               <CardHeader title="Interest Rate Configuration" subtitle="Update rates for deposit and loan products" icon={<Percent className="h-5 w-5" />} />
//               <div className="rounded-xl border border-ink-100 overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b border-ink-100 text-xs font-semibold uppercase tracking-wide text-ink-400">
//                       <th className="px-4 py-3 text-left">Product</th>
//                       <th className="px-4 py-3 text-left">Tenure</th>
//                       <th className="px-4 py-3 text-right">General</th>
//                       <th className="px-4 py-3 text-right">Senior</th>
//                       <th className="px-4 py-3 text-right">NRI</th>
//                       <th className="px-4 py-3 text-left">Effective Date</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {[
//                       { p: 'FD', t: '7–14 days', g: '3.00%', s: '3.50%', n: '2.50%', e: '15 Jan 2024' },
//                       { p: 'FD', t: '1 year', g: '6.50%', s: '7.00%', n: '6.00%', e: '15 Jan 2024' },
//                       { p: 'Personal Loan', t: '36 months', g: '10.50%', s: '10.00%', n: '11.00%', e: '15 Jan 2024' },
//                       { p: 'Home Loan', t: '240 months', g: '8.50%', s: '8.00%', n: '9.00%', e: '15 Jan 2024' },
//                     ].map((row, i) => (
//                       <tr key={i} className="border-b border-ink-50 last:border-0 text-sm">
//                         <td className="px-4 py-3 font-medium text-ink-800">{row.p}</td>
//                         <td className="px-4 py-3 text-ink-600">{row.t}</td>
//                         <td className="px-4 py-3 text-right text-ink-600">{row.g}</td>
//                         <td className="px-4 py-3 text-right text-ink-600">{row.s}</td>
//                         <td className="px-4 py-3 text-right text-ink-600">{row.n}</td>
//                         <td className="px-4 py-3 text-ink-600">{row.e}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//               <div className="mt-4">
//                 <Button onClick={() => showToast('Interest rates updated', 'success')} leftIcon={<Save className="h-4 w-4" />}>Update rates</Button>
//               </div>
//             </Card>
//           )}

//           {activeTab === 'Security' && (
//             <Card padding="lg">
//               <div className="flex flex-col items-center justify-center py-12 text-center">
//                 <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-ink-400">
//                   <Lock className="h-6 w-6" />
//                 </div>
//                 <h3 className="font-display text-base font-bold text-ink-900">Security Module</h3>
//                 <p className="mt-1 text-sm text-ink-500">Advanced security policies and audit trails available in the full version.</p>
//                 <Button className="mt-4" variant="outline">Learn more</Button>
//               </div>
//             </Card>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// =====================
// =====================
// =====================
// =====================
// =====================
// =====================
// =====================
// =====================
// =====================
// =====================
// =====================
// @/pages/admin/AdminPage.tsx
import { 
  ShieldCheck, Users, KeyRound, FileCheck, Percent, Lock, Settings,
  Building2, ChevronRight
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNav } from '@/lib/nav';

export function AdminPage() {
  const { navigate } = useNav();

  const adminModules = [
    {
      title: 'User Management',
      description: 'Manage system users and their roles',
      icon: <Users className="h-6 w-6" />,
      route: 'admin-users' as const,
      stats: '12 Active Users',
      color: 'bg-brand-50 text-brand-600'
    },
    {
      title: 'Role Management',
      description: 'Configure roles and permissions',
      icon: <KeyRound className="h-6 w-6" />,
      route: 'admin-roles' as const,
      stats: '4 Roles Defined',
      color: 'bg-accent-100 text-accent-700'
    },
    {
      title: 'Approval Matrix',
      description: 'Set approval workflows for loans',
      icon: <FileCheck className="h-6 w-6" />,
      route: 'admin-approval-matrix' as const,
      stats: '4 Approval Rules',
      color: 'bg-warning-100 text-warning-700'
    },
    {
      title: 'Interest Rates',
      description: 'Manage deposit and loan rates',
      icon: <Percent className="h-6 w-6" />,
      route: 'admin-interest-rates' as const,
      stats: '8 Rate Configs',
      color: 'bg-success-100 text-success-600'
    },
    {
      title: 'Security',
      description: 'Security policies and audit trails',
      icon: <Lock className="h-6 w-6" />,
      route: 'admin-security' as const,
      stats: '2FA Enabled',
      color: 'bg-error-100 text-error-600'
    },
    {
      title: 'System Configuration',
      description: 'Configure system-wide settings',
      icon: <Settings className="h-6 w-6" />,
      route: 'admin-system-config' as const,
      stats: '8 Settings',
      color: 'bg-ink-100 text-ink-600'
    },
  ];

  return (
    <div>
      <PageHeader
        title="System Administration"
        subtitle="Manage users, roles, approvals, and system configurations"
        icon={<ShieldCheck className="h-5 w-5" />}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {[
          { label: 'Total Customers', value: '12,847', icon: <Users className="h-5 w-5" />, color: 'bg-brand-50 text-brand-600' },
          { label: 'Active Loans', value: '3,421', icon: <Building2 className="h-5 w-5" />, color: 'bg-accent-100 text-accent-700' },
          { label: 'Pending Approvals', value: '5', icon: <FileCheck className="h-5 w-5" />, color: 'bg-warning-100 text-warning-700' },
          { label: 'Total Deposits', value: '₹4.8T', icon: <Percent className="h-5 w-5" />, color: 'bg-success-100 text-success-600' },
        ].map((s) => (
          <Card key={s.label} padding="md">
            <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>{s.icon}</div>
            <p className="font-display text-2xl font-extrabold text-ink-900">{s.value}</p>
            <p className="text-sm text-ink-500">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Admin Modules Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {adminModules.map((module) => (
          <Card key={module.title} padding="lg" className="group cursor-pointer hover:shadow-soft-lg transition-shadow" onClick={() => navigate(module.route)}>
            <div className="flex items-start justify-between">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${module.color}`}>
                {module.icon}
              </div>
              <ChevronRight className="h-5 w-5 text-ink-300 group-hover:text-brand-500 transition-colors" />
            </div>
            <h3 className="font-display text-lg font-bold text-ink-900">{module.title}</h3>
            <p className="mt-1 text-sm text-ink-500">{module.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-medium text-ink-400">{module.stats}</span>
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(module.route); }}>
                Manage
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}