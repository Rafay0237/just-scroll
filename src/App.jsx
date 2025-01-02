import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, Mail, Phone, MapPin, ArrowUp, RefreshCw } from 'lucide-react';

const Card = ({ user }) => (
  <div className="bg-[#19191B] rounded-lg shadow-md p-4 m-2 flex items-center space-x-4 hover:shadow-lg transition-shadow duration-300">
    <img
      src={user.picture.large}
      alt={`${user.name.first} ${user.name.last}`}
      className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 hidden sm:block"
    />
    <div className="flex-grow">
      <div className="flex flex-col sm:flex-row justify-between gap-2">

        <div className='flex items-center gap-2 mb-2 sm:mb-0'>
          <img
            src={user.picture.large}
            alt={`${user.name.first} ${user.name.last}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 block sm:hidden"
          />
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-white">{`${user.name.first} ${user.name.last}`}</h2>
            <p className="text-sm text-gray-300">{user.dob.age} years old</p>
          </div>
        </div>
        <span className="flex items-center text-sm text-gray-100">
          <MapPin size={14} className="mr-1" /> {`${user.location.city}, ${user.location.country}`}
        </span>

      </div>
      <div className="mt-2 flex flex-col sm:flex-row justify-start sm:items-center gap-2 sm:gap-4 text-sm text-gray-200">
        <p className="flex items-center">
          <Mail size={14} className="mr-1" /> {user.email}
        </p>
        <p className="flex items-center">
          <Phone size={14} className="mr-1" /> {user.phone}
        </p>
      </div>
    </div>
  </div>
);

const App = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const bottomRef = useRef(null);
  const observerRef = useRef(null);

  const fetchUsers = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(`https://randomuser.me/api/?results=20&page=${page}`);
      const data = await response.json();
      setUsers(prevUsers => [...prevUsers, ...data.results]);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchUsers(); // Directly call fetchUsers when observed
        }
      },
      { threshold: 1.0 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowButtons(window.scrollY > 200); // Show buttons after 200px of scrolling
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setUsers([]);
    setPage(1);
    fetchUsers(); // Refetch initial users
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-200">Virtual Scroll Display</h1>
      <h1 className="text-lg font-semibold text-center mb-8 text-neutral-400">Some Random Users</h1>
      <div className="space-y-4">
        {users.map((user, index) => (
          <Card key={index} user={user} />
        ))}
      </div>
      {loading && (
        <div className="flex justify-center items-center my-8">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      )}
      <div ref={bottomRef} id="bottom" className="h-4" />

      {showButtons && (
        <>
          <button
            onClick={handleBackToTop}
            className="p-2.5 px-4 bg-neutral-700 text-white text-xs inline-flex gap-2 rounded-full shadow-lg hover:bg-neutral-900 transition-all items-center justify-center fixed top-4 right-1/2 translate-x-1/2"
          >
            Back To Top
            <ArrowUp size={12} />
          </button>
          <button
            onClick={handleReset}
            className="fixed bottom-4 right-2  p-3 bg-neutral-700 text-white rounded-full shadow-lg hover:bg-red-600 transition-all flex items-center justify-center"
          >
            <RefreshCw size={12} />
          </button>
        </>
      )}
    </div>
  );
};

export default App;
