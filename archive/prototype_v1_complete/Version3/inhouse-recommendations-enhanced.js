/**
 * Enhanced In-House Marketing Recommendations Engine
 * Version 3.0 - Market Insights & Transformation Focus
 * 
 * Uses real market data for benchmarking
 * Provides genuine, actionable value
 * Natural progression to consulting
 */

class InhouseRecommendationsEngineV3 {
    constructor(assessmentData) {
        this.assessment = assessmentData;
        
        // Market insights from research
        this.marketInsights = {
            adoption: {
                2023: { overall: 55, marketing: 71 },
                2024: { overall: 78, marketing: 87 }
            },
            productivity: {
                contentCreation: { avg: 50, top: 70 }, // % time saved
                reporting: { avg: 70, top: 85 },
                emailMarketing: { avg: 40, top: 60 },
                socialMedia: { avg: 45, top: 65 }
            },
            transformation: {
                small: { timeline: "3-6 months", budget: "£200-500/month" },
                medium: { timeline: "6-9 months", budget: "£500-2000/month" },
                large: { timeline: "9-12 months", budget: "£2000-5000/month" }
            },
            roi: {
                quickWins: "30-60 days",
                fullValue: "90-120 days",
                multiplier: "5-15x within 6 months"
            }
        };
    }
    
    /**
     * Generate comprehensive recommendations with market context
     */
    generateRecommendations(scores, responses) {
        const companySize = responses.companySize || 'small';
        const selectedActivities = responses.selectedActivities || [];
        
        return {
            executiveSummary: this.generateExecutiveSummary(scores, responses),
            marketPosition: this.analyzeMarketPosition(scores, companySize),
            transformationOpportunities: this.identifyOpportunities(scores, responses),
            quickWins: this.generateQuickWins(scores, responses, selectedActivities),
            strategicRoadmap: this.buildRoadmap(scores, responses),
            teamReadiness: this.assessTeamReadiness(scores, responses),
            implementationPath: this.createImplementationPath(scores, responses),
            expectedOutcomes: this.projectOutcomes(scores, companySize, selectedActivities),
            nextSteps: this.defineNextSteps(scores, responses)
        };
    }
    
    /**
     * Executive summary with peer context
     */
    generateExecutiveSummary(scores, responses) {
        const size = responses.companySize || 'small';
        const overallScore = scores.overall || 0;
        
        // Position relative to market
        const marketAvg = this.getMarketAverage(size);
        const position = overallScore > marketAvg ? 'ahead' : 'behind';
        const gap = Math.abs(overallScore - marketAvg);
        
        // Key insight based on biggest gap
        const biggestGap = this.findBiggestGap(scores);
        
        return {
            headline: this.getHeadline(overallScore, position),
            marketContext: `You're ${gap} points ${position} similar ${size} marketing teams. ${this.marketInsights.adoption[2024].marketing}% are actively adopting AI.`,
            criticalInsight: this.getCriticalInsight(biggestGap, responses),
            bottomLine: this.getBottomLine(scores, responses)
        };
    }
    
    /**
     * Analyze position relative to market
     */
    analyzeMarketPosition(scores, companySize) {
        const benchmarks = {
            solo: { bottom: 25, average: 40, top: 65 },
            small: { bottom: 35, average: 50, top: 75 },
            medium: { bottom: 45, average: 60, top: 85 }
        };
        
        const benchmark = benchmarks[companySize] || benchmarks.small;
        const score = scores.overall;
        
        let quartile, message, implication;
        
        if (score >= benchmark.top) {
            quartile = "Top 25%";
            message = "You're ahead of the curve";
            implication = "Focus on extending your lead and becoming a case study";
        } else if (score >= benchmark.average) {
            quartile = "Above Average";
            message = "You're keeping pace";
            implication = "Key opportunities to jump ahead of competitors";
        } else if (score >= benchmark.bottom) {
            quartile = "Below Average";
            message = "You're falling behind";
            implication = "Urgent action needed to avoid disruption";
        } else {
            quartile = "Bottom 25%";
            message = "Critical gap emerging";
            implication = "Immediate transformation required";
        }
        
        return {
            quartile,
            message,
            implication,
            competitorActions: this.getCompetitorInsights(quartile),
            timeToAct: this.getUrgency(score, benchmark.average)
        };
    }
    
