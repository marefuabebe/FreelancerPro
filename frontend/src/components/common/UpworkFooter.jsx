import { Link } from 'react-router-dom'
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react'

export default function UpworkFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">FreelancerPro</h3>
            <p className="text-sm">
              Connecting businesses with talented freelancers worldwide. Build your dream team or find your next project.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-green-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-green-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-green-500 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-green-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-green-500 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* For Clients */}
          <div>
            <h4 className="text-white font-semibold mb-4">For Clients</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/search-talent" className="hover:text-green-500 transition-colors">
                  Find Freelancers
                </Link>
              </li>
              <li>
                <Link to="/nx/job-post/chat" className="hover:text-green-500 transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  How to Hire
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Client Success Stories
                </a>
              </li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div>
            <h4 className="text-white font-semibold mb-4">For Freelancers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-green-500 transition-colors">
                  Find Work
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  How to Get Started
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Resources
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} FreelancerPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
