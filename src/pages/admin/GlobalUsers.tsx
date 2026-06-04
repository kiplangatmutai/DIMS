import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, ShieldAlert, UserCheck, UserX } from 'lucide-react';
import { api } from '../../config/api';
import { useRole } from '../../context/RoleContext';

interface ApiRole {
  id: string;
  name: string;
  tier: string;
  description?: string;
  routes?: ApiModule[];
  canOnboardRoleIds?: string[];
  isCustom?: boolean;
}

interface ApiFacility {
  id: string;
  name: string;
}

interface ApiUser {
  id: string;
  name: string;
  username: string;
  email: string;
  mobileNo?: string;
  county?: string | null;
  role?: ApiRole;
  facility?: ApiFacility | null;
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
  roleId: 'dha-admin',
  facilityId: '',
  county: ''
};

export function GlobalUsers() {
  const { currentRole, currentUser } = useRole();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [roles, setRoles] = useState<ApiRole[]>([]);
  const [facilities, setFacilities] = useState<ApiFacility[]>([]);
  const [counties, setCounties] = useState<string[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadUsers = async () => {
    const response = await api.get<DataResponse<ApiUser[]>>('/users');
    setUsers(response.data);
  };

  useEffect(() => {
    Promise.all([
      loadUsers(),
      api.get<DataResponse<ApiRole[]>>('/roles').then((response) => setRoles(response.data)),
      api.get<DataResponse<ApiFacility[]>>('/facilities').then((response) => setFacilities(response.data)),
      api.get<DataResponse<string[]>>('/counties').then((response) => setCounties(response.data))
    ]).catch((loadError) => {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load users.');
    });
  }, []);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return users;
    }

    return users.filter((user) =>
      [user.id, user.name, user.username, user.email, user.role?.name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [searchTerm, users]);

  const allowedRoleIds = useMemo(() => {
    const activeApiRole = roles.find((role) => role.id === currentRole.id);

    return activeApiRole?.canOnboardRoleIds || currentRole.canOnboardRoleIds || [];
  }, [currentRole.canOnboardRoleIds, currentRole.id, roles]);
  const onboardingRoles = useMemo(
    () =>
      roles.filter(
        (role) =>
          allowedRoleIds.includes(role.id) ||
          (currentRole.id === 'super-admin' && role.isCustom)
      ),
    [allowedRoleIds, currentRole.id, roles]
  );
  const editableRoles = useMemo(
    () =>
      roles.filter(
        (role) =>
          allowedRoleIds.includes(role.id) ||
          currentRole.id === 'super-admin' ||
          role.id === currentRole.id
      ),
    [allowedRoleIds, currentRole.id, roles]
  );
  const selectedRole = useMemo(
    () => roles.find((role) => role.id === form.roleId),
    [form.roleId, roles]
  );
  const isCountyRequired = Boolean(
    currentRole.tier === 'County' ||
    (selectedRole && ['County', 'Sub-County', 'Facility'].includes(selectedRole.tier))
  );

  useEffect(() => {
    if (onboardingRoles.length > 0 && !onboardingRoles.some((role) => role.id === form.roleId)) {
      setForm((current) => ({ ...current, roleId: onboardingRoles[0].id }));
    }
  }, [form.roleId, onboardingRoles]);

  useEffect(() => {
    if (currentRole.tier === 'County' && currentUser?.county && !form.county) {
      setForm((current) => ({ ...current, county: currentUser.county || '' }));
    }
  }, [currentRole.tier, currentUser?.county, form.county]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      await api.post('/users', {
        ...form,
        facilityId: form.facilityId || null,
        county: form.county || null
      });
      setForm(emptyForm);
      setMessage('User onboarded successfully.');
      await loadUsers();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to onboard user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateUser = async (userId: string, updates: Record<string, unknown>, successMessage: string) => {
    setError('');
    setMessage('');

    try {
      await api.patch(`/users/${userId}`, updates);
      setMessage(successMessage);
      await loadUsers();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update user.');
    }
  };

  const toggleUserStatus = (user: ApiUser) => {
    const nextStatus = user.status === 'Disabled' ? 'Active' : 'Disabled';
    const label = nextStatus === 'Active' ? 'enabled' : 'disabled';
    updateUser(user.id, { status: nextStatus }, `User ${label} successfully.`);
  };

  const assignProfile = (user: ApiUser, roleId: string) => {
    updateUser(user.id, { roleId }, 'Profile assigned successfully.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            User Onboarding
          </h1>
          <p className="text-neutral-500 mt-1">
            Create and manage users across the system.
          </p>
        </div>
      </div>

      {currentRole.id === 'super-admin' ? (
      <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 flex items-start">
        <ShieldAlert className="w-5 h-5 text-brand-600 mr-3 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-brand-800">
          <strong>Super Admin Privileges:</strong> User onboarding and disabling
          actions affect access across the entire system.
        </div>
      </div>) : null}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Full name
          </label>
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
          
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Username
          </label>
          <input
            required
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
          
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Email
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
          
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Mobile number
          </label>
          <input
            required
            type="tel"
            value={form.mobileNo}
            onChange={(event) => setForm({ ...form, mobileNo: event.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
          
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Temporary password
          </label>
          <input
            required
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
          
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Role
          </label>
          <select
            value={form.roleId}
            onChange={(event) => setForm({ ...form, roleId: event.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm bg-white focus:ring-brand-500 focus:border-brand-500">
            
            {onboardingRoles.map((role) =>
            <option key={role.id} value={role.id}>
                {role.name}
              </option>
            )}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            County {isCountyRequired ? '' : '(optional)'}
          </label>
          <select
            required={isCountyRequired}
            value={form.county}
            onChange={(event) => setForm({ ...form, county: event.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm bg-white focus:ring-brand-500 focus:border-brand-500">
            
            <option value="">Select county</option>
            {counties.map((county) =>
            <option key={county} value={county}>
                {county}
              </option>
            )}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Facility
          </label>
          <select
            value={form.facilityId}
            onChange={(event) => setForm({ ...form, facilityId: event.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm bg-white focus:ring-brand-500 focus:border-brand-500">
            
            <option value="">None</option>
            {facilities.map((facility) =>
            <option key={facility.id} value={facility.id}>
                {facility.name}
              </option>
            )}
          </select>
        </div>

        <div className="md:col-span-2 xl:col-span-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm">
            {message ? <span className="text-black">{message}</span> : null}
            {error ? <span className="text-brand-700">{error}</span> : null}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 disabled:opacity-60">
            
            <Plus className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Onboarding...' : 'Onboard User'}
          </button>
        </div>
      </form>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name, username, email, or ID..."
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
            
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-500 uppercase bg-white border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-medium">User Details</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">County</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredUsers.map((user) =>
              <tr key={user.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {user.username} / {user.email} / {user.id}
                    </div>
                    <div className="text-xs text-neutral-500">
                      Mobile: {user.mobileNo || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role?.id || ''}
                      onChange={(event) => assignProfile(user, event.target.value)}
                      className="w-full min-w-48 rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 focus:border-brand-500 focus:ring-brand-500">
                      
                      {editableRoles.map((role) =>
                      <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      )}
                    </select>
                    <div className="text-xs text-neutral-500">
                      {user.facility?.name || 'No facility assigned'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    <select
                      value={user.county || ''}
                      onChange={(event) =>
                        updateUser(
                          user.id,
                          { county: event.target.value || null },
                          'County assignment updated successfully.'
                        )
                      }
                      className="w-full min-w-40 rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-700 focus:border-brand-500 focus:ring-brand-500">
                      
                      <option value="">No county</option>
                      {counties.map((county) =>
                      <option key={county} value={county}>
                          {county}
                        </option>
                      )}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.status === 'Disabled' ? 'bg-neutral-100 text-neutral-600' : 'bg-white text-black'}`}>
                      {user.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleUserStatus(user)}
                      className="text-brand-600 hover:text-brand-800 font-medium text-sm inline-flex items-center">
                      
                      {user.status === 'Disabled' ? (
                        <UserCheck className="w-4 h-4 mr-1" />
                      ) : (
                        <UserX className="w-4 h-4 mr-1" />
                      )}
                      {user.status === 'Disabled' ? 'Enable' : 'Disable'}
                    </button>
                  </td>
                </tr>
              )}
              {filteredUsers.length === 0 ?
              <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-neutral-500">
                    No users found.
                  </td>
                </tr> :
              null}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
}
