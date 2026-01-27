/// <reference types="astro/client" />

import type { Role } from '@/types/role';

declare global {
  namespace App {
    interface Locals {
      role: Role;
    }
  }
}
