import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal.jsx'
import api from '../../api/axiosInstance.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import toast from 'react-hot-toast';

export default function ProfileEducation() {
    const navigate = useNavigate();
    const { user, refreshUser } = useAuthStore();
    const [items, setItems] = useState(() => {
        try { return JSON.parse(localStorage.getItem('onboarding_education') || '[]'); } catch { return []; }
    });

    // Check for existing user data on mount (for edit mode)
    useEffect(() => {
        if (user?.education && Array.isArray(user.education) && user.education.length > 0) {
            // Prioritize DB data if available, but maybe merge? 
            // For simplicity, if local is empty or we assume edit mode, take DB.
            // Let's just set it if we haven't touched the form yet.
            // Actually, best to just use DB data if available.
            setItems(user.education);
            localStorage.setItem('onboarding_education', JSON.stringify(user.education));
        }
    }, [user?.education]);

    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({ school: '', degree: '', field: '', from: '', to: '', description: '' })
    const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

    const currentYear = new Date().getFullYear()
    const yearsAsc = Array.from({ length: (currentYear + 7) - 1960 + 1 }, (_, i) => 1960 + i)
    const years = yearsAsc.reverse()
    const [fromOpen, setFromOpen] = useState(false)
    const [toOpen, setToOpen] = useState(false)
    const [fromQuery, setFromQuery] = useState('')
    const [toQuery, setToQuery] = useState('')

    const [editingIndex, setEditingIndex] = useState(-1)

    const save = async () => {
        if (!form.school.trim()) return
        const next = [...items]
        if (editingIndex >= 0) {
            next[editingIndex] = form
        } else {
            next.push(form)
        }
        setItems(next)
        localStorage.setItem('onboarding_education', JSON.stringify(next))

        try {
            const userId = user?._id || user?.id;
            if (userId) {
                await api.put(`/users/${userId}`, { education: next });
                await refreshUser(); // Update store
                toast.success('Education saved');
            }
        } catch (error) {
            console.error('Failed to save education:', error);
            toast.error('Failed to save education');
        }

        setForm({ school: '', degree: '', field: '', from: '', to: '', description: '' })
        setEditingIndex(-1)
        setOpen(false)
    }
    const remove = async (idx) => {
        const next = items.filter((_, i) => i !== idx)
        setItems(next)
        localStorage.setItem('onboarding_education', JSON.stringify(next))
        try {
            const userId = user?._id || user?.id;
            if (userId) {
                await api.put(`/users/${userId}`, { education: next });
                await refreshUser(); // Update store
                toast.success('Education removed');
            }
        } catch (error) {
            console.error('Failed to save education:', error);
            toast.error('Failed to remove education');
        }
    }

    const startEdit = (idx) => {
        setEditingIndex(idx)
        setForm(items[idx])
        setOpen(true)
    }

    const handleNext = () => {
        localStorage.setItem('onboarding_education', JSON.stringify(items));
        navigate('/nx/create-profile/languages');
    };

    return (
        <>
            <div className="min-h-screen bg-white flex items-start justify-center p-10">
                <div className="w-full max-w-5xl">
                    <div className="text-sm text-gray-600 mb-3">6/10</div>
                    <div className="w-full h-1 bg-gray-200 rounded mb-10">
                        <div className="h-full bg-gray-400 rounded" style={{ width: '60%' }} />
                    </div>

                    <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Clients like to know what you know - add your education here.</h1>
                    <p className="text-gray-700 mb-10 max-w-4xl">You don’t have to have a degree. Adding any relevant education helps make your profile more visible.</p>

                    {items.length === 0 ? (
                        <button type="button" onClick={() => setOpen(true)} className="w-full text-left border-2 border-dashed rounded-2xl p-16 bg-gray-50 text-gray-500 flex items-center gap-4 mb-16 hover:bg-gray-100">
                            <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-xl">+</span>
                            <span className="text-2xl">Add education</span>
                        </button>
                    ) : (
                        <div className="relative">
                            <div className="mb-6 inline-flex items-center">
                                <button type="button" onClick={() => { setEditingIndex(-1); setForm({ school: '', degree: '', field: '', from: '', to: '', description: '' }); setOpen(true) }} className="w-12 h-12 rounded-full border-2 border-green-600 text-green-600 flex items-center justify-center text-2xl mr-6">+</button>
                            </div>
                            {items.map((it, idx) => (
                                <div key={idx} className="border rounded-2xl shadow-sm p-8 max-w-4xl w-full min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-9 bg-green-600 rounded-sm" />
                                            <div className="text-3xl font-semibold text-gray-900">{it.school}</div>
                                        </div>
                                        <div className="flex items-center gap-3 text-green-600">
                                            <button type="button" onClick={() => startEdit(idx)} className="w-9 h-9 rounded-full border-2 border-green-600 flex items-center justify-center">✏️</button>
                                            <button type="button" onClick={() => remove(idx)} className="w-9 h-9 rounded-full border-2 border-green-600 flex items-center justify-center">🗑️</button>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-gray-700 font-medium">
                                        {it.degree && `${it.degree}`} {it.field && `of ${it.field}`} {it.from || it.to ? `${it.from || ''}${it.to ? `-${it.to}` : ''}` : ''}
                                    </div>
                                    {it.description && <div className="mt-4 text-gray-800 break-words whitespace-pre-wrap break-all">{it.description}</div>}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <button type="button" onClick={() => navigate('/nx/create-profile/experience')} className="h-12 px-8 rounded-[28px] border border-gray-300 font-bold text-green-700 hover:bg-gray-50">Back</button>
                        <div className="flex items-center gap-6">
                            <button type="button" onClick={handleNext} className="text-green-600 hover:underline">Skip for now</button>
                            <button type="button" onClick={handleNext} className="h-12 px-8 rounded-[28px] bg-green-600 hover:bg-green-700 text-white">Next, add languages</button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal open={open} onClose={() => setOpen(false)} maxWidth="max-w-4xl">
                <div className="p-3">
                    <div className="text-4xl font-extrabold mb-6">Add Education History</div>
                    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                        <div>
                            <div className="mb-2 font-medium">School *</div>
                            <input value={form.school} onChange={(e) => update('school', e.target.value)} className="w-full h-12 px-4 border rounded-lg text-gray-900 bg-white" placeholder="Ex: Northwestern University" />
                        </div>
                        <div>
                            <div className="mb-2 font-medium">Degree</div>
                            <input value={form.degree} onChange={(e) => update('degree', e.target.value)} className="w-full h-12 px-4 border rounded-lg text-gray-900 bg-white" placeholder="Ex: Bachelors" />
                        </div>
                        <div>
                            <div className="mb-2 font-medium">Field of Study</div>
                            <input value={form.field} onChange={(e) => update('field', e.target.value)} className="w-full h-12 px-4 border rounded-lg text-gray-900 bg-white" placeholder="Ex: Computer Science" />
                        </div>
                        <div>
                            <div className="mb-2 font-medium">Dates Attended</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <button type="button" onClick={() => { setFromOpen(v => !v); setToOpen(false) }} className="h-12 px-4 border rounded-lg w-full flex items-center justify-between text-gray-900 bg-white">
                                        <span>{form.from || 'From'}</span>
                                        <span className="ml-2">▾</span>
                                    </button>
                                    {fromOpen && (
                                        <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            <div className="sticky top-0 bg-white p-3 z-10 border-b">
                                                <input value={fromQuery} onChange={(e) => setFromQuery(e.target.value)} className="w-full h-10 px-3 border rounded text-gray-900 bg-white" placeholder="Search" />
                                            </div>
                                            <div className="p-2 space-y-1">
                                                <div className="px-2 py-2 text-gray-500">From</div>
                                                {years.filter(y => y.toString().includes(fromQuery)).map((y) => (
                                                    <button key={y} type="button" onClick={() => { update('from', y); setFromOpen(false) }} className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 text-gray-900">{y}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="relative">
                                    <button type="button" onClick={() => { setToOpen(v => !v); setFromOpen(false) }} className="h-12 px-4 border rounded-lg w-full flex items-center justify-between text-gray-900 bg-white">
                                        <span>{form.to || 'To (or expected graduation year)'}</span>
                                        <span className="ml-2">▾</span>
                                    </button>
                                    {toOpen && (
                                        <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            <div className="sticky top-0 bg-white p-3 z-10 border-b">
                                                <input value={toQuery} onChange={(e) => setToQuery(e.target.value)} className="w-full h-10 px-3 border rounded text-gray-900 bg-white" placeholder="" />
                                            </div>
                                            <div className="p-2 space-y-1">
                                                <div className="px-2 py-2 text-gray-500">To (or expected graduation year)</div>
                                                {years.filter(y => y.toString().includes(toQuery)).map((y) => (
                                                    <button key={y} type="button" onClick={() => { update('to', y); setToOpen(false) }} className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 text-gray-900">{y}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="mb-2 font-medium">Description</div>
                            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={6} className="w-full px-4 py-3 border rounded-lg text-gray-900 bg-white" placeholder="Describe your studies, awards, etc." />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-4">
                        <button type="button" onClick={() => setOpen(false)} className="h-11 px-6 rounded-[28px] border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button type="button" onClick={save} className="h-11 px-8 rounded-[28px] bg-green-600 hover:bg-green-700 text-white">Save</button>
                    </div>
                </div>
            </Modal>
        </>
    );
}


