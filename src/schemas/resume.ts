import { z } from 'zod';

const monthLike = /^\d{4}(-\d{2})?$/;
const isoOrPresent = /^\d{4}(-\d{2})?$|^Present$/;

const linkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url()
});

export const resumeSchema = z.object({
  profile: z.object({
    name: z.string().min(1),
    title: z.string().min(1),
    location: z.string().min(1),
    email: z.string().email().optional(),
    phone: z.string().min(1).optional()
  }),
  summary: z.string().min(1),
  experience: z.array(
    z.object({
      company: z.string().min(1),
      role: z.string().min(1),
      location: z.string().min(1),
      startDate: z.string().regex(monthLike, 'Use YYYY or YYYY-MM format'),
      endDate: z.string().regex(isoOrPresent, 'Use YYYY, YYYY-MM, or Present'),
      highlights: z.array(z.string().min(1)).min(1)
    })
  ),
  education: z.array(
    z.object({
      institution: z.string().min(1),
      degree: z.string().min(1),
      startDate: z.string().regex(monthLike, 'Use YYYY or YYYY-MM format'),
      endDate: z.string().regex(monthLike, 'Use YYYY or YYYY-MM format')
    })
  ),
  projects: z.array(
    z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      links: z.array(linkSchema).optional()
    })
  ),
  skills: z.array(
    z.object({
      category: z.string().min(1),
      items: z.array(z.string().min(1)).min(1)
    })
  ),
  certifications: z.array(
    z.object({
      name: z.string().min(1),
      issuer: z.string().min(1),
      year: z.string().regex(/^\d{4}$/, 'Use YYYY format')
    })
  ),
  links: z.array(linkSchema)
});

export type ResumeContent = z.infer<typeof resumeSchema>;
