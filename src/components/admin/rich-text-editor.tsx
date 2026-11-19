"use client";

export function RichTextEditor({ name, label }: { name: string; label: string }) {
  return <div className="field"><label htmlFor={name}>{label}</label><textarea id={name} name={name} rows={7} placeholder="Enter formatted content. Replace with a rich-text editor such as Tiptap when implementing the CMS."/></div>;
}
