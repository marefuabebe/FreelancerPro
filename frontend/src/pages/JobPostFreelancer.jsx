import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MoreVertical, Info, Plus, X, ChevronDown } from 'lucide-react';
import { Calendar } from 'lucide-react';

import { categories, specialties } from '../utils/jobCategories.js';
import { countries, languages } from '../utils/locationsAndLanguages.js';
import CustomSelect from '../components/common/CustomSelect.jsx';

const allOtherPrefs = [
  'Screening Questions',
  'Location',
  'English level',
  'Languages',
  'Agency preference',
  'History on Upwork',
];

// New preference config
const prefsConfig = {
  'Screening Questions': {
    label: 'Screening Questions',
    options: ['Describe your experience', 'Why should I hire you?'],
    multi: true,
  },
  'Location': {
    label: 'Location',
    options: countries,
    multi: true,
  },
  'English level': {
    label: 'English level',
    options: ['Basic', 'Conversational', 'Fluent', 'Native'],
    multi: false,
  },
  'Languages': {
    label: 'Languages',
    options: languages,
    multi: true,
  },
  'Agency preference': {
    label: 'Agency preference',
    options: ['Yes', 'No', 'No preference'],
    multi: false,
  },
  'History on Upwork': {
    label: 'History on Upwork',
    options: ['New', '1-5 jobs', '5+ jobs'],
    multi: false,
  },
};

