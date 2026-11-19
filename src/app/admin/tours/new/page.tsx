import Link from "next/link";
import {
  ArrowLeft, ChevronRight, Clock, FileText, Image as ImageIcon, Info, Mountain, Rocket, Route, Save, Tag,
} from "lucide-react";
import { createTourAction } from "@/actions/tour.actions";
import { DestinationPicker } from "@/components/admin/destination-picker";
import { ImageUrlField } from "@/components/admin/image-url-field";
import { TourItemPicker } from "@/components/admin/tour-item-picker";
import { prisma } from "@/lib/prisma";
import { SlugField } from "../slug-field";

function CardHead({ Icon, title, sub }: { Icon: typeof Info; title: string; sub?: string }) {
  return (
    <div className="ta-card-head">
      <div className="ico"><Icon size={18} /></div>
      <div>
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
    </div>
  );
}

export default async function NewTourPage() {
  const [destinations, attractions, activities] = await Promise.all([
    prisma.destination.findMany({
      select: { id: true, name: true, slug: true, imageUrl: true },
      orderBy: { name: "asc" },
    }),
    prisma.attraction.findMany({ select: { id: true, name: true, imageUrl: true }, orderBy: { name: "asc" } }),
    prisma.activity.findMany({ select: { id: true, name: true, imageUrl: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="ta">
      <div className="ta-head">
        <div>
          <div className="ta-crumb">
            <Link href="/admin/tours">Tours</Link>
            <ChevronRight size={12} />
            <span>New</span>
          </div>
          <h1>Add New Tour</h1>
          <p className="ta-muted">Fill in the essentials. You can refine everything after saving.</p>
        </div>
        <Link href="/admin/tours" className="ta-btn ta-btn-ghost">
          <ArrowLeft size={16} /> Back to tours
        </Link>
      </div>

      <form action={createTourAction}>
        <div className="ta-layout">
          {/* ---------- MAIN COLUMN ---------- */}
          <div>
            <section className="ta-card">
              <CardHead Icon={Tag} title="Basic information" sub="Name and web address of the package" />
              <div className="ta-card-body ta-grid">
                <div className="ta-field">
                  <label htmlFor="title" className="req">Tour name</label>
                  <input id="title" name="title" required minLength={3} className="ta-input" placeholder="e.g. Cultural Triangle Explorer" />
                </div>
                <div className="ta-field">
                  <label htmlFor="slug" className="req">URL slug</label>
                  <SlugField titleId="title" />
                </div>
                <div className="ta-field ta-span">
                  <label htmlFor="shortDescription" className="req">Short description</label>
                  <textarea id="shortDescription" name="shortDescription" rows={2} required className="ta-input" placeholder="One or two sentences shown on tour cards" />
                </div>
              </div>
            </section>

            <section className="ta-card">
              <CardHead Icon={Clock} title="Duration & pricing" />
              <div className="ta-card-body ta-grid">
                <div className="ta-field">
                  <label htmlFor="durationDays" className="req">Days</label>
                  <input id="durationDays" name="durationDays" type="number" min="1" required defaultValue="8" className="ta-input" />
                </div>
                <div className="ta-field">
                  <label htmlFor="durationNights" className="req">Nights</label>
                  <input id="durationNights" name="durationNights" type="number" min="0" required defaultValue="7" className="ta-input" />
                </div>
                <div className="ta-field">
                  <label htmlFor="durationLabel">Display duration</label>
                  <input id="durationLabel" name="durationLabel" maxLength={80} className="ta-input" placeholder="e.g. Full day or 4–5 hours" />
                </div>
                <div className="ta-field">
                  <label htmlFor="basePrice" className="req">Starting price</label>
                  <div className="ta-addon price">
                    <select id="currency" name="currency" className="ta-input" aria-label="Currency">
                      <option>USD</option><option>EUR</option><option>GBP</option><option>LKR</option>
                    </select>
                    <input id="basePrice" name="basePrice" type="number" min="0.01" step="0.01" required className="ta-input" placeholder="0.00" />
                  </div>
                </div>
              </div>
            </section>

            <section className="ta-card">
              <CardHead Icon={Route} title="Destinations & route" sub="Choose stops, then arrange their order in the itinerary" />
              <div className="ta-card-body">
                <DestinationPicker destinations={destinations} />
              </div>
            </section>

            <section className="ta-card">
              <CardHead Icon={Mountain} title="Attractions & activities" sub="Select what is included in this package" />
              <div className="ta-card-body">
                <TourItemPicker
                  groups={[
                    { name: "attractionIds", label: "Attractions", items: attractions },
                    { name: "activityIds", label: "Activities", items: activities },
                  ]}
                />
              </div>
            </section>

            <section className="ta-card">
              <CardHead Icon={FileText} title="Full description" sub="Optional — detailed overview shown on the tour page" />
              <div className="ta-card-body">
                <textarea id="description" name="description" rows={6} className="ta-input" aria-label="Full description" />
              </div>
            </section>
          </div>

          {/* ---------- SIDEBAR ---------- */}
          <aside className="ta-side">
            <section className="ta-card">
              <CardHead Icon={Rocket} title="Publish" />
              <div className="ta-card-body">
                <div>
                  <span className="ta-label">Status</span>
                  <div className="ta-seg" role="radiogroup" aria-label="Status">
                    <input type="radio" id="st-draft" name="status" value="DRAFT" defaultChecked />
                    <label htmlFor="st-draft">Draft</label>
                    <input type="radio" id="st-pub" name="status" value="PUBLISHED" />
                    <label htmlFor="st-pub">Published</label>
                    <input type="radio" id="st-arc" name="status" value="ARCHIVED" />
                    <label htmlFor="st-arc">Archived</label>
                  </div>
                </div>
                <div>
                  <span className="ta-label">Featured on homepage</span>
                  <div className="ta-seg" role="radiogroup" aria-label="Featured">
                    <input type="radio" id="ft-no" name="featured" value="false" defaultChecked />
                    <label htmlFor="ft-no">No</label>
                    <input type="radio" id="ft-yes" name="featured" value="true" />
                    <label htmlFor="ft-yes">Yes</label>
                  </div>
                </div>
                <div>
                  <span className="ta-label">Show price on website</span>
                  <div className="ta-seg" role="radiogroup" aria-label="Show price publicly">
                    <input type="radio" id="price-visible" name="showPrice" value="true" defaultChecked />
                    <label htmlFor="price-visible">Show</label>
                    <input type="radio" id="price-hidden" name="showPrice" value="false" />
                    <label htmlFor="price-hidden">Hide</label>
                  </div>
                </div>
                <button type="submit" className="ta-btn ta-btn-primary ta-btn-block">
                  <Save size={16} /> Save tour
                </button>
                <Link href="/admin/tours" className="ta-btn ta-btn-ghost ta-btn-block">Cancel</Link>
              </div>
            </section>

            <section className="ta-card">
              <CardHead Icon={ImageIcon} title="Cover image" />
              <div className="ta-card-body">
                <ImageUrlField id="coverImageUrl" name="coverImageUrl" label="Package cover image" folder="tour-covers" />
              </div>
            </section>
          </aside>
        </div>
      </form>
    </div>
  );
}