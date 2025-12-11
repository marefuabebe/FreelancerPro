import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';

export default function JobPostChat() {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const minLength = 50;
  const maxLength = 1500;
  const currentLength = description.length;
  const isTooShort = currentLength < minLength;
  const isTooLong = currentLength > maxLength;

  const handleSkip = () => {
    // Navigate to draft job post page
    navigate('/nx/job-post/draft', { state: { description } });
  };

  const handleGo = () => {
    if (isTooShort || isTooLong) {
      return;
    }
    // Navigate to draft job post page with the description
    navigate('/nx/job-post/draft', { state: { description } });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Heading */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          What do you need done?
        </h1>

        {/* Instructional Text */}
        <p className="text-gray-600 text-lg mb-8">
          Describe your job, and we'll help you draft a post that gets the right proposals.
        </p>

        {/* Job Description Input Area */}
        <div className="relative mb-6">
          <textarea
            value={description}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue.length <= maxLength) {
                setDescription(newValue);
              }
            }}
            placeholder="Describe what you need..."
            className={`w-full min-h-[300px] p-6 border-2 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-gray-900 bg-white ${isTooShort ? 'border-yellow-400' : isTooLong ? 'border-red-400' : 'border-gray-300'
              }`}
          />

          {/* Character Counter */}
          <div className="absolute bottom-4 right-4 text-sm text-gray-500">
            {currentLength} / {maxLength}
          </div>

          {/* Validation Message */}
          {isTooShort && (
            <div className="mt-2 text-yellow-600 text-sm font-medium">
              That looks a little short
            </div>
          )}
          {isTooLong && (
            <div className="mt-2 text-red-600 text-sm font-medium">
              Description is too long. Please reduce by {currentLength - maxLength} characters.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={handleSkip}
            className="px-6 py-3 text-gray-700 font-medium hover:text-gray-900 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleGo}
            disabled={isTooShort || isTooLong}
            className={`px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors ${isTooShort || isTooLong
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-black text-green-500 hover:bg-gray-800'
              }`}
          >
            <span>Go</span>
            <Settings size={18} className="text-green-500" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            Powered by Uma, Freelancer's Mindful AI
          </p>
        </div>
      </footer>
    </div>
  );
}

