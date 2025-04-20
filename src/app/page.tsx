import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to commands page
  redirect("/commands");

  // This won't be rendered
  return (
    <div>
      <p>Redirecting to commands page...</p>
    </div>
  );
}
