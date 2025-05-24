import type { SnipkitDecision } from "snipkit:client";

declare global {
  declare namespace App {
    interface Locals {
      decision?: SnipkitDecision;
    }
  }
}
