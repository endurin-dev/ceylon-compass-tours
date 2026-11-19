import {
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
  PrismaClient,
  TourStatus,
  UserRole,
} from "@prisma/client";

const prisma = new PrismaClient();
const disabledPasswordHash = "!";

const destinations = [
  {
    id: "seed-destination-colombo",
    name: "Colombo",
    slug: "colombo",
    description:
      "Sri Lanka's lively commercial capital, where colonial landmarks, seaside promenades, temples, and modern city life meet.",
    imageUrl: null,
    latitude: 6.9271,
    longitude: 79.8612,
  },
  {
    id: "seed-destination-kandy",
    name: "Kandy",
    slug: "kandy",
    description:
      "A scenic hill-country city and home of the Temple of the Sacred Tooth Relic, surrounded by forested mountains.",
    imageUrl: null,
    latitude: 7.2906,
    longitude: 80.6337,
  },
  {
    id: "seed-destination-sigiriya",
    name: "Sigiriya",
    slug: "sigiriya",
    description:
      "Explore the ancient rock fortress, frescoes, and water gardens at the heart of Sri Lanka's Cultural Triangle.",
    imageUrl: null,
    latitude: 7.957,
    longitude: 80.7603,
  },
  {
    id: "seed-destination-ella",
    name: "Ella",
    slug: "ella",
    description:
      "A relaxed mountain town known for tea country, cloud-wrapped viewpoints, waterfalls, and the scenic railway.",
    imageUrl: null,
    latitude: 6.8667,
    longitude: 81.0466,
  },
  {
    id: "seed-destination-galle",
    name: "Galle",
    slug: "galle",
    description:
      "A southern coastal city with a UNESCO-listed Dutch Fort, historic streets, and nearby beaches.",
    imageUrl: null,
    latitude: 6.0535,
    longitude: 80.221,
  },
  {
    id: "seed-destination-bentota",
    name: "Bentota",
    slug: "bentota",
    description:
      "A laid-back west coast escape with golden beaches, calm lagoon waters, and easy access to river and sea excursions.",
    imageUrl: null,
    latitude: 6.4214,
    longitude: 79.9989,
  },
  {
    id: "seed-destination-yala",
    name: "Yala National Park",
    slug: "yala",
    description:
      "A celebrated wildlife reserve of dry forest, lagoons, and open plains, home to elephants and an abundance of birdlife.",
    imageUrl: null,
    latitude: 6.3725,
    longitude: 81.5185,
  },
  {
    id: "seed-destination-anuradhapura",
    name: "Anuradhapura",
    slug: "anuradhapura",
    description:
      "Discover Sri Lanka's ancient first kingdom, with monumental stupas, sacred Bodhi tree sites, and extensive archaeological ruins.",
    imageUrl: null,
    latitude: 8.3114,
    longitude: 80.4037,
  },
  {
    id: "seed-destination-polonnaruwa",
    name: "Polonnaruwa",
    slug: "polonnaruwa",
    description:
      "Explore a UNESCO-listed medieval capital known for its stone temples, royal ruins, and impressive Gal Vihara Buddha statues.",
    imageUrl: null,
    latitude: 7.9403,
    longitude: 81.0188,
  },
  {
    id: "seed-destination-dambulla",
    name: "Dambulla",
    slug: "dambulla",
    description:
      "Visit the UNESCO-listed cave temple complex, where historic Buddhist shrines and vivid murals overlook the surrounding plains.",
    imageUrl: null,
    latitude: 7.8567,
    longitude: 80.6492,
  },
  {
    id: "seed-destination-nuwara-eliya",
    name: "Nuwara Eliya",
    slug: "nuwara-eliya",
    description:
      "Breathe in the cool highland air among rolling tea estates, colonial-era streets, gardens, and mountain scenery.",
    imageUrl: null,
    latitude: 6.9497,
    longitude: 80.7891,
  },
  {
    id: "seed-destination-trincomalee",
    name: "Trincomalee",
    slug: "trincomalee",
    description:
      "Enjoy the island's east coast with its natural harbour, historic Koneswaram Temple, and nearby beaches and reefs.",
    imageUrl: null,
    latitude: 8.5874,
    longitude: 81.2152,
  },
  {
    id: "seed-destination-mirissa",
    name: "Mirissa",
    slug: "mirissa",
    description:
      "Relax on a laid-back south coast beach, known for its palm-lined bay, surf breaks, and seasonal whale-watching trips.",
    imageUrl: null,
    latitude: 5.9483,
    longitude: 80.4716,
  },
  {
    id: "seed-destination-jaffna",
    name: "Jaffna",
    slug: "jaffna",
    description:
      "Experience Sri Lanka's northern peninsula, rich in Tamil culture, distinctive cuisine, historic forts, and island landscapes.",
    imageUrl: null,
    latitude: 9.6615,
    longitude: 80.0255,
  },
  {
    id: "seed-destination-arugam-bay",
    name: "Arugam Bay",
    slug: "arugam-bay",
    description:
      "A relaxed east coast surf town with celebrated point breaks, lagoon wildlife, and easy access to nearby nature reserves.",
    imageUrl: null,
    latitude: 6.8406,
    longitude: 81.8368,
  },
  {
    id: "seed-destination-sinharaja-rainforest",
    name: "Sinharaja Rainforest",
    slug: "sinharaja-rainforest",
    description:
      "A biodiverse tropical rainforest reserve known for guided jungle walks, birdlife, and forest streams.",
    imageUrl: null,
    latitude: null,
    longitude: null,
  },
  {
    id: "seed-destination-peradeniya",
    name: "Peradeniya",
    slug: "peradeniya",
    description:
      "A Kandy-area destination best known for the Royal Botanical Gardens and its tropical plant collections.",
    imageUrl: null,
    latitude: null,
    longitude: null,
  },
  {
    id: "seed-destination-ambuluwawa",
    name: "Ambuluwawa",
    slug: "ambuluwawa",
    description:
      "A hilltop landmark near Gampola, known for its distinctive tower and panoramic views.",
    imageUrl: null,
    latitude: null,
    longitude: null,
  },
  {
    id: "seed-destination-southern-coast",
    name: "Southern Coast",
    slug: "southern-coast",
    description:
      "Sri Lanka's southern shoreline, with historic coastal towns, beaches, wildlife, and ocean excursions.",
    imageUrl: null,
    latitude: null,
    longitude: null,
  },
] as const;

