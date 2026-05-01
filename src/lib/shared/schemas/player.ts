import { z } from "zod";
import {
  CAF_COUNTRIES,
  POSITION_CODES,
  PREFERRED_FEET,
  PLAYER_STATUSES,
} from "@/lib/shared/constants";

const countryCodes = CAF_COUNTRIES.map((c) => c.code) as [string, ...string[]];
const positionCodes = POSITION_CODES as [string, ...string[]];

export const playerSchema = z.object({
  full_name: z.string().min(2).max(200),
  common_name: z.string().max(200).optional().nullable(),
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
    .refine(
      (s) => !Number.isNaN(new Date(s).getTime()),
      "Not a valid date",
    ),
  nationality_code: z.enum(countryCodes, {
    message: "Nationality is required",
  }),
  primary_position_code: z.enum(positionCodes, {
    message: "Primary position is required",
  }),
  secondary_position_codes: z.array(z.enum(positionCodes)).max(3).default([]),
  preferred_foot: z.enum(PREFERRED_FEET).default("unknown"),
  height_cm: z.coerce.number().int().min(140).max(220).optional().nullable(),
  weight_kg: z.coerce.number().int().min(40).max(120).optional().nullable(),
  current_club: z.string().max(200).optional().nullable(),
  current_competition_id: z.string().uuid().optional().nullable(),
  photo_url: z.url().max(500).optional().nullable(),
  bio: z.string().max(5000).optional().nullable(),
  status: z.enum(PLAYER_STATUSES).default("draft"),
});

export type PlayerInput = z.infer<typeof playerSchema>;
