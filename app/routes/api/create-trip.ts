import type {ActionFunctionArgs} from "react-router";
import {GoogleGenerativeAI} from "@google/generative-ai";

export const action = async ({ request }: ActionFunctionArgs) => {
    const {
        country,
        numberOfDays,
        travelStyle,
        interests,
        budget,
        groupType,
        userId,
    } = await request.json();

    const getAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const unsplashApiKey= process.env.UNSPLASH_ACCESS_KEY!;
}