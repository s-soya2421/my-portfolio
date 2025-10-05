import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { ProjectFrontmatter } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const ProjectCard = ({ project }: { project: ProjectFrontmatter & { slug: string } }) => {
  const metrics = project.impact_metrics ? Object.entries(project.impact_metrics) : [];

  return (
    <Card className="group flex h-full flex-col overflow-hidden">
      {project.cover ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={project.cover}
            alt={project.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority={false}
          />
        </div>
      ) : null}
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-xl font-semibold">
              <Link href={`/projects/${project.slug}`}>{project.title}</Link>
            </CardTitle>
            <CardDescription className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                {project.role}
              </span>
            </CardDescription>
          </div>
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition hover:text-primary"
            aria-label={`${project.title} 詳細を見る`}
          >
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <p className="text-sm text-muted-foreground md:text-base">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="outline" className="border-border/80">
              {tag}
            </Badge>
          ))}
        </div>
        {metrics.length ? (
          <div className="grid grid-cols-2 gap-3 text-xs md:text-sm">
            {metrics.map(([label, value]) => (
              <div
                key={label}
                className={cn('rounded-2xl border border-border/60 bg-muted/40 px-3 py-2 text-muted-foreground')}
              >
                <p className="font-semibold text-foreground">{value}</p>
                <p className="text-xs capitalize">{label.replace(/_/g, ' ')}</p>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {project.tech.slice(0, 6).map((tech) => (
            <span key={tech} className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-3 text-sm font-medium">
          {project.links?.demo ? (
            <Link href={project.links.demo} target="_blank" rel="noopener noreferrer" className="text-primary">
              Demo
            </Link>
          ) : null}
          {project.links?.repo ? (
            <Link href={project.links.repo} target="_blank" rel="noopener noreferrer" className="text-primary">
              Repo
            </Link>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
};
