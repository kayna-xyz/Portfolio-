import type { Slide } from "../types"
import Cover from "./Cover"
import Agenda from "./Agenda"
import Bio from "./Bio"
import Principles from "./Principles"
import CompanyIntro from "./CompanyIntro"
import Role from "./Role"
import Problem from "./Problem"
import Final from "./Final"
import Explorations from "./Explorations"
import Results from "./Results"
import CaseTakeaway from "./CaseTakeaway"
import BuildIntro from "./BuildIntro"
import BuildArtifact from "./BuildArtifact"
import BuildDecision from "./BuildDecision"
import BuildJudgment from "./BuildJudgment"
import BuildSynthesis from "./BuildSynthesis"
import Fit from "./Fit"
import Closing from "./Closing"
import Fallback from "./Fallback"

// One component per archetype (all 18). Fallback remains as a safety net for
// any archetype string that loses its mapping.
/* eslint-disable @typescript-eslint/no-explicit-any */
const MAP: Partial<Record<Slide["archetype"], (p: { slide: any }) => React.ReactNode>> = {
  Cover,
  Agenda,
  Bio,
  Principles,
  CompanyIntro,
  Role,
  Problem,
  Final,
  Explorations,
  Results,
  CaseTakeaway,
  BuildIntro,
  BuildArtifact,
  BuildDecision,
  BuildJudgment,
  BuildSynthesis,
  Fit,
  Closing,
}

export function renderSlide(slide: Slide) {
  const C = MAP[slide.archetype]
  if (!C) return <Fallback slide={slide} />
  return <C slide={slide} />
}
