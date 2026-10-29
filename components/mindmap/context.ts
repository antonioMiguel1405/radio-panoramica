"use client";

import { createContext } from "react";

export interface MindMapActions {
  toggle: (id: string) => void;
  select: (id: string) => void;
}

export const MindMapContext = createContext<MindMapActions>({
  toggle: () => {},
  select: () => {},
});
