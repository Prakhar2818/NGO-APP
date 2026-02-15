import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HeartHandshake, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const quickLinks = [
    { name: 'Home', path: '/', hash: null },
    { name: 'Features', path: '/#features', hash: 'features' },
    { name: 'How It Works', path: '/#how-it-works', hash: 'how-it-works' },
    { name: 'Impact', path: '/#impact', hash: 'impact' },
    { name: 'Login', path: '/login', hash: null },
    { name: 'Register', path: '/register', hash: null }
  ];

  const socialLinks = [
    { name: 'Twitter', url: '#' },
    { name: 'LinkedIn', url: '#' },
    { name: 'Facebook', url: '#' }
  ];

  const handleNavClick = (e: React.MouseEvent, hash: string | null) => {
    if (hash) {
      e.preventDefault();
      if (location.pathname !== '/') {
        navigate('/#' + hash);
      } else {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <HeartHandshake className="text-white" size={28} />
              </div>
              <span className="text-2xl font-bold">NGO Connect</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md text-lg">
              Connecting restaurants with NGOs to reduce food waste and serve communities in need.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                    onClick={(e) => handleNavClick(e, link.hash)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-gray-400" />
                <span className="text-gray-300">ngo.food2818@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-gray-400" />
                <span className="text-gray-300">+91 9685463355</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-gray-400" />
                <span className="text-gray-300">Indore, MP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p className="text-lg">&copy; {new Date().getFullYear()} NGO Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;