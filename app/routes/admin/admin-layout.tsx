
import {Outlet, redirect} from "react-router";
import {SidebarComponent} from "@syncfusion/ej2-react-navigations";
import {MobileSidebar, NavItems} from "../../../components";
import {account} from "~/appwrite/client";
import {getExistingUser, storeUserData} from "~/appwrite/auth";

/**
 * Loader function.. Verifying the authenticated user and redirects based on their status
 */
export async function clientLoader() {
    try {
        const user = await account.get();

        // if no valid user ID is found, redirect to sign-in page
        if(!user.$id) return redirect('/sign-in');

        //check if the user exists in the database
        const existingUser = await getExistingUser(user.$id)
        if(existingUser?.status === 'user') {
            return redirect('/')
        }

        return existingUser?.$id ? existingUser : await storeUserData();
    } catch (e) {
        console.log('Error in ClientLoader',e)
        return redirect('sign-in')
    }
}

/**
 * Admin Layout
 * Provides a sidebar navigation and a content area for nested routes
 */
const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <MobileSidebar />
            <aside className="w-full max-w-[270px] hidden lg:block">
                <SidebarComponent width={270} enableGestures={false}>
                    <NavItems/>
                </SidebarComponent>
            </aside>
            <aside className="children">
                <Outlet/>
            </aside>
        </div>
    )
}
export default AdminLayout
