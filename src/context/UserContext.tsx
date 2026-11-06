"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useCurrentUser } from "@/providers/AuthProvider";

export type DepartmentStream = "science" | "commercial" | "arts";
export type ProficiencyLevel = "beginner" | "intermediate" | "advanced";
export type StudyTimeOfDay = "morning" | "afternoon" | "evening" | "night";

export interface CandidateUserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  xp: number;
  department: DepartmentStream;
  departmentStream: DepartmentStream;
  selectedSubjects: string[];
  targetScore: number;
  targetExamDate: string | null;
  proficiencyLevel: ProficiencyLevel;
  dailyStudyMinutes: number;
  preferredStudyTime: StudyTimeOfDay;
  hasCompletedOnboarding: boolean;
}

export interface UserContextValue {
  user: CandidateUserProfile | null;
  isSignedIn: boolean;
  isLoading: boolean;
  department: DepartmentStream;
  selectedSubjects: string[];
  targetScore: number;
  xp: number;
  refetchUser: () => Promise<void>;
  updateProfile: (updates: Partial<CandidateUserProfile>) => Promise<boolean>;
}

const DEFAULT_SUBJECTS: Record<DepartmentStream, string[]> = {
  science: ["Use of English", "Mathematics", "Physics", "Chemistry"],
  commercial: ["Use of English", "Mathematics", "Economics", "Accounting"],
  arts: ["Use of English", "Literature", "Government", "Christian Religious Studies"],
};

const defaultContextValue: UserContextValue = {
  user: null,
  isSignedIn: false,
  isLoading: true,
  department: "science",
  selectedSubjects: DEFAULT_SUBJECTS.science,
  targetScore: 280,
  xp: 0,
  refetchUser: async () => {},
  updateProfile: async () => false,
};

const UserContext = createContext<UserContextValue>(defaultContextValue);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn: authSignedIn, isLoaded: authLoaded, user: authUser } = useCurrentUser();
  const [userProfile, setUserProfile] = useState<CandidateUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(async () => {
    if (!authSignedIn) {
      setUserProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/user/profile", {
        headers: { "Cache-Control": "no-cache" },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUserProfile(data.user);
        }
      }
    } catch (err) {
      console.warn("Failed to retrieve candidate profile from API:", err);
    } finally {
      setIsLoading(false);
    }
  }, [authSignedIn]);

  useEffect(() => {
    if (authLoaded) {
      fetchProfile();
    }
  }, [authLoaded, fetchProfile]);

  const updateProfile = useCallback(
    async (updates: Partial<CandidateUserProfile>): Promise<boolean> => {
      try {
        const res = await fetch("/api/user/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: updates.name,
            targetScore: updates.targetScore,
            targetExamDate: updates.targetExamDate,
            departmentStream: updates.departmentStream || updates.department,
            selectedSubjects: updates.selectedSubjects,
            proficiencyLevel: updates.proficiencyLevel,
            dailyStudyMinutes: updates.dailyStudyMinutes,
            preferredStudyTime: updates.preferredStudyTime,
          }),
        });

        if (res.ok) {
          // Optimistically apply updates
          setUserProfile((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              ...updates,
              department: (updates.departmentStream || updates.department || prev.department) as DepartmentStream,
              departmentStream: (updates.departmentStream || updates.department || prev.departmentStream) as DepartmentStream,
            };
          });
          return true;
        }
        return false;
      } catch (err) {
        console.error("Failed to update profile:", err);
        return false;
      }
    },
    []
  );

  const department = useMemo<DepartmentStream>(() => {
    return userProfile?.department || userProfile?.departmentStream || "science";
  }, [userProfile]);

  const selectedSubjects = useMemo<string[]>(() => {
    if (userProfile?.selectedSubjects && userProfile.selectedSubjects.length > 0) {
      return userProfile.selectedSubjects;
    }
    return DEFAULT_SUBJECTS[department];
  }, [userProfile, department]);

  const targetScore = useMemo<number>(() => {
    return userProfile?.targetScore || 280;
  }, [userProfile]);

  const xp = useMemo<number>(() => {
    return userProfile?.xp || 0;
  }, [userProfile]);

  const value = useMemo<UserContextValue>(() => {
    return {
      user: userProfile,
      isSignedIn: !!authSignedIn,
      isLoading: !authLoaded || isLoading,
      department,
      selectedSubjects,
      targetScore,
      xp,
      refetchUser: fetchProfile,
      updateProfile,
    };
  }, [
    userProfile,
    authSignedIn,
    authLoaded,
    isLoading,
    department,
    selectedSubjects,
    targetScore,
    xp,
    fetchProfile,
    updateProfile,
  ]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/**
 * Universal hook to access the unified candidate profile across all pages
 */
export function useUserContext(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    return defaultContextValue;
  }
  return context;
}

// Convenient alias
export const useAppUser = useUserContext;
