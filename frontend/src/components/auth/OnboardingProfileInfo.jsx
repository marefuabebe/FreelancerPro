import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { uploadFile } from '../../api/uploadApi.js';
import { updateUser } from '../../api/authApi.js';
import { useAuthStore } from '../../store/useAuthStore.js';

function LinkedInUploadModal({ open, onClose, onImport }) {
    // File upload handling
    const [file, setFile] = useState(null);
    // Optional: warning or feedback state
    function handleFile(e) {
        const f = e.target.files[0];
        if (!f) return;
        if (f.type !== 'application/pdf') {
            alert('Please upload a PDF file.');
            return;
        }
        setFile(f);
    }
    function handleContinue() {
        if (!file) return;
        onImport(file);
        setFile(null);
    }
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/15 flex items-center justify-center" style={{ backdropFilter: 'blur(1.5px)' }}>
            <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-xl w-full relative animate-fadeIn">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-6 text-3xl text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                >
                    ×
                </button>
                <h2 className="text-3xl font-bold mb-4 mt-2">Upload your LinkedIn profile</h2>
                <div className="text-lg mb-5">Step 1: if you haven't already, save your LinkedIn profile as a PDF. Here's how:</div>
                <div className="flex flex-col items-center mb-7">
                    <img
                        src="https://static.overlay-tech.com/assets/24706c63-3c41-4d68-993f-6673c237a43c.png"
                        alt="LinkedIn PDF instructions"
                        className="rounded-xl border w-[370px] h-auto mb-7 shadow"
                        style={{ maxWidth: '98%' }}
                    />
                </div>
                <div className="text-base font-medium mb-4">Step 2: come back here to upload it.</div>
                <div className="flex flex-col items-center gap-3 mb-8">
                    <label className="w-full">
                        <input type="file" accept="application/pdf" className="hidden" onChange={handleFile} />
                        <span className="inline-flex items-center gap-2 cursor-pointer rounded-xl border-2 border-green-600 transition-colors px-6 py-3 bg-white text-green-700 font-bold text-lg hover:bg-green-50 active:bg-green-100">
                            <svg width="28" height="28" fill="none"><path stroke="#10B981" strokeWidth="2.2" d="M14 4v16m0 0l-7-6m7 6l7-6" /><rect x="4" y="20" width="16" height="4" rx="2" fill="#10B981" /></svg>
                            {file ? `PDF uploaded: ${file.name}` : 'Upload your saved LinkedIn PDF'}
                        </span>
                    </label>
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        disabled={!file}
                        onClick={handleContinue}
                        className={`rounded-2xl px-8 py-3 text-lg font-bold transition-colors ${file ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

function ResumeUploadModal({ open, onClose, onPickFile, onFileSelected, onContinue }) {
    const [file, setFile] = useState(null);
    const inputRef = useRef(null);
    if (!open) return null;
    const choose = () => inputRef.current && inputRef.current.click();
    const handleChange = (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        setFile(f);
        if (onFileSelected) onFileSelected(f);
    };
    return (
        <div className="fixed inset-0 z-50 bg-black/15 flex items-center justify-center" style={{ backdropFilter: 'blur(1.5px)' }}>
            <div className="bg-white rounded-2xl p-8 max-w-3xl w-full relative shadow-2xl animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute top-5 right-6 text-3xl text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                >
                    ×
                </button>
                <h2 className="text-3xl font-bold mb-2">Add your resume</h2>
                <div className="text-gray-700 mb-6">Use a PDF, Word doc, or rich text file – make sure it’s 5MB or less.</div>
                <div className="border-2 border-dashed rounded-xl p-12 bg-gray-50 flex flex-col items-center justify-center">
                    <svg width="72" height="72" viewBox="0 0 24 24" className="text-green-500 mb-4" aria-hidden="true">
                        <path fill="#10B981" d="M19 9h-4V3H9v6H5l7 8 7-8z" /><path fill="#10B981" d="M5 18h14v2H5z" />
                    </svg>
                    <div className="text-gray-700">Drag and drop or <button type="button" onClick={choose} className="text-green-600 underline">choose file</button></div>
                    <input ref={inputRef} type="file" accept=".pdf,.doc,.docx,.rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={handleChange} />
                    {file && <div className="mt-4 text-gray-800">Selected: <span className="font-semibold">{file.name}</span></div>}
                </div>
                <div className="mt-8 flex justify-end">
                    <button
                        type="button"
                        onClick={() => file && onContinue && onContinue(file)}
                        disabled={!file}
                        className={`h-12 px-8 rounded-[28px] font-bold text-white ${file ? 'bg-green-500 hover:bg-green-600' : 'bg-green-500 opacity-50 cursor-not-allowed'}`}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export default function OnboardingProfileInfo() {
    const navigate = useNavigate();
    const fileInputRef = useRef();
    const [profileSource, setProfileSource] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeText, setResumeText] = useState('');
    const [loading, setLoading] = useState(false);
    // For this step, LinkedIn is mocked
    const [linkedinImported, setLinkedinImported] = useState(false);
    const [showLinkedInModal, setShowLinkedInModal] = useState(false);
    const [showResumeModal, setShowResumeModal] = useState(false);

    // Resume parsing function (simplified - just validate and store file)
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.error('Please upload a PDF or DOCX file.');
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            toast.error('File is too large (max 5MB).');
            return;
        }
        setResumeFile(file);
        setResumeText(`File uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
        setResumeFile(file);
        setResumeText(`File uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
        toast.success('Resume uploaded successfully!');
    };

    // Initialize state from existing user data
    const { user } = useAuthStore();
    useEffect(() => {
        if (user?.resume?.url) {
            setLinkedinImported(true); // Treat as imported if resume exists
            setProfileSource('linkedin'); // Default to linkedin or resume based on... needs logic but 'linkedin' works for bypass
            // Optionally set file text
        }
    }, [user]);

    // Flow validation
    const canProceed =
        profileSource === 'linkedin' ? linkedinImported :
            profileSource === 'resume' ? Boolean(resumeFile && resumeText) :
                profileSource === 'manual';

    // Next navigation logic
    const handleNext = () => {
        if (!profileSource) {
            toast.error('Please select a method.');
            return;
        }
        localStorage.setItem('onboarding_profile_source', profileSource);
        if (profileSource === 'linkedin') return navigate('/nx/create-profile/categories');
        if (profileSource === 'resume') return navigate('/nx/create-profile/categories');
        return navigate('/nx/create-profile/categories');
    };

    // Handler for LinkedIn (mock for now)
    const startLinkedInImport = () => {
        // For a real app, open LinkedIn OAuth pop-up. For now:
        setLinkedinImported(true);
        toast.success('Mock LinkedIn import complete!');
    };

    const [uploading, setUploading] = useState(false);

    // Handler for LinkedIn Import modal success
    async function handleLinkedInImport(file) {
        setUploading(true);
        try {
            const { user } = useAuthStore.getState();
            // 1. Upload file
            const uploadRes = await uploadFile(file);
            const { url, public_id, original_filename } = uploadRes.data || uploadRes;

            // 2. Update user profile
            const updatedUser = await updateUser(user._id, {
                resume: {
                    url,
                    publicId: public_id,
                    filename: original_filename
                }
            });

            // 3. Update store
            useAuthStore.getState().setUser(updatedUser.data);

            setShowLinkedInModal(false);
            setLinkedinImported(true);
            setProfileSource('linkedin');
            toast.success('LinkedIn PDF uploaded and saved!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload LinkedIn PDF');
        } finally {
            setUploading(false);
        }
    }

    const handleBack = () => navigate('/nx/create-profile/preference');

    return (
        <div className="min-h-screen bg-white flex flex-col items-center p-10">
            {/* Modal */}
            <LinkedInUploadModal
                open={showLinkedInModal}
                onClose={() => setShowLinkedInModal(false)}
                onImport={handleLinkedInImport}
            />
            <ResumeUploadModal
                open={showResumeModal}
                onClose={() => setShowResumeModal(false)}
                onFileSelected={(f) => {
                    setResumeFile(f);
                    setResumeText(`File uploaded: ${f.name} (${(f.size / 1024).toFixed(1)} KB)`);
                }}
                onContinue={async (f) => {
                    setLoading(true);
                    try {
                        const { user } = useAuthStore.getState();
                        const uploadRes = await uploadFile(f);
                        const { url, public_id, original_filename } = uploadRes.data || uploadRes;

                        const updatedUser = await updateUser(user._id, {
                            resume: { url, publicId: public_id, filename: original_filename }
                        });

                        useAuthStore.getState().setUser(updatedUser.data);

                        setProfileSource('resume');
                        setShowResumeModal(false);
                        toast.success('Resume uploaded and saved!');
                    } catch (error) {
                        console.error(error);
                        toast.error('Failed to upload resume');
                    } finally {
                        setLoading(false);
                    }
                }}
            />
            {/* Top logo removed; global OnboardingNavbar renders header */}
            <div className="w-full max-w-6xl flex flex-col md:flex-row gap-12">
                {/* Left - Main options */}
                <div className="flex-1 min-w-[300px]">
                    <div className="mb-1 flex items-center gap-3 text-2xl font-bold text-gray-900">
                        Create your profile <span className="text-lg font-normal text-gray-500">1/10</span>
                    </div>
                    <div className="w-full h-[4px] rounded bg-gray-200 mb-7">
                        <div className="h-full bg-green-600 rounded" style={{ width: '10%' }} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                        How would you like to tell us about yourself?
                    </h1>
                    <p className="text-lg text-gray-700 mb-7 max-w-2xl">
                        We need to get a sense of your education, experience, and skills. It's quickest to import your information—you can edit it before your profile goes live.
                    </p>
                    <div className="flex flex-col gap-4 w-full max-w-md mb-4">
                        {/* LinkedIn */}
                        <button
                            type="button"
                            onClick={() => { setShowLinkedInModal(true); }}
                            className={`flex items-center gap-4 border-2 ${profileSource === 'linkedin' ? 'border-green-600 bg-green-50' : 'border-green-600'} text-green-700 rounded-lg px-7 py-4 text-lg font-semibold shadow-none bg-white hover:bg-green-50 transition-colors outline-none`}
                            style={{ boxShadow: 'none' }}
                        >
                            <svg viewBox="0 0 32 32" className="w-6 h-6" aria-hidden="true"><g><path fill="#0A66C2" d="M29 0H3C1.3 0 0 1.3 0 3v26c0 1.7 1.3 3 3 3h26c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3zM9.4 27.3H5V12.2h4.5v15.1zM7.2 10.5c-1.4 0-2.5-1.1-2.5-2.5S5.7 5.4 7.2 5.4c1.4 0 2.5 1.1 2.5 2.5s-1.2 2.6-2.5 2.6zm20.1 16.8h-4.4v-7.3c0-1.7-0.6-2.9-2-2.9-1.1 0-1.7 0.7-1.9 1.4-0.1 0.3-0.1 0.7-0.1 1.1v7.7h-4.4s0.1-12.5 0-13.7h4.4v1.9c0.6-1 1.7-2.4 4.1-2.4 3 0 5.2 2 5.2 6.2v8z" /></g></svg>
                            Import from LinkedIn {profileSource === 'linkedin' && linkedinImported && <span className="text-green-600 ml-2">✓ Imported</span>}
                        </button>
                        {/* Resume upload */}
                        <button
                            type="button"
                            onClick={() => { setProfileSource('resume'); setShowResumeModal(true); }}
                            className={`flex items-center gap-4 border-2 ${profileSource === 'resume' ? 'border-green-600 bg-green-50' : 'border-green-600'} text-green-700 rounded-lg px-7 py-4 text-lg font-semibold shadow-none bg-white hover:bg-green-50 transition-colors outline-none`}
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true"><path fill="#10B981" d="M19 9h-4V3H9v6H5l7 8 7-8z" /><path fill="#10B981" d="M5 18h14v2H5z" /></svg>
                            Upload your resume
                        </button>
                        {/* file input and inline preview moved to dedicated step */}
                        {/* Fill out manually */}
                        <button
                            type="button"
                            onClick={() => { setProfileSource('manual'); navigate('/nx/create-profile/categories'); }}
                            className={`flex items-center justify-center border-2 ${profileSource === 'manual' ? 'border-green-600 bg-green-50' : 'border-green-600'} text-green-700 rounded-lg px-7 py-4 text-lg font-semibold shadow-none bg-white hover:bg-green-50 transition-colors outline-none`}
                        >
                            Fill out manually (15 min)
                        </button>
                    </div>
                </div>
                {/* Right - Testimonial carousel */}
                {/* Remove TestimonialCarousel import and its usage from right column. */}
            </div>
            {/* Bottom row navigation */}
            <div className="w-full max-w-6xl mt-8 flex justify-between px-0">
                <button
                    type="button"
                    onClick={handleBack}
                    className="h-12 px-8 rounded-[28px] border border-gray-300 font-bold text-green-700 hover:bg-gray-50 transition-colors"
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceed}
                    className={`h-12 px-10 text-lg rounded-[28px] bg-green-500 text-white font-bold transition-colors ${canProceed ? 'hover:bg-green-600' : 'opacity-50 cursor-not-allowed'}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}