import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, ChevronDown, MoreVertical, Plus, X } from 'lucide-react';

export default function JobPostBudget() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobId } = useParams();

  // State - initialize from location.state if available
  const [projectType, setProjectType] = useState(location.state?.projectType || 'hourly'); // 'hourly' or 'fixed'
  const [budgetFrom, setBudgetFrom] = useState(location.state?.budgetFrom || '10.00');
  const [budgetTo, setBudgetTo] = useState(location.state?.budgetTo || '100.00');
  const [fixedBudget, setFixedBudget] = useState(location.state?.fixedBudget || '');
  const [showNotReady, setShowNotReady] = useState(false);
  const [visibility, setVisibility] = useState(location.state?.visibility || 'Public, including search engines');
  const visibilityOptions = [
    'Public, including search engines',
    'FreelancerPro users only',
    'Invite only'
  ];
  const [showVisibility, setShowVisibility] = useState(false);
  const [coworkers, setCoworkers] = useState(location.state?.coworkers || []);
  const [coworkerInput, setCoworkerInput] = useState('');
  const [addCoworker, setAddCoworker] = useState(false);

  function handleBack() {
    navigate(`/nx/job-post/chat/${jobId}/freelancer`, { state: location.state });
  }
  function handleFinalize() {
    // Collect all data from previous steps and current step
    const allJobData = {
      ...location.state, // Data from previous steps (Job, Freelancer)
      projectType,
      budgetFrom,
      budgetTo,
      fixedBudget,
      visibility,
      coworkers,
    };
    // Navigate to review page
    navigate(`/nx/job-post/chat/${jobId}/review`, { state: allJobData });
  }

  const handleAddCoworker = () => {
    if (coworkerInput.trim() && !coworkers.includes(coworkerInput.trim())) {
      setCoworkers([...coworkers, coworkerInput.trim()]);
      setCoworkerInput('');
    }
  };
  const handleRemoveCoworker = (email) => {
    setCoworkers(coworkers.filter(cw => cw !== email));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Alert banner */}
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
          {/* Left Sidebar - Uma */}
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
                  <span className="text-sm text-gray-700">Job post strength: 2 of 4</span>
                </div>
                <button className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 hover:bg-yellow-200">
                  2 tips
                  <ArrowRight size={12} />
                </button>
              </div>
              {/* Uma intro, skill suggestions, reply input (stubbed as before) */}
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 mb-2">
                    Hi there. I'm Uma, FreelancerPro's Mindful AI. I'm here to help you write a job post that gets noticed. What do you need done?
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Logo', 'Website', 'AI chatbot', 'SEO', 'Video editing'].map(skill => (
                    <button
                      key={skill}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-full hover:bg-gray-300 transition-colors"
                      tabIndex={-1}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Reply to Uma..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                  tabIndex={-1}
                  disabled
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-green-600 hover:bg-green-50 rounded"
                  disabled
                  tabIndex={-1}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right main content */}
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-lg p-8">
              {/* Step bar */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <span className="bg-gray-200 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">(1) Job</span>
                  <div className="w-12 h-0.5 bg-gray-300"></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-gray-200 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">(2) Freelancer</span>
                  <div className="w-12 h-0.5 bg-gray-300"></div>
                </div>
                <span className="bg-green-600 text-white text-sm font-medium px-3 py-1 rounded-full">(3) Budget</span>
              </div>
              {/* Project type section */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-6">Project type</label>
                <div className="flex gap-8 mb-6">
                  <button
                    type="button"
                    onClick={() => setProjectType('hourly')}
                    className={`flex items-center gap-2 px-8 py-4 rounded-lg border text-lg font-medium transition-colors focus:outline-none ${projectType === 'hourly' ? 'border-green-600 ring-2 ring-green-200 bg-white text-green-700' : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-green-50'}`}
                  >
                    {projectType === 'hourly' && <span className="w-5 h-5 rounded-full border-2 border-green-600 bg-white flex items-center justify-center"><span className="w-3 h-3 bg-green-600 rounded-full block" /></span>}
                    Hourly rate
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectType('fixed')}
                    className={`flex items-center gap-2 px-8 py-4 rounded-lg border text-lg font-medium transition-colors focus:outline-none ${projectType === 'fixed' ? 'border-green-600 ring-2 ring-green-200 bg-white text-green-700' : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-green-50'}`}
                  >
                    {projectType === 'fixed' && <span className="w-5 h-5 rounded-full border-2 border-green-600 bg-white flex items-center justify-center"><span className="w-3 h-3 bg-green-600 rounded-full block" /></span>}
                    Fixed-price
                  </button>
                </div>
                {projectType === 'hourly' ? (
                  <div className="flex gap-6 mb-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                      <div className="flex items-center gap-2">
                        <input
                          className="border border-gray-300 rounded-md px-4 py-3 text-lg w-32 text-gray-900 bg-white"
                          type="number"
                          value={budgetFrom}
                          onChange={e => setBudgetFrom(e.target.value)}
                          min="0"
                        />
                        <span className="text-gray-500 text-base">/hour</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                      <div className="flex items-center gap-2">
                        <input
                          className="border border-gray-300 rounded-md px-4 py-3 text-lg w-32 text-gray-900 bg-white"
                          type="number"
                          value={budgetTo}
                          onChange={e => setBudgetTo(e.target.value)}
                          min="0"
                        />
                        <span className="text-gray-500 text-base">/hour</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                    <div className="flex items-center gap-2">
                      <input
                        className="border border-gray-300 rounded-md px-4 py-3 text-lg w-48 text-gray-900 bg-white"
                        type="number"
                        value={fixedBudget}
                        onChange={e => setFixedBudget(e.target.value)}
                        min="0"
                        placeholder="Total budget"
                      />
                      <span className="text-gray-500 text-base">USD</span>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  className="text-green-600 underline text-base mt-3"
                  onClick={() => setShowNotReady(true)}
                >
                  Not ready to set an hourly rate?
                </button>
              </div>
              {/* Ready to publish section */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to publish?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-3">Visibility</label>
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-white text-lg flex items-center justify-between text-left focus:outline-none"
                        onClick={() => setShowVisibility(v => !v)}
                      >
                        {visibility}
                        <ChevronDown size={22} className="text-gray-400" />
                      </button>
                      {showVisibility && (
                        <div className="absolute z-10 left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg text-base">
                          {visibilityOptions.map(v => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => { setVisibility(v); setShowVisibility(false); }}
                              className={`w-full text-left px-5 py-3 hover:bg-green-50 text-gray-700 ${visibility === v ? 'bg-green-100 font-semibold' : ''}`}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-3">Sharing</label>
                    <div>
                      <button
                        type="button"
                        onClick={() => setAddCoworker(v => !v)}
                        className="w-full border border-gray-300 text-green-600 hover:bg-green-50 transition-colors font-medium rounded-lg px-5 py-4 flex items-center justify-between text-lg"
                      >
                        Add coworkers <Plus size={24} />
                      </button>
                      {addCoworker && (
                        <div className="mt-3 flex flex-col gap-3">
                          <input
                            type="email"
                            placeholder="Invite coworker email"
                            value={coworkerInput}
                            onChange={e => setCoworkerInput(e.target.value)}
                            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base text-gray-900 bg-white"
                          />
                          <button
                            type="button"
                            onClick={handleAddCoworker}
                            disabled={!coworkerInput.trim()}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2 font-semibold text-lg transition-colors disabled:opacity-50"
                          >Add</button>
                        </div>
                      )}
                      {coworkers.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {coworkers.map(email => (
                            <span key={email} className="flex items-center bg-green-100 rounded-full px-4 py-2 text-green-700 text-base border border-green-200">
                              {email}
                              <button onClick={() => handleRemoveCoworker(email)} className="ml-2 text-green-400 hover:text-red-600"><X size={16} /></button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Navigation row */}
                <div className="flex items-center justify-between pt-16 mt-6 border-t">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-8 py-4 text-green-600 hover:text-green-700 font-medium transition-colors rounded-lg border border-green-600 bg-white text-lg"
                  >
                    <ArrowLeft size={22} />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleFinalize}
                    className="flex items-center gap-3 px-9 py-5 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 text-xl shadow-lg"
                  >
                    Finalize job post <Check size={28} className="text-white" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
