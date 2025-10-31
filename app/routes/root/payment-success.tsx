import React, {useEffect} from 'react'
import {Link, type LoaderFunctionArgs} from "react-router";
import type { Route } from "./+types/payment-success";
import {ButtonComponent} from "@syncfusion/ej2-react-buttons";
import confetti from "canvas-confetti";
import {LEFT_CONFETTI, RIGHT_CONFETTI} from "~/constants";

// Loader function to fetch route parameters
export async function loader ({ params }: LoaderFunctionArgs) {
    return params;
}

// PaymentSuccess component - displays a success message after a trip is booked
const PaymentSuccess = ({ loaderData }: Route.ComponentProps) => {
    useEffect(() => {
        // Trigger confetti animation from both sides when the component mounts
        confetti(LEFT_CONFETTI)
        confetti(RIGHT_CONFETTI)
    }, [])

    return (
        <main className="payment-success wrapper">
            <section>
                <article>
                    {/* Success icon */}
                    <img src="/assets/icons/check.svg" className="size-24" />
                    <h1>Thank & Welcome Aboard!</h1>

                    {/* Confirmation message */}
                    <p>Your trip is booked - can't wait to have you on this adventure. Get ready to explore & make memories! ✨</p>
                    {/* Link to view trip details using trip ID from route parameters  */}
                    <Link to={`/travel/${loaderData?.tripId}`} className="w-full">
                        <ButtonComponent className="button-class !h-11 !w-full">
                            <img
                                src="/assets/icons/itinerary-button.svg"
                                className="size-5"
                            />

                            <span className="p-16-semibold text-white">View trip details</span>
                        </ButtonComponent>
                        {/* Link to return to homepage */}
                    </Link>
                    <Link to={'/'} className="w-full">
                        <ButtonComponent className="button-class-secondary !h-11 !w-full">
                            <img
                                src="/assets/icons/arrow-left.svg"
                                className="size-5"
                            />

                            <span className="p-16-semibold">Return to homepage</span>
                        </ButtonComponent>
                    </Link>
                </article>
            </section>
        </main>
    )
}
export default PaymentSuccess