const tours = [
  {
    id: "seed-tour-cultural-triangle",
    slug: "sri-lanka-cultural-triangle",
    title: "Sri Lanka Cultural Triangle",
    shortDescription:
      "Discover ancient capitals, sacred Kandy, and the legendary rock fortress of Sigiriya.",
    description:
      "A week-long journey through Sri Lanka's celebrated Cultural Triangle. Walk among the ruins of Polonnaruwa, climb Sigiriya Rock, meet local artisans, and experience the sacred city of Kandy with a knowledgeable local guide.",
    durationDays: 7,
    durationNights: 6,
    featured: true,
    basePrice: 1190,
    destinations: ["colombo", "sigiriya", "kandy"],
    itinerary: [
      {
        title: "Arrival in Colombo",
        description:
          "Meet your guide at Bandaranaike International Airport and transfer to your hotel. Depending on arrival time, enjoy a relaxed introduction to Colombo.",
        overnightAt: "Colombo",
        activities: ["Airport welcome and private transfer", "Colombo orientation walk"],
      },
      {
        title: "Colombo to Sigiriya",
        description:
          "Travel inland through changing landscapes to the Cultural Triangle, stopping for a village-style Sri Lankan lunch.",
        overnightAt: "Sigiriya",
        activities: ["Scenic drive to Sigiriya", "Traditional village lunch"],
      },
      {
        title: "Sigiriya Rock Fortress",
        description:
          "Explore the water gardens and climb Sigiriya Rock Fortress for sweeping views across the plains.",
        overnightAt: "Sigiriya",
        activities: ["Guided visit to Sigiriya", "Sunset from Pidurangala viewpoint"],
      },
      {
        title: "Polonnaruwa Heritage",
        description:
          "Discover the medieval capital of Polonnaruwa by bicycle or tuk-tuk, including its remarkable Buddha statues.",
        overnightAt: "Sigiriya",
        activities: ["Polonnaruwa archaeological site", "Local craft and produce stop"],
      },
      {
        title: "Dambulla to Kandy",
        description:
          "Visit Dambulla's cave temples before continuing through spice-growing country to Kandy.",
        overnightAt: "Kandy",
        activities: ["Dambulla cave temple visit", "Matale spice garden visit"],
      },
      {
        title: "Kandy Cultural Day",
        description:
          "Visit the Temple of the Sacred Tooth Relic, stroll beside Kandy Lake, and enjoy an evening cultural performance.",
        overnightAt: "Kandy",
        activities: ["Temple of the Sacred Tooth Relic", "Kandyan dance performance"],
      },
      {
        title: "Departure",
        description:
          "Enjoy breakfast before your private transfer to Colombo or the airport.",
        overnightAt: "Kandy",
        activities: ["Breakfast and checkout", "Private departure transfer"],
      },
    ],
  },
  {
    id: "seed-tour-hill-country",
    slug: "hill-country-train-and-tea",
    title: "Hill Country Train & Tea",
    shortDescription:
      "Ride the famous mountain railway through tea country, waterfalls, and Ella's scenic trails.",
    description:
      "Slow down in Sri Lanka's central highlands. Visit a working tea estate, take in the views from Ella's trails, and travel on one of the world's most scenic train routes, with comfortable stays and a private local driver.",
    durationDays: 5,
    durationNights: 4,
    featured: true,
    basePrice: 890,
    destinations: ["kandy", "ella"],
    itinerary: [
      {
        title: "Arrive in Kandy",
        description:
          "Settle into Kandy and take a gentle walk around the lake and the city's lively market streets.",
        overnightAt: "Kandy",
        activities: ["Kandy Lake walk", "Central Market visit"],
      },
      {
        title: "Tea Country by Train",
        description:
          "Board the scenic train into the highlands, passing waterfalls and emerald tea fields on the way to Ella.",
        overnightAt: "Ella",
        activities: ["Scenic train journey", "Ella town evening stroll"],
      },
      {
        title: "Ella Views and Tea",
        description:
          "Choose a morning hike to Little Adam's Peak, then learn how Ceylon tea is grown and made at a nearby estate.",
        overnightAt: "Ella",
        activities: ["Little Adam's Peak walk", "Tea estate and factory visit"],
      },
      {
        title: "Waterfalls and Nine Arch Bridge",
        description:
          "Visit the iconic Nine Arch Bridge and Ravana Falls, with time to enjoy Ella at your own pace.",
        overnightAt: "Ella",
        activities: ["Nine Arch Bridge viewpoint", "Ravana Falls stop"],
      },
      {
        title: "Highland Farewell",
        description:
          "After breakfast, depart by private vehicle toward the south coast or Colombo.",
        overnightAt: "Ella",
        activities: ["Breakfast and checkout", "Private onward transfer"],
      },
    ],
  },
  {
    id: "seed-tour-south-coast-safari",
    slug: "southern-coast-and-yala-safari",
    title: "Southern Coast & Yala Safari",
    shortDescription:
      "Pair Galle Fort's coastal history with a guided wildlife safari and time beside the Indian Ocean.",
    description:
      "Explore the southern coastline at an easy pace. Wander the ramparts of Galle Fort, visit a turtle conservation project, and head into Yala National Park with an experienced naturalist for a wildlife safari.",
    durationDays: 4,
    durationNights: 3,
    featured: false,
    basePrice: 740,
    destinations: ["bentota", "galle", "yala"],
    itinerary: [
      {
        title: "Bentota Coast and Galle Fort",
        description:
          "Start with time on Bentota's palm-lined coast, then continue south to explore the lanes, ramparts, and lighthouse of historic Galle Fort.",
        overnightAt: "Galle",
        activities: ["Bentota beach and lagoon", "Galle Fort walking tour"],
      },
      {
        title: "Coast to Yala",
        description:
          "Follow the coast east, stopping at a responsible turtle conservation centre before continuing to Yala.",
        overnightAt: "Yala",
        activities: ["Coastal scenery drive", "Turtle conservation visit"],
      },
      {
        title: "Yala Wildlife Safari",
        description:
          "Set out with a local naturalist to explore Yala's varied habitats and look for elephants, crocodiles, and native birds.",
        overnightAt: "Yala",
        activities: ["Morning Yala jeep safari", "Afternoon at leisure"],
      },
      {
        title: "Southern Coast Departure",
        description:
          "Enjoy a final breakfast before your transfer to the south coast or Colombo.",
        overnightAt: "Yala",
        activities: ["Breakfast and checkout", "Private departure transfer"],
      },
    ],
  },
  {
    id: "seed-tour-island-highlights",
    slug: "sri-lanka-island-highlights",
    title: "Sri Lanka Island Highlights",
    shortDescription:
      "A balanced first visit from Colombo and Sigiriya to Kandy, Ella, and the southern coast.",
    description:
      "See Sri Lanka's signature sights on a privately guided island journey. Explore the Cultural Triangle, ride the hill-country railway, walk among tea fields, and finish with ocean views on the south coast.",
    durationDays: 9,
    durationNights: 8,
    featured: true,
    basePrice: 1640,
    destinations: ["colombo", "sigiriya", "kandy", "ella", "galle"],
    itinerary: [
      {
        title: "Welcome to Colombo",
        description:
          "Arrive in Sri Lanka and meet your private driver for a transfer to your Colombo hotel. Take time to rest or enjoy a short neighborhood walk.",
        overnightAt: "Colombo",
        activities: ["Airport meet and greet", "Colombo seaside promenade"],
      },
      {
        title: "Colombo to Sigiriya",
        description:
          "Travel inland through Sri Lanka's changing landscapes, with a relaxed stop for lunch along the way.",
        overnightAt: "Sigiriya",
        activities: ["Private drive to the Cultural Triangle", "Sri Lankan rice and curry lunch"],
      },
      {
        title: "Sigiriya and Dambulla",
        description:
          "Visit Sigiriya's ancient water gardens and rock fortress, then explore Dambulla's painted cave temples.",
        overnightAt: "Sigiriya",
        activities: ["Sigiriya Rock Fortress", "Dambulla cave temple"],
      },
      {
        title: "Village Life and Polonnaruwa",
        description:
          "Experience a rural village lunch and discover the historic city of Polonnaruwa with your local guide.",
        overnightAt: "Sigiriya",
        activities: ["Village walk and home-cooked lunch", "Polonnaruwa heritage site"],
      },
      {
        title: "Spice Country and Kandy",
        description:
          "Drive south through spice-growing country to Kandy, pausing to learn about local spices and garden traditions.",
        overnightAt: "Kandy",
        activities: ["Matale spice garden", "Kandy Lake and old town"],
      },
      {
        title: "Kandy to the Highlands",
        description:
          "Visit the Temple of the Sacred Tooth Relic before boarding the scenic train through tea country toward Ella.",
        overnightAt: "Ella",
        activities: ["Temple of the Sacred Tooth Relic", "Hill-country train journey"],
      },
      {
        title: "Ella's Mountain Scenery",
        description:
          "Enjoy an easy walk to a highland viewpoint and visit a tea estate to learn about Ceylon tea.",
        overnightAt: "Ella",
        activities: ["Little Adam's Peak walk", "Tea estate visit"],
      },
      {
        title: "Ella to Galle",
        description:
          "Travel down from the highlands toward the coast, stopping at a waterfall before an evening in Galle Fort.",
        overnightAt: "Galle",
        activities: ["Ravana Falls viewpoint", "Galle Fort sunset walk"],
      },
      {
        title: "Departure",
        description:
          "Enjoy a final breakfast before your private transfer to Colombo or the airport.",
        overnightAt: "Galle",
        activities: ["Breakfast and checkout", "Private departure transfer"],
      },
    ],
  },
  {
    id: "seed-tour-wildlife-safari",
    slug: "sri-lanka-wildlife-safari",
    title: "Wild Sri Lanka Safari",
    shortDescription:
      "Combine elephant country, guided national-park drives, and a relaxed southern-coast finish.",
    description:
      "A wildlife-focused journey led by local naturalists. Explore the landscapes around Sigiriya, travel south to Yala for guided game drives, and unwind on the coast with time to enjoy Galle.",
    durationDays: 6,
    durationNights: 5,
    featured: true,
    basePrice: 1320,
    destinations: ["sigiriya", "yala", "galle", "bentota"],
    itinerary: [
      {
        title: "Arrive in Sigiriya",
        description:
          "Meet your driver at the airport and transfer to the Cultural Triangle, with a stop for refreshments on the way.",
        overnightAt: "Sigiriya",
        activities: ["Airport transfer", "Countryside orientation"],
      },
      {
        title: "Rock Fortress and Nature",
        description:
          "Explore Sigiriya Rock in the cooler morning hours, then enjoy a quiet afternoon around the village or hotel.",
        overnightAt: "Sigiriya",
        activities: ["Sigiriya Rock Fortress", "Village nature walk"],
      },
      {
        title: "Travel to Yala",
        description:
          "Head south through changing dry-zone landscapes to your lodge near Yala National Park.",
        overnightAt: "Yala",
        activities: ["Scenic transfer to Yala", "Naturalist briefing"],
      },
      {
        title: "Yala Safari",
        description:
          "Set out at dawn with a licensed local naturalist to explore park habitats and look for native wildlife.",
        overnightAt: "Yala",
        activities: ["Morning Yala jeep safari", "Afternoon at leisure"],
      },
      {
        title: "Yala to Galle",
        description:
          "Travel to Galle and spend the afternoon discovering its historic fort, lighthouse, and ocean-facing ramparts.",
        overnightAt: "Galle",
        activities: ["Coastal drive", "Galle Fort guided walk"],
      },
      {
        title: "Coastal Farewell",
        description:
          "Enjoy breakfast before continuing to the airport or a beach stay on the west coast.",
        overnightAt: "Galle",
        activities: ["Breakfast and checkout", "Private onward transfer"],
      },
    ],
  },
  {
    id: "seed-tour-south-coast-escape",
    slug: "south-coast-beach-escape",
    title: "South Coast Beach Escape",
    shortDescription:
      "Unwind on Sri Lanka's palm-lined coast with Galle Fort, Bentota lagoon, and relaxed beach time.",
    description:
      "A gentle coastal break combining a guided introduction to Galle Fort with unhurried time by the Indian Ocean. Enjoy a Bentota lagoon outing and choose from optional local experiences at your own pace.",
    durationDays: 5,
    durationNights: 4,
    featured: false,
    basePrice: 920,
    destinations: ["galle", "bentota"],
    itinerary: [
      {
        title: "Arrive on the South Coast",
        description:
          "Transfer from Colombo to the coast and settle into your beachside accommodation.",
        overnightAt: "Galle",
        activities: ["Private coastal transfer", "Beach sunset"],
      },
      {
        title: "Galle Fort",
        description:
          "Explore the UNESCO-listed fort with a local guide, then enjoy free time in its cafes and galleries.",
        overnightAt: "Galle",
        activities: ["Galle Fort heritage walk", "Lighthouse and ramparts"],
      },
      {
        title: "Coast to Bentota",
        description:
          "Travel north along the coast to Bentota, stopping at a local craft workshop or seaside viewpoint.",
        overnightAt: "Bentota",
        activities: ["Coastal drive", "Local craft stop"],
      },
      {
        title: "Bentota Lagoon and Beach",
        description:
          "Enjoy a gentle lagoon boat ride and an open afternoon for swimming, relaxing, or optional water activities.",
        overnightAt: "Bentota",
        activities: ["Bentota lagoon boat ride", "Free time on the beach"],
      },
      {
        title: "Departure",
        description:
          "Have a relaxed breakfast before your private transfer to Colombo or the airport.",
        overnightAt: "Bentota",
        activities: ["Breakfast and checkout", "Private departure transfer"],
      },
    ],
  },
  {
    id: "seed-tour-family-adventure",
    slug: "sri-lanka-family-adventure",
    title: "Sri Lanka Family Adventure",
    shortDescription:
      "A family-friendly mix of ancient landmarks, scenic train travel, and easy highland walks.",
    description:
      "Designed for curious families, this private trip balances cultural highlights with memorable hands-on experiences. Discover the Cultural Triangle, take the famous hill-country train, and enjoy gentle outdoor adventures around Ella.",
    durationDays: 8,
    durationNights: 7,
    featured: false,
    basePrice: 1480,
    destinations: ["colombo", "sigiriya", "kandy", "ella"],
    itinerary: [
      {
        title: "Arrival in Colombo",
        description:
          "Meet your family driver at the airport and settle in. Keep the first evening easy after your flight.",
        overnightAt: "Colombo",
        activities: ["Airport welcome", "Short seaside walk"],
      },
      {
        title: "Colombo to Sigiriya",
        description:
          "Drive north through the countryside, taking breaks as needed and stopping for a relaxed local lunch.",
        overnightAt: "Sigiriya",
        activities: ["Private family transfer", "Sri Lankan lunch experience"],
      },
      {
        title: "Sigiriya and Village Experience",
        description:
          "Explore Sigiriya's gardens and fortress, then enjoy a hands-on village visit with local food and crafts.",
        overnightAt: "Sigiriya",
        activities: ["Sigiriya Rock Fortress", "Village cooking and craft experience"],
      },
      {
        title: "Dambulla to Kandy",
        description:
          "Visit the Dambulla cave temples and continue to Kandy with a stop at a spice garden.",
        overnightAt: "Kandy",
        activities: ["Dambulla cave temple", "Spice garden visit"],
      },
      {
        title: "Discover Kandy",
        description:
          "Enjoy a relaxed day in Kandy with a cultural visit and time beside the lake.",
        overnightAt: "Kandy",
        activities: ["Temple of the Sacred Tooth Relic", "Kandy Lake and market"],
      },
      {
        title: "Train to Ella",
        description:
          "Take the scenic highland train through tea estates and mountain scenery to Ella.",
        overnightAt: "Ella",
        activities: ["Scenic train ride", "Ella town stroll"],
      },
      {
        title: "Easy Ella Adventures",
        description:
          "Choose an easy family walk to a viewpoint and visit the Nine Arch Bridge with your guide.",
        overnightAt: "Ella",
        activities: ["Little Adam's Peak family walk", "Nine Arch Bridge viewpoint"],
      },
      {
        title: "Departure",
        description:
          "After breakfast, travel by private vehicle to Colombo, the airport, or your next hotel.",
        overnightAt: "Ella",
        activities: ["Breakfast and checkout", "Private onward transfer"],
      },
    ],
  },
] as const;

