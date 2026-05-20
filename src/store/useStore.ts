import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserInput, Recommendation, ProjectResult, AnalysisMode, User, RegisteredUser } from '@/types';

interface AppState {
  user: User | null;
  registeredUsers: RegisteredUser[];
  userInput: UserInput | null;
  recommendations: Recommendation[];
  selectedProject: ProjectResult | null;
  savedProjects: ProjectResult[];
  analysisMode: AnalysisMode;
  
  setUser: (user: User | null) => void;
  registerUser: (newUser: RegisteredUser) => void;
  setUserInput: (input: UserInput) => void;
  setRecommendations: (recs: Recommendation[]) => void;
  setSelectedProject: (project: ProjectResult | null) => void;
  saveProject: (project: ProjectResult) => void;
  deleteProject: (id: string) => void;
  setAnalysisMode: (mode: AnalysisMode) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      registeredUsers: [],
      userInput: null,
      recommendations: [],
      selectedProject: null,
      savedProjects: [],
      analysisMode: 'General',

      setUser: (user) => set({ user }),
      registerUser: (newUser) => 
        set((state) => ({ 
          registeredUsers: [...state.registeredUsers, newUser] 
        })),
      setUserInput: (input) => set({ userInput: input }),
      setRecommendations: (recs) => set({ recommendations: recs }),
      setSelectedProject: (project) => set({ selectedProject: project }),
      saveProject: (project) =>
        set((state) => ({
          savedProjects: [project, ...state.savedProjects],
        })),
      deleteProject: (id) =>
        set((state) => ({
          savedProjects: state.savedProjects.filter((p) => p.id !== id),
        })),
      setAnalysisMode: (mode) => set({ analysisMode: mode }),
    }),
    {
      name: 'agri-consilium-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? window.localStorage : (null as any))),
    }
  )
);
