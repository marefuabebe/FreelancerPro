import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function JobPostSuccess() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to billing page after 3 seconds
    const timer = setTimeout(() => {
      navigate(`/nx/job-post/onboarding/billing/${jobId}`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [jobId, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-4">
        {/* Illustration */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Green board */}
            <svg width="200" height="240" viewBox="0 0 200 240" className="text-green-800">
              {/* Board */}
              <rect x="20" y="40" width="160" height="180" rx="8" fill="currentColor" />
              {/* Paper pinned to board */}
              <rect x="40" y="60" width="120" height="140" rx="4" fill="white" />
              {/* Job Post text on paper */}
              <text x="100" y="85" textAnchor="middle" fill="#10b981" fontSize="14" fontWeight="bold" fontFamily="Arial, sans-serif">
                JOB POST
              </text>
              {/* Three lines on paper */}
              <line x1="50" y1="100" x2="150" y2="100" stroke="#10b981" strokeWidth="2" />
              <line x1="50" y1="120" x2="150" y2="120" stroke="#10b981" strokeWidth="2" />
              <line x1="50" y1="140" x2="150" y2="140" stroke="#10b981" strokeWidth="2" />
              {/* Pink thumbtack */}
              <circle cx="50" cy="70" r="8" fill="#ec4899" />
              <circle cx="50" cy="70" r="4" fill="#fce7f3" />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Congratulations! Your job post is now live.
        </h1>
      </div>
    </div>
  );
}