const catalogAttractions = [
  "Galle Face Green Promenade",
  "Gangaramaya Buddhist Temple",
  "Hindu Temple",
  "Independence Square",
  "Old Parliament Building",
  "Pettah Market",
  "Royal Botanical Gardens, Peradeniya",
  "Ambuluwawa Tower",
  "Temple of Four Religions",
  "Nine Arch Bridge",
  "Little Adam's Peak",
  "Ravana Falls",
  "Tea Factory & Plantation",
  "Dambulla Cave Temple",
  "Dambulla Golden Buddha",
  "Sigiriya Rock Fortress",
  "Nuwara Eliya – Little England",
  "Temple of the Sacred Tooth Relic",
  "Gem Museum",
  "Historic Galle Fort",
  "Moonstone Mine",
  "Turtle Farm Beach",
  "Ayurveda Garden",
  "Spice Garden",
] as const;

const attractionDescriptions = {
  "Galle Face Green Promenade": "A waterfront promenade in central Colombo, popular for ocean views, open lawns, and evening strolls.",
  "Gangaramaya Buddhist Temple": "A distinctive Buddhist temple complex blending worship spaces, colourful art, and a collection of cultural artefacts.",
  "Hindu Temple": "An ornate Hindu place of worship in Colombo, known for colourful shrines and detailed decorative work.",
  "Independence Square": "A national monument and landscaped plaza commemorating Sri Lanka's independence, set within a quiet Colombo park.",
  "Old Parliament Building": "A colonial-era landmark overlooking Colombo Harbour, distinguished by its neoclassical architecture.",
  "Pettah Market": "A lively Colombo market district filled with narrow streets, local produce, textiles, spices, and everyday goods.",
  "Royal Botanical Gardens, Peradeniya": "A spacious botanical garden near Kandy, celebrated for its orchid collection, palm avenues, and tropical trees.",
  "Ambuluwawa Tower": "A striking hilltop tower near Gampola offering panoramic views across surrounding valleys and mountains.",
  "Temple of Four Religions": "A multi-faith landmark on Ambuluwawa hill featuring Buddhist, Hindu, Islamic, and Christian symbols.",
  "Nine Arch Bridge": "A landmark railway viaduct near Ella, framed by forested hills and tea country.",
  "Little Adam's Peak": "An approachable Ella hike leading to wide views over the highlands and surrounding valleys.",
  "Ravana Falls": "A tiered waterfall near Ella that cascades beside the road through Sri Lanka's central highlands.",
  "Tea Factory & Plantation": "Explore rolling tea fields and learn how Ceylon tea is grown, picked, and processed.",
  "Dambulla Cave Temple": "A historic cave sanctuary adorned with Buddhist statues and murals spanning centuries of Sri Lankan history.",
  "Dambulla Golden Buddha": "A monumental golden Buddha statue at the entrance to the Dambulla temple complex.",
  "Sigiriya Rock Fortress": "An ancient rock citadel rising above the plains, known for its water gardens, frescoes, and summit ruins.",
  "Nuwara Eliya – Little England": "A cool-climate hill town with colonial architecture, gardens, and tea estates in its surrounding countryside.",
  "Temple of the Sacred Tooth Relic": "Kandy's revered Buddhist temple houses the sacred tooth relic and remains a major pilgrimage site.",
  "Gem Museum": "Discover Sri Lanka's gemstone heritage through displays of locally mined stones and traditional gem cutting.",
  "Historic Galle Fort": "A coastal heritage fort of ramparts, colonial buildings, boutiques, and ocean-facing streets.",
  "Moonstone Mine": "See how Sri Lanka's distinctive moonstones are mined and prepared in a traditional coastal village.",
  "Turtle Farm Beach": "A southern-coast stop to learn about turtle conservation and observe rescued turtles.",
  "Ayurveda Garden": "A guided introduction to Sri Lankan Ayurvedic herbs, traditional remedies, and indigenous plant uses.",
  "Spice Garden": "Walk among fragrant spice plants and learn how Sri Lanka's spices are cultivated and used.",
} satisfies Record<(typeof catalogAttractions)[number], string>;

