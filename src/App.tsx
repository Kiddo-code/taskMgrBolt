import { useState, useEffect } from 'react';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleNavigation = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleNavigation);

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const url = new URL(link.href);
        window.history.pushState({}, '', url.pathname);
        setCurrentPath(url.pathname);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  if (currentPath === '/login') {
    return <Login />;
  }

  if (currentPath === '/signup') {
    return <Signup />;
  }

  return <Home />;
}

export default App;
