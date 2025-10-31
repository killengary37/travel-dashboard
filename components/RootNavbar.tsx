import React from 'react'
import {Link, useLoaderData, useLocation, useNavigate, useParams} from "react-router";
import {logoutUser} from "~/appwrite/auth";
import {cn} from "~/lib/utils";

// Root-level navigation bar component
const RootNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const params = useParams();
    const user = useLoaderData();

    // Logout handler: logs user out and redirects to sign-in page
    const handleLogout = async () => {
        await logoutUser();
        navigate('/sign-in')
    }

    return (
        // Dynamic background class: solid white on trip detail pages, glassmorphism elsewhere
        <nav className={cn(location.pathname === `/travel/${params.tripId}` ? 'bg-white' : 'glassmorphism', 'w-full fixed z-50')}>
            <header className="root-nav wrapper">
                {/* App logo and name, navigates to homepage */}
                <Link to='/' className="link-logo">
                    <img src="/assets/icons/logo2.svg" alt="logo" className="size-[30px]" />
                    <h1>AI-Ventures</h1>
                </Link>

                <aside>
                    {/* Conditionally render admin panel link if user is an admin */}
                    {user.status === 'admin' && (
                        <Link to="/dashboard" className={cn('text-base font-normal text-white', {"text-dark-100": location.pathname.startsWith('/travel')})}>
                            Admin Panel
                        </Link>
                    )}
                    {/* User avatar */}
                    <img src={user?.imageUrl || '/assets/images/david.webp'} alt="user" referrerPolicy="no-referrer" />
                    {/* Logout button */}
                    <button onClick={handleLogout} className="cursor-pointer">
                        <img
                            src="/assets/icons/logout.svg"
                            alt="logout"
                            className="size-6 rotate-180"
                        />
                    </button>
                </aside>
            </header>
        </nav>
    )
}
export default RootNavbar