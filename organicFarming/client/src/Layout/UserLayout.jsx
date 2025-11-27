import { Outlet } from 'react-router-dom';

import FAQChatbot from '../components/FAQChatbot';
import Navbar from '../components/Navbar';

export default function UserLayout({ user, handleUserLogout }) {
  return (
    <>
      <Navbar user={user} handleUserLogout={handleUserLogout} />
      <main style={{ padding: 20 }}>
        <Outlet />
         <FAQChatbot user={user} /> {/* <-- Always rendered if logged in */}
      </main>
    </>
  );
}
