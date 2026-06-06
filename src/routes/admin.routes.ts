import { Router,Request,Response } from 'express' ;
const router = require('express').Router();

router.get('/stats', (req : Request, res : Response) => {
  res.json({
    totalJobs: 1200,
    totalCompanies: 530,
    totalCandidates: 3400,
    totalApplications: 47800
  });
});

router.get('/recent-jobs', (req : Request, res : Response) => {
  res.json([
    { title: 'Frontend Developer', company: 'ABC Tech' },
    { title: 'Digital Marketer', company: 'XYZ Marketing' }
  ]);
});

router.get('/recent-applications', (req : Request, res : Response) => {
  res.json([
    { name: 'Sarah Jones', job: 'Project Manager' },
    { name: 'Mark Wilson', job: 'Graphic Designer' }
  ]);
});

module.exports = router;