import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { resumeSchema, type ResumeContent } from '../schemas/resume';

const resumeFilePath = path.resolve(process.cwd(), 'content/resume.yml');

function formatError(pathParts: (string | number)[], message: string): string {
  const pathString = pathParts.length ? pathParts.join('.') : 'root';
  return `- ${pathString}: ${message}`;
}

export function loadResume(): ResumeContent {
  const raw = fs.readFileSync(resumeFilePath, 'utf-8');
  const parsed = parse(raw);
  const validated = resumeSchema.safeParse(parsed);

  if (!validated.success) {
    const details = validated.error.issues
      .map((issue) => formatError(issue.path, issue.message))
      .join('\n');
    throw new Error(`Invalid resume YAML at ${resumeFilePath}:\n${details}`);
  }

  return validated.data;
}
