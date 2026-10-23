export default function Profile() {
  const email = sessionStorage.getItem("demoEmail") || "student@example.com";
  const name = sessionStorage.getItem("demoName") || "Campus Student";

  return (
    <section className="card">
      <h1>My Profile</h1>
      <div className="avatar">{name.charAt(0).toUpperCase()}</div>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Role:</strong> {sessionStorage.getItem("demoRole") || "Guest"}</p>
      <p className="muted">Demo profile only. Add backend authentication for real accounts.</p>
    </section>
  );
}