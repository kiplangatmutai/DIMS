import React, { useEffect, useState } from 'react';
import { Plus, Shield } from 'lucide-react';
import { api } from '../../config/api';

interface ApiModule {
  path: string;
  label: string;
  icon: string;
}

interface ApiRole {
  id: string;
  name: string;
  tier: string;
  description?: string;
  routes?: ApiModule[];
  isCustom?: boolean;
}

interface DataResponse<T> {
  data: T;
}

const emptyProfileForm = {
  name: '',
  tier: 'Admin',
  description: '',
  modulePaths: ['/dashboard']
};

export function RoleProvisioning() {
  const [roles, setRoles] = useState<ApiRole[]>([]);
  const [modules, setModules] = useState<ApiModule[]>([]);
  const [profileForm, setProfileForm] = useState(emptyProfileForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  const loadProfiles = async () => {
    const response = await api.get<DataResponse<ApiRole[]>>('/roles');
    setRoles(response.data);
  };

  useEffect(() => {
    Promise.all([
      loadProfiles(),
      api.get<DataResponse<ApiModule[]>>('/modules').then((response) => setModules(response.data))
    ]).catch((loadError) => {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load profiles.');
    });
  }, []);

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

  const handleCreateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsCreatingProfile(true);

    try {
      await api.post<DataResponse<ApiRole>>('/roles', profileForm);
      setProfileForm(emptyProfileForm);
      setMessage('Profile created successfully.');
      await loadProfiles();
    } catch (profileError) {
      setError(profileError instanceof Error ? profileError.message : 'Unable to create profile.');
    } finally {
      setIsCreatingProfile(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Profile Management
        </h1>
        <p className="text-neutral-500 mt-1">
          Create access profiles and map them to system modules.
        </p>
      </div>

      {(message || error) ? (
        <div className={`rounded-md px-4 py-3 text-sm ${error ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'bg-white text-black border border-brand-200'}`}>
          {error || message}
        </div>
      ) : null}

      <form
        onSubmit={handleCreateProfile}
        className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
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
            className="inline-flex items-center justify-center px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 disabled:opacity-60">
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
            {modules.map((module) => (
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
            ))}
          </div>
        </div>
      </form>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
          <h2 className="font-semibold text-neutral-900">Profile Mapping</h2>
        </div>
        <div className="divide-y divide-neutral-100">
          {roles.map((role) => (
            <div key={role.id} className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2">
                <div>
                  <div className="font-medium text-neutral-900">
                    {role.name}
                    {role.isCustom ? (
                      <span className="ml-2 text-xs text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                        Custom
                      </span>
                    ) : null}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {role.tier} / {role.id}
                  </div>
                  <p className="text-sm text-neutral-600 mt-2">
                    {role.description || 'No profile description provided.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 max-w-xl">
                  {(role.routes || []).map((route) => (
                    <span
                      key={route.path}
                      className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded">
                      {route.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
