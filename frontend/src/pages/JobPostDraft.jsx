import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Paperclip, ChevronDown, MoreVertical, Plus, Minus, ArrowLeft, ArrowRight, Calendar, Trash2, X } from 'lucide-react';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance.js';

export default function JobPostDraft() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialDescription = location.state?.description || '';

  // Form state
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState(initialDescription);
  const [deliverables, setDeliverables] = useState('');
  const [jobType, setJobType] = useState('One-time project');
  const [duration, setDuration] = useState('Less than 1 month');
  const [hoursPerWeek, setHoursPerWeek] = useState('More than 30 hrs/week');
  const [jobSize, setJobSize] = useState('Medium');
  const [freelancersNeeded, setFreelancersNeeded] = useState(1);
  const [umaMessage, setUmaMessage] = useState('');
  const [showProjectDeadline, setShowProjectDeadline] = useState(false);
  const [showHiringTimeline, setShowHiringTimeline] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [projectDeadline, setProjectDeadline] = useState('');
  const [hiringTimeline, setHiringTimeline] = useState('');

  const jobTypes = ['One-time project', 'Ongoing project', 'Complex project'];
  const durations = ['Less than 1 month', '1 to 3 months', '3 to 6 months', 'More than 6 months'];
  const hoursPerWeekOptions = ['Less than 10 hrs/week', '10-30 hrs/week', 'More than 30 hrs/week'];
  const jobSizes = ['Small', 'Medium', 'Large'];

  const canProceed = title.trim().length > 0 && summary.trim().length > 0;

  const handleBack = () => {
    navigate('/nx/job-post/chat');
  };

  const handleNext = () => {
    if (!canProceed) return;
    // Navigate to the freelancer step with a job id in the URL
    navigate('/nx/job-post/chat/1986694301012893989/freelancer', {
      state: {
        title,
        summary,
        deliverables,
        jobType,
        duration,
        hoursPerWeek,
        jobSize,
        freelancersNeeded,
        projectDeadline,
        hiringTimeline,
        files,
      },
    });
  };

  const handleUmaReply = () => {
    if (!umaMessage.trim()) return;
    // Handle Uma AI reply (can be implemented later)
    console.log('Uma reply:', umaMessage);
    setUmaMessage('');
  };

  // File handling
  // File handling
  const handleAddFilesClick = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'job-attachments');

    try {
      // Create a temporary placeholder
      const tempId = Math.random().toString(36).substr(2, 9);
      setFiles(prev => [...prev, {
        name: file.name,
        type: file.type,
        size: file.size,
        uploading: true,
        id: tempId
      }]);

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const uploadedFile = {
        name: file.name,
        type: file.type,
        size: file.size,
        url: res.data.data.url,
        publicId: res.data.data.publicId,
        uploading: false
      };

      // Replace placeholder with actual file data
      setFiles(prev => prev.map(f => f.id === tempId ? uploadedFile : f));
      toast.success(`${file.name} uploaded`);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(`Failed to upload ${file.name}`);
      // Remove the failed file placeholder
      setFiles(prev => prev.filter(f => f.name !== file.name));
    }
  };

  const handleFilesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    newFiles.forEach(file => uploadFile(file));
    e.target.value = '';
  };

  const handleRemoveFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const suggestedSkills = ['Logo', 'Website', 'AI chatbot', 'SEO', 'Video editing'];

  return (
    <div className="min-h-screen bg-white">
      {/* Alert Banner */}
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-blue-800">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
          <span>Just a reminder to publish your job post, you'll need to verify your phone number</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - AI Assistant Uma */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Refine your job post with Uma
                </h2>
                <span className="bg-black text-white text-xs px-2 py-1 rounded-full">Beta</span>
              </div>

              {/* Job Post Strength */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span className="text-sm text-gray-700">Job post strength: 1 of 4</span>
                </div>
                <button className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 hover:bg-yellow-200">
                  3 tips
                  <ArrowRight size={12} />
                </button>
              </div>

              {/* Uma Introduction */}
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 mb-2">
                    Hi! I'm <span className="font-semibold">Uma</span>, Freelancer's Mindful AI. I can help you write a job post that gets noticed.
                  </p>
                  <p className="text-sm text-gray-700">
                    What do you need done?
                  </p>
                </div>

                {/* Suggested Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {suggestedSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => setSummary(prev => prev ? `${prev} ${skill}` : skill)}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-full hover:bg-gray-300 transition-colors"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reply Input */}
              <div className="relative">
                <input
                  type="text"
                  value={umaMessage}
                  onChange={(e) => setUmaMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUmaReply()}
                  placeholder="Reply to Uma..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                />
                <button
                  onClick={handleUmaReply}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-green-600 hover:bg-green-50 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Main Content - Draft Job Post */}
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-lg p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Draft job post</h1>
                <button className="p-2 text-green-600 hover:bg-green-50 rounded-full">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Progress Tracker */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <span className="bg-green-600 text-white text-sm font-medium px-3 py-1 rounded-full">(1) Job</span>
                  <div className="w-12 h-0.5 bg-gray-300"></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-gray-200 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">(2) Freelancer</span>
                  <div className="w-12 h-0.5 bg-gray-300"></div>
                </div>
                <span className="bg-gray-200 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">(3) Budget</span>
              </div>

              {/* Job Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Untitled job post"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
                />
              </div>

              {/* Summary */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Describe what you need..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-gray-900 bg-white"
                />
              </div>

              {/* Deliverables */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Deliverables</label>
                <textarea
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  placeholder="Describe the deliverables..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none mb-3 text-gray-900 bg-white"
                />
                {/* File Upload Section */}
                <div className="mb-3">
                  <input
                    type="file"
                    multiple
                    hidden
                    ref={fileInputRef}
                    onChange={handleFilesChange}
                  />
                  <button
                    type="button"
                    onClick={handleAddFilesClick}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                  >
                    <Paperclip size={18} />
                    <span>Add supporting files</span>
                  </button>
                </div>
                {/* Show uploaded files preview/thumbnails */}
                {files.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-4">
                    {files.map((file, idx) => (
                      <div key={idx} className="relative flex flex-col items-center group">
                        {file.uploading ? (
                          <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded border mb-1">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                          </div>
                        ) : file.type.startsWith('image/') ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-20 h-20 object-cover rounded border mb-1"
                          />
                        ) : (
                          <div className="w-20 h-20 flex flex-col items-center justify-center bg-gray-100 rounded border mb-1 p-1 text-center">
                            <Paperclip size={20} className="text-gray-400 mb-1" />
                            <span className="text-[10px] text-gray-500 line-clamp-2 break-all">{file.name}</span>
                          </div>
                        )}
                        {!file.uploading && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="absolute -top-2 -right-2 bg-white rounded-full shadow-md text-red-600 hover:bg-red-50 p-1 opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200"
                            title="Remove file"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Job Details - Two Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job type</label>
                  <div className="relative">
                    <select
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white text-gray-900"
                    >
                      {jobTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <div className="relative">
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white text-gray-900"
                    >
                      {durations.map((dur) => (
                        <option key={dur} value={dur}>{dur}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hours per week</label>
                  <div className="relative">
                    <select
                      value={hoursPerWeek}
                      onChange={(e) => setHoursPerWeek(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white text-gray-900"
                    >
                      {hoursPerWeekOptions.map((hours) => (
                        <option key={hours} value={hours}>{hours}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job size</label>
                  <div className="relative">
                    <select
                      value={jobSize}
                      onChange={(e) => setJobSize(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white text-gray-900"
                    >
                      {jobSizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
              </div>

              {/* Freelancers needed */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Freelancers needed</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setFreelancersNeeded(Math.max(1, freelancersNeeded - 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={18} className="text-gray-600" />
                  </button>
                  <input
                    type="number"
                    value={freelancersNeeded}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setFreelancersNeeded(Math.max(1, val));
                    }}
                    min="1"
                    className="w-20 px-4 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
                  />
                  <button
                    onClick={() => setFreelancersNeeded(freelancersNeeded + 1)}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={18} className="text-green-600" />
                  </button>
                </div>
              </div>

              {/* Other preferences */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">Other preferences (optional)</label>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setShowProjectDeadline(!showProjectDeadline)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                  >
                    <span>Project deadline</span>
                    <Plus size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowHiringTimeline(!showHiringTimeline)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                  >
                    <span>Hiring timeline</span>
                    <Plus size={18} />
                  </button>
                </div>
                {/* Inline Project deadline pop-up */}
                {showProjectDeadline && (
                  <div className="mt-4 flex items-center bg-gray-50 p-5 rounded-lg shadow border w-full max-w-md gap-4 relative">
                    <div className="flex-1">
                      <label className="block text-base font-semibold text-gray-900 mb-2">Project deadline</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={projectDeadline}
                          onChange={e => setProjectDeadline(e.target.value)}
                          placeholder="MM-DD-YYYY"
                          className="w-full px-4 py-2 pl-14 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg bg-white appearance-none text-gray-900"
                        />
                        <Calendar size={24} className="absolute left-4 top-2.5 text-gray-400" />
                      </div>
                    </div>
                    <button
                      type="button"
                      title="Remove deadline"
                      className="ml-4 mt-8 flex items-center justify-center p-2 text-gray-500 hover:text-red-600"
                      onClick={() => {
                        setProjectDeadline(''); setShowProjectDeadline(false);
                      }}
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                )}
                {/* Inline Hiring timeline pop-up */}
                {showHiringTimeline && (
                  <div className="mt-4 flex items-center bg-gray-50 p-5 rounded-lg shadow border w-full max-w-md gap-4 relative">
                    <div className="flex-1">
                      <label className="block text-base font-semibold text-gray-900 mb-2">Hiring timeline</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={hiringTimeline}
                          onChange={e => setHiringTimeline(e.target.value)}
                          placeholder="MM-DD-YYYY"
                          className="w-full px-4 py-2 pl-14 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg bg-white appearance-none text-gray-900"
                        />
                        <Calendar size={24} className="absolute left-4 top-2.5 text-gray-400" />
                      </div>
                    </div>
                    <button
                      type="button"
                      title="Remove hiring timeline"
                      className="ml-4 mt-8 flex items-center justify-center p-2 text-gray-500 hover:text-red-600"
                      onClick={() => {
                        setHiringTimeline(''); setShowHiringTimeline(false);
                      }}
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${canProceed
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <span>Next</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

