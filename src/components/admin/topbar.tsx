export function AdminTopbar() {
  return <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:20,borderBottom:"1px solid #e5eaf2"}}>
    <strong style={{color:"var(--navy)"}}>Ceylon Compass Admin</strong>
    <span className="muted">Local development workspace</span>
  </header>;
}
