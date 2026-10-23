export default function Notifications() {
  const items = [
    "Welcome to CampusConnect!",
    "Check the event schedule for upcoming activities.",
    "Always verify payment status before assuming a paid booking is confirmed."
  ];

  return (
    <section>
      <h1>Notifications</h1>
      {items.map((item, index) => (
        <article className="card notification" key={index}>
          <p>{item}</p>
        </article>
      ))}
    </section>
  );
}