"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export type ItineraryActivityDraft = {
  timeLabel: string;
  title: string;
  description: string;
  imageUrl: string;
};

export type ItineraryDayDraft = {
  title: string;
  description: string;
  distanceKm: string;
  drivingMinutes: string;
  overnightAt: string;
  accommodation: string;
  meals: string;
  activities: ItineraryActivityDraft[];
};

function emptyDay(): ItineraryDayDraft {
  return {
    title: "",
    description: "",
    distanceKm: "",
    drivingMinutes: "",
    overnightAt: "",
    accommodation: "",
    meals: "",
    activities: [],
  };
}

export function ItineraryEditor({
  initialDays = [],
  name = "itineraryDays",
}: {
  initialDays?: ItineraryDayDraft[];
  name?: string;
}) {
  const [days, setDays] = useState(initialDays);
  const value = JSON.stringify(days.map(({ meals, ...day }) => ({
    ...day,
    meals: meals.split(/[,\n]/).map((meal) => meal.trim()).filter(Boolean),
  })));

  function updateDay(index: number, patch: Partial<ItineraryDayDraft>) {
    setDays((current) => current.map((day, dayIndex) =>
      dayIndex === index ? { ...day, ...patch } : day,
    ));
  }

  function updateActivity(
    dayIndex: number,
    activityIndex: number,
    patch: Partial<ItineraryActivityDraft>,
  ) {
    setDays((current) => current.map((day, index) => index === dayIndex
      ? {
          ...day,
          activities: day.activities.map((activity, itemIndex) =>
            itemIndex === activityIndex ? { ...activity, ...patch } : activity,
          ),
        }
      : day,
    ));
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={value} />
      {days.map((day, index) => (
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4" key={index}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-semibold text-slate-800">Day {index + 1}</h3>
            <button
              type="button"
              onClick={() => setDays((current) => current.filter((_, dayIndex) => dayIndex !== index))}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
              aria-label={`Remove day ${index + 1}`}
            >
              <Trash2 size={14} /> Remove day
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="ta-field sm:col-span-2">
              <span className="ta-label">Day title *</span>
              <input
                className="ta-input"
                value={day.title}
                onChange={(event) => updateDay(index, { title: event.target.value })}
                required
                maxLength={160}
                placeholder="e.g. Explore Sigiriya"
              />
            </label>
            <label className="ta-field sm:col-span-2">
              <span className="ta-label">Day plan</span>
              <textarea
                className="ta-input"
                value={day.description}
                onChange={(event) => updateDay(index, { description: event.target.value })}
                rows={3}
                maxLength={5000}
                placeholder="Describe the day’s route and experiences"
              />
            </label>
            <label className="ta-field">
              <span className="ta-label">Overnight location</span>
              <input
                className="ta-input"
                value={day.overnightAt}
                onChange={(event) => updateDay(index, { overnightAt: event.target.value })}
                maxLength={160}
              />
            </label>
            <label className="ta-field">
              <span className="ta-label">Accommodation</span>
              <input
                className="ta-input"
                value={day.accommodation}
                onChange={(event) => updateDay(index, { accommodation: event.target.value })}
                maxLength={160}
              />
            </label>
            <label className="ta-field">
              <span className="ta-label">Distance (km)</span>
              <input
                className="ta-input"
                type="number"
                min="0"
                step="0.1"
                value={day.distanceKm}
                onChange={(event) => updateDay(index, { distanceKm: event.target.value })}
              />
            </label>
            <label className="ta-field">
              <span className="ta-label">Driving time (minutes)</span>
              <input
                className="ta-input"
                type="number"
                min="0"
                step="1"
                value={day.drivingMinutes}
                onChange={(event) => updateDay(index, { drivingMinutes: event.target.value })}
              />
            </label>
            <label className="ta-field sm:col-span-2">
              <span className="ta-label">Meals (comma separated)</span>
              <input
                className="ta-input"
                value={day.meals}
                onChange={(event) => updateDay(index, { meals: event.target.value })}
                placeholder="Breakfast, Lunch, Dinner"
              />
            </label>
          </div>

          <div className="mt-4 border-t border-slate-200 pt-3">
            <h4 className="mb-2 text-sm font-semibold text-slate-700">Schedule items</h4>
            <div className="space-y-3">
              {day.activities.map((activity, activityIndex) => (
                <div className="rounded-lg border border-slate-200 bg-white p-3" key={activityIndex}>
                  <div className="grid gap-3 sm:grid-cols-[120px_minmax(0,1fr)_auto]">
                    <label className="ta-field">
                      <span className="ta-label">Time</span>
                      <input
                        className="ta-input"
                        value={activity.timeLabel}
                        onChange={(event) => updateActivity(index, activityIndex, { timeLabel: event.target.value })}
                        maxLength={80}
                        placeholder="Morning"
                      />
                    </label>
                    <label className="ta-field">
                      <span className="ta-label">Activity *</span>
                      <input
                        className="ta-input"
                        value={activity.title}
                        onChange={(event) => updateActivity(index, activityIndex, { title: event.target.value })}
                        required
                        maxLength={160}
                        placeholder="Visit the rock fortress"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => updateDay(index, {
                        activities: day.activities.filter((_, itemIndex) => itemIndex !== activityIndex),
                      })}
                      className="self-end rounded-lg p-2 text-red-700 hover:bg-red-50"
                      aria-label={`Remove schedule item ${activityIndex + 1} from day ${index + 1}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <label className="ta-field mt-3">
                    <span className="ta-label">Activity details</span>
                    <textarea
                      className="ta-input"
                      value={activity.description}
                      onChange={(event) => updateActivity(index, activityIndex, { description: event.target.value })}
                      rows={2}
                      maxLength={2000}
                    />
                  </label>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => updateDay(index, {
                activities: [
                  ...day.activities,
                  { timeLabel: "", title: "", description: "", imageUrl: "" },
                ],
              })}
              className="mt-3 inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Plus size={14} /> Add schedule item
            </button>
          </div>
        </section>
      ))}

      <button
        type="button"
        onClick={() => setDays((current) => [...current, emptyDay()])}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-dashed border-slate-400 px-4 text-sm font-semibold text-slate-700 hover:border-slate-600 hover:bg-slate-50"
      >
        <Plus size={16} /> Add itinerary day
      </button>
    </div>
  );
}