    /**
     * Identify specific transformation opportunities
     */
    identifyOpportunities(scores, responses) {
        const opportunities = [];
        
        // Human readiness opportunities
        if (scores.dimensions.humanReadiness < 50) {
            opportunities.push({
                area: "Team Transformation",
                insight: "Your team shows signs of change readiness but lacks direction",
                data: "Teams with AI champions are 3x more likely to succeed",
                action: "Identify and empower an AI champion within your existing team"
            });
        }
        
        // Process opportunities
        if (scores.dimensions.technicalReadiness < 60) {
            opportunities.push({
                area: "Process Evolution",
                insight: "Your processes can be dramatically streamlined",
                data: `${this.marketInsights.productivity.reporting.avg}% time savings in reporting alone`,
                action: "Start with your most repetitive weekly task"
            });
        }
        
        // Activity-specific opportunities
        const activityOps = this.analyzeActivityOpportunities(responses.activityScores);
        opportunities.push(...activityOps);
        
        return opportunities;
    }
    
    /**
     * Generate quick wins based on specific gaps
     */
    generateQuickWins(scores, responses, activities) {
        const wins = [];
        const companySize = responses.companySize || 'small';
        
        // Always start with easiest, highest-impact win
        if (activities.includes('content_marketing') && responses.activityScores?.content_marketing < 50) {
            wins.push({
                title: "Transform Your Content Creation Today",
                why: "Based on your responses, content creation is consuming significant time",
                how: "Start using AI for first drafts - same quality, 70% time savings",
                specificAction: "Tomorrow: Write your next blog post with Claude or ChatGPT",
                expectedResult: "Save 2-3 hours per piece while maintaining your brand voice",
                marketContext: "84% of marketing teams already use AI for content",
                investment: "Free to start, £20/month for pro features"
            });
        }
        
        // Champion identification
        if (responses.questions?.champion_identification < 3) {
            wins.push({
                title: "Identify Your AI Champion",
                why: "Someone on your team is already curious about AI",
                how: "Ask 'Who wants to experiment with AI for a week?'",
                specificAction: "Give them 2 hours this week to explore and report back",
                expectedResult: "Natural leader emerges to drive adoption",
                marketContext: "72% of successful transformations start with an internal champion",
                investment: "Just time - no budget needed"
            });
        }
        
        // Tool consolidation
        if (responses.questions?.tech_complexity === 1) { // Too many tools
            wins.push({
                title: "AI-Powered Tool Consolidation",
                why: "You mentioned using 20+ tools - AI can replace 5-10 of them",
                how: "Map your tools to AI alternatives that do multiple jobs",
                specificAction: "List your tools and identify overlap this week",
                expectedResult: "Reduce tool overhead by 40% while improving capability",
                marketContext: "Leading teams use 50% fewer tools with AI",
                investment: "Likely save money overall"
            });
        }
        
        // Activity-specific wins
        const activityWins = this.generateActivityQuickWins(responses.activityScores, companySize);
        wins.push(...activityWins.slice(0, 2)); // Max 2 activity wins
        
        return wins.slice(0, 4); // Return top 4 quick wins
    }
    
    /**
     * Build strategic roadmap
     */
    buildRoadmap(scores, responses) {
        const companySize = responses.companySize || 'small';
        const timeline = this.marketInsights.transformation[companySize].timeline;
        
        return {
            overview: `Your ${timeline} transformation journey`,
            phase1: {
                name: "Foundation (Days 1-30)",
                focus: "Quick wins and champion development",
                actions: [
                    "Implement 2-3 quick wins",
                    "Identify AI champion(s)",
                    "Document current processes",
                    "Start measurement baseline"
                ],
                expectedOutcome: "20-30% time savings, team buy-in"
            },
            phase2: {
                name: "Acceleration (Days 31-60)",
                focus: "Scale successful experiments",
                actions: [
                    "Roll out AI tools to full team",
                    "Establish quality guidelines",
                    "Connect AI tools to workflow",
                    "Share early wins internally"
                ],
                expectedOutcome: "40-50% productivity gain"
            },
            phase3: {
                name: "Transformation (Days 61-90)",
                focus: "Embed AI as competitive advantage",
                actions: [
                    "Optimize all core activities",
                    "Develop team expertise",
                    "Create new AI-enabled services",
                    "Measure and showcase ROI"
                ],
                expectedOutcome: "2-3x output, new capabilities"
            },
            investmentGuide: this.marketInsights.transformation[companySize].budget
        };
    }
    
