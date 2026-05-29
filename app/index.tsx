import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { AuthFlow } from '../features/auth/AuthFlow';

export default function AuthEntryScreen() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/map" />;
  }

  return <AuthFlow />;
}