const catalogActivities = [
  "Elephant riding",
  "Elephant photography and feeding",
  "Jungle trekking",
  "Waterfall bathing",
  "Mountain train rides",
  "Yala Jeep Safari",
  "River safari",
  "Ocean fishing",
  "Surfing",
  "Whale watching",
  "Dolphin watching",
  "Snorkeling",
  "Diving",
  "Rafting",
  "Yacht cruise",
  "Helicopter flight",
  "Barbecue camp night",
] as const;

const catalogSlug = (name: string) =>
  name.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const completeTourPackages = [
  {
    slug: "colombo-city-tour",
    title: "Colombo City Tour",
    durationLabel: "Full day",
    durationDays: 1,
    durationNights: 0,
    shortDescription: "A full-day introduction to Colombo's landmarks, temples, seaside and markets.",
    description:
      "Explore Colombo with a Russian-speaking guide, from Galle Face Green and the city's temples to Independence Square and the Old Parliament Building. Pettah Market is an optional stop, with time for shopping at a mall.",
    destinations: ["colombo"],
    attractions: [
      "Galle Face Green Promenade",
      "Gangaramaya Buddhist Temple",
      "Hindu Temple",
      "Independence Square",
      "Old Parliament Building",
      "Pettah Market",
    ],
    activities: [],
    inclusions: ["Transfer", "Entrance tickets", "Russian-speaking guide"],
  },
  {
    slug: "sinharaja-rainforest",
    title: "Sinharaja Rainforest",
    durationLabel: "Private tour",
    durationDays: 1,
    durationNights: 0,
    shortDescription: "A private rainforest escape with guided trekking, waterfalls and a camp barbecue.",
    description:
      "Spend time in the Sinharaja Rainforest on a private tour. Enjoy jungle trekking, a waterfall stop and a barbecue camp night.",
    destinations: ["sinharaja-rainforest"],
    attractions: [],
    activities: ["Jungle trekking", "Waterfall bathing", "Barbecue camp night"],
    inclusions: ["Transfer", "Entrance tickets", "Russian-speaking guide"],
  },
  {
    slug: "ocean-fishing",
    title: "Ocean Fishing",
    durationLabel: "4–5 hours",
    durationDays: 1,
    durationNights: 0,
    shortDescription: "A half-day deep-sea fishing trip in the Indian Ocean.",
    description:
      "Head offshore for deep-sea fishing. Possible catches include tuna, marlin, barracuda, shark, swordfish and other fish.",
    destinations: ["southern-coast"],
    attractions: [],
    activities: ["Ocean fishing"],
    inclusions: ["Transfer", "Fishing equipment"],
  },
  {
    slug: "surfing",
    title: "Surfing",
    durationLabel: "2 hours",
    durationDays: 1,
    durationNights: 0,
    shortDescription: "A beginner-friendly surf session with instruction and time in the water.",
    description:
      "Join an instructor-led lesson that covers safety before beach practice and ocean training.",
    destinations: ["southern-coast"],
    attractions: [],
    activities: ["Surfing"],
    inclusions: ["Transfer", "Surfboard", "Instructor"],
  },
  {
    slug: "pearl-of-sri-lanka",
    title: "Pearl of Sri Lanka",
    durationLabel: "2 days",
    durationDays: 2,
    durationNights: 1,
    shortDescription: "A two-day journey through Peradeniya, Ambuluwawa and Ella's hill-country highlights.",
    description:
      "Visit an Ayurveda centre and spice garden, the Royal Botanical Gardens, Ambuluwawa Tower and the Temple of Four Religions. Continue to tea country and Ella for Ravana Falls, Nine Arch Bridge, a scenic mountain train ride and Little Adam's Peak.",
    destinations: ["peradeniya", "ambuluwawa", "kandy", "nuwara-eliya", "ella"],
    attractions: [
      "Royal Botanical Gardens, Peradeniya",
      "Ambuluwawa Tower",
      "Temple of Four Religions",
      "Tea Factory & Plantation",
      "Ravana Falls",
      "Nine Arch Bridge",
      "Little Adam's Peak",
      "Ayurveda Garden",
      "Spice Garden",
    ],
    activities: ["Elephant riding", "Mountain train rides"],
    inclusions: [
      "Transfer",
      "Entrance tickets",
      "Russian-speaking guide",
      "3-star hotel",
      "Dinner",
      "Breakfast",
    ],
  },
  {
    slug: "wonder-of-sri-lanka",
    title: "Wonder of Sri Lanka",
    durationLabel: "2 days",
    durationDays: 2,
    durationNights: 1,
    shortDescription: "A two-day tour combining Ella, Nuwara Eliya and Sri Lanka's Cultural Triangle.",
    description:
      "See Ravana Falls, Ambuluwawa Tower and Ella's Nine Arch Bridge, with a scenic train ride, Little Adam's Peak, an Ayurveda centre and spice garden. Continue to the Dambulla Golden Buddha, Nuwara Eliya's Little England and Sigiriya Rock Fortress, with an elephant photography and feeding experience.",
    destinations: ["ella", "ambuluwawa", "nuwara-eliya", "dambulla", "sigiriya"],
    attractions: [
      "Ravana Falls",
      "Ambuluwawa Tower",
      "Temple of Four Religions",
      "Nine Arch Bridge",
      "Ayurveda Garden",
      "Spice Garden",
      "Little Adam's Peak",
      "Dambulla Golden Buddha",
      "Nuwara Eliya – Little England",
      "Tea Factory & Plantation",
      "Sigiriya Rock Fortress",
    ],
    activities: ["Mountain train rides", "Elephant photography and feeding"],
    inclusions: [
      "Transfer",
      "Entrance tickets",
      "Russian-speaking guide",
      "3-star hotel",
      "Dinner",
      "Breakfast",
    ],
  },
  {
    slug: "misty-mountains",
    title: "Misty Mountains",
    durationLabel: "1 day",
    durationDays: 1,
    durationNights: 0,
    shortDescription: "A day among Ella's bridges, waterfalls, tea fields and mountain views.",
    description:
      "Visit Nine Arch Bridge, Ravana Falls and a tea plantation. Enjoy a mountain train ride, Little Adam's Peak and an Ayurveda garden.",
    destinations: ["ella", "nuwara-eliya"],
    attractions: [
      "Nine Arch Bridge",
      "Ravana Falls",
      "Tea Factory & Plantation",
      "Little Adam's Peak",
      "Ayurveda Garden",
    ],
    activities: ["Mountain train rides"],
    inclusions: ["Transfer", "Entrance tickets", "Russian-speaking guide"],
  },
  {
    slug: "misty-mountains-with-yala-safari",
    title: "Misty Mountains with Yala Safari",
    durationLabel: "1 day",
    durationDays: 1,
    durationNights: 0,
    shortDescription: "An Ella and tea-country day with a Yala National Park jeep safari.",
    description:
      "Combine Nine Arch Bridge, a tea plantation, a scenic mountain train ride and Ravana Falls with a Yala National Park jeep safari. Wildlife may include elephants, leopards, deer, buffaloes, crocodiles, monkeys, peacocks, flamingos and mongooses.",
    destinations: ["ella", "nuwara-eliya", "yala"],
    attractions: ["Nine Arch Bridge", "Tea Factory & Plantation", "Ravana Falls"],
    activities: ["Mountain train rides", "Yala Jeep Safari"],
    inclusions: ["Transfer", "Entrance tickets", "Russian-speaking guide"],
  },
  {
    slug: "cultural-experience",
    title: "Cultural Experience",
    durationLabel: "1 day",
    durationDays: 1,
    durationNights: 0,
    shortDescription: "Discover Dambulla and Sigiriya with local cultural experiences.",
    description:
      "Visit Dambulla Cave Temple and the Golden Buddha, then explore Sigiriya Rock Fortress. The day also includes an elephant photography and feeding experience and an Ayurveda garden.",
    destinations: ["dambulla", "sigiriya"],
    attractions: [
      "Dambulla Cave Temple",
      "Dambulla Golden Buddha",
      "Sigiriya Rock Fortress",
      "Ayurveda Garden",
    ],
    activities: ["Elephant photography and feeding"],
    inclusions: ["Transfer", "Entrance tickets", "Russian-speaking guide"],
  },
  {
    slug: "yala-safari",
    title: "Yala Safari",
    durationLabel: "1 day",
    durationDays: 1,
    durationNights: 0,
    shortDescription: "A full-day open jeep safari in Yala National Park.",
    description:
      "Explore Yala National Park by open jeep in search of elephants, leopards, deer, buffaloes, crocodiles, monkeys, peacocks, flamingos and mongooses.",
    destinations: ["yala"],
    attractions: [],
    activities: ["Yala Jeep Safari"],
    inclusions: ["Transfer", "Entrance tickets", "Russian-speaking guide"],
  },
  {
    slug: "the-last-kingdom",
    title: "The Last Kingdom",
    durationLabel: "1 day",
    durationDays: 1,
    durationNights: 0,
    shortDescription: "A day of Kandy-area heritage, gardens, gems and tea-country culture.",
    description:
      "Experience an elephant ride, visit the Temple of the Sacred Tooth Relic and Royal Botanical Gardens in Peradeniya, and explore a gem museum, Ayurveda garden and tea factory and plantation.",
    destinations: ["kandy", "peradeniya", "nuwara-eliya"],
    attractions: [
      "Temple of the Sacred Tooth Relic",
      "Royal Botanical Gardens, Peradeniya",
      "Gem Museum",
      "Ayurveda Garden",
      "Tea Factory & Plantation",
    ],
    activities: ["Elephant riding"],
    inclusions: ["Transfer", "Entrance tickets", "Russian-speaking guide"],
  },
  {
    slug: "charm-of-the-southern-coast",
    title: "Charm of the Southern Coast",
    durationLabel: "1 day",
    durationDays: 1,
    durationNights: 0,
    shortDescription: "Explore Galle Fort and the cultural and coastal experiences of the south.",
    description:
      "Discover Historic Galle Fort, take a river safari, visit a moonstone mine and Ayurveda garden, and stop at Turtle Farm Beach.",
    destinations: ["galle", "southern-coast"],
    attractions: [
      "Historic Galle Fort",
      "Moonstone Mine",
      "Ayurveda Garden",
      "Turtle Farm Beach",
    ],
    activities: ["River safari"],
    inclusions: ["Transfer", "Entrance tickets", "Russian-speaking guide"],
  },
  {
    slug: "whale-watching",
    title: "Whale Watching",
    durationLabel: "1 day",
    durationDays: 1,
    durationNights: 0,
    shortDescription: "A southern-coast boat trip for seasonal whale and dolphin watching.",
    description:
      "Take an Indian Ocean boat trip for whale watching and dolphin watching.",
    destinations: ["southern-coast"],
    attractions: [],
    activities: ["Whale watching", "Dolphin watching"],
    inclusions: ["Transfer", "Tickets", "Boat", "Russian-speaking guide"],
  },
] as const;