    /**
     * Assess team readiness with specific insights
     */
    assessTeamReadiness(scores, responses) {
        const strengths = [];
        const gaps = [];
        const recommendations = [];
        
        // Identify strengths
        if (responses.questions?.knowledge_sharing >= 3) {
            strengths.push({
                area: "Knowledge Sharing Culture",
                insight: "Your team already shares learnings - critical for AI success",
                leverage: "Build on this with AI experiment sharing sessions"
            });
        }
        
        if (responses.questions?.experimentation_culture >= 3) {
            strengths.push({
                area: "Innovation Mindset",
                insight: "Failure tolerance exists - essential for AI adoption",
                leverage: "Frame AI as experiments with learning goals"
            });
        }
        
        // Identify gaps
        if (responses.questions?.process_documentation < 2) {
            gaps.push({
                area: "Process Documentation",
                insight: "Undocumented processes are hard to improve with AI",
                fix: "Spend 1 hour documenting your top 3 workflows",
                impact: "3x faster AI implementation with clear processes"
            });
        }
        
        if (responses.questions?.leadership_ai_attitude < 3) {
            gaps.push({
                area: "Leadership Buy-in",
                insight: "Leadership skepticism can kill transformation",
                fix: "Show them competitor examples and ROI projections",
                impact: "Executive support accelerates adoption by 5x"
            });
        }
        
        // Generate specific recommendations
        if (scores.dimensions.humanReadiness < 60) {
            recommendations.push(
                "Start with volunteers - forced adoption fails",
                "Celebrate learning over perfection",
                "Share wins weekly to build momentum"
            );
        }
        
        return { strengths, gaps, recommendations, overallReadiness: this.calculateReadiness(scores) };
    }
    
    /**
     * Create specific implementation path
     */
    createImplementationPath(scores, responses) {
        const companySize = responses.companySize || 'small';
        const budget = this.marketInsights.transformation[companySize].budget;
        
        return {
            week1: {
                title: "Proof of Concept",
                actions: [
                    "Try one AI tool for your biggest pain point",
                    "Track time saved meticulously",
                    "Document what worked/didn't"
                ],
                tools: this.recommendTools(responses, 'free'),
                success: "One clear win to share with team"
            },
            week2_4: {
                title: "Expand and Learn",
                actions: [
                    "Add 2-3 more AI applications",
                    "Involve eager team members",
                    "Create simple guidelines"
                ],
                tools: this.recommendTools(responses, 'basic'),
                success: "Multiple team members seeing benefits"
            },
            month2: {
                title: "Systematic Implementation",
                actions: [
                    "Roll out across priority activities",
                    "Establish quality processes",
                    "Connect tools to workflow"
                ],
                tools: this.recommendTools(responses, 'standard'),
                success: "AI embedded in daily work"
            },
            month3: {
                title: "Optimization and Scale",
                actions: [
                    "Refine what's working",
                    "Explore advanced applications",
                    "Train others in organization"
                ],
                tools: this.recommendTools(responses, 'advanced'),
                success: "Clear competitive advantage"
            },
            budget: budget,
            warning: "Don't try to do everything at once - sustainable change beats rapid failure"
        };
    }
    
    /**
     * Project expected outcomes with data
     */
    projectOutcomes(scores, companySize, activities) {
        const baseline = this.calculateBaseline(companySize);
        
        // Time savings by activity
        const timeSavings = {};
        activities.forEach(activity => {
            const savings = this.marketInsights.productivity[activity] || { avg: 40 };
            timeSavings[activity] = savings.avg;
        });
        
        // Calculate total impact
        const avgSaving = Object.values(timeSavings).reduce((a, b) => a + b, 0) / Object.values(timeSavings).length;
        const hoursPerWeek = baseline.teamHours;
        const hoursSaved = Math.round(hoursPerWeek * (avgSaving / 100));
        
        return {
            headline: `Save ${hoursSaved} hours weekly (${Math.round(avgSaving)}% productivity gain)`,
            details: {
                timeSavings: `${hoursSaved} hours/week = ${hoursSaved * 4} hours/month`,
                outputIncrease: "2-3x content volume at same quality",
                costAvoidance: `£${hoursSaved * 50 * 4}/month in equivalent hiring costs`,
                newCapabilities: [
                    "Personalization at scale",
                    "Predictive analytics",
                    "Always-on optimization"
                ]
            },
            timeline: {
                month1: "20-30% productivity gain",
                month3: "50-70% productivity gain", 
                month6: "2-3x overall output"
            },
            marketContext: `Top performers achieve ${avgSaving + 20}% productivity gains`,
            roi: `Typical ROI: ${this.marketInsights.roi.multiplier}`
        };
    }
    
