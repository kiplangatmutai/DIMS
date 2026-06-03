import React, { useEffect, useMemo, useState } from 'react';
import { Shield, PlusCircle, Search } from 'lucide-react';
import { api } from '../../config/api';

interface ApiRole {
  id: string;
  name: string;
  tier: string;
}

interface ApiUser {
  id: string;
  name: string;
  username: string;
  email: string;
  mobileNo?: string;
  role?: ApiRole;
  status?: string;
}

interface DataResponse<T> {
  data: T;
}

const emptyForm = {
  name: '',
  username: '',
  email: '',
  mobileNo: '',
  password: '',
  roleId: 'dha-onboarding-officer'
};

export function RoleProvisioning() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [roles, setRoles] = useState<ApiRole[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dhaRoles = roles.filter((role) => role.tier === 'DHA');

  const loadUsers = async () => {
    const response = await api.get<DataResponse<ApiUser[]>>('/users');
    setUsers(response.data.filter((user) => user.role?.tier === 'DHA'));
  };

  useEffect(() => {
    Promise.all([
      loadUsers(),
      api.get<DataResponse<ApiRole[]>>('/roles').then((response) => {
        const nextRoles = response.data.filter((role) => role.tier === 'DHA');
        setRoles(response.data);

        if (nextRoles.length > 0) {
          setForm((current) => ({ ...current, roleId: nextRoles[0].id }));
        }
      })
    ]).catch((loadError) => {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load DHA users.');
    });
  }, []);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch = !term ||
        [user.id, user.name, user.username, user.email, user.role?.name]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      const matchesRole = roleFilter === 'all' || user.role?.id === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [roleFilter, searchTerm, users]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      await api.post('/users', {
        ...form,
        facilityId: null
      });
      setForm({ ...emptyForm, roleId: dhaRoles[0]?.id || emptyForm.roleId });
      setIsFormOpen(false);
      setMessage('DHA user added successfully.');
      await loadUsers();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to add DHA user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            DHA Internal Role Provisioning
          </h1>
          <p className="text-neutral-500 mt-1">
            Manage DHA operational team members and permissions.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen((current) => !current)}
          className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700">
          
          <PlusCircle className="w-4 h-4 mr-2" />
          Add DHA User
        </button>
      </div>

      {isFormOpen ?
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          
          <input
          required
          placeholder="Full name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
          
          <input
          required
          placeholder="Username"
          value={form.username}
          onChange={(event) => setForm({ ...form, username: event.target.value })}
          className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
          
          <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
          
          <input
          required
          type="tel"
          placeholder="Mobile number"
          value={form.mobileNo}
          onChange={(event) => setForm({ ...form, mobileNo: event.target.value })}
          className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
          
          <input
          required
          type="password"
          placeholder="Temporary password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
          
          <select
          value={form.roleId}
          onChange={(event) => setForm({ ...form, roleId: event.target.value })}
          className="px-3 py-2 border border-neutral-300 rounded-md text-sm bg-white focus:ring-brand-500 focus:border-brand-500">
            
            {dhaRoles.map((role) =>
          <option key={role.id} value={role.id}>
                {role.name}
              </option>
          )}
          </select>
          <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-neutral-900 text-white rounded-md text-sm font-medium hover:bg-neutral-800 disabled:opacity-60">
            
            {isSubmitting ? 'Adding...' : 'Save DHA User'}
          </button>
        </form> :
      null}

      {(message || error) ?
      <div className={`rounded-md px-4 py-3 text-sm ${error ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'bg-white text-black border border-brand-200'}`}>
          {error || message}
        </div> :
      null}

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search DHA users..."
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
            
          </div>
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="px-3 py-2 border border-neutral-300 bg-white text-neutral-700 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-500 w-full sm:w-auto">
            
            <option value="all">All Roles</option>
            {dhaRoles.map((role) =>
            <option key={role.id} value={role.id}>
                {role.name}
              </option>
            )}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-500 uppercase bg-white border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Mobile</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredUsers.map((user) =>
              <tr key={user.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-neutral-500">{user.username} / {user.id}</div>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{user.email}</td>
                  <td className="px-6 py-4 text-neutral-600">{user.mobileNo || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-800">
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role?.name || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white text-black">
                      {user.status || 'Active'}
                    </span>
                  </td>
                </tr>
              )}
              {filteredUsers.length === 0 ?
              <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-neutral-500">
                    No DHA users found.
                  </td>
                </tr> :
              null}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
}
