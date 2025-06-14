import { Redirect, Slot } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) return null; // of een spinner
  if (!user) return <Redirect href="/(auth)/login" />;

  return <Slot />; // gebruiker OK → toon child-pages
}
// Deze layout zorgt ervoor dat alleen ingelogde gebruikers toegang hebben tot de child pages.