async function seedDestinations() {
  const destinationIds = new Map<string, string>();
  for (const destination of destinations) {
    const destinationRecord = await prisma.destination.upsert({
      where: { slug: destination.slug },
      update: {
        name: destination.name,
        description: destination.description,
        latitude: destination.latitude,
        longitude: destination.longitude,
      },
      create: destination,
    });
    destinationIds.set(destination.slug, destinationRecord.id);
  }
  return destinationIds;
}

async function seedExperienceCatalog() {
  const existingAttractions = await prisma.attraction.findMany({
    select: { slug: true, description: true },
  });
  const existingDescriptions = new Map(existingAttractions.map(({ slug, description }) => [slug, description]));

  for (const name of catalogAttractions) {
    const slug = catalogSlug(name);
    const description = attractionDescriptions[name];
    const existingDescription = existingDescriptions.get(slug);

    await prisma.attraction.upsert({
      where: { slug },
      update: {
        name,
        ...(!existingDescription ? { description } : {}),
      },
      create: { name, slug, imageUrl: null, description },
    });
  }
  for (const name of catalogActivities) {
    const slug = catalogSlug(name);
    await prisma.activity.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
  }
}

async function seedCompleteTourPackages(destinationIds: Map<string, string>) {
  const [attractions, activities] = await Promise.all([
    prisma.attraction.findMany({ select: { id: true, slug: true } }),
    prisma.activity.findMany({ select: { id: true, slug: true } }),
  ]);
  const attractionIds = new Map(attractions.map(({ id, slug }) => [slug, id]));
  const activityIds = new Map(activities.map(({ id, slug }) => [slug, id]));

  for (const tour of completeTourPackages) {
    const packageDestinationIds = tour.destinations.map((slug) => {
      const id = destinationIds.get(slug);
      if (!id) throw new Error(`Unknown destination "${slug}" in ${tour.slug}`);
      return id;
    });
    const packageAttractionIds = tour.attractions.map((name) => {
      const id = attractionIds.get(catalogSlug(name));
      if (!id) throw new Error(`Unknown attraction "${name}" in ${tour.slug}`);
      return id;
    });
    const packageActivityIds = tour.activities.map((name) => {
      const id = activityIds.get(catalogSlug(name));
      if (!id) throw new Error(`Unknown activity "${name}" in ${tour.slug}`);
      return id;
    });

    const tourRecord = await prisma.tour.upsert({
      where: { slug: tour.slug },
      update: {
        title: tour.title,
        shortDescription: tour.shortDescription,
        description: tour.description,
        durationDays: tour.durationDays,
        durationNights: tour.durationNights,
        durationLabel: tour.durationLabel,
        seoTitle: `${tour.title} | Super Star Travel`,
        seoDescription: tour.shortDescription,
      },
      create: {
        id: `seed-complete-tour-${tour.slug}`,
        slug: tour.slug,
        title: tour.title,
        shortDescription: tour.shortDescription,
        description: tour.description,
        durationDays: tour.durationDays,
        durationNights: tour.durationNights,
        durationLabel: tour.durationLabel,
        status: TourStatus.DRAFT,
        featured: false,
        basePrice: 1,
        currency: "USD",
        seoTitle: `${tour.title} | Super Star Travel`,
        seoDescription: tour.shortDescription,
      },
    });

    for (const [sortOrder, destinationId] of packageDestinationIds.entries()) {
      await prisma.tourDestination.upsert({
        where: {
          tourId_destinationId: { tourId: tourRecord.id, destinationId },
        },
        update: { sortOrder },
        create: { tourId: tourRecord.id, destinationId, sortOrder },
      });
    }
    for (const [sortOrder, attractionId] of packageAttractionIds.entries()) {
      await prisma.tourAttraction.upsert({
        where: {
          tourId_attractionId: { tourId: tourRecord.id, attractionId },
        },
        update: { sortOrder },
        create: { tourId: tourRecord.id, attractionId, sortOrder },
      });
    }
    for (const [sortOrder, activityId] of packageActivityIds.entries()) {
      await prisma.tourActivity.upsert({
        where: {
          tourId_activityId: { tourId: tourRecord.id, activityId },
        },
        update: { sortOrder },
        create: { tourId: tourRecord.id, activityId, sortOrder },
      });
    }
    for (const [sortOrder, label] of tour.inclusions.entries()) {
      const id = `seed-complete-tour-inclusion-${tour.slug}-${sortOrder + 1}`;
      await prisma.tourInclusion.upsert({
        where: { id },
        update: { tourId: tourRecord.id, label, sortOrder },
        create: { id, tourId: tourRecord.id, label, sortOrder },
      });
    }
  }
}

