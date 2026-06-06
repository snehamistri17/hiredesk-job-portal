export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  additionalName?: string;
  profileImage?: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  profileCompletion: number;
  readyScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Education {
  id?: string;
  schoolName: string;
  collegeName?: string;
  location: string;
  city: string;
  contactInfo?: string;
  email?: string;
  dateAdded?: Date;
}

export interface Experience {
  id?: string;
  jobTitle: string;
  employmentType: 'full-time' | 'part-time' | 'self-employed' | 'freelance' | 'internship' | 'trainee';
  companyName: string;
  organization: string;
  startDate: Date;
  endDate?: Date;
  isCurrentlyWorking: boolean;
  location: string;
  description?: string;
}

export interface Skill {
  id?: string;
  name: string;
  category: 'soft-skills' | 'technical-skills' | 'engineering';
  description?: string;
  isDeleted?: boolean;
}

export interface Application {
  id?: string;
  userId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  status: 'under-review' | 'shortlisted' | 'rejected' | 'interview-scheduled';
  appliedDate: Date;
  updatedDate?: Date;
}

export interface Job {
  id?: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  employmentType: string;
  matchPercentage?: number;
  description?: string;
  postedDate: Date;
}

export interface DashboardStats {
  readyScore: number;
  profileCompletion: number;
  totalApplications: number;
  shortlisted: number;
  underReview: number;
  rejected: number;
  interviewScheduled: number;
}
