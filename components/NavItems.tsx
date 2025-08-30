import {Link, NavLink, useLoaderData, useNavigate} from "react-router";
import {sidebarItems} from "~/constants";
import {cn} from "~/lib/utils";
import {logoutUser} from "~/appwrite/auth";

// Navigation sidebar component
const NavItems = ({handleClick}: { handleClick?: () => void}) => {
   const user = useLoaderData();
   const navigate= useNavigate();

    // Handle logout: call auth logout function and redirect to sign-in page
   const handleLogout = async () => {
       await logoutUser();
       navigate('/sign-in')
   }

    return (
        <section className="nav-items">
            {/* Logo and app title, links to homepage */}
            <Link to='/' className="link-logo">
                <img src="/assets/icons/logo2.svg" alt="logo" className="size-[30px]"/>
                <h1>AI-Ventures</h1>
            </Link>

            <div className="container">
                <nav>
                    {/* Render each sidebar link from config */}
                    {sidebarItems.map(({id, href, icon, label}) => (
                        <NavLink to={href} key={id}>
                            {({ isActive}: {isActive: boolean}) => (
                                <div className={cn('group nav-item', {
                                    'bg-primary-100 !text-white': isActive
                                })} onClick={handleClick}>
                                    <img
                                        src={icon}
                                        alt={label}
                                        className={`group-hover:brightness-0 size-0 group-hover:invert ${isActive ? 'brightness-0 invert' : 'text-dark-200'}`}
                                    />
                                    {label}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Sidebar footer: displays user profile and logout */}
                <footer className="nav-footer">
                    <img src={user?.imageUrl || '/assets/images/david.webp'} alt={user?.name || 'David'} referrerPolicy="no-referrer" />

                    <article>
                        <h2>{user?.name}</h2>
                        <p>{user?.email}</p>
                    </article>

                    {/* Logout button */}
                    <button
                       onClick={handleLogout}
                       className="cursor-pointer"

                    >
                        <img
                            src="/assets/icons/logout.svg"
                            alt="Logout"
                            className="size-6"
                        />

                    </button>
                </footer>
            </div>
        </section>
    )
}
export default NavItems
