import { getCurrentUser } from "./_lib/auth/actions";

export default async function HomePage() {
  const currentUser = await getCurrentUser();

  return (
    <div>
      {currentUser ? (
        <div>Welcome, {currentUser.email}!</div>
      ) : (
        <div>Please sign in to continue</div>
      )}
    </div>
  );
}