    /**
     * Define clear next steps
     */
    defineNextSteps(scores, responses) {
        const urgency = this.calculateUrgency(scores);
        
        return {
            immediate: {
                today: "Share this report with your team",
                tomorrow: "Try one AI tool for 30 minutes",
                thisWeek: "Identify your AI champion",
                reasoning: "Small actions build momentum"
            },
            shortTerm: {
                week2: "Run your first AI experiment",
                week3: "Measure and share results",
                week4: "Plan broader rollout",
                reasoning: "Prove value before scaling"
            },
            strategic: {
                month2: "Implement across priority areas",
                month3: "Develop team capabilities",
                ongoing: "Continuous optimization",
                reasoning: "Sustainable transformation"
            },
            callToAction: {
                primary: "Ready to accelerate this journey?",
                value: "Get your personalized 90-day QuickMap.ai roadmap",
                urgency: urgency.message,
                cta: "Book Your QuickMap Session"
            }
        };
    }
    
    // Helper methods
    
    getMarketAverage(size) {
        const averages = { solo: 40, small: 50, medium: 60, large: 70 };
        return averages[size] || 50;
    }
    
    findBiggestGap(scores) {
        const dimensions = scores.dimensions || {};
        let biggest = { dimension: null, gap: 0 };
        
        Object.entries(dimensions).forEach(([dim, score]) => {
            const gap = 100 - score;
            if (gap > biggest.gap) {
                biggest = { dimension: dim, gap, score };
            }
        });
        
        return biggest;
    }
    
    getHeadline(score, position) {
        if (score >= 70) return "You're ahead of the curve - let's extend your lead";
        if (score >= 50) return "You have key pieces in place - time to connect them";
        if (score >= 30) return "Significant opportunity to leapfrog competitors";
        return "Urgent transformation needed to avoid disruption";
    }
    
    getCriticalInsight(biggestGap, responses) {
        const insights = {
            humanReadiness: "Your team is ready but lacks tools and direction",
            technicalReadiness: "You have tools but need to connect them strategically",
            activityAutomation: "Your activities are ripe for AI transformation"
        };
        
        return insights[biggestGap.dimension] || "Multiple opportunities for quick improvement";
    }
    
    getBottomLine(scores, responses) {
        const size = responses.companySize || 'small';
        const potential = this.calculatePotential(scores, size);
        
        return `With focused effort over ${this.marketInsights.transformation[size].timeline}, 
                you could save ${potential.hours} hours weekly while ${potential.outcome}. 
                Investment required: ${this.marketInsights.transformation[size].budget}.`;
    }
    
    analyzeActivityOpportunities(activityScores) {
        const opportunities = [];
        
        Object.entries(activityScores || {}).forEach(([activity, score]) => {
            if (score < 50) {
                const insight = this.getActivityInsight(activity);
                opportunities.push({
                    area: this.formatActivityName(activity),
                    insight: insight.problem,
                    data: insight.benchmark,
                    action: insight.action
                });
            }
        });
        
        return opportunities;
    }
    
    getActivityInsight(activity) {
        const insights = {
            content_marketing: {
                problem: "Content creation is your biggest time sink",
                benchmark: "AI users create 3.5x more content in 70% less time",
                action: "Start with AI-assisted blog writing this week"
            },
            email_marketing: {
                problem: "Email campaigns take too long to produce",
                benchmark: "41% higher click rates with AI personalization",
                action: "Use AI for subject lines and personalization"
            },
            social_media: {
                problem: "Social media is overwhelming your team",
                benchmark: "60% time savings with AI scheduling and creation",
                action: "Automate post creation and scheduling"
            },
            analytics_data: {
                problem: "Reporting eats up valuable strategic time",
                benchmark: "85% reduction in reporting time with AI",
                action: "Implement automated reporting dashboards"
            }
        };
        
        return insights[activity] || {
            problem: "This area has optimization potential",
            benchmark: "40-60% improvement possible",
            action: "Assess current process for AI opportunities"
        };
    }
    
    recommendTools(responses, tier) {
        const tools = {
            free: ["ChatGPT (Free)", "Canva (Free)", "Google's AI tools"],
            basic: ["ChatGPT Plus (£20/mo)", "Buffer (£15/mo)", "Grammarly (£12/mo)"],
            standard: ["Claude Pro (£20/mo)", "Jasper (£39/mo)", "Surfer SEO (£89/mo)"],
            advanced: ["HubSpot (£45/mo)", "Synthesia (£29/mo)", "AgencyAnalytics (£49/mo)"]
        };
        
        // Customize based on activities
        const priorityTools = [];
        const activities = responses.selectedActivities || [];
        
        if (activities.includes('content_marketing')) {
            priorityTools.push(tier === 'free' ? "ChatGPT (Free)" : "Claude Pro (£20/mo)");
        }
        if (activities.includes('social_media')) {
            priorityTools.push(tier === 'free' ? "Canva (Free)" : "Buffer (£15/mo)");
        }
        
        return priorityTools.length > 0 ? priorityTools : tools[tier];
    }
    
