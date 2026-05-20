import { Link, useLocation } from 'react-router-dom';
import { Home, Store, Scan, Bell, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function BottomNav() {
  const location = useLocation();
  const { t } = useLanguage();
  
  const navItems = [
    { path: '/', label: t('home'), icon: Home },
    { path: '/sell', label: t('sell'), icon: Store },
    { path: '/scanner', label: t('scan'), icon: Scan },
    { path: '/alerts', label: t('alerts'), icon: Bell },
    { path: '/profile', label: t('profile'), icon: User },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
        
        return (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={24} className="nav-icon" strokeWidth={isActive ? 2.5 : 2} />
            <span className="nav-text">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
