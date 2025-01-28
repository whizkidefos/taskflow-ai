'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, BriefcaseIcon, MapPinIcon, DollarSignIcon } from 'lucide-react';

interface Job {
  job_id: string;
  employer_name: string;
  job_title: string;
  job_description: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_employment_type: string;
  job_salary_currency: string;
  job_salary_min: number;
  job_salary_max: number;
  job_apply_link: string;
  job_posted_at_timestamp: number;
}

export function JobsBoard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      const response = await fetch('/api/jobs');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch jobs');
      }
      const data = await response.json();
      setJobs(data);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      setError(error.message || 'Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const formatSalary = (min: number, max: number, currency: string) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    });

    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    } else if (min) {
      return `${formatter.format(min)}+`;
    } else if (max) {
      return `Up to ${formatter.format(max)}`;
    }
    return 'Salary not specified';
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading jobs...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <div className="text-lg font-medium">{error}</div>
          <Button onClick={() => {
            setLoading(true);
            fetchJobs();
          }}>
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Top Paying Jobs</h2>
      
      {jobs.map((job) => (
        <Card
          key={job.job_id}
          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setSelectedJob(job)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{job.job_title}</h3>
              <p className="text-muted-foreground">{job.employer_name}</p>
              
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-sm">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>
                    {job.job_city}, {job.job_state}, {job.job_country}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <BriefcaseIcon className="h-4 w-4 mr-1" />
                  <span>{job.job_employment_type}</span>
                </div>
              </div>

              <div className="mt-2">
                <Badge variant="secondary" className="mr-2">
                  <DollarSignIcon className="h-3 w-3 mr-1" />
                  {formatSalary(
                    job.job_salary_min,
                    job.job_salary_max,
                    job.job_salary_currency
                  )}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      ))}

      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedJob?.job_title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Company</h4>
              <p>{selectedJob?.employer_name}</p>
            </div>

            <div>
              <h4 className="font-semibold">Location</h4>
              <p>
                {selectedJob?.job_city}, {selectedJob?.job_state},{' '}
                {selectedJob?.job_country}
              </p>
            </div>

            <div>
              <h4 className="font-semibold">Salary</h4>
              <p>
                {selectedJob &&
                  formatSalary(
                    selectedJob.job_salary_min,
                    selectedJob.job_salary_max,
                    selectedJob.job_salary_currency
                  )}
              </p>
            </div>

            <div>
              <h4 className="font-semibold">Description</h4>
              <p className="whitespace-pre-wrap">{selectedJob?.job_description}</p>
            </div>

            <Button
              className="w-full"
              onClick={() => {
                if (selectedJob?.job_apply_link) {
                  window.open(selectedJob.job_apply_link, '_blank');
                }
              }}
            >
              Apply Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
