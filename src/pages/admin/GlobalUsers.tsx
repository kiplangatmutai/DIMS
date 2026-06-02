import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Shield, ShieldAlert, UserX } from 'lucide-react';
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
  role?: ApiRole;
  facility?: ApiFacility | null;
  status?: string;
}

interface DataResponse<T> {
  data: T;
}

interface ApiModule {
  path: string;
  label: string;
  icon: string;
}

const emptyForm = {
  name: '',
  username: '',
  email: '',
  password: '',
  roleId: 'dha-admin',
  facilityId: ''
};

const emptyProfileForm = {
  name: '',
  tier: 'Admin',
  description: '',
  modulePaths: ['/dashboard']
};

export function GlobalUsers() {
  const { currentRole } = useRole();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [roles, setRoles] = useState<ApiRole[]>([]);
  const [modules, setModules] = useState<ApiModule[]>([]);
  const [facilities, setFacilities] = useState<ApiFacility[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [profileForm, setProfileForm] = useState(emptyProfileForm);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  const loadUsers = async () => {
    const response = await api.get<DataResponse<ApiUser[]>>('/users');
    setUsers(response.data);
  };

  useEffect(() => {
    Promise.all([
      loadUsers(),
      api.get<DataResponse<ApiRole[]>>('/roles').then((response) => setRoles(response.data)),
      api.get<DataResponse<ApiModule[]>>('/modules').then((response) => setModules(response.data)),
      api.get<DataResponse<ApiFacility[]>>('/facilities').then((response) => setFacilities(response.data))
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

  const activeApiRole = roles.find((role) => role.id === currentRole.id);
  const allowedRoleIds = activeApiRole?.canOnboardRoleIds || currentRole.canOnboardRoleIds || [];
  const onboardingRoles = useMemo(
    () =>
      roles.filter(
        (role) =>
          allowedRoleIds.includes(role.id) ||
          (currentRole.id === 'super-admin' && role.isCustom)
      ),
    [allowedRoleIds, currentRole.id, roles]
  );

  useEffect(() => {
    if (onboardingRoles.length > 0 && !onboardingRoles.some((role) => role.id === form.roleId)) {
      setForm((current) => ({ ...current, roleId: onboardingRoles[0].id }));
    }
  }, [form.roleId, onboardingRoles]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      await api.post('/users', {
        ...form,
        facilityId: form.facilityId || null
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

  const handleCreateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsCreatingProfile(true);

    try {
      const response = await api.post<DataResponse<ApiRole>>('/roles', profileForm);
      const rolesResponse = await api.get<DataResponse<ApiRole[]>>('/roles');
      setRoles(rolesResponse.data);
      setForm((current) => ({ ...current, roleId: response.data.id }));
      setProfileForm(emptyProfileForm);
      setMessage('Profile created successfully.');
    } catch (profileError) {
      setError(profileError instanceof Error ? profileError.message : 'Unable to create profile.');
    } finally {
      setIsCreatingProfile(false);
    }
  };

  const toggleModulePath = (path: string) => {
    setProfileForm((current) => {
      const exists = current.modulePaths.includes(path);
      const modulePaths = exists
        ? current.modulePaths.filter((modulePath) => modulePath !== path)
        : [...current.modulePaths, path];

      return {
        ...current,
        modulePaths: modulePaths.length > 0 ? modulePaths : ['/dashboard']
      };
    });
  };

  const disableUser = async (userId: string) => {
    setError('');
    setMessage('');

    try {
      await api.patch(`/users/${userId}`, { status: 'Disabled' });
      setMessage('User disabled successfully.');
      await loadUsers();
    } catch (disableError) {
      setError(disableError instanceof Error ? disableError.message : 'Unable to disable user.');
    }
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

      <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 flex items-start">
        <ShieldAlert className="w-5 h-5 text-brand-600 mr-3 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-brand-800">
          <strong>Super Admin Privileges:</strong> User onboarding and disabling
          actions affect access across the entire system.
        </div>
      </div>

      <form
        onSubmit={handleCreateProfile}
        className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5 space-y-5">
        
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold text-neutral-900 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-brand-600" />
              Create Access Profile
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Build a profile by selecting the modules it can access.
            </p>
          </div>
          <button
            type="submit"
            disabled={isCreatingProfile}
            className="inline-flex items-center justify-center px-4 py-2 bg-neutral-900 text-white rounded-md text-sm font-medium hover:bg-neutral-800 disabled:opacity-60">
            
            <Plus className="w-4 h-4 mr-2" />
            {isCreatingProfile ? 'Creating...' : 'Create Profile'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Profile name
            </label>
            <input
              required
              value={profileForm.name}
              onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
            
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Tier
            </label>
            <select
              value={profileForm.tier}
              onChange={(event) => setProfileForm({ ...profileForm, tier: event.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm bg-white focus:ring-brand-500 focus:border-brand-500">
              
              <option>Admin</option>
              <option>DHA</option>
              <option>County</option>
              <option>Sub-County</option>
              <option>Vendor</option>
              <option>Facility</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <input
              value={profileForm.description}
              onChange={(event) =>
              setProfileForm({ ...profileForm, description: event.target.value })
              }
              className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
            
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-neutral-700 mb-2">
            Module access
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {modules.map((module) =>
            <label
              key={module.path}
              className="flex items-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-700">
              
                <input
                type="checkbox"
                checked={profileForm.modulePaths.includes(module.path)}
                onChange={() => toggleModulePath(module.path)}
                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-neutral-300 rounded" />
              
                {module.label}
              </label>
            )}
          </div>
        </div>
      </form>

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
            {message ? <span className="text-emerald-700">{message}</span> : null}
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

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
          <h2 className="font-semibold text-neutral-900">Profile Mapping</h2>
        </div>
        <div className="divide-y divide-neutral-100">
          {roles.map((role) =>
          <div key={role.id} className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2">
                <div>
                  <div className="font-medium text-neutral-900">
                    {role.name}
                    {role.isCustom ? (
                      <span className="ml-2 text-xs text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                        Custom
                      </span>) :
                    null}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {role.tier} / {role.id}
                  </div>
                  <p className="text-sm text-neutral-600 mt-2">
                    {role.description || 'No profile description provided.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 max-w-xl">
                  {(role.routes || []).map((route) =>
                  <span
                    key={route.path}
                    className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded">
                      
                      {route.label}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-neutral-900">{user.role?.name || '-'}</div>
                    <div className="text-xs text-neutral-500">
                      {user.facility?.name || 'No facility assigned'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                      {user.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      disabled={user.status === 'Disabled'}
                      onClick={() => disableUser(user.id)}
                      className="text-brand-600 hover:text-brand-800 disabled:text-neutral-400 font-medium text-sm inline-flex items-center">
                      
                      <UserX className="w-4 h-4 mr-1" />
                      Disable
                    </button>
                  </td>
                </tr>
              )}
              {filteredUsers.length === 0 ?
              <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-neutral-500">
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
