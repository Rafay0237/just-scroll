
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, Mail, Phone, MapPin } from 'lucide-react';


const Card = ({ user }) => (
  <div className="bg-[#19191B] rounded-lg shadow-md p-4 m-2 flex items-center space-x-4 hover:shadow-lg transition-shadow duration-300">
    <img 
      src={user.picture.large} 
      alt={`${user.name.first} ${user.name.last}`} 
      className="size-20 rounded-lg sm:rounded-full object-cover border-2 border-purple-800"
    />
    <div className="flex-grow">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <div>
          
      <h2 className="text-xl font-semibold text-white">{`${user.name.first} ${user.name.last}`}</h2>
      <p className="text-sm text-gray-300">{user.dob.age} years old</p>
        </div>
        <span className="flex items-center text-sm text-gray-100"><MapPin size={14} className="mr-1" /> {`${user.location.city}, ${user.location.country}`}</span>
      </div>
      <div className="mt-2 flex flex-col sm:flex-row justify-start sm:items-center gap-4 text-sm text-gray-200">
        <p className="flex items-center "><Mail size={14} className="mr-1" /> {user.email}</p>
        <p className="flex items-center "><Phone size={14} className="mr-1" /> {user.phone}</p>
      </div>
    </div>
  </div>
);

const App = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="container mx-auto sm:px-4 py-8 bg-black min-h-screen">
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
    </div>
  );
};

export default App;

