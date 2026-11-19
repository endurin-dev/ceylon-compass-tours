"use client";

import { useState } from "react";

export type TourItemOption = {
  id: string;
  name: string;
  imageUrl: string | null;
};

export type TourItemGroup = {
  name: "attractionIds" | "activityIds";
  label: string;
  items: TourItemOption[];
  initialSelectedIds?: string[];
};

export function TourItemPicker({ groups }: { groups: TourItemGroup[] }) {
  const [selectedIds, setSelectedIds] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(groups.map((group) => [group.name, group.initialSelectedIds ?? []])),
  );

  function toggle(groupName: TourItemGroup["name"], id: string) {
    setSelectedIds((current) => {
      const selected = current[groupName] ?? [];
      return {
        ...current,
        [groupName]: selected.includes(id)
          ? selected.filter((selectedId) => selectedId !== id)
          : [...selected, id],
      };
    });
  }

  return (
    <div className="tour-item-picker">
      {groups.map((group) => {
        const selected = selectedIds[group.name] ?? [];
        return (
          <section className="tour-item-picker-group" key={group.name}>
            <div className="tour-item-picker-heading">
              <strong>{group.label}</strong>
              <span>{selected.length} selected</span>
            </div>
            {group.items.length ? (
              <div className="tour-item-picker-options">
                {group.items.map((item) => (
                  <label className="tour-item-picker-option" key={item.id}>
                    <input
                      type="checkbox"
                      checked={selected.includes(item.id)}
                      onChange={() => toggle(group.name, item.id)}
                      aria-label={`Add ${item.name} to this package`}
                    />
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt="" loading="lazy" />
                    ) : <span className="tour-item-picker-placeholder" aria-hidden="true" />}
                    <span>{item.name}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="destination-picker-empty">Add {group.label.toLowerCase()} in the admin catalogue first.</p>
            )}
            {selected.filter((id) => group.items.some((item) => item.id === id)).map((id) => (
              <input type="hidden" name={group.name} value={id} key={id} />
            ))}
          </section>
        );
      })}
    </div>
  );
}
