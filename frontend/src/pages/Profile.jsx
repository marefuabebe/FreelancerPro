import { useEffect, useState } from 'react';
import { useUserStore } from '../store/useUserStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { useRef } from 'react';
import { uploadKYC, getPortfolio, updatePortfolio, uploadAvatar } from '../api/userApi.js';
import TwoFactorAuth from '../components/auth/TwoFactorAuth.jsx';
import Modal from '../components/common/Modal.jsx';
import { User, Shield, Briefcase, Save, Plus, Trash2, Upload, Camera } from 'lucide-react';

export default function Profile() {
  const { profile, loading, error, loadProfile, updateProfile } = useUserStore();
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const [form, setForm] = useState({ firstName: '', lastName: '' });
  const [kycFile, setKycFile] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [savingPortfolio, setSavingPortfolio] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Photo upload state
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (profile) {
      setForm({ firstName: profile.firstName || '', lastName: profile.lastName || '' });
      setPhotoFile(profile.avatar);
    }
  }, [profile]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!profile?._id && !profile?.id) return;
      try {
        const { data } = await getPortfolio(profile._id || profile.id);
        if (mounted) setPortfolio((data.data || data).items || (data.data || data) || []);
      } catch { }
    })();
    return () => { mounted = false };
  }, [profile]);

  function photoPreviewUrl() {
    if (photoFile && typeof photoFile === 'string') return photoFile;
    if (selectedFile) return URL.createObjectURL(selectedFile);
    return null;
  }

  function handleFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setSelectedFile(f);
    const reader = new FileReader();
    reader.onload = function (ev) {
      setPhotoFile(ev.target.result);
    };
    reader.readAsDataURL(f);
  }

  async function attachPhoto() {
    console.log('🚀 [attachPhoto] Function called');
    console.log('📋 [attachPhoto] selectedFile:', selectedFile);
    console.log('📋 [attachPhoto] hasFile:', !!selectedFile);

    if (!selectedFile) {
      console.warn('⚠️ [attachPhoto] No file selected');
      alert('Please select a photo first');
      return;
    }

    console.log('📦 [attachPhoto] Creating FormData...');
    const formData = new FormData();
    // IMPORTANT: Backend expects field name 'avatar', not 'file'
    formData.append('avatar', selectedFile);
    console.log('✅ [attachPhoto] FormData created with field name "avatar"');

    try {
      console.log('🌐 [attachPhoto] Calling uploadAvatar API...');
      const res = await uploadAvatar(formData);
      console.log('📥 [attachPhoto] Response received:', res);

      const avatarData = res.data;
      console.log('✅ [attachPhoto] Avatar uploaded and saved:', avatarData);

      setPhotoFile(avatarData.avatar.url);
      setSelectedFile(null);

      console.log('🔄 [attachPhoto] Refreshing user data...');
      await refreshUser();
      console.log('✅ [attachPhoto] User data refreshed');

      alert('Photo uploaded successfully!');
      setShowPhotoModal(false);
    } catch (err) {
      console.error('❌ [attachPhoto] Upload error:', err);
      console.error('❌ [attachPhoto] Error response:', err.response);
      console.error('❌ [attachPhoto] Error data:', err.response?.data);
      alert(err.response?.data?.message || err.message || 'Failed to upload photo');
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(form);
      alert('Profile updated successfully!');
    } finally {
      setSavingProfile(false);
    }
  };

  const onSavePortfolio = async () => {
    setSavingPortfolio(true);
    try {
      await updatePortfolio(profile._id || profile.id, { items: portfolio });
      alert('Portfolio saved successfully!');
    } finally {
      setSavingPortfolio(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-green-100">Manage your account information and preferences</p>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-50 rounded-lg">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
          </div>

          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden ring-4 ring-white shadow-md">
                {photoPreviewUrl() ? (
                  <img src={photoPreviewUrl()} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600 text-2xl font-bold">
                    {profile.firstName?.[0]}{profile.lastName?.[0]}
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowPhotoModal(true)}
                className="absolute bottom-0 right-0 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-lg transition-transform hover:scale-105"
                title="Change photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Profile Photo</h3>
              <p className="text-sm text-gray-500 mb-2">Update your profile picture</p>
              <button
                onClick={() => setShowPhotoModal(true)}
                className="text-sm font-medium text-green-600 hover:text-green-700"
              >
                Change Photo
              </button>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white transition-all"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white transition-all"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* KYC Verification */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">KYC Verification</h2>
              <p className="text-sm text-gray-500">Upload your identity documents for verification</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="space-y-3">
              <div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) {
                      setKycFile(null);
                      return;
                    }

                    // Validate file size (10MB)
                    if (file.size > 10 * 1024 * 1024) {
                      alert('File size must be less than 10MB');
                      setKycFile(null);
                      e.target.value = '';
                      return;
                    }

                    setKycFile(file);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {kycFile && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected: {kycFile.name} ({(kycFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>

              {kycFile && (
                <button
                  onClick={async () => {
                    if (!kycFile) return;

                    try {
                      setSavingProfile(true);
                      const formData = new FormData();
                      formData.append('document', kycFile);
                      await uploadKYC(formData);
                      alert('KYC document uploaded successfully!');
                      // Refresh user data to update KYC status
                      await refreshUser();
                      setKycFile(null);
                      // Reset file input
                      const fileInput = document.querySelector('input[type="file"]');
                      if (fileInput) fileInput.value = '';
                    } catch (error) {
                      alert(error.response?.data?.message || 'Failed to upload document');
                    } finally {
                      setSavingProfile(false);
                    }
                  }}
                  disabled={savingProfile}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-5 h-5" />
                  {savingProfile ? 'Uploading...' : 'Upload File'}
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Accepted formats: PDF, JPG, JPEG, PNG (Max 10MB)
            </p>
          </div>
        </div>

        {/* Portfolio */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Portfolio</h2>
              <p className="text-sm text-gray-500">Showcase your best work</p>
            </div>
          </div>

          <div className="space-y-4">
            {portfolio.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  value={item.title || ''}
                  onChange={(e) => setPortfolio(portfolio.map((it, i) => i === idx ? { ...it, title: e.target.value } : it))}
                  placeholder="Project Title"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                />
                <input
                  value={item.url || ''}
                  onChange={(e) => setPortfolio(portfolio.map((it, i) => i === idx ? { ...it, url: e.target.value } : it))}
                  placeholder="Project URL"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                />
                <button
                  onClick={() => setPortfolio(portfolio.filter((_, i) => i !== idx))}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            {portfolio.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No portfolio items yet. Add your first project!</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setPortfolio([...portfolio, { title: '', url: '' }])}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Item
              </button>
              <button
                onClick={onSavePortfolio}
                disabled={savingPortfolio}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {savingPortfolio ? 'Saving...' : 'Save Portfolio'}
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
              <p className="text-sm text-gray-500">Manage your account security</p>
            </div>
          </div>

          <TwoFactorAuth user={profile} />
        </div>
      </div>

      {/* Profile Photo Upload Modal */}
      <Modal open={showPhotoModal} onClose={() => setShowPhotoModal(false)} maxWidth="max-w-6xl">
        <div className="flex flex-col md:flex-row p-1 gap-10 min-h-[470px] w-[90vw] max-w-5xl">
          {/* Left: Dropzone */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-[350px] h-[350px] rounded-full border-2 border-dashed border-gray-400 flex flex-col items-center justify-center text-center mx-auto relative overflow-hidden group">
              {photoPreviewUrl() ? (
                <>
                  <img src={photoPreviewUrl()} alt="avatar" className="absolute inset-0 w-full h-full object-cover" />
                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="underline font-semibold">Change photo</span>
                    <input type="file" accept="image/*" ref={inputRef} className="hidden" onChange={handleFile} />
                  </label>
                </>
              ) : (
                <>
                  <div className="pb-3">
                    <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="32" cy="32" r="30" stroke="none" fill="#fff" /><circle cx="32" cy="27" r="10" stroke="#222" fill="none" /><path d="M16 54a16 10 0 0 1 32 0" stroke="#222" /></svg>
                  </div>
                  <label className="block cursor-pointer text-base">
                    <span className="text-green-600 underline">Upload</span> or drop<br />image here
                    <input type="file" accept="image/*" ref={inputRef} className="hidden" onChange={handleFile} />
                  </label>
                </>
              )}
            </div>
            <div className="text-gray-500 mt-4">250x250 Min / 5MB Max</div>
          </div>
          {/* Right: Info and CTA */}
          <div className="flex-1 flex flex-col justify-center p-6">
            <h2 className="text-5xl font-extrabold mb-6">Show clients the best version of yourself!</h2>
            <div className="flex items-center gap-3 mb-6 ml-1">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                {photoPreviewUrl() && <img src={photoPreviewUrl()} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                {photoPreviewUrl() && <img src={photoPreviewUrl()} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                {photoPreviewUrl() && <img src={photoPreviewUrl()} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                {photoPreviewUrl() && <img src={photoPreviewUrl()} alt="" className="w-full h-full object-cover" />}
              </div>
            </div>
            <div className="text-lg font-semibold mb-1">Must be an actual photo of you.</div>
            <div className="text-gray-700 mb-4">Logos, clip-art, group photos, and digitally-altered images are not allowed. <a href="#" className="text-green-600 underline">Learn more</a></div>
          </div>
          <div className="absolute right-6 top-4 text-4xl">
            <button onClick={() => setShowPhotoModal(false)}>&times;</button>
          </div>
        </div>
        <div className="flex justify-end gap-5 mt-8">
          <button type="button" className="text-gray-700 hover:text-gray-900 mr-10 text-lg font-medium" onClick={() => setShowPhotoModal(false)}>Cancel</button>
          <button type="button" className="h-12 px-8 rounded-[28px] bg-green-600 hover:bg-green-700 text-white text-lg" onClick={attachPhoto}>Attach photo</button>
        </div>
      </Modal>
    </div>
  );
}
