import {Link, type LoaderFunctionArgs} from "react-router";
import {getAllTrips, getTripById} from "~/appwrite/trips";
import type { Route } from './+types/travel-detail'
import {cn, getFirstWord, parseTripData} from "~/lib/utils";
import {Header, InfoPill, TripCard} from "../../../components";
import {ButtonComponent, ChipDirective, ChipListComponent, ChipsDirective} from "@syncfusion/ej2-react-buttons";

// Loader to fetch a specific trip by ID and a list of popular trips
export const loader = async ({params}: LoaderFunctionArgs) => {
    const { tripId } = params;
    if(!tripId) throw new Error ('Trip ID is required');

    // Fetch the current trip and some additional trips in parallel
    const[trip, trips] = await Promise.all ([
        getTripById(tripId),
        getAllTrips(4, 0)
    ])


    // Return structured trip data for use in the component
    return {
        trip,
        allTrips: trips.allTrips.map(({$id, tripDetails, imageUrls }) => ({
            id: $id,
            ...parseTripData(tripDetails),
            imageUrls: imageUrls ?? []
        }))
    }


}

// TravelDetail component displays the full details of a selected trip
const TravelDetail = ({ loaderData}: Route.ComponentProps) => {
    const imageUrls = loaderData?.trip?.imageUrls || [];
    const tripData = parseTripData(loaderData?.trip?.tripDetails);
    const paymentLink = loaderData?.trip?.payment_link;

    const {
        name, duration, itinerary, travelStyle, groupType, budget, interests, estimatedPrice, description, bestTimeToVisit, weatherInfo, country
    } = tripData || {};
    const allTrips = loaderData.allTrips as Trip[] | [];

    // UI pills to represent trip characteristics
    const pillItems = [
        {text: travelStyle, bg: '!bg-pink-50 !text-pink-500'},
        {text: groupType, bg: '!bg-primary-50 !text-primary-500'},
        {text: budget, bg: '!bg-success-50 !text-success-700'},
        {text: interests, bg: '!bg-navy-50 !text-navy-500'},
    ]

    // Best time and weather details for the trip
    const visitTimeAndWeatherInfo = [
        {title: 'Best Time to Visit:', items: bestTimeToVisit},
        {title: 'Weather:', items: weatherInfo},
    ]

    return (
        <main className="travel-detail pt-40 wrapper">
            <div className="travel-div">
                {/* Back to navigation */}
                <Link to="/" className="back-link">
                    <img src="/assets/icons/arrow-left.svg" alt="back icon"/>
                    <span>Go back</span>
                </Link>

            <section className="container wrapper-md">
                {/* Trip title and basic info */}
                <header>
                    <h1 className="p-40-semibold text-dark-100">{name}</h1>
                    <div className="flex items-center gap-5">
                        <InfoPill
                            text={`${duration} day plan`}
                            image="/assets/icons/calendar.svg"
                        />
                        <InfoPill
                            text={itinerary?.slice(0,4).map((item) => item.location).join(',') || ''}
                            image="/assets/icons/location-mark.svg"
                        />
                    </div>
                </header>

                {/* Trip photo gallery */}
                <section className="gallery">
                    {imageUrls.map((url: string, i: number)=> (
                        <img
                            src={url}
                            key={i}
                            className={cn('w-full rounded-xl object-cover', i===0 ? 'md:col-span-2 md:row-span-2 h-[330px]' : 'md:row-span-1 h-[150px]')}
                        />
                    ))}
                </section>
                {/* Tags and rating */}
                <section className="flex gap-3 md:gap-5 items-center flex-wrap">
                    <ChipListComponent id="travel-chip">
                        <ChipsDirective>
                            {pillItems.map((pill, i) => (
                                <ChipDirective
                                    key={i}
                                    text={getFirstWord(pill.text)}
                                    cssClass={`${pill.bg} !text-base !font-medium !px-4`}
                                />
                            ))}
                        </ChipsDirective>
                    </ChipListComponent>
                    {/* Static str rating and review score */}
                    <ul className="flex gap-1 items-center">
                        {Array(5).fill('null').map((_, index) => (
                            <li>
                                <img
                                    src="/assets/icons/star.svg"
                                    alt="star"
                                    className="size-[18px]"
                                />
                            </li>
                        ))}

                        <li className="ml-1">
                            <ChipListComponent>
                                <ChipsDirective>
                                    <ChipDirective
                                        text="4.9/5"
                                        cssClass="!bg-yellow-50 !text-red-700"
                                    />
                                </ChipsDirective>
                            </ChipListComponent>
                        </li>
                    </ul>
                </section>
                {/* Summary and price */}
                <section className="title">
                    <article>
                        <h3>
                            {duration}-Day {country} {travelStyle} Trip
                        </h3>
                        <p>{budget}, {groupType} and {interests}</p>
                    </article>

                    <h2>{estimatedPrice}</h2>
                </section>

                <p className="text-sm md:text-lg font-normal text-dark-400">{description}</p>
                {/* Day-by-day itinerary */}
                <ul className="itinerary">
                    {itinerary?.map((dayPlan: DayPlan, index: number) => (
                        <li key={index}>
                            <h3>
                                Day {dayPlan.day}: {dayPlan.location}
                            </h3>

                            <ul>
                                {dayPlan.activities.map((activity, index: number)=> (
                                    <li key={index}>
                                        <span className="flex-shrink-0 p-18-semibold">{activity.time}</span>
                                        <p className="flex-grow">{activity.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
                {/* Best time to visit and weather information */}
                {visitTimeAndWeatherInfo.map((section) => (
                    <section key={section.title} className="visit">
                        <div>
                            <h3>{section.title}</h3>

                            <ul>
                                {section.items?.map((item) => (
                                    <li key={item}>
                                        <p className="flex-grow">
                                            {item}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                ))}
                {/* Payment button */}
                <a href={paymentLink} className="flex">
                    <ButtonComponent className="button-class" type="submit">
                        <span className="p-16-semibold text-white">
                            Pay to join the trip
                        </span>
                        <span className="price-pill">{estimatedPrice}</span>
                    </ButtonComponent>
                </a>
            </section>
            </div>

            {/* Popular trips section */}
            <section className="flex flex-col gap-6">
                <h2 className="p-24-semibold">Popular Trips</h2>

                <div className="trip-grid">
                    {allTrips.map(({id, name, imageUrls, itinerary, interests, travelStyle, estimatedPrice}) => (
                        <TripCard
                            id={id}
                            key={id}
                            name={name}
                            location={itinerary?.[0].location ?? ''}
                            imageUrl={imageUrls[0]}
                            tags={[interests, travelStyle]}
                            price={estimatedPrice}
                        />
                    ))}
                </div>
            </section>
        </main>
    )
}
export default TravelDetail