export default function JobPostFreelancer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobId } = useParams();
  // Values from previous page (can be used for summary or further steps)
  const previousState = location.state || {};

  // Form state
  const [category, setCategory] = useState('');
  const [categoryTouched, setCategoryTouched] = useState(false);
  const [mandatorySkills, setMandatorySkills] = useState([]);
  const [niceSkills, setNiceSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [niceSkillInput, setNiceSkillInput] = useState('');
  const [tools, setTools] = useState([]);
  const [toolInput, setToolInput] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [otherPrefs, setOtherPrefs] = useState([]);
  const [otherPrefMenu, setOtherPrefMenu] = useState(false);
  const [specialty, setSpecialty] = useState('');
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const languageList = languages;
  const [openPref, setOpenPref] = useState([]); // array of open prefs
  const [preferenceValues, setPreferenceValues] = useState({ // chips by pref
    'Screening Questions': [],
    'Location': [],
    'English level': [],
    'Languages': [],
    'Agency preference': [],
    'History on Upwork': []
  });

  // Handlers for skills and tools
  const addSkill = () => {
    if (skillInput.trim() && !mandatorySkills.includes(skillInput.trim())) {
      setMandatorySkills([...mandatorySkills, skillInput.trim()]);
      setSkillInput('');
    }
  };
  const removeSkill = (skill) => {
    setMandatorySkills(mandatorySkills.filter(s => s !== skill));
  };
  const addNiceSkill = () => {
    if (niceSkillInput.trim() && !niceSkills.includes(niceSkillInput.trim())) {
      setNiceSkills([...niceSkills, niceSkillInput.trim()]);
      setNiceSkillInput('');
    }
  };
  const removeNiceSkill = (skill) => {
    setNiceSkills(niceSkills.filter(s => s !== skill));
  };
  const addTool = () => {
    if (toolInput.trim() && !tools.includes(toolInput.trim())) {
      setTools([...tools, toolInput.trim()]);
      setToolInput('');
    }
  };
  const removeTool = (tool) => {
    setTools(tools.filter(t => t !== tool));
  };

  // Experience level selection
  const levels = [
    {
      label: 'Entry',
      desc: 'Slightly experienced',
      value: 'Entry',
    },
    {
      label: 'Intermediate',
      desc: 'Moderately experienced',
      value: 'Intermediate',
    },
    {
      label: 'Expert',
      desc: 'Extremely experienced',
      value: 'Expert',
    },
  ];
  // Prefs
  const toggleOtherPref = (p) => {
    setOpenPref(prev =>
      prev.includes(p)
        ? prev.filter(x => x !== p)
        : [...prev, p]
    );
  };

  // Helper to add/remove selections
  const handleAddPrefVal = (type, val) => {
    setPreferenceValues(prev => {
      if (prefsConfig[type].multi) {
        return { ...prev, [type]: prev[type].includes(val) ? prev[type] : [...prev[type], val] };
      } else {
        return { ...prev, [type]: [val] };
      }
    });
  };
  const handleRemovePrefVal = (type, val) => {
    setPreferenceValues(prev => ({
      ...prev,
      [type]: prev[type].filter(x => x !== val)
    }));
  };

  // Navigation
  function handleBack() {
    navigate('/nx/job-post/draft', { state: previousState });
  }
  function handleNext() {
    // proceed to budget step with state
    navigate(`/nx/job-post/chat/${jobId}/budget`, {
      state: { ...previousState, category, mandatorySkills, niceSkills, tools, experienceLevel, otherPrefs },
    });
  }

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
          {/* Left Sidebar -- Uma Assistant */}
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
              {/* Uma intro, skill suggestions, reply input (optional, can be stubbed as before) */}
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 mb-2">
                    Hi! I'm <span className="font-semibold">Uma</span>, Freelancer's Mindful AI. I can help you write a job post that gets noticed.
                  </p>
                  <p className="text-sm text-gray-700">
                    What do you need done?
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
                  <span className="bg-green-600 text-white text-sm font-medium px-3 py-1 rounded-full">(2) Freelancer</span>
                  <div className="w-12 h-0.5 bg-gray-300"></div>
                </div>
                <span className="bg-gray-200 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">(3) Budget</span>
              </div>
              {/* Job Category and Specialty fields */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:gap-8 w-full">
                  {/* Category */}
                  <div className="flex-1">
                    <label className="block text-lg font-semibold text-gray-900 mb-3">Job category</label>
                    <CustomSelect
                      options={categories}
                      value={category}
                      onChange={(val) => {
                        setCategory(val);
                        setCategoryTouched(true);
                        setSpecialty('');
                      }}
                      placeholder="Select category"
                    />
                  </div>
                  {/* Specialty (show only if category picked) */}
                  {category && (
                    <div className="flex-1 mt-6 md:mt-0">
                      <label className="block text-lg font-semibold text-gray-900 mb-3">Specialty</label>
                      <CustomSelect
                        options={specialties[category]?.map(s => ({ label: s, value: s })) || []}
                        value={specialty}
                        onChange={(val) => setSpecialty(val)}
                        placeholder="Select specialty"
                      />
                    </div>
                  )}
                </div>
                {/* Tooltip if nothing selected */}
                {!category && categoryTouched && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 shadow-lg rounded-xl px-6 py-4 text-sm text-gray-700 z-10 whitespace-nowrap">
                    Job category and specialty must be selected first
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></span>
                  </div>
                )}
              </div>
              {/* Mandatory Skills */}
              <div className="mb-5">
                <label className="block text-base font-medium text-gray-900 mb-2">Mandatory skills</label>
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  {mandatorySkills.map(skill => (
                    <span key={skill} className="flex items-center bg-gray-200 rounded-full px-4 py-1 text-gray-800 text-sm font-medium">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="ml-2 text-gray-500 hover:text-red-600"><X size={14} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
                    type="text"
                    disabled={!category}
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { addSkill(); e.preventDefault(); } }}
                    placeholder={!category ? 'Select job category first' : 'Add skill...'}
                  />
                  <button type="button" onClick={addSkill} disabled={!category || !skillInput.trim()} className="px-3 py-2 rounded-lg bg-green-50 text-green-600 disabled:opacity-50"><Plus size={16} /></button>
                </div>
              </div>
              {/* Nice-to-have Skills */}
              <div className="mb-5">
                <label className="block text-base font-medium text-gray-900 mb-2">Nice-to-have skills</label>
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  {niceSkills.map(skill => (
                    <span key={skill} className="flex items-center bg-gray-100 rounded-full px-4 py-1 text-gray-600 text-sm">
                      {skill}
                      <button onClick={() => removeNiceSkill(skill)} className="ml-2 text-gray-400 hover:text-red-600"><X size={14} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
                    type="text"
                    disabled={!category}
                    value={niceSkillInput}
                    onChange={e => setNiceSkillInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { addNiceSkill(); e.preventDefault(); } }}
                    placeholder={!category ? 'Select job category first' : 'Add skill...'}
                  />
                  <button type="button" onClick={addNiceSkill} disabled={!category || !niceSkillInput.trim()} className="px-3 py-2 rounded-lg bg-green-50 text-green-600 disabled:opacity-50"><Plus size={16} /></button>
                </div>
              </div>
              {/* Tools */}
              <div className="mb-8">
                <label className="block text-base font-medium text-gray-900 mb-2">Tools <span className="text-gray-400">(optional)</span></label>
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  {tools.map(tool => (
                    <span key={tool} className="flex items-center bg-green-100 rounded-full px-4 py-1 text-green-700 text-sm font-medium border border-green-200">
                      {tool}
                      <button onClick={() => removeTool(tool)} className="ml-2 text-green-400 hover:text-red-600"><X size={14} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
                    type="text"
                    value={toolInput}
                    onChange={e => setToolInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { addTool(); e.preventDefault(); } }}
                    placeholder={'Add tools'}
                  />
                  <button type="button" onClick={addTool} disabled={!toolInput.trim()} className="px-3 py-2 rounded-lg bg-green-50 text-green-600 disabled:opacity-50"><Plus size={16} /></button>
                </div>
              </div>
              {/* Experience level (cards) */}
              <div className="mb-10">
                <label className="block text-lg font-semibold text-gray-900 mb-5">Experience level</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {levels.map((lvl) => (
                    <button
                      key={lvl.value}
                      type="button"
                      onClick={() => setExperienceLevel(lvl.value)}
                      className={`flex flex-col items-start w-full border rounded-xl p-5 focus:outline-none transition-all duration-150 h-full shadow-sm
                        ${experienceLevel === lvl.value ? 'border-green-600 bg-green-50 ring-2 ring-green-200' : 'border-gray-300 bg-white hover:ring-1 hover:ring-green-200'}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-gray-900">{lvl.label}</span>
                        {experienceLevel === lvl.value && <span className="w-4 h-4 rounded-full border-2 border-green-600 flex items-center justify-center"><span className="w-2 h-2 bg-green-600 rounded-full block" /></span>}
                      </div>
                      <span className="text-gray-700 text-base">{lvl.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Other preferences */}
              <div className="mb-10">
                <label className="block text-lg font-semibold text-gray-900 mb-5">Other preferences <span className="text-gray-400">(optional)</span></label>
                <div className="flex flex-wrap gap-4 mb-2">
                  {allOtherPrefs.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleOtherPref(type)}
                      className={`px-5 py-3 border rounded-lg flex items-center gap-2 text-green-600 transition-colors
                        ${openPref.includes(type) || preferenceValues[type].length ? 'border-green-300 bg-green-50 font-semibold' : 'border-gray-300 bg-white hover:bg-green-50'}`}
                    >
                      {type} <Plus size={20} />
                    </button>
                  ))}
                </div>
                {allOtherPrefs.map(type => (
                  openPref.includes(type) && (
                    <div key={type} className="mt-6 flex flex-col w-full max-w-sm">
                      <label className="block text-xl font-semibold text-gray-900 mb-2">{prefsConfig[type].label}</label>
                      <div className="relative">
                        <CustomSelect
                          options={prefsConfig[type].options
                            .filter(opt => prefsConfig[type].multi ? !preferenceValues[type].includes(opt) : true)
                            .map(opt => ({ label: opt, value: opt }))
                          }
                          value={prefsConfig[type].multi ? '' : (preferenceValues[type][0] || '')}
                          onChange={(val) => handleAddPrefVal(type, val)}
                          placeholder={prefsConfig[type].multi ? `Add ${type.toLowerCase()}` : `Select ${type.toLowerCase()}`}
                        />
                      </div>
                      {preferenceValues[type].length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {preferenceValues[type].map(l => (
                            <span key={l} className="flex items-center bg-green-100 rounded-full px-4 py-2 text-green-700 text-base border border-green-200">
                              {l}
                              <button onClick={() => handleRemovePrefVal(type, l)} className="ml-2 text-green-400 hover:text-red-600"><X size={16} /></button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>

              {/* Inline Languages pop-up */}
              {showLanguages && (
                <div className="mt-6 flex flex-col w-full max-w-sm">
                  <label className="block text-xl font-semibold text-gray-900 mb-2">Languages</label>
                  <div className="relative">
                    <select
                      value=""
                      onChange={e => {
                        const l = e.target.value;
                        if (l && !selectedLanguages.includes(l)) {
                          setSelectedLanguages(prev => [...prev, l]);
                        }
                      }}
                      className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg bg-white appearance-none text-gray-900 pr-12"
                    >
                      <option value="" disabled>Add languages</option>
                      {languageList.filter(l => !selectedLanguages.includes(l)).map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={28} />
                  </div>
                  {selectedLanguages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {selectedLanguages.map(l => (
                        <span key={l} className="flex items-center bg-green-100 rounded-full px-4 py-2 text-green-700 text-base border border-green-200">
                          {l}
                          <button onClick={() => setSelectedLanguages(prev => prev.filter(x => x !== l))} className="ml-2 text-green-400 hover:text-red-600"><X size={16} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {/* Navigation */}
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
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
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
