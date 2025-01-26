'use client';

import { Card } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

interface Job {
  title: string;
  salary: string;
  growth: string;
  description: string;
}

const topJobs: Job[] = [
  {
    title: 'Software Architect',
    salary: '$170,000 - $200,000',
    growth: '25%',
    description: 'Design and oversee complex software systems architecture'
  },
  {
    title: 'Machine Learning Engineer',
    salary: '$150,000 - $180,000',
    growth: '40%',
    description: 'Develop AI and machine learning models and systems'
  },
  {
    title: 'Cloud Solutions Architect',
    salary: '$160,000 - $190,000',
    growth: '35%',
    description: 'Design and implement cloud infrastructure solutions'
  },
  {
    title: 'Data Scientist',
    salary: '$140,000 - $170,000',
    growth: '30%',
    description: 'Analyze complex data sets to drive business decisions'
  },
  {
    title: 'DevOps Engineer',
    salary: '$130,000 - $160,000',
    growth: '28%',
    description: 'Implement and manage CI/CD pipelines and infrastructure'
  }
];

export function TopJobs() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Top Paying Tech Jobs 2024</h2>
      </div>
      <div className="grid gap-4">
        {topJobs.map((job, index) => (
          <div
            key={job.title}
            className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
              {index + 1}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{job.title}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                <span className="font-medium text-primary">{job.salary}</span>
                <span className="text-green-500">+{job.growth} Growth</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{job.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}