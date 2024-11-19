import {
  valid as validOriginal,
  invalid as invalidOriginal,
  // Slight technical debt, we can build our own tester at some point
} from "@denis-sokolov/eslint-plugin/dist/tester";
import { type RuleDefinition } from "../../eslint";

export function invalid(rule: RuleDefinition, name: string, code: string) {
  // Rule types slightly differ, but it’s fine, since we’ll detect any issues with unit tests
  invalidOriginal(name, rule as never, code);
}

export function valid(rule: RuleDefinition, name: string, code: string) {
  // Rule types slightly differ, but it’s fine, since we’ll detect any issues with unit tests
  validOriginal(name, rule as never, code);
}
