import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PlacementService } from '../services/placement.service';
import { jsPDF } from 'jspdf';
export interface RuleItem {
  num: number;
  title: string;
  desc: string;
}

export interface TimelineStep {
  num: number;
  color: string;
  title: string;
  desc: string;
}

export interface ConductRow {
  action: string;
  policy: string;
  consequence: string;
  type: 'ok' | 'warn' | 'no';
}

export interface BarItem {
  label: string;
  percent: number;
  value: string;
  color: string;
}

export interface NavItem {
  id: string;
  icon: string;
  label: string;
}

export interface StatItem {
  value: string;
  label: string;
  colorClass: string;
}

export interface SummaryRow {
  label: string;
  value: string;
  cls: string;
}

export interface Badge {
  label: string;
  color: string;
}

@Component({
  selector: 'app-placement-rules',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './placement-rules.component.html',
  styleUrls: ['./placement-rules.component.css']
})
export class PlacementRulesComponent implements OnInit {

  constructor(
    private router: Router,
    private placementService: PlacementService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  activeSection = 'eligibility';

  stats: StatItem[] = [
    { value: '28',   label: 'Total Rules',        colorClass: 'sv-blue'   },
    { value: '6',    label: 'Rule Sections',       colorClass: 'sv-green'  },
    { value: '4',    label: 'Interview Stages',    colorClass: 'sv-yellow' },
    { value: '100%', label: 'Transparent Process', colorClass: 'sv-purple' },
  ];

  navItems: NavItem[] = [
    { id: 'eligibility',  icon: '📋', label: 'Eligibility Criteria' },
    { id: 'registration', icon: '📝', label: 'Registration Rules'   },
    { id: 'interview',    icon: '🎯', label: 'Interview Process'     },
    { id: 'conduct',      icon: '🚫', label: 'Code of Conduct'       },
    { id: 'offer',        icon: '📄', label: 'Offer & Joining'       },
    { id: 'faq',          icon: '❓', label: 'FAQ'                   },
  ];

  eligibilityRules: RuleItem[]  = [];
  eligibilityBadges: Badge[]    = [];
  registrationLeft: RuleItem[]  = [];
  registrationRight: RuleItem[] = [];
  offerRules: RuleItem[]        = [];
  offerBadges: Badge[]          = [];

  timelineSteps: TimelineStep[] = [];

  conductRows: ConductRow[] = [
    { action: 'Using unfair means in test',      policy: 'Strictly Prohibited',     consequence: 'Permanent Ban',      type: 'no'   },
    { action: 'No-show for confirmed interview', policy: 'Must inform 24hrs prior',  consequence: '1 Round Penalty',   type: 'warn' },
    { action: 'Revoking accepted offer',         policy: 'Allowed once only',        consequence: 'Warning Issued',    type: 'warn' },
    { action: 'Multiple offer acceptance',       policy: 'Not Allowed',              consequence: 'Disqualification',  type: 'no'   },
    { action: 'Professional communication',      policy: 'Mandatory always',         consequence: 'No Penalty',        type: 'ok'   },
    { action: 'Dress code compliance',           policy: 'Formal attire required',   consequence: 'May be turned away', type: 'warn' },
  ];

  summaryRows: SummaryRow[] = [
    { label: 'Total Sections',   value: '6',              cls: 'blue'   },
    { label: 'Total Rules',      value: '28',             cls: 'blue'   },
    { label: 'Min. CGPA',        value: '6.0 / 60%',     cls: 'green'  },
    { label: 'Backlogs Allowed', value: 'None',           cls: 'red'    },
    { label: 'Max Gap Allowed',  value: '1 Year',         cls: 'yellow' },
    { label: 'Age Limit',        value: '18 – 27 Yrs',   cls: ''       },
    { label: 'Offer Acceptance', value: '5 Working Days', cls: 'yellow' },
    { label: 'Last Updated',     value: 'Jan 2025',       cls: ''       },
  ];

  complianceBars: BarItem[] = [
    { label: 'Eligibility',  percent: 100, value: '100%', color: 'blue'   },
    { label: 'Registration', percent: 90,  value: '90%',  color: 'green'  },
    { label: 'Interview',    percent: 85,  value: '85%',  color: 'yellow' },
    { label: 'Conduct',      percent: 95,  value: '95%',  color: 'purple' },
    { label: 'Offer Rules',  percent: 80,  value: '80%',  color: 'red'    },
  ];

  private tlColors = ['blue', 'green', 'yellow', 'purple'];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.placementService.getAllRules().subscribe({
        next: (res: any) => {
          res.rules.forEach((section: any) => {

            if (section.section === 'eligibility') {
              this.eligibilityRules  = section.rules  || [];
              this.eligibilityBadges = section.badges || [];
            }

            if (section.section === 'registration') {
              const rules = section.rules || [];
              const mid = Math.ceil(rules.length / 2);
              this.registrationLeft  = rules.slice(0, mid);
              this.registrationRight = rules.slice(mid);
            }

            if (section.section === 'interview') {
              this.timelineSteps = (section.rules || []).map((r: any, i: number) => ({
                num:   r.num,
                color: this.tlColors[i % this.tlColors.length],
                title: r.title,
                desc:  r.desc
              }));
            }

            if (section.section === 'offer') {
              this.offerRules  = section.rules  || [];
              this.offerBadges = section.badges || [];
            }

          });
        },
        error: (err: any) => {
          console.error('Could not load placement rules:', err);
        }
      });
    }
  }

  setActive(id: string): void {
    this.activeSection = id;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  goToJobs(): void { this.router.navigate(['/jobs']); }
  goToFaq(): void  { this.router.navigate(['/faq']);  }
}