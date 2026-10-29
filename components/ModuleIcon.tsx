import {
  Bone,
  Ghost,
  Layers,
  ListChecks,
  Orbit,
  ScanLine,
  Stethoscope,
  ThumbsDown,
  ThumbsUp,
  Triangle,
  TriangleAlert,
  UserCheck,
  type LucideProps,
} from "lucide-react";
import type { ModuleIcon as IconName } from "@/lib/types";

const icons = {
  Orbit,
  ScanLine,
  Layers,
  Triangle,
  UserCheck,
  TriangleAlert,
  Ghost,
  Bone,
  ThumbsUp,
  ThumbsDown,
  Stethoscope,
  ListChecks,
} satisfies Record<IconName, unknown>;

export function ModuleIcon({ name, ...props }: { name: IconName } & LucideProps) {
  const Icon = icons[name];
  return <Icon aria-hidden {...props} />;
}
