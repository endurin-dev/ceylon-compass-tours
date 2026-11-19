export type BookingOption = "PAY_LATER" | "REQUEST_BOOKING";

export type TravellerInput = {
  firstName: string;
  lastName: string;
  travellerType: "ADULT" | "CHILD" | "INFANT";
  nationality?: string;
};
