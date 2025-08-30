import {getExistingUser, logoutUser, storeUserData} from "~/appwrite/auth";
import {Outlet, redirect, useNavigate} from "react-router";
import {account} from "~/appwrite/client";
import RootNavbar from "../../../components/RootNavbar";

/**
 * Loader function that runs on the client side before rendering the route
 * It checks is a user is authenticated and either
 * - Retrieves their existing data from the database
 * - Stores new user data if they are signing in for the first time
 *
 *  if no user is found or an error occurs, it redirects to the sign-in page
 */
export async function clientLoader() {
    try {
        const user = await account.get();

        if(!user.$id) return redirect('/')

        const existingUser = await getExistingUser(user.$id);
        return existingUser?.$id ? existingUser : await storeUserData();
    } catch (e) {
        console.log('Error fetching user',e);
        return redirect('sign-in')
    }
}

/**
 * layout component that wraps protected routes
 * Renders the navigation bar and nested child routes using <Outlet/>
 */
const PageLayout = () => {
    const navigate = useNavigate();

    // Logs out the user and redirects to the sign-in page
    const handleLogout = async () => {
        await logoutUser();
        navigate('/sign-in')
    }
    return (
        <div className="bg-light-200">
            <RootNavbar/>
            <Outlet/>
        </div>
    )
}
export default PageLayout