    calculateBaseline(companySize) {
        const baselines = {
            solo: { teamSize: 1, teamHours: 50 },
            small: { teamSize: 3, teamHours: 120 },
            medium: { teamSize: 8, teamHours: 320 },
            large: { teamSize: 20, teamHours: 800 }
        };
        
        return baselines[companySize] || baselines.small;
    }
    
    calculatePotential(scores, size) {
        const baseline = this.calculateBaseline(size);
        const improvementPotential = (100 - scores.overall) / 100;
        const hours = Math.round(baseline.teamHours * improvementPotential * 0.4); // 40% is realistic
        
        const outcomes = {
            solo: "competing with larger teams",
            small: "doubling your output without hiring",
            medium: "becoming a marketing powerhouse",
            large: "setting industry benchmarks"
        };
        
        return { hours, outcome: outcomes[size] };
    }
    
    calculateUrgency(scores) {
        if (scores.overall < 30) {
            return { 
                level: "critical",
                message: "Your competitors are pulling ahead daily"
            };
        } else if (scores.overall < 50) {
            return {
                level: "high",
                message: "The window for easy gains is closing"
            };
        } else if (scores.overall < 70) {
            return {
                level: "moderate", 
                message: "Good foundation - time to accelerate"
            };
        }
        return {
            level: "low",
            message: "Stay ahead by continuous innovation"
        };
    }
    
    formatActivityName(activity) {
        const names = {
            content_marketing: "Content Marketing",
            email_marketing: "Email Marketing",
            social_media: "Social Media",
            seo_sem: "Search Marketing",
            analytics_data: "Analytics & Reporting",
            paid_advertising: "Paid Advertising",
            creative_design: "Creative & Design"
        };
        return names[activity] || activity;
    }
    
    generateActivityQuickWins(activityScores, companySize) {
        const wins = [];
        
        Object.entries(activityScores || {}).forEach(([activity, score]) => {
            if (score < 40) {
                const win = this.getActivityQuickWin(activity, companySize);
                if (win) wins.push(win);
            }
        });
        
        return wins;
    }
    
    getActivityQuickWin(activity, companySize) {
        const quickWins = {
            content_marketing: {
                title: "AI Content Assembly Line",
                why: "You're spending too much time on content creation",
                how: "Research → AI Draft → Human Edit → Publish",
                specificAction: "Create your next blog in 45 minutes instead of 3 hours",
                expectedResult: "70% time savings, same quality",
                marketContext: "Leading teams produce 3.5x more content with AI"
            },
            social_media: {
                title: "Social Media Content Multiplication",
                why: "One piece of content should become 10 social posts",
                how: "Use AI to adapt content across platforms",
                specificAction: "Turn your next blog into 15 social posts in 20 minutes",
                expectedResult: "10x social output, consistent posting", 
                marketContext: "Top teams post 5x more with 50% less effort"
            }
        };
        
        return quickWins[activity];
    }
    
    calculateReadiness(scores) {
        const overall = scores.overall || 0;
        
        if (overall >= 70) return "High - Ready to accelerate";
        if (overall >= 50) return "Moderate - Foundation in place";
        if (overall >= 30) return "Developing - Clear path forward";
        return "Early Stage - Significant opportunity";
    }
    
    getCompetitorInsights(quartile) {
        const insights = {
            "Top 25%": "Competitors are looking to you for inspiration - stay ahead",
            "Above Average": "Fast followers are adopting your successful practices",
            "Below Average": "Competitors are pulling ahead with AI-powered efficiency",
            "Bottom 25%": "Risk of losing key clients to AI-enabled competitors"
        };
        
        return insights[quartile] || "Monitor competitor AI adoption closely";
    }
    
    getUrgency(score, average) {
        const gap = average - score;
        
        if (gap > 20) return "Act within 30 days to avoid irreversible gap";
        if (gap > 10) return "3-month window to catch up";
        if (gap > 0) return "6 months to establish leadership";
        return "Maintain momentum to stay ahead";
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InhouseRecommendationsEngineV3;
}