async function clearNonUploadImageReferences() {
  const [
    destinations,
    attractions,
    activities,
    tourCovers,
    tourHeroes,
    tourGallery,
    itineraryImages,
    media,
  ] = await prisma.$transaction([
    prisma.destination.updateMany({
      where: { imageUrl: { not: { startsWith: "/uploads/" } } },
      data: { imageUrl: null },
    }),
    prisma.attraction.updateMany({
      where: { imageUrl: { not: { startsWith: "/uploads/" } } },
      data: { imageUrl: null },
    }),
    prisma.activity.updateMany({
      where: { imageUrl: { not: { startsWith: "/uploads/" } } },
      data: { imageUrl: null },
    }),
    prisma.tour.updateMany({
      where: { coverImageUrl: { not: { startsWith: "/uploads/" } } },
      data: { coverImageUrl: null },
    }),
    prisma.tour.updateMany({
      where: { heroImageUrl: { not: { startsWith: "/uploads/" } } },
      data: { heroImageUrl: null },
    }),
    prisma.tourImage.deleteMany({
      where: { url: { not: { startsWith: "/uploads/" } } },
    }),
    prisma.itineraryActivity.updateMany({
      where: { imageUrl: { not: { startsWith: "/uploads/" } } },
      data: { imageUrl: null },
    }),
    prisma.media.deleteMany({
      where: { url: { not: { startsWith: "/uploads/" } } },
    }),
  ]);
  console.info(
    `Cleared ${destinations.count + attractions.count + activities.count + tourCovers.count + tourHeroes.count + itineraryImages.count} image references and removed ${tourGallery.count + media.count} non-uploaded media records.`,
  );
}

