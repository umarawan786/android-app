import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("profiles")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
        },
        async (payload) => {
          console.log("subscription:", payload.new.verified, profile.verified);
          if (
            payload?.new?.verified !== profile?.verified ||
            payload?.new?.onboarding_complete !== profile?.onboarding_complete
          ) {
            await refreshProfile();
            router.replace("/");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  useEffect(() => {
    // Fetch session and user profile
    (async () => {
      setIsLoading(true);
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        Alert.alert(
          "Error",
          "supabase.auth.getSession() error: " + error.message
        );
      }

      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      }
      setIsLoading(false);
    })();

    // Listen for changes to the session
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session) {
          fetchProfile(session.user.id);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    setIsLoading(true);
    if (profile?.id) {
      await fetchProfile(profile.id);
    }
    setIsLoading(false);
  };

  const fetchProfile = async (user_id) => {
    setIsLoading(true);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user_id)
      .single();

    if (profileError) {
      console.error(
        "supabase.from('profiles').select().eq().single() error: " +
          profileError.message
      );
      setProfile(null);
      setSession(null);
      await supabase.signOut(); // Sign out if there is an error fetching profile
      setIsLoading(false);

      return;
    }

    setProfile(profile);
    setIsLoading(false);
  };

  const signInWithEmail = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert(
        "Error",
        "supabase.auth.signInWithPassword() error: " + error.message
      );
      return;
    }
  };

  const guardianSignUp = async (
    name,
    email,
    password,
    dateOfBirth,
    numberOfChildAccounts
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          email: email,
          date_of_birth: dateOfBirth, // Expects a format like YYYY-MM-DD
          initial_no_child: numberOfChildAccounts,
          number_of_child_accounts_created: 1,
          role: "guardian",
          onboarding_complete: numberOfChildAccounts == 0 ? true : false,
        },
      },
    });

    if (error) {
      console.error("Error signing up the guardian account", error.message);
      return;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error.message);
  };

  return (
    <AuthContext.Provider
      value={{
        profile,
        isLoading,
        session,
        signInWithEmail,
        signOut,
        fetchProfile,
        guardianSignUp,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "Wrap this component with AuthProvider to use this context"
    );
  }

  return context;
};
