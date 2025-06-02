export class ReportGenerator {
    constructor(config = {}) {
        this.config = config;
    }

    generateReport(scores, recommendations, metadata, assessmentType = 'agency') {
        const reportData = {
            executive: this.generateExecutiveSummary(scores, recommendations, metadata, assessmentType),
            readiness: this.generateReadinessSection(scores, assessmentType),
            opportunities: this.generateOpportunitiesSection(scores, recommendations, assessmentType),
            roadmap: this.generateRoadmapSection(recommendations, assessmentType),
            impact: this.generateImpactSection(scores, metadata, assessmentType),
            nextSteps: this.generateNextSteps(scores, recommendations, assessmentType)
        };
        return reportData;
    }

    generateExecutiveSummary(scores, recommendations, metadata, assessmentType) {
        const orgSize = assessmentType === 'agency' ? metadata.agencySize : metadata.team_size;
        const readinessScore = assessmentType === 'agency' ? scores.transformation : scores.overall;
        
        let headline, subheadline, tone;
        if (readinessScore >= 70) {
            headline = `You're Ahead of the Curve`;
            subheadline = `Your ${assessmentType} is in the top 20% for AI readiness. Here's how to extend your lead.`;
            tone = 'leadership';
        } else if (readinessScore >= 40) {
            headline = `You're Closer Than You Think`;
            subheadline = `With focused effort, your ${assessmentType} can leap ahead of competitors.`;
            tone = 'opportunity';
        } else {
            headline = `Your Transformation Starts Now`;
            subheadline = `Move quickly to gain competitive advantage.`;
            tone = 'urgency';
        }

        return {
            headline,
            subheadline,
            tone,
            keyMetrics: this.generateKeyMetrics(scores, recommendations, assessmentType),
            snapshot: this.generateSnapshot(scores, recommendations, assessmentType),
            narrative: this.generateNarrative(scores, metadata, tone, assessmentType)
        };
    }

    generateKeyMetrics(scores, recommendations, assessmentType) {
        const readinessScore = assessmentType === 'agency' ? scores.transformation : scores.overall;
        return {
            readinessScore: {
                value: Math.round(readinessScore),
                label: 'AI Readiness Score',
                interpretation: this.getScoreInterpretation(readinessScore)
            },
            timeToSave: {
                value: this.calculateQuickWinHours(recommendations.quickWins),
                label: 'Hours/Week You Could Save',
                interpretation: 'With quick wins alone'
            },
            impactPotential: {
                value: assessmentType === 'agency' ? 
                    scores.categories?.valuation?.multiple || 'Significant' : 
                    recommendations.expectedOutcomes?.roi || 'Significant',
                label: assessmentType === 'agency' ? 'Current Valuation Range' : 'Potential ROI',
                interpretation: assessmentType === 'agency' ? 
                    'Could increase by 2-3x' : 
                    'Achievable in 6 months'
            }
        };
    }

    generateSnapshot(scores, recommendations, assessmentType) {
        const topOpportunity = recommendations.immediate?.[0] || recommendations.quickWins?.[0];
        return {
            strengths: this.identifyStrengths(scores, assessmentType),
            gaps: this.identifyGaps(scores, assessmentType),
            quickestWin: topOpportunity ? {
                action: topOpportunity.title,
                impact: topOpportunity.impact || topOpportunity.expectedResult,
                effort: topOpportunity.effort || topOpportunity.investment
            } : null
        };
    }

    generateNarrative(scores, metadata, tone, assessmentType) {
        const readinessScore = assessmentType === 'agency' ? scores.transformation : scores.overall;
        const orgSize = assessmentType === 'agency' ? metadata.agencySize : metadata.team_size;
        
        if (tone === 'leadership') {
            return `As a ${assessmentType} with ${orgSize} people, you're already ahead of most competitors in AI adoption. Your readiness score of ${readinessScore}% puts you in the top tier. The opportunity now is to extend your lead and capture the premium valuations that AI-forward organizations command.`;
        } else if (tone === 'opportunity') {
            return `Your ${assessmentType} shows strong potential for AI transformation. With a readiness score of ${readinessScore}%, you're well-positioned to leap ahead. The key is moving quickly while competitors hesitate.`;
        } else {
            return `The good news? You're taking action while many are still in denial about AI's impact. Your current readiness score of ${readinessScore}% shows room for dramatic improvement. Organizations that start where you are typically see 50%+ efficiency gains within 6 months.`;
        }
    }

    generateReadinessSection(scores, assessmentType) {
        // Implementation details for readiness section
        return {
            overall: {
                score: Math.round(assessmentType === 'agency' ? scores.transformation : scores.overall),
                categoryLabel: 'AI Readiness Level'
            },
            dimensions: [],
            serviceOrActivityReadiness: [],
            champions: 'Assessment pending',
            barriers: 'Assessment pending'
        };
    }

    generateOpportunitiesSection(scores, recommendations, assessmentType) {
        return {
            immediate: {
                title: "This Week's Quick Wins",
                subtitle: "Start here for immediate impact",
                items: recommendations.quickWins || []
            },
            shortTerm: {
                title: "30-90 Day Opportunities",
                subtitle: "Building momentum",
                items: recommendations.shortTerm || []
            },
            transformational: {
                title: "Game-Changing Moves",
                subtitle: "For organizations ready to lead",
                items: recommendations.strategic || []
            }
        };
    }

    generateRoadmapSection(recommendations, assessmentType) {
        const roadmap = recommendations.transformationRoadmap || recommendations.strategicRoadmap;
        if (!roadmap) return { overview: { title: "Transformation Journey" }, phases: [] };
        
        return {
            overview: {
                title: `Your Transformation Journey`,
                totalDuration: "6-12 months",
                approach: "Phased implementation for sustainable change"
            },
            phases: Object.values(roadmap).filter(p => p && p.title).map(phase => ({
                title: phase.title,
                duration: phase.duration,
                focus: phase.focus,
                actions: phase.milestones || [],
                outcome: phase.expectedOutcome || ""
            }))
        };
    }

    generateImpactSection(scores, metadata, assessmentType) {
        if (assessmentType === 'agency') {
            return this.generateAgencyImpact(scores, metadata);
        } else {
            return this.generateInhouseImpact(scores, metadata);
        }
    }

    generateAgencyImpact(scores, metadata) {
        const currentMultiple = this.estimateCurrentMultiple(scores);
        const potentialMultiple = this.estimatePotentialMultiple(scores);
        const valuationLift = ((potentialMultiple / currentMultiple - 1) * 100).toFixed(0);
        
        return {
            title: "The Hidden Value in Your Transformation",
            subtitle: "How AI readiness translates to agency value",
            current: {
                multiple: `${currentMultiple.toFixed(1)}x EBITDA`,
                category: scores.categories?.valuation?.label || 'Current State'
            },
            potential: {
                multiple: `${potentialMultiple.toFixed(1)}x EBITDA`,
                increase: `+${valuationLift}%`,
                achievableIn: "12-18 months"
            },
            drivers: [
                { driver: "Recurring Revenue", potentialImpact: "+0.5-1.0x", action: "Convert project clients to retainers" },
                { driver: "AI Capabilities", potentialImpact: "+1.0-2.0x", action: "Demonstrate AI-enhanced services" }
            ],
            risks: scores.riskFactors || []
        };
    }

    generateInhouseImpact(scores, metadata) {
        return {
            title: "Expected Business Impact",
            subtitle: "How AI transformation drives marketing results",
            headline: "Significant productivity and output gains expected",
            details: {
                timeSavings: "20-50% time savings across activities",
                outputIncrease: "2-3x content and campaign velocity"
            },
            timeline: {
                month1: "20-30% productivity gain",
                month3: "50-70% productivity gain",
                month6: "2-3x overall output"
            },
            roi: "5-15x ROI within 6 months"
        };
    }

    generateNextSteps(scores, recommendations, assessmentType) {
        const urgency = this.determineUrgency(scores, assessmentType);
        const primaryCTA = this.getPrimaryCTA(scores, assessmentType);
        
        return {
            urgency,
            primaryCTA,
            options: [
                {
                    title: "QuickMap.ai Consultation",
                    description: "Get your personalized 90-day AI transformation roadmap",
                    price: "£500",
                    idealFor: "Teams ready to move fast"
                },
                {
                    title: "Transformation Program",
                    description: "Full support to implement your AI transformation",
                    price: "From £5,000",
                    idealFor: "Organizations serious about leading their market"
                },
                {
                    title: "Free Resources",
                    description: "Start your journey today",
                    price: "Free",
                    idealFor: "Exploring possibilities"
                }
            ],
            testimonial: this.getRelevantTestimonial(scores, assessmentType),
            booking: {
                headline: primaryCTA.headline,
                subheadline: primaryCTA.subheadline,
                buttonText: primaryCTA.buttonText,
                urgencyMessage: urgency.message
            }
        };
    }

    // Helper methods
    calculateQuickWinHours(quickWins) {
        if (!quickWins) return 0;
        return quickWins.reduce((total, win) => {
            const match = win.time?.match(/(\d+)\s*(hours?|mins?)/i);
            if (match) {
                const value = parseInt(match[1]);
                const unit = match[2].toLowerCase();
                if (unit.includes('hour')) return total + value;
                if (unit.includes('min')) return total + (value / 60);
            }
            return total;
        }, 0).toFixed(1);
    }

    getScoreInterpretation(score) {
        if (score >= 80) return "Exceptional - you're leading the pack";
        if (score >= 70) return "Strong - well positioned for growth";
        if (score >= 60) return "Good - solid foundation to build on";
        if (score >= 50) return "Moderate - clear path forward";
        if (score >= 40) return "Developing - significant opportunity";
        if (score >= 30) return "Early stage - quick wins available";
        return "Urgent - immediate action needed";
    }

    identifyStrengths(scores, assessmentType) {
        const strengths = [];
        if (assessmentType === 'agency') {
            if (scores.dimensions?.transformation > 70) {
                strengths.push("Strong AI readiness foundation");
            }
            if (scores.dimensions?.leadership > 70) {
                strengths.push("Leadership aligned on AI vision");
            }
        } else {
            if (scores.dimensions?.humanReadiness > 60) {
                strengths.push("Team ready for change");
            }
            if (scores.dimensions?.technicalReadiness > 60) {
                strengths.push("Good technical foundation");
            }
        }
        return strengths.slice(0, 3);
    }

    identifyGaps(scores, assessmentType) {
        const gaps = [];
        if (assessmentType === 'agency') {
            if (scores.dimensions?.resources < 40) {
                gaps.push("Resource constraints");
            }
            if (scores.dimensions?.change < 40) {
                gaps.push("Change management challenges");
            }
        } else {
            if (scores.dimensions?.humanReadiness < 40) {
                gaps.push("Team capability gaps");
            }
            if (scores.dimensions?.activityAutomation < 40) {
                gaps.push("Low automation levels");
            }
        }
        return gaps.slice(0, 3);
    }

    estimateCurrentMultiple(scores) {
        let baseMultiple = 3.5;
        if (scores.valuationDimensions?.financial > 70) baseMultiple += 1.0;
        else if (scores.valuationDimensions?.financial < 40) baseMultiple -= 1.0;
        if (scores.dimensions?.transformation > 70) baseMultiple += 0.5;
        return Math.max(1.5, Math.min(6.0, baseMultiple));
    }

    estimatePotentialMultiple(scores) {
        let potentialMultiple = this.estimateCurrentMultiple(scores);
        if (scores.valuationDimensions?.financial < 60) potentialMultiple += 0.75;
        if (scores.dimensions?.transformation < 60) potentialMultiple += 1.0;
        return Math.min(8.0, potentialMultiple);
    }

    determineUrgency(scores, assessmentType) {
        const readinessScore = assessmentType === 'agency' ? scores.transformation : scores.overall;
        
        if (readinessScore < 30) {
            return {
                level: 'critical',
                message: 'Your competitors are pulling ahead daily'
            };
        } else if (readinessScore < 50) {
            return {
                level: 'high',
                message: 'The window for easy gains is closing'
            };
        } else if (readinessScore < 70) {
            return {
                level: 'moderate',
                message: 'Good foundation - time to accelerate'
            };
        }
        return {
            level: 'low',
            message: 'Stay ahead by continuous innovation'
        };
    }

    getPrimaryCTA(scores, assessmentType) {
        const readinessScore = assessmentType === 'agency' ? scores.transformation : scores.overall;
        
        if (readinessScore >= 70) {
            return {
                headline: "Ready to Dominate Your Market?",
                subheadline: "Let's build your AI leadership strategy",
                buttonText: "Book Strategic Consultation"
            };
        } else if (readinessScore >= 40) {
            return {
                headline: "Ready to Transform Your Organization?",
                subheadline: "Get your personalized 90-day roadmap",
                buttonText: "Get Your QuickMap.ai"
            };
        }
        return {
            headline: "Ready to Future-Proof Your Business?",
            subheadline: "Start with quick wins that prove ROI",
            buttonText: "Book Free Discovery Call"
        };
    }

    getRelevantTestimonial(scores, assessmentType) {
        const readinessScore = assessmentType === 'agency' ? scores.transformation : scores.overall;
        
        if (readinessScore >= 70) {
            return {
                quote: "Obsolete helped us go from AI-curious to AI-leaders in 6 months.",
                author: "Sarah Chen",
                role: "CEO, Digital Agency",
                result: "3x efficiency, 40% revenue growth"
            };
        } else if (readinessScore >= 40) {
            return {
                quote: "The QuickMap.ai session was a game-changer. Clear plan we could execute.",
                author: "Mark Thompson",
                role: "Founder, Creative Agency",
                result: "Saving 20 hours/week within 60 days"
            };
        }
        return {
            quote: "We thought we were too small. Obsolete showed us exactly where to start.",
            author: "Jessica Williams",
            role: "Marketing Director",
            result: "From zero to AI-powered in 90 days"
        };
    }
}

export default ReportGenerator;