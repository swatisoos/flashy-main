export interface User {
  id: string;
  name: string;
  role: string;
  favourites: string[];
  likedSets: string[];
  sets: string[];
}

export type Role = "admin" | "user";
