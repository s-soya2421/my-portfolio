import { describe, expect, it } from 'vitest';
import { getAllTags, loadCollection, type ProjectFrontmatter } from '@/lib/content';

describe('content loader', () => {
  it('returns published projects sorted by date', async () => {
    const projects = await loadCollection<ProjectFrontmatter>('projects');
    expect(projects.length).toBeGreaterThan(0);
    const sorted = [...projects]
      .map((project) => (project.date ? new Date(project.date).getTime() : 0))
      .every((value, index, array) => index === 0 || value <= array[index - 1]);
    expect(sorted).toBe(true);
    expect(projects.every((project) => project.draft !== true)).toBe(true);
  });

  it('aggregates unique tags', async () => {
    const tags = await getAllTags();
    const unique = new Set(tags);
    expect(tags.length).toBe(unique.size);
    expect(tags.length).toBeGreaterThan(0);
  });
});