async function main() {
  if (process.argv.includes("--local-images-only")) {
    await clearNonUploadImageReferences();
    return;
  }
  if (process.argv.includes("--destinations-only")) {
    const destinationIds = await seedDestinations();
    console.info(`Seeded ${destinationIds.size} destinations.`);
    return;
  }
  if (process.argv.includes("--experiences-only")) {
    await seedExperienceCatalog();
    console.info(`Seeded ${catalogAttractions.length} attractions and ${catalogActivities.length} activities.`);
    return;
  }
  if (process.argv.includes("--packages-only")) {
    await seedExperienceCatalog();
    const destinationIds = await seedDestinations();
    await seedCompleteTourPackages(destinationIds);
    console.info(`Seeded ${completeTourPackages.length} complete tour packages as drafts.`);
    return;
  }

  for (const user of [
    {
      id: "seed-user-admin",
      name: "Super Star Travel Admin",
      email: "admin@example.com",
      role: UserRole.SUPER_ADMIN,
    },
    {
      id: "seed-user-tour-manager",
      name: "Nimali Perera",
      email: "tours@example.com",
      role: UserRole.TOUR_MANAGER,
    },
    {
      id: "seed-user-booking-manager",
      name: "Kasun Fernando",
      email: "bookings@example.com",
      role: UserRole.BOOKING_MANAGER,
    },
  ]) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, role: user.role, active: true },
      create: { ...user, passwordHash: disabledPasswordHash },
    });
  }

  await seedExperienceCatalog();
  const destinationIds = await seedDestinations();

  const tourIds = new Map<string, string>();
  const getTourId = (slug: string) => {
    const id = tourIds.get(slug);
    if (!id) {
      throw new Error(`Tour "${slug}" was not seeded`);
    }
    return id;
  };
  for (const [tourIndex, tour] of tours.entries()) {
    const tourRecord = await prisma.tour.upsert({
      where: { slug: tour.slug },
      update: {
        title: tour.title,
        shortDescription: tour.shortDescription,
        description: tour.description,
        durationDays: tour.durationDays,
        durationNights: tour.durationNights,
        status: TourStatus.PUBLISHED,
        featured: tour.featured,
        basePrice: tour.basePrice,
        currency: "USD",
        seoTitle: `${tour.title} | Super Star Travel`,
        seoDescription: tour.shortDescription,
      },
      create: {
        id: tour.id,
        slug: tour.slug,
        title: tour.title,
        shortDescription: tour.shortDescription,
        description: tour.description,
        durationDays: tour.durationDays,
        durationNights: tour.durationNights,
        status: TourStatus.PUBLISHED,
        featured: tour.featured,
        basePrice: tour.basePrice,
        currency: "USD",
        seoTitle: `${tour.title} | Super Star Travel`,
        seoDescription: tour.shortDescription,
      },
    });
    tourIds.set(tour.slug, tourRecord.id);
    const tourId = tourRecord.id;

    for (const [sortOrder, destinationSlug] of tour.destinations.entries()) {
      const destination = destinations.find((item) => item.slug === destinationSlug);
      if (!destination) {
        throw new Error(`Unknown destination "${destinationSlug}" in ${tour.slug}`);
      }
      const destinationId = destinationIds.get(destinationSlug);
      if (!destinationId) {
        throw new Error(`Destination "${destinationSlug}" was not seeded`);
      }

      await prisma.tourDestination.upsert({
        where: {
          tourId_destinationId: {
            tourId,
            destinationId,
          },
        },
        update: { sortOrder },
        create: {
          tourId,
          destinationId,
          sortOrder,
        },
      });
    }

    await prisma.tourPrice.upsert({
      where: { id: `seed-tour-price-${tourIndex + 1}` },
      update: {
        tourId,
        label: "Per adult, twin share",
        adultPrice: tour.basePrice,
        childPrice: Math.round(tour.basePrice * 0.7),
        infantPrice: 0,
        singleSupplement: 180,
        privateTourPrice: Math.round(tour.basePrice * 1.45),
        currency: "USD",
      },
      create: {
        id: `seed-tour-price-${tourIndex + 1}`,
        tourId,
        label: "Per adult, twin share",
        adultPrice: tour.basePrice,
        childPrice: Math.round(tour.basePrice * 0.7),
        infantPrice: 0,
        singleSupplement: 180,
        privateTourPrice: Math.round(tour.basePrice * 1.45),
        currency: "USD",
      },
    });

    const startDate = new Date(Date.UTC(2027, 1 + tourIndex, 10 + tourIndex * 3));
    const endDate = new Date(
      startDate.getTime() + (tour.durationDays - 1) * 24 * 60 * 60 * 1000,
    );
    await prisma.tourDeparture.upsert({
      where: { id: `seed-tour-departure-${tourIndex + 1}` },
      update: {
        tourId,
        startDate,
        endDate,
        capacity: 12,
        bookedSeats: tourIndex === 0 ? 2 : 0,
        active: true,
      },
      create: {
        id: `seed-tour-departure-${tourIndex + 1}`,
        tourId,
        startDate,
        endDate,
        capacity: 12,
        bookedSeats: tourIndex === 0 ? 2 : 0,
        active: true,
      },
    });

    for (const [sortOrder, label] of [
      "Private air-conditioned transfers",
      "Daily breakfast at the hotel",
      "English-speaking local guide",
      "Accommodation in carefully selected hotels",
    ].entries()) {
      const id = `seed-tour-${tourIndex + 1}-inclusion-${sortOrder + 1}`;
      await prisma.tourInclusion.upsert({
        where: { id },
        update: { tourId, label, sortOrder },
        create: { id, tourId, label, sortOrder },
      });
    }

    for (const [sortOrder, label] of [
      "International flights and travel insurance",
      "Lunches and dinners unless stated",
      "Entrance fees not listed in the itinerary",
      "Personal expenses and gratuities",
    ].entries()) {
      const id = `seed-tour-${tourIndex + 1}-exclusion-${sortOrder + 1}`;
      await prisma.tourExclusion.upsert({
        where: { id },
        update: { tourId, label, sortOrder },
        create: { id, tourId, label, sortOrder },
      });
    }

    for (const [dayIndex, day] of tour.itinerary.entries()) {
      const dayId = `seed-tour-${tourIndex + 1}-day-${dayIndex + 1}`;
      const itineraryDay = await prisma.itineraryDay.upsert({
        where: {
          tourId_dayNumber: { tourId, dayNumber: dayIndex + 1 },
        },
        update: {
          tourId,
          title: day.title,
          description: day.description,
          overnightAt: day.overnightAt,
          accommodation: `Comfortable guesthouse or boutique hotel in ${day.overnightAt}`,
          meals: dayIndex === 0 ? ["Dinner"] : ["Breakfast"],
          distanceKm: dayIndex === 0 ? null : 90 + dayIndex * 35,
          drivingMinutes: dayIndex === 0 ? null : 120 + dayIndex * 20,
        },
        create: {
          id: dayId,
          tourId,
          dayNumber: dayIndex + 1,
          title: day.title,
          description: day.description,
          overnightAt: day.overnightAt,
          accommodation: `Comfortable guesthouse or boutique hotel in ${day.overnightAt}`,
          meals: dayIndex === 0 ? ["Dinner"] : ["Breakfast"],
          distanceKm: dayIndex === 0 ? null : 90 + dayIndex * 35,
          drivingMinutes: dayIndex === 0 ? null : 120 + dayIndex * 20,
        },
      });
      const itineraryDayId = itineraryDay.id;

      for (const [activityIndex, activityTitle] of day.activities.entries()) {
        const activityId = `seed-tour-${tourIndex + 1}-day-${dayIndex + 1}-activity-${activityIndex + 1}`;
        await prisma.itineraryActivity.upsert({
          where: { id: activityId },
          update: {
            dayId: itineraryDayId,
            timeLabel: activityIndex === 0 ? "Morning" : "Afternoon",
            title: activityTitle,
            description: `${activityTitle} with your knowledgeable local guide.`,
            sortOrder: activityIndex,
          },
          create: {
            id: activityId,
            dayId: itineraryDayId,
            timeLabel: activityIndex === 0 ? "Morning" : "Afternoon",
            title: activityTitle,
            description: `${activityTitle} with your knowledgeable local guide.`,
            sortOrder: activityIndex,
          },
        });
      }
    }
  }

  await seedCompleteTourPackages(destinationIds);

  for (const customer of [
    {
      id: "seed-customer-olivia",
      firstName: "Olivia",
      lastName: "Bennett",
      email: "olivia.bennett@example.com",
      phone: "+447700900123",
      country: "United Kingdom",
    },
    {
      id: "seed-customer-noah",
      firstName: "Noah",
      lastName: "Martin",
      email: "noah.martin@example.com",
      phone: "+33612345678",
      country: "France",
    },
    {
      id: "seed-customer-amara",
      firstName: "Amara",
      lastName: "Silva",
      email: "amara.silva@example.com",
      phone: "+61412345678",
      country: "Australia",
    },
  ]) {
    await prisma.customer.upsert({
      where: { id: customer.id },
      update: customer,
      create: customer,
    });
  }

  const bookings = [
    {
      id: "seed-booking-cultural",
      reference: "SST-DEMO-1001",
      tourIndex: 0,
      customerId: "seed-customer-olivia",
      status: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.SUCCEEDED,
      paymentMethod: PaymentMethod.ONLINE,
      bookingOption: "Scheduled departure",
      adults: 2,
      children: 0,
      subtotal: 2380,
      amountPaid: 2380,
      specialRequests: "One vegetarian meal preference.",
    },
    {
      id: "seed-booking-hill-country",
      reference: "SST-DEMO-1002",
      tourIndex: 1,
      customerId: "seed-customer-noah",
      status: BookingStatus.AWAITING_PAYMENT,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      bookingOption: "Scheduled departure",
      adults: 2,
      children: 1,
      subtotal: 2403,
      amountPaid: 0,
      specialRequests: "Please advise on the best family-friendly train carriage.",
    },
    {
      id: "seed-booking-safari",
      reference: "SST-DEMO-1003",
      tourIndex: 2,
      customerId: "seed-customer-amara",
      status: BookingStatus.COMPLETED,
      paymentStatus: PaymentStatus.SUCCEEDED,
      paymentMethod: PaymentMethod.ONLINE,
      bookingOption: "Private tour",
      adults: 2,
      children: 0,
      subtotal: 2146,
      amountPaid: 2146,
      specialRequests: null,
    },
  ] as const;

  for (const [bookingIndex, booking] of bookings.entries()) {
    const tour = tours[booking.tourIndex];
    const tourId = getTourId(tour.slug);
    const startDate =
      booking.status === BookingStatus.COMPLETED
        ? new Date(Date.UTC(2026, 7, 12))
        : new Date(Date.UTC(2027, 1 + booking.tourIndex, 10 + booking.tourIndex * 3));
    const endDate = new Date(
      startDate.getTime() + (tour.durationDays - 1) * 24 * 60 * 60 * 1000,
    );
    const departureId =
      booking.status === BookingStatus.COMPLETED
        ? null
        : `seed-tour-departure-${booking.tourIndex + 1}`;

    const bookingRecord = await prisma.booking.upsert({
      where: { reference: booking.reference },
      update: {
        tourId,
        customerId: booking.customerId,
        departureId,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        paymentMethod: booking.paymentMethod,
        bookingOption: booking.bookingOption,
        travelStartDate: startDate,
        travelEndDate: endDate,
        adults: booking.adults,
        children: booking.children,
        infants: 0,
        currency: "USD",
        subtotal: booking.subtotal,
        discountAmount: 0,
        totalAmount: booking.subtotal,
        amountPaid: booking.amountPaid,
        tourTitleSnapshot: tour.title,
        priceSnapshot: {
          adults: booking.adults,
          children: booking.children,
          adultPrice: tour.basePrice,
          childPrice: Math.round(tour.basePrice * 0.7),
          currency: "USD",
        },
        specialRequests: booking.specialRequests,
      },
      create: {
        id: booking.id,
        reference: booking.reference,
        tourId,
        customerId: booking.customerId,
        departureId,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        paymentMethod: booking.paymentMethod,
        bookingOption: booking.bookingOption,
        travelStartDate: startDate,
        travelEndDate: endDate,
        adults: booking.adults,
        children: booking.children,
        infants: 0,
        currency: "USD",
        subtotal: booking.subtotal,
        discountAmount: 0,
        totalAmount: booking.subtotal,
        amountPaid: booking.amountPaid,
        tourTitleSnapshot: tour.title,
        priceSnapshot: {
          adults: booking.adults,
          children: booking.children,
          adultPrice: tour.basePrice,
          childPrice: Math.round(tour.basePrice * 0.7),
          currency: "USD",
        },
        specialRequests: booking.specialRequests,
      },
    });

    for (const traveller of [
      ...Array.from({ length: booking.adults }, (_, index) => ({
        id: `seed-booking-${bookingIndex + 1}-adult-${index + 1}`,
        firstName: bookingIndex === 0 ? "Olivia" : bookingIndex === 1 ? "Noah" : "Amara",
        lastName: bookingIndex === 0 ? "Bennett" : bookingIndex === 1 ? "Martin" : "Silva",
        travellerType: "ADULT",
        nationality:
          bookingIndex === 0
            ? "United Kingdom"
            : bookingIndex === 1
              ? "France"
              : "Australia",
      })),
      ...Array.from({ length: booking.children }, (_, index) => ({
        id: `seed-booking-${bookingIndex + 1}-child-${index + 1}`,
        firstName: "Camille",
        lastName: "Martin",
        travellerType: "CHILD",
        nationality: "France",
      })),
    ]) {
      await prisma.bookingTraveller.upsert({
        where: { id: traveller.id },
        update: {
          bookingId: bookingRecord.id,
          firstName: traveller.firstName,
          lastName: traveller.lastName,
          travellerType: traveller.travellerType,
          nationality: traveller.nationality,
        },
        create: { ...traveller, bookingId: bookingRecord.id },
      });
    }

    const paid = booking.paymentStatus === PaymentStatus.SUCCEEDED;
    await prisma.bookingPayment.upsert({
      where: { idempotencyKey: `seed-payment-${booking.reference}` },
      update: {
        bookingId: bookingRecord.id,
        amount: booking.amountPaid,
        currency: "USD",
        status: paid ? PaymentStatus.SUCCEEDED : PaymentStatus.PENDING,
        method: booking.paymentMethod,
        provider: paid ? "demo-gateway" : "bank-transfer",
        providerReference: paid ? `DEMO-${booking.reference}` : null,
        paidAt: paid ? new Date(Date.UTC(2026, 9, 15 + bookingIndex)) : null,
      },
      create: {
        id: `seed-payment-${bookingIndex + 1}`,
        bookingId: bookingRecord.id,
        amount: booking.amountPaid,
        currency: "USD",
        status: paid ? PaymentStatus.SUCCEEDED : PaymentStatus.PENDING,
        method: booking.paymentMethod,
        provider: paid ? "demo-gateway" : "bank-transfer",
        providerReference: paid ? `DEMO-${booking.reference}` : null,
        idempotencyKey: `seed-payment-${booking.reference}`,
        paidAt: paid ? new Date(Date.UTC(2026, 9, 15 + bookingIndex)) : null,
      },
    });

    const statusHistory = [
      {
        id: `seed-booking-${bookingIndex + 1}-history-created`,
        fromStatus: null,
        toStatus: BookingStatus.PENDING,
        note: "Sample booking created.",
      },
      {
        id: `seed-booking-${bookingIndex + 1}-history-current`,
        fromStatus: BookingStatus.PENDING,
        toStatus: booking.status,
        note: "Sample booking status for the demo dashboard.",
      },
    ];

    for (const history of statusHistory) {
      await prisma.bookingStatusHistory.upsert({
        where: { id: history.id },
        update: {
          bookingId: bookingRecord.id,
          fromStatus: history.fromStatus,
          toStatus: history.toStatus,
          note: history.note,
          changedBy: "seed-data",
        },
        create: {
          ...history,
          bookingId: bookingRecord.id,
          changedBy: "seed-data",
        },
      });
    }
  }

  for (const review of [
    {
      id: "seed-review-sigiriya",
      tourId: getTourId(tours[0].slug),
      customerName: "Olivia Bennett",
      rating: 5,
      title: "A wonderful introduction to Sri Lanka",
      body: "Our guide brought the history of Sigiriya and Kandy to life. The route was thoughtful, the hotels were welcoming, and every transfer ran smoothly.",
    },
    {
      id: "seed-review-ella",
      tourId: getTourId(tours[1].slug),
      customerName: "Noah Martin",
      rating: 5,
      title: "The train journey was unforgettable",
      body: "Tea country was beautiful, and our local team made the train and Ella walks easy to enjoy. A lovely mix of activity and downtime.",
    },
    {
      id: "seed-review-yala",
      tourId: getTourId(tours[2].slug),
      customerName: "Amara Silva",
      rating: 4,
      title: "History, coast, and wildlife in one trip",
      body: "We loved wandering around Galle Fort and having a naturalist explain Yala's landscapes and wildlife. The itinerary felt relaxed and personal.",
    },
  ]) {
    await prisma.review.upsert({
      where: { id: review.id },
      update: review,
      create: review,
    });
  }

  for (const enquiry of [
    {
      id: "seed-enquiry-custom-tour",
      name: "Isabella Clark",
      email: "isabella.clark@example.com",
      phone: "+14155550124",
      country: "United States",
      message:
        "Hello, could you suggest a 10-day private itinerary combining Sigiriya, Kandy, Ella, and a few relaxing days on the south coast?",
      status: "NEW",
    },
    {
      id: "seed-enquiry-family",
      name: "Lucas Martin",
      email: "lucas.martin@example.com",
      phone: "+33123456789",
      country: "France",
      message:
        "We are planning a family holiday next summer. Do you offer child-friendly wildlife and cultural experiences?",
      status: "IN_PROGRESS",
    },
  ]) {
    await prisma.enquiry.upsert({
      where: { id: enquiry.id },
      update: enquiry,
      create: enquiry,
    });
  }

  for (const coupon of [
    {
      id: "seed-coupon-ayubowan",
      code: "AYUBOWAN10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      active: true,
      startsAt: new Date(Date.UTC(2026, 0, 1)),
      expiresAt: new Date(Date.UTC(2027, 11, 31)),
      usageLimit: 100,
      usageCount: 12,
    },
    {
      id: "seed-coupon-island",
      code: "ISLAND50",
      discountType: "FIXED",
      discountValue: 50,
      active: true,
      startsAt: new Date(Date.UTC(2026, 0, 1)),
      expiresAt: new Date(Date.UTC(2027, 5, 30)),
      usageLimit: 40,
      usageCount: 4,
    },
  ]) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        active: coupon.active,
        startsAt: coupon.startsAt,
        expiresAt: coupon.expiresAt,
        usageLimit: coupon.usageLimit,
        usageCount: coupon.usageCount,
      },
      create: coupon,
    });
  }

  for (const setting of [
    {
      id: "seed-setting-brand",
      key: "brand",
      value: {
        name: "Super Star Travel",
        tagline: "Discover the Pearl of the Indian Ocean",
        country: "Sri Lanka",
        currency: "USD",
      },
    },
    {
      id: "seed-setting-contact",
      key: "contact",
      value: {
        email: "hello@superstartravel.example",
        phone: "+94 11 234 5678",
        address: "Colombo, Sri Lanka",
        officeHours: "Monday to Saturday, 09:00-17:00 Sri Lanka time",
      },
    },
    {
      id: "seed-setting-social",
      key: "social",
      value: {
        facebook: "https://www.facebook.com/",
        instagram: "https://www.instagram.com/",
      },
    },
    {
      id: "seed-setting-booking",
      key: "booking",
      value: {
        defaultCurrency: "USD",
        supportedCurrencies: ["USD", "EUR", "GBP", "LKR"],
        enquiryResponseHours: 24,
      },
    },
  ]) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log("Sri Lanka tourism demo data seeded successfully.");
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error("Failed to seed Sri Lanka tourism demo data:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
