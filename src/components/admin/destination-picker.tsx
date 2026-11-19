"use client";

import { ArrowDown, ArrowUp, MapPin } from "lucide-react";
import { useState } from "react";

export type DestinationOption = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
};

export function DestinationPicker({
  destinations,
  name = "destinationIds",
  initialSelectedIds = [],
}: {
  destinations: DestinationOption[];
  name?: string;
  initialSelectedIds?: string[];
}) {
  const [selectedIds, setSelectedIds] = useState(() =>
    initialSelectedIds.filter((id) => destinations.some((destination) => destination.id === id)),
  );
  const selectedDestinations = selectedIds
    .map((id) => destinations.find((destination) => destination.id === id))
    .filter((destination): destination is DestinationOption => Boolean(destination));

  function toggleDestination(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id],
    );
  }

  function moveDestination(index: number, offset: -1 | 1) {
    const targetIndex = index + offset;
    if (targetIndex < 0 || targetIndex >= selectedIds.length) return;
    setSelectedIds((current) => {
      const reordered = [...current];
      [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
      return reordered;
    });
  }

  return (
    <div className="destination-picker">
      {destinations.length ? (
        <div className="destination-picker-options">
          {destinations.map((destination) => (
            <label
              className={`destination-picker-option${selectedIds.includes(destination.id) ? " is-selected" : ""}`}
              key={destination.id}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(destination.id)}
                onChange={() => toggleDestination(destination.id)}
                aria-label={`Add ${destination.name} to this tour`}
              />
              {destination.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={destination.imageUrl} alt="" loading="lazy" />
              ) : (
                <span className="destination-picker-placeholder" aria-hidden="true"><MapPin size={16} /></span>
              )}
              <span className="destination-picker-name">{destination.name}</span>
            </label>
          ))}
        </div>
      ) : (
        <p className="destination-picker-empty">Add destinations first to include them in tour packages.</p>
      )}

      <div className="destination-picker-route">
        <div className="destination-picker-route-heading">
          <strong>Package itinerary order</strong>
          <span>{selectedDestinations.length} selected</span>
        </div>
        {selectedDestinations.length ? (
          <ol>
            {selectedDestinations.map((destination, index) => (
              <li key={destination.id}>
                <span className="destination-picker-step">{index + 1}</span>
                <span>{destination.name}</span>
                <span className="destination-picker-reorder">
                  <button
                    type="button"
                    aria-label={`Move ${destination.name} up`}
                    disabled={index === 0}
                    onClick={() => moveDestination(index, -1)}
                  ><ArrowUp size={14} /></button>
                  <button
                    type="button"
                    aria-label={`Move ${destination.name} down`}
                    disabled={index === selectedDestinations.length - 1}
                    onClick={() => moveDestination(index, 1)}
                  ><ArrowDown size={14} /></button>
                </span>
                <input type="hidden" name={name} value={destination.id} />
              </li>
            ))}
          </ol>
        ) : (
          <p className="destination-picker-empty">Choose one or more stops above. Their order will be shown on the public tour page.</p>
        )}
      </div>
    </div>
  );
}
