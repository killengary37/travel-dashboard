import { ID, OAuthProvider, Query } from "appwrite";
import { account, database, appwriteConfig } from "~/appwrite/client";
import { redirect } from "react-router";

/**
 * Fetches an existing user document from the database by Appwrite account ID.
 * @param id - The Appwrite user ID.
 * @returns The user document if found, otherwise null.
 */
export const getExistingUser = async (id: string) => {
    try {
        const { documents, total } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", id)]
        );
        return total > 0 ? documents[0] : null;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

/**
 * Creates and stores user data in the database after successful authentication.
 * Also attempts to fetch Google profile picture if available.
 */
export const storeUserData = async () => {
    try {
        // Fetch authenticated user data from Appwrite
        const user = await account.get();
        if (!user) throw new Error("User not found");

        // Retrieve the current session to access OAuth token
        const { providerAccessToken } = (await account.getSession("current")) || {};

        // Attempt to get Google profile picture if access token is present
        const profilePicture = providerAccessToken
            ? await getGooglePicture(providerAccessToken)
            : null;

        // Create a new user document in the database
        const createdUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: user.$id,
                email: user.email,
                name: user.name,
                imageUrl: profilePicture,
                joinedAt: new Date().toISOString(),
            }
        );

        // Redirect to sign-in if document creation fails
        if (!createdUser.$id) redirect("/sign-in");
    } catch (error) {
        console.error("Error storing user data:", error);
    }
};

/**
 * Fetches the user's Google profile picture using the People API.
 * @param accessToken - OAuth access token for Google API.
 * @returns URL of the profile picture or null if unavailable.
 */
const getGooglePicture = async (accessToken: string) => {
    try {
        const response = await fetch(
            "https://people.googleapis.com/v1/people/me?personFields=photos",
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (!response.ok) throw new Error("Failed to fetch Google profile picture");

        const { photos } = await response.json();
        return photos?.[0]?.url || null;
    } catch (error) {
        console.error("Error fetching Google picture:", error);
        return null;
    }
};

/**
 * Initiates Google OAuth2 login flow using Appwrite.
 */
export const loginWithGoogle = async () => {
    try {
        account.createOAuth2Session(
            OAuthProvider.Google,
            `${window.location.origin}/`,   // Success redirect URL
            `${window.location.origin}/404` // Failure redirect URL
        );
    } catch (error) {
        console.error("Error during OAuth2 session creation:", error);
    }
};

/**
 * Logs out the current user by deleting their session.
 */
export const logoutUser = async () => {
    try {
        await account.deleteSession("current");
    } catch (error) {
        console.error("Error during logout:", error);
    }
};

/**
 * Retrieves the currently authenticated user's details from the database.
 * @returns User document if found, otherwise redirects to sign-in.
 */
export const getUser = async () => {
    try {
        const user = await account.get();
        if (!user) return redirect("/sign-in");

        const { documents } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.equal("accountId", user.$id),
                Query.select(["name", "email", "imageUrl", "joinedAt", "accountId"]),
            ]
        );

        return documents.length > 0 ? documents[0] : redirect("/sign-in");
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

/**
 * Retrieves a paginated list of users from the database.
 * @param limit - Number of users to fetch.
 * @param offset - Number of users to skip (used for pagination).
 * @returns An object containing the list of users and the total count.
 */
export const getAllUsers = async (limit: number, offset: number) => {
    try {
        const { documents: users, total } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.limit(limit), Query.offset(offset)]
        );

        if (total === 0) return { users: [], total };

        return { users, total };
    } catch (e) {
        console.log("Error fetching users");
        return { users: [], total: 0 };
    }
};
