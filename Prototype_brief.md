# Revised Brief

# Multi-Sector Assessment Platform

## Strategic Brief & Development Guide

---

## Part One: Strategic Context

### The Real Opportunity

Mid-tier agencies and SME marketing teams are caught in an impossible position. They see AI transforming their industry daily—their clients are asking about it, competitors are claiming to use it, and their teams are secretly experimenting with ChatGPT. But they have no idea where to start, what's actually useful versus hype, or whether they're about to be made obsolete.

These aren't enterprises with innovation labs and dedicated AI teams. These are 10-50 person agencies juggling client work, or 2-5 person marketing teams trying to do more with less. They need practical guidance, not theoretical frameworks. They need someone who understands their reality—tight budgets, lean teams, and the constant pressure to deliver results yesterday.

The Multi-Sector Assessment Platform speaks directly to these organizations. It's a sophisticated lead generation tool that provides genuine value: a free AI readiness assessment that would typically cost £500. But more importantly, it meets them where they are—curious but cautious, eager but overwhelmed.

### Why This Works for SMEs and Mid-Tier Agencies

The platform succeeds because it respects the reality of smaller organizations. The questions are conversational, not corporate. "If your biggest client called tomorrow and fired you, how would it affect your business?" That's a question every agency owner has nightmares about. "Has anyone in your marketing team used AI tools like ChatGPT for their work?" That acknowledges the grassroots experimentation already happening.

The value exchange is perfectly calibrated for this market. These organizations can't afford expensive consultants for exploratory conversations, but they desperately need guidance. A free assessment that provides real insights—identifying quick wins, revealing competitive gaps, suggesting practical next steps—creates immediate value while opening the door to affordable consulting.

### Obsolete's Differentiated Approach

What makes Obsolete perfect for this market is the co-creation philosophy. SMEs and mid-tier agencies don't want consultants who swoop in, deliver a strategy deck, and disappear. They need partners who will build capability within their existing teams, who understand that the creative director needs to remain creative while using AI tools, that the account manager can't become a prompt engineer overnight.

This human-first approach resonates because it addresses their real fear: not that AI will destroy their business, but that they'll lose what makes them special in the rush to adopt technology. Obsolete's message is clear: AI augments your team's capabilities, it doesn't replace your creativity or client relationships.

### The Lead Qualification Reality

Not every SME or agency is ready for transformation, and the assessment intelligently identifies who's ready to move forward:

**Ready-to-Transform** organizations have budgets of £10-50K for transformation initiatives, team members already experimenting with AI, and immediate pressure from clients or competitors. They just need a roadmap and someone to guide the journey.

**Nearly-Ready** organizations see the opportunity but need to build the business case. Maybe they're still convincing the founder, or they need to see clearer ROI. These leads enter a nurture campaign with case studies and quick win strategies.

**Not-Yet-Ready** organizations are too small (under £500K revenue), have no budget allocated, or are looking for someone to "do AI for them." They receive helpful content but aren't pursued for consulting.

### Creating Urgency Without Panic

The magic happens when a creative agency discovers their design process is 70% automatable, but also learns that AI-augmented designers are commanding premium rates. Or when an SME marketing team realizes they're spending 15 hours weekly on tasks that AI could handle in 2, freeing them for strategic work that actually drives growth.

The assessment reveals these insights naturally, through their own answers. It's not Obsolete telling them they're behind—it's them realizing it themselves. This self-discovery creates authentic urgency and openness to help.

### QuickMap.ai: The Natural Next Step

After the assessment reveals what needs to change, QuickMap.ai shows how—in practical, 90-day sprints that respect SME resources. It's not a separate product but Obsolete's methodology for making transformation manageable. Instead of overwhelming year-long transformations, QuickMap.ai breaks everything into digestible chunks with clear ROI at each stage.

The pricing makes sense for this market: Free assessment builds trust. £500 QuickMap.ai consultation is an easy yes for serious organizations. £2,500-25,000 full programs are significant but achievable investments for organizations seeing clear ROI. It's priced like the agency retainers and marketing budgets they already understand.

---

## Part Two: Design Philosophy for SMEs

### Speaking Their Language

Every element of the assessment respects how these organizations actually work. Questions use familiar scenarios: "When a client asks if you're using AI, what do you say?" Options range from "We pretend we know more than we do" to "We have clear examples to share." This honesty builds trust while gathering intelligence.

For SME marketers, questions acknowledge their reality: "How much of your marketing budget could you reallocate to AI tools and training?" with options like "We'd need to prove ROI first" and "£100-500/month if it really worked." No pretending everyone has enterprise budgets.

### Progressive Disclosure That Respects Time

The assessment takes under 10 minutes because SME leaders don't have hours for diagnostic tools. Early questions quickly determine if this is a solo marketer (who gets practical, DIY-focused questions) or a 20-person agency (who gets team transformation questions).

This isn't just efficiency—it's respect for their time and recognition that the person taking the assessment is probably supposed to be doing five other things right now.

### Value They Can Use Today

Unlike enterprise assessments that deliver abstract readiness scores, this platform provides immediate, practical value:

- **For Agencies**: "Your content team could save 12 hours weekly with these 3 specific AI tools"
- **For SME Marketers**: "Start with ChatGPT for blog posts—here's exactly how competitors are using it"
- **Quick Wins**: "Try this tomorrow and measure the time saved"

The results include enough specific guidance to be genuinely helpful, but naturally lead to "you know what to do, but implementing it across your team is where we can help."

### Building Internal Champions

The co-creation philosophy shows up in questions that identify who could lead AI adoption internally. "Is there someone on your team who gets excited about new tools?" or "Who tends to figure out new systems first?" These questions help organizations realize they already have potential AI champions—they just need development and support.

This approach is crucial for SMEs who can't hire AI specialists. It shows transformation is possible with existing teams, making consulting feel like capability building rather than dependency creation.

---

## Part Three: Technical Implementation

### Architecture for Flexibility

The platform uses a configuration-driven architecture that allows rapid deployment of new assessments without engineering involvement. This matters because SME needs evolve quickly—what resonates with agencies might not work for e-commerce teams or B2B SaaS marketers.

```
/assessments
├── /agency-vulnerability      # Creative, digital, media agencies
├── /inhouse-marketing        # SME marketing teams
├── /ecommerce-readiness     # Future: Online retailers
└── /saas-marketing          # Future: B2B SaaS companies

```

Each assessment is self-contained with its own questions, scoring logic, and recommendations, but shares common components for consistency and efficiency.

### Core User Journey

**Entry Points**:

- Direct links: `obsolete.com/assess?type=agency`
- Embedded on partner sites
- Email campaigns: "Take our free 10-minute assessment"

**Smart Routing**:

1. Company size/type selection (solo/small team/mid-tier)
2. Industry/sector specification
3. Current AI maturity (none/experimenting/using)
4. Service focus (what they actually do)

**Intelligent Question Flow**:

- Solo marketers skip team transformation questions
- Agencies without content services skip content automation questions
- Budget-conscious paths for smaller organizations

**Results That Convert**:

- Overall readiness score with peer benchmarking
- Specific vulnerabilities and opportunities
- Practical quick wins they can try immediately
- Natural progression to QuickMap.ai consultation

### Lead Intelligence & Nurturing

The platform captures rich data for intelligent follow-up:

```jsx
leadProfile = {
  firmographics: {
    type: "agency",
    size: "15-25",
    revenue: "£1-2M",
    sector: "creative"
  },
  readiness: {
    score: 45,
    gaps: ["content_automation", "client_positioning"],
    champions: "identified",
    budget: "project_based"
  },
  engagement: {
    completion: "full",
    time_spent: "8:32",
    quick_wins_viewed: true
  }
}

```

This enables targeted nurture campaigns:

- High readiness + budget = Immediate sales outreach
- Low readiness + interest = Educational email series
- Specific gaps = Targeted content and case studies

### Conversion Optimization

Every element optimizes for the key outcome: booking QuickMap.ai consultations.

**Messaging by Score**:

- **70-100**: "You're ahead—let's help you extend your lead"
- **40-69**: "You have key pieces—we'll help connect them"
- **0-39**: "Act now before competitors pull ahead"

**CTAs That Work**:

- "Get your 90-day AI roadmap" (not "Schedule enterprise consultation")
- "See how similar agencies transformed" (peer proof)
- "Start with a £500 QuickMap session" (accessible entry point)

### Key Success Metrics

For SME/mid-tier focus:

- Assessment completion rate: >60%
- Email capture: >80%
- Quick win downloads: >50%
- Consultation booking: >10%
- QuickMap.ai conversion: >30% of consultations
- Average deal size: £5-15K (not enterprise £100K+)

---

## Part Four: Report System Architecture

### Data Flow Pattern

1. **Centralized State Management**: 
   - Assessment data flows from `AssessmentFlow` to child components via props
   - Central state persisted through `saveResponse`/`getResponse` functions
   - Calculation performed in `ResultsDashboard` component via `calculateResults`

2. **Data Transformation Pipeline**:
   ```
   Raw Responses → Scoring Engine → Raw Results → adaptResultsFormat → UI-Ready Data
   ```

3. **Results Adaptation Function**:
   - Located in `ResultsDashboard.jsx`
   - Transforms raw calculation data into UI-ready format
   - Creates nested objects for each report section (executive, readiness, opportunities, etc.)
   - Provides default values and fallbacks for missing data
   - Generates derived values (like valuation multipliers) based on scores

4. **Component-Ready Data Structure**:
   ```jsx
   results = {
     executive: { ... },     // Summary section
     readiness: {           // Readiness analysis
       dimensions: [ ... ],  // Capability dimensions
       serviceReadiness: [ ... ], // Service-specific readiness
       transformationPaths: { ... } // Transformation strategies
     },
     opportunities: {       // Transformation opportunities
       immediate: { ... },   // Priority actions
       serviceSpecific: [ ... ], // Service-level recommendations
       strategic: [ ... ],    // Long-term opportunities
       valuationImpact: [ ... ] // Financial impact items
     },
     roadmap: { ... },      // Transformation journey
     impact: { ... },       // Business value metrics
     nextSteps: { ... }     // Conversion opportunities
   }
   ```

### CSS Architecture

1. **Centralized Modular CSS**:
   - All styles contained in `/src/core/styles/components.module.css`
   - CSS modules for component-scoped styling without conflicts
   - Classes accessed via `import styles from '../styles/components.module.css'`

2. **Semantic Class Naming**:
   - Report structure: `.reportSection`, `.reportHeader`, etc.
   - Component types: `.dimensionCard`, `.serviceCard`, etc.
   - Modifier patterns: `.card.highRisk`, `.recommendation.priority`

3. **Responsive Grid System**:
   ```css
   .dimensionsGrid {
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
     gap: 1.5rem;
   }
   ```

4. **Visual Hierarchy with CSS**:
   - Consistent spacing rhythm (0.5rem, 1rem, 1.5rem, 2rem)
   - Typography scale with semantic meaning
   - Color system for status indication (risk levels, scores, etc.)
   - Card-based layout with consistent padding/borders

5. **Reusable Component Classes**:
   - Score circles: `.scoreCircle`, `.scoreCircleLarge`
   - Cards: `.dimensionCard`, `.serviceCard`, `.recommendationCard`
   - Grids: `.dimensionsGrid`, `.serviceGrid`, `.recommendationsGrid`
   - Text elements: `.sectionTitle`, `.sectionSubtitle`, `.cardTitle`

### Component Architecture

1. **Report View Components**:
   - Each assessment type has its own results view (`AgencyResultsView`, `InhouseResultsView`)
   - Views are stateless, receiving data via props from `ResultsDashboard`
   - Components organized by semantic sections (`<div className={styles.reportSection}>`)

2. **Conditional Rendering Pattern**:
   ```jsx
   {opportunities.strategic && opportunities.strategic.length > 0 && (
     <div className={styles.opportunitiesSection}>
       <h3>Strategic Opportunities</h3>
       {/* Component content */}
     </div>
   )}
   ```

3. **Data Mapping Pattern**:
   ```jsx
   <div className={styles.dimensionsGrid}>
     {readiness.dimensions.map((dimension, idx) => (
       <div key={idx} className={styles.dimensionCard}>
         <h4>{dimension.name}</h4>
         <div className={styles.scoreCircle}>{dimension.score}</div>
         <p>{dimension.description}</p>
       </div>
     ))}
   </div>
   ```

4. **Consistent Section Structure**:
   - Section container with semantic heading
   - Optional introduction text
   - Grid of cards or other content components
   - Appropriate spacing and visual hierarchy

5. **Dynamic Styling**:
   ```jsx
   <div className={`${styles.serviceCard} ${styles[`${service.interpretation}Risk`]}`}>
     {/* Card content */}
   </div>
   ```

This architecture ensures consistent, maintainable, and extensible reports across different assessment types while providing rich, visually engaging results for users.

---

## Part Five: Content & Messaging Strategy

### Voice and Tone

The platform speaks like a knowledgeable peer, not a corporate consultant. It acknowledges the reality of running a lean organization while showing the art of the possible. Examples:

**Instead of**: "Your organization lacks AI governance frameworks"

**We say**: "When AI tools create something great, who owns it—you, your team, or the AI company?"

**Instead of**: "Digital transformation requires enterprise architecture"

**We say**: "Three tools could save your team 10 hours weekly—here's where to start"

### Building Trust Through Honesty

The assessment acknowledges real constraints:

- "We know budgets are tight—these solutions pay for themselves in 60 days"
- "You don't need to hire AI experts—we'll show your existing team"
- "Start small, prove ROI, then scale what works"

### Case Studies That Resonate

Success stories feature similar organizations, not Fortune 500 companies:

- "How a 12-person creative agency increased output 40% without hiring"
- "SME marketer saves 15 hours weekly with these 5 AI tools"
- "Regional PR firm wins national clients with AI-powered insights"

---

## Part Five: Critical Implementation Guidelines

### What This Is NOT

1. **Not an enterprise sales tool** - Language, pricing, and approach target SMEs/mid-tier
2. **Not a self-service platform** - Creates need for expertise, doesn't replace it
3. **Not fear-based marketing** - Opportunity-focused, not "adapt or die"
4. **Not generic advice** - Industry and size-specific recommendations

### Essential Features for SME Success

1. **Mobile-first**: SME leaders check phones constantly
2. **Sub-10 minutes**: Respect for busy schedules
3. **Immediate value**: Practical tips in results
4. **Peer benchmarking**: "Agencies like yours..."
5. **Budget-friendly options**: Clear ROI, staged investment

### Development Priorities

1. **Week 1**: Core architecture and SME-friendly UI
2. **Week 2**: Smart routing and question logic
3. **Week 3**: Agency assessment with peer benchmarking
4. **Week 4**: SME marketer variant and nurture campaigns

### Current Implementation Status

#### Project Structure

The application has been successfully configured as a Create React App project. The original `assessment-platform` folder structure has been migrated to the `src` directory to align with CRA requirements. The actual project structure is as follows:

```
/Users/jon/Documents/GitHub/assessor/
├── public/                    # Public assets
├── src/                       # Source code (formerly assessment-platform)
│   ├── app/                   # Main application components
│   │   ├── App.jsx            # Root component with Router implementation
│   │   ├── AssessmentFlow.jsx # Assessment flow controller 
│   │   ├── Router.jsx         # Route definitions for assessment paths
│   │   └── index.jsx          # React entry point
│   ├── assessments/           # Assessment-specific modules
│   │   ├── agency-vulnerability/  
│   │   │   ├── ResultsView.jsx    # Agency results UI (7.8KB)
│   │   │   ├── config.json        # Assessment configuration (2.2KB)
│   │   │   ├── qualifying.json    # Qualifying questions (2.9KB)
│   │   │   ├── questions.json     # Main questions (12.8KB)
│   │   │   ├── recommendations.json # Recommendation templates (15.7KB)
│   │   │   ├── scoring.js        # Scoring algorithm (42.4KB)
│   │   │   ├── sectors.json      # Sector definitions (2.3KB)
│   │   │   ├── service-questions.json # Service questions (6.8KB)
│   │   │   └── services.json     # Service definitions (1.5KB)
│   │   └── inhouse-marketing/
│   │       ├── ResultsView.jsx    # In-house results UI (5.2KB)
│   │       ├── activities.json    # Marketing activities (1.9KB)
│   │       ├── activity-questions.json # Activity questions (16KB)
│   │       ├── config.json        # Assessment configuration (2.8KB)
│   │       ├── qualifying.json    # Qualifying questions (2.9KB)
│   │       ├── questions.json     # Main questions (12.9KB)
│   │       ├── recommendations.json # Recommendation templates (6.6KB)
│   │       ├── scoring.js         # Scoring algorithm (24.4KB)
│   │       ├── sectors.json       # Sector definitions (1.9KB)
│   │       └── services.json      # Service definitions (3.1KB)
│   ├── core/                  # Shared components and utilities
│   │   ├── components/        # UI components
│   │   │   ├── AssessmentSelector.jsx  # Type selector (2KB)
│   │   │   ├── DynamicQuestions.jsx    # Question renderer (3.6KB)
│   │   │   ├── EmailGate.jsx           # Email collection (4.8KB)
│   │   │   ├── ErrorMessage.jsx        # Error UI (1.5KB)
│   │   │   ├── Layout.jsx              # Page layout (255B)
│   │   │   ├── LoadingSpinner.jsx      # Loading indicator (845B)
│   │   │   ├── Navigation.jsx          # Navigation component (1B)
│   │   │   ├── ProgressBar.jsx         # Progress indicator (461B)
│   │   │   ├── QualifyingQuestions.jsx # Qualifier UI (7.2KB)
│   │   │   ├── QuestionCard.jsx        # Question UI (1.6KB)
│   │   │   ├── ResultsDashboard.jsx    # Results UI (13.9KB)
│   │   │   ├── SectorSelector.jsx      # Sector selection UI (3.2KB)
│   │   │   └── ServiceSelector.jsx     # Service selection UI (5.3KB)
│   │   ├── hooks/             # React hooks
│   │   │   ├── useAnalytics.js  # Analytics hook (7KB)
│   │   │   ├── useAssessment.js # Assessment state hook (3.1KB)
│   │   │   └── useProgress.js   # Progress tracking hook (9.6KB)
│   │   └── utils/             # Utility functions
│   │       ├── analytics.js     # Analytics helpers (1.6KB)
│   │       ├── firebase.js      # Firebase config stubs (938B)
│   │       ├── routing.js       # Routing utilities (1.3KB)
│   │       └── validation.js    # Form validation (1.3KB)
│   ├── firebase.json         # Firebase configuration 
│   ├── firestore.rules       # Firestore security rules
│   └── index.js              # CRA entry point
└── package.json              # Dependencies and scripts
```

#### Components and Features Status

**✅ Fully Implemented:**
- Core application structure and entry points
- Routing system with React Router (in App.jsx and Router.jsx)
- Basic UI components (Layout, LoadingSpinner, ErrorMessage)
- Assessment JSON data structures for both assessment types

**⏳ Partially Implemented:**
- Scoring algorithms have implementation but need testing (scoring.js files)
- Results visualization components have structure but need testing (ResultsView.jsx, ResultsDashboard.jsx)

**✅ Completed Since Last Update:**
- Custom React hooks for state management (useAssessment consolidates state management)
- Assessment UI components refactored to follow centralized pattern
- Fixed data flow between components with consistent prop passing
- Removed redundant localStorage manipulation across components

**❌ Stubbed/Placeholder Only:**
- Firebase integration (firebase.js has config but functions are stubs)
- Email capture functionality (EmailGate.jsx exists but needs backend integration)
- Analytics implementation (useAnalytics.js exists but needs actual tracking)

#### Running the Application

The application can be run using standard Create React App commands:

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

#### Next Development Steps

1. ✅ Complete the AssessmentFlow component as central coordinator
2. ✅ Refactor UI components to use centralized state management
3. ✅ Fix data flow consistency between assessment stages
4. 🔄 Update EmailGate component to follow AssessmentFlow pattern
5. 🔄 Test full assessment flow end-to-end
6. ⏳ Address ESLint warnings about dependencies in useEffect
7. ⏳ Implement Firebase integration for data storage
8. ⏳ Set up email capture functionality
9. ⏳ Finalize the results dashboard with PDF generation
10. ⏳ Add unit tests for components and assessment logic

### Remember: This Drives Consulting, Not Software Sales

Every decision should lead to one outcome: qualified SMEs and mid-tier agencies booking QuickMap.ai consultations with Obsolete. The assessment demonstrates expertise and creates urgency, but it's Obsolete's human experts—who understand the reality of running lean organizations—that clients are ultimately buying.

The platform succeeds when a 20-person agency realizes they need help transforming their creative process, or when a 3-person marketing team sees how AI could help them compete with larger competitors. It's about making AI transformation accessible, practical, and achievable for the organizations that need it most but can least afford to get it wrong.

# Multi-Sector Assessment Platform - Lead Generation Brief

## Executive Summary

The Multi-Sector Assessment Platform is a strategic lead generation tool designed to identify and qualify potential clients for Obsolete.com's AI transformation consulting services. By offering valuable diagnostic insights, the platform demonstrates Obsolete's expertise while creating natural progression to paid consulting engagements.

**Core Purpose**: Convert AI-curious organizations into qualified consulting leads by revealing transformation opportunities that require expert guidance to implement.

## Strategic Context

### Obsolete's Consulting Philosophy

- **Human-First AI**: Technology augments human capability, never replaces it
- **Co-Creation Model**: Transformation happens WITH organizations, not TO them
- **Pragmatic Approach**: No jargon, no hype - just practical solutions to real problems
- **Sustainable Change**: Building internal capabilities for lasting transformation
- **Ethical Implementation**: Responsible AI adoption with proper governance

### The Lead Generation Challenge

Organizations know they need AI transformation but don't know:

- Where to start
- What's possible in their industry
- How vulnerable they are to disruption
- Who in their team can lead the change
- Whether they're ready for transformation

The assessment platform answers these questions while positioning Obsolete as the trusted guide for the journey ahead.

## Assessment Platform Strategy

### Value Exchange Model

1. **Organization Receives**:
    - Free AI readiness/vulnerability assessment (valued at £500)
    - Industry-specific insights and benchmarking
    - Identification of quick wins and strategic priorities
    - Understanding of internal readiness and capability gaps
2. **Obsolete Receives**:
    - Qualified lead with detailed context
    - Understanding of organization's needs and readiness
    - Demonstration of expertise and approach
    - Natural conversation starter for consultation

### Lead Qualification Through Assessment

The assessment acts as a sophisticated qualification filter:

**High-Value Prospects** (Immediate consultation):

- Revenue >£0.5M or budget >£100K
- Cross-functional team interest
- Identified internal champions
- Urgent competitive pressure

**Development Prospects** (Nurture campaign):

- Growing organizations with AI curiosity
- Some internal resistance to overcome
- Need education before transformation

**Not Qualified** (Educational content only):

- Too small or no budget
- No internal ownership
- "Do it for us" mentality

## From Assessment to Consulting Engagement

### The Natural Progression

1. **Assessment Reveals Reality**
    - "Your content creation process is 70% vulnerable to AI disruption"
    - "Competitors are already implementing these 5 AI solutions"
    - "You have strong potential champions in your design team"
2. **Creates Urgency Without Fear**
    - Focus on opportunity, not obsolescence
    - Emphasize competitive advantage, not survival
    - Show what's possible, not just what's at risk
3. **Demonstrates Need for Expertise**
    - "You know WHAT needs to change, but not HOW"
    - "Success requires careful orchestration across teams"
    - "Internal ownership is critical - we'll show you how to build it"
4. **Positions Obsolete as Essential Partner**
    - "We don't just tell you what to do - we build the capability with you"
    - "Our co-creation approach ensures lasting transformation"
    - "We've guided dozens of similar organizations through this journey"

### Conversion Messaging by Score

**High Scorers (70-100)**

- "You're ahead of the curve - let's accelerate your AI leadership"
- "Your team is ready - we'll help you capitalize on that readiness"
- CTA: "Book a strategy session to build your transformation roadmap"

**Medium Scorers (40-69)**

- "You have key pieces in place - let's connect them strategically"
- "Critical gaps need addressing before competitors pull ahead"
- CTA: "Schedule a consultation to prioritize your AI initiatives"

**Low Scorers (0-39)**

- "Urgent action needed to avoid disruption"
- "Start with quick wins while building long-term capability"
- CTA: "Talk to us about your 90-day transformation sprint"

## QuickMap.ai Integration

QuickMap.ai is Obsolete's proprietary roadmapping methodology, not a separate product. It's delivered through consulting engagement:

### What QuickMap.ai Delivers

- 90-day sprint plans with clear milestones
- Tool recommendations with implementation guidance
- Team capability development roadmap
- ROI projections and success metrics
- Governance and compliance framework

### Pricing Psychology

- Assessment: Free (builds trust, demonstrates value)
- QuickMap.ai Consultation: From £500 (low-risk entry point)
- Full Transformation Program: From £25,000 (includes QuickMap.ai methodology)
- Ongoing Advisory: Custom pricing

## Key Design Principles

### Assessment as Conversation Starter

Every element should facilitate meaningful dialogue:

- Questions that make them think differently
- Results that surprise and enlighten
- Insights they can't get elsewhere
- Clear next steps requiring expertise

### Demonstrating Co-Creation Philosophy

- Questions about internal champions and capability
- Focus on "who in your team could..."
- Emphasis on building vs. buying solutions
- Cultural readiness assessment

### Building Trust Through Value

- Genuinely useful insights regardless of conversion
- Industry-specific recommendations
- Honest assessment without fear-mongering
- Professional presentation of results

## Implementation Requirements

### Essential Features

1. **Lead Intelligence Gathering**
    - Company size, revenue, industry
    - Current AI maturity and initiatives
    - Team structure and potential champions
    - Budget indicators and timeline
2. **Sophisticated Scoring**
    - Multi-dimensional analysis
    - Industry benchmarking
    - Readiness indicators beyond just vulnerability
3. **Consultation-Focused Results**
    - Executive summary for decision makers
    - Specific examples relevant to their business
    - Clear visualization of transformation journey
    - Natural lead-in to consultation
4. **CRM Integration**
    - Automatic lead scoring and routing
    - Trigger nurture campaigns by segment
    - Sales team alerts for hot prospects
    - Engagement tracking

### What to Minimize

- Technical implementation details
- Self-service action plans
- Too much free strategic advice
- Generic one-size-fits-all recommendations

## Success Metrics

### Primary KPIs

1. **Qualified Leads Generated**: >50/month
2. **Lead-to-Consultation Rate**: >15%
3. **Consultation-to-Engagement Rate**: >30%
4. **Average Engagement Value**: >£35,000

### Secondary Metrics

- Assessment completion rate: >60%
- Email capture rate: >80%
- Report download rate: >70%
- Referral generation: >10%

## Content Strategy Integration

Assessment data feeds broader marketing:

- Industry insight reports
- Webinars addressing common gaps
- Case studies from successful transformations
- Thought leadership on AI readiness

## Critical Reminders

1. **This is NOT a product** - it's a sophisticated lead generation tool
2. **Don't give away the strategy** - reveal problems, not solutions
3. **Focus on transformation journey** - not just AI implementation
4. **Emphasize human elements** - champions, culture, capability
5. **Create urgency through opportunity** - not fear
6. **Position consultation as natural next step** - not optional add-on

## Technical Specifications (Simplified)

### Core Requirements

- Mobile-responsive design
- <10 minute completion time
- Professional PDF reports
- CRM integration (HubSpot/Salesforce)
- Analytics tracking
- Multi-assessment support

### Architecture Principles

- Configuration-driven assessments
- Reusable component library
- Centralized scoring engine
- Easy to add new assessments
- Minimal technical debt

*Note: Detailed technical implementation should be documented separately for development team*

## Final Thought

Every decision should optimize for one outcome: scheduling qualified consultation calls with organizations ready for AI transformation. The assessment demonstrates expertise, builds trust, and creates urgency - but it's the human expertise of Obsolete's consultants that organizations are ultimately buying.

# Multi-Sector Assessment Platform

## Technical Architecture & Implementation Guide

---

## Core Architecture Principles

### 1. Modular Assessment System

Each assessment is a self-contained module that plugs into a shared engine. This allows new assessments to be added without touching core code.

### 2. Configuration Over Code

Assessment behavior is driven by JSON configuration files, not hardcoded logic. Only custom scoring algorithms require actual code.

### 3. Shared Everything

UI components, flow control, data management, and styling are centralized. Assessments only provide content and scoring rules.

### 4. Progressive Enhancement

Start with core functionality, layer on advanced features. Every phase should produce a working system.

---

## Proposed File Structure

```
/assessment-platform
├── /core                           # Shared engine (never touched when adding assessments)
│   ├── /components                 # Reusable UI components
│   │   ├── Layout.jsx             # App wrapper with branding
│   │   ├── AssessmentSelector.jsx # Grid view for choosing assessment
│   │   ├── SectorSelector.jsx     # Dynamic sector/type selection
│   │   ├── QualifyingQuestions.jsx # Company size, revenue, etc.
│   │   ├── ServiceSelector.jsx    # Multi-select services/activities
│   │   ├── QuestionCard.jsx       # Single question display
│   │   ├── ProgressBar.jsx        # Visual progress indicator
│   │   ├── EmailGate.jsx          # Lead capture form
│   │   ├── ResultsDashboard.jsx  # Base dashboard container
│   │   └── Navigation.jsx         # Back/Next/Skip controls
│   │
│   ├── /engine                    # Core business logic
│   │   ├── AssessmentEngine.js    # Main orchestrator
│   │   ├── FlowController.js      # Manages stages and routing
│   │   ├── QuestionFilter.js      # Filters questions by selections
│   │   ├── ScoringEngine.js       # Base scoring functionality
│   │   ├── DataManager.js         # State and persistence
│   │   └── ReportGenerator.js     # PDF/email generation
│   │
│   ├── /styles                    # Global styles
│   │   ├── theme.js               # Colors, fonts, spacing
│   │   ├── globals.css            # Base styles
│   │   └── components.module.css  # Component styles
│   │
│   ├── /utils                     # Shared utilities
│   │   ├── firebase.js            # Firebase config
│   │   ├── analytics.js           # Event tracking
│   │   ├── validation.js          # Form validation
│   │   └── routing.js             # URL parameter handling
│   │
│   └── /hooks                     # Custom React hooks
│       ├── useAssessment.js       # Assessment state management
│       ├── useProgress.js         # Progress tracking
│       └── useAnalytics.js        # Analytics wrapper
│
├── /assessments                   # Assessment modules
│   ├── /agency-vulnerability
│   │   ├── config.json           # Assessment metadata
│   │   ├── sectors.json          # Agency types (PR, Creative, etc.)
│   │   ├── qualifying.json       # Qualifying questions config
│   │   ├── services.json         # Service list with descriptions
│   │   ├── questions.json        # All questions with conditions
│   │   ├── recommendations.json  # Score-based recommendations
│   │   ├── scoring.js            # Custom scoring algorithm
│   │   └── ResultsView.jsx       # Custom results components
│   │
│   └── /inhouse-marketing
│       ├── config.json
│       ├── sectors.json          # Industry sectors
│       ├── qualifying.json       # SME-aware qualifying questions
│       ├── services.json         # Marketing activities
│       ├── questions.json        # Including SME variants
│       ├── recommendations.json
│       ├── scoring.js
│       └── ResultsView.jsx
│
├── /public
│   └── /assets                   # Images, fonts, etc.
│
└── /app
    ├── App.jsx                   # Main app component
    ├── Router.jsx                # Route handling
    └── index.js                  # Entry point

```

---

## User Flow Implementation

### Stage 1: Homepage

```jsx
// Route: /
// Component: Landing.jsx

const Landing = () => {
  const navigate = useNavigate();
  
  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1>AI Assessment Tool for Marketing Leaders</h1>
        <p>Free & confidential. No account required.</p>
      </header>
      
      <div className={styles.heroCta}>
        <button 
          className={styles.primaryButton}
          onClick={() => navigate('/assessment')}
        >
          Start Assessment
        </button>
      </div>
    </div>
  );
};
```

### Stage 2: Assessment Selection

```jsx
// Route: /assessment
// Component: AssessmentSelector.jsx

const AssessmentSelector = () => {
  const navigate = useNavigate();

  const selectAssessment = (type) => {
    navigate(`/assessment/${type}/sector`);
  };

  return (
    <div className={styles.assessmentGrid}>
      <div 
        className={styles.assessmentCard}
        onClick={() => selectAssessment('agency-vulnerability')}
      >
        <h2 className={styles.cardTitle}>Agency Vulnerability Assessment</h2>
        <p className={styles.cardDescription}>
          For marketing agencies worried about client needs shifting to AI.
        </p>
        <span className={styles.time}>⏱ 3-5 mins</span>
      </div>
    </div>
  );
};
```

### Stage 3: Sector Selection

```jsx
// Route: /assessment/:type/sector
// Component: SectorSelector.jsx

const SectorSelector = ({ assessmentType, onSelect, onBack }) => {
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null);
  
  useEffect(() => {
    // Load sectors data from the correct path
    const loadSectors = async () => {
      try {
        const module = await import(`../../assessments/${assessmentType}/sectors.json`);
        const data = module.default || module;
        setSectors(data.sectors || []);
      } catch (error) {
        console.error('Failed to load sectors:', error);
      }
    };
    
    loadSectors();
  }, [assessmentType]);
  
  // Called when user clicks a sector
  const handleSelect = (sector) => {
    setSelectedSector(sector);
    // Pass selected sector to parent component
    onSelect(sector);
  };
  
  return (
    <div className={styles.sectorsGrid}>
      {sectors.map(sector => (
        <div 
          key={sector.id}
          className={`${styles.sectorCard} ${selectedSector?.id === sector.id ? styles.selected : ''}`}
          onClick={() => handleSelect(sector)}
        >
          <h3>{sector.name}</h3>
          <p>{sector.description}</p>
        </div>
      ))}
      
      <Navigation onBack={onBack} onNext={() => {}} canProgress={false} />
    </div>
  );
};
```

### Stage 4: Service Selection

```jsx
// Route: /assessment/:type/services
// Component: ServiceSelector.jsx

const ServiceSelector = ({ assessmentType, onSelect, onBack }) => {
  const [services, setServices] = useState([]);
  const [allocations, setAllocations] = useState({});
  
  useEffect(() => {
    // Load services from the correct path
    const loadServices = () => {
      try {
        // Using static imports with proper error handling
        let servicesData;
        if (assessmentType === 'agency-vulnerability') {
          servicesData = agencyServices; // imported at top of file
        } else if (assessmentType === 'inhouse-marketing') {
          servicesData = inhouseActivities; // imported at top of file
        }
        
        const serviceArray = servicesData?.services || [];
        setServices(serviceArray);
        
        // Initialize allocations
        const initialAllocations = {};
        serviceArray.forEach(service => {
          initialAllocations[service.id] = 0;
        });
        setAllocations(initialAllocations);
      } catch (error) {
        console.error('Failed to load services:', error);
      }
    };
    
    loadServices();
  }, [assessmentType]);
  
  // Handle continue button - pass normalized allocations to parent
  const handleContinue = () => {
    const selectedServices = {};
    let totalAllocation = 0;
    
    // Count total allocation
    Object.entries(allocations).forEach(([serviceId, value]) => {
      if (value > 0) {
        totalAllocation += value;
      }
    });
    
    // Normalize allocations
    if (totalAllocation > 0) {
      Object.entries(allocations).forEach(([serviceId, value]) => {
        if (value > 0) {
          selectedServices[serviceId] = value / totalAllocation;
        }
      });
    }
    
    // Pass to parent component
    onSelect(selectedServices);
  };
  
  return (
    <div className={styles.serviceSelector}>
      {/* Service sliders */}
      <Navigation 
        onBack={onBack} 
        onNext={handleContinue} 
        canProgress={Object.values(allocations).some(v => v > 0)}
      />
    </div>
  );
};
```

### Stage 5: Dynamic Questions

```jsx
// Route: /assessment/:type/questions
// Component: DynamicQuestions.jsx

const DynamicQuestions = ({ 
  assessmentType,
  saveResponse,
  getResponse,
  getContext,
  setContext, 
  onComplete,
  onBack,
  progress
}) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  useEffect(() => {
    // Load questions from the correct path
    const loadQuestions = async () => {
      try {
        // Load core questions
        const coreModule = await import(`../../assessments/${assessmentType}/questions.json`);
        const coreData = coreModule.default || coreModule;
        let coreQuestions = coreData.questions || [];
        
        // Load service-specific questions
        const selectedServices = getResponse('selectedServices') || {};
        if (Object.keys(selectedServices).length > 0) {
          // Try to load from service-questions.json
          try {
            const serviceModule = await import(`../../assessments/${assessmentType}/service-questions.json`);
            const serviceData = serviceModule.default || serviceModule;
            // Add service questions
          } catch (error) {
            // If that fails, try activity-questions.json
            // ...
          }
        }
        
        setQuestions(coreQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
      }
    };
    
    loadQuestions();
  }, [assessmentType, getResponse]);
  
  // Handle an answer
  const handleAnswer = (questionId, value) => {
    // Save the answer using the centralized saveResponse
    saveResponse(questionId, value);
    
    // Auto-advance
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 300);
  };
  
  // Handle next button
  const handleNext = () => {
    if (currentQuestionIndex >= questions.length - 1) {
      // Move to next stage
      onComplete();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  // Current question
  const currentQuestion = questions[currentQuestionIndex] || {};
  
  return (
    <div className={styles.questionsContainer}>
      <ProgressBar progress={progress} />
      
      <QuestionCard
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        selectedValue={getResponse(currentQuestion.id)}
        onSelect={value => handleAnswer(currentQuestion.id, value)}
      />
      
      <Navigation
        onNext={handleNext}
        onBack={() => currentQuestionIndex > 0 
          ? setCurrentQuestionIndex(prev => prev - 1) 
          : onBack()
        }
        canProgress={getResponse(currentQuestion.id) !== undefined}
      />
    </div>
  );
};
```

### Stage 6: Email Gate

```jsx
// Route: /assessment/:type/email
// Component: EmailGate.jsx

const EmailGate = ({ 
  assessmentType,
  saveResponse,
  getResponse,
  onComplete,
  onBack,
  progress
}) => {
  // Form state initialized from saved responses
  const [formData, setFormData] = useState({
    email: getResponse('email') || '',
    name: getResponse('name') || '',
    company: getResponse('company') || '',
    phone: getResponse('phone') || '',
    marketingConsent: getResponse('marketingConsent') || false
  });
  
  // Update form field
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save all form fields
    Object.entries(formData).forEach(([key, value]) => {
      saveResponse(key, value);
    });
    
    // Move to results
    onComplete();
  };
  
  // Go back to questions
  const handleBackClick = () => {
    // Save current form state before navigation
    Object.entries(formData).forEach(([key, value]) => {
      saveResponse(key, value);
    });
    
    onBack();
  };
  
  return (
    <div className={styles.emailGate}>
      <ProgressBar progress={progress} />
      
      <form onSubmit={handleSubmit}>
        <h2>Just one more step!</h2>
        <p>Where should we send your results?</p>
        
        <div className={styles.formField}>
          <label htmlFor="email">Email (required)</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formField}>
          <label htmlFor="name">Name (optional)</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        
        <div className={styles.formConsent}>
          <input
            id="marketingConsent"
            name="marketingConsent"
            type="checkbox"
            checked={formData.marketingConsent}
            onChange={handleChange}
            required
          />
          <label htmlFor="marketingConsent">
            I agree to receive marketing emails (GDPR compliant)
          </label>
        </div>
        
        <div className={styles.formActions}>
          <button type="button" onClick={handleBackClick} className={styles.backButton}>
            Back
          </button>
          <button type="submit" className={styles.submitButton}>
            See My Results
          </button>
        </div>
      </form>
    </div>
  );
};
```

### Stage 7: Results Dashboard

```jsx
// Route: /assessment/:type/results
// Component: ResultsDashboard.jsx receives these props:
{
  assessmentType: 'agency-vulnerability',  // identifies which assessment
  calculateResults: async () => {...},     // calculates results from responses
  onRestart: () => {...},                 // navigation callback
  ResultsView: AgencyResultsView,         // custom view component for this assessment
  getResponse: (key) => {...},            // access saved responses
  getContext: () => {...}                 // access assessment context
}

// ResultsDashboard transforms raw results using adaptResultsFormat:
{
  executive: { ... },
  readiness: {
    dimensions: [
      { name: 'Technology', score: 65, description: '...' },
      { name: 'Team', score: 78, description: '...' }
    ],
    serviceReadiness: [
      { name: 'Content Creation', score: 70, interpretation: 'medium', timeToDisruption: '12-18 months' }
    ],
    transformationPaths: { ... }
  },
  opportunities: {
    immediate: [ ... ],
    serviceSpecific: [ ... ],
    strategic: [ ... ],
    valuationImpact: [ ... ]
  },
  roadmap: { ... },
  impact: { ... },
  nextSteps: { ... }
}
```

---

## Core Engine Design

### AssessmentFlow.jsx (Central Coordinator)

```jsx
// This is the central component that manages state and navigation
const AssessmentFlow = () => {
  const { type } = useParams();  // From React Router
  const navigate = useNavigate();
  const [step, setStep] = useState('qualifying');
  const [progress, setProgress] = useState(0);
  
  // Centralized response management
  const saveResponse = (key, value) => {
    // Save to localStorage with namespacing by assessment type
    const storageKey = `${type}_${key}`;
    localStorage.setItem(storageKey, JSON.stringify(value));
  };
  
  const getResponse = (key) => {
    // Retrieve from localStorage with namespacing
    const storageKey = `${type}_${key}`;
    const item = localStorage.getItem(storageKey);
    return item ? JSON.parse(item) : null;
  };
  
  // Context for assessment-wide data
  const [context, setContext] = useState({});
  
  // Navigation handlers
  const handleComplete = (currentStep) => {
    // Determine next step based on current step
    const nextStep = getNextStep(currentStep);
    setStep(nextStep);
    // Update progress
    setProgress(calculateProgress(nextStep));
  };
  
  // Calculate results based on all responses
  const calculateResults = async () => {
    try {
      // Import scoring module dynamically based on assessment type
      const scoringModule = await import(`../../assessments/${type}/scoring.js`);
      // Get all responses
      const allResponses = getAllResponses();
      // Calculate scores and recommendations
      return scoringModule.calculateScores(allResponses);
    } catch (error) {
      console.error('Error calculating results:', error);
      return null;
    }
  };

    this.flow.start();
  }

  async nextStage() {
    const currentStage = this.flow.getCurrentStage();
    await this.saveProgress();
    return this.flow.advance();
  }

  calculateResults() {
    const responses = this.data.getResponses();
    const context = this.data.getContext();
    return this.scoring.calculate(responses, context);
  }
}

```

### FlowController.js

```jsx
class FlowController {
  constructor(config) {
    this.stages = [
      'sector',
      'qualifying',
      'services',
      'questions',
      'email',
      'results'
    ];
    this.currentStage = 0;
    this.config = config;
  }

  getCurrentStage() {
    return this.stages[this.currentStage];
  }

  advance() {
    // Handle conditional stage skipping
    if (this.shouldSkipStage()) {
      this.currentStage++;
      return this.advance();
    }

    this.currentStage++;
    return this.getCurrentStage();
  }

  getRelevantQuestions() {
    const selectedServices = this.data.get('selectedServices');
    const qualifyingAnswers = this.data.get('qualifying');

    return QuestionFilter.filter(
      this.config.questions,
      selectedServices,
      qualifyingAnswers
    );
  }
}

```

### ScoringEngine.js

```jsx
class ScoringEngine {
  constructor(customScoring) {
    this.customScoring = customScoring;
    this.weights = customScoring?.weights || this.defaultWeights;
  }

  calculate(responses, context) {
    // Base scoring logic used by all assessments
    let scores = this.calculateDimensionScores(responses);

    // Apply custom scoring if provided
    if (this.customScoring?.calculate) {
      scores = this.customScoring.calculate(scores, responses, context);
    }

    // Apply context-based adjustments
    scores = this.applyContextAdjustments(scores, context);

    return {
      overall: this.calculateOverallScore(scores),
      dimensions: scores,
      insights: this.generateInsights(scores, context)
    };
  }
}

```

---

## Data Management Strategy

### State Management

```jsx
// Using React Context + useReducer for state
const AssessmentContext = createContext();

const assessmentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STAGE':
      return { ...state, currentStage: action.payload };
    case 'SAVE_RESPONSE':
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.questionId]: action.value
        }
      };
    // etc...
  }
};

```

### Firebase Schema

```jsx
{
  assessments: {
    [sessionId]: {
      type: "agency-vulnerability",
      startedAt: timestamp,
      completedAt: timestamp,
      stages: {
        sector: "creative",
        qualifying: { company_size: "11-50", revenue: "1-5m" },
        services: ["content", "social", "creative"],
        responses: { q1: "option_a", q2: "option_c" },
        email: "user@agency.com"
      },
      results: {
        overallScore: 65,
        dimensions: {...},
        reportUrl: "https://..."
      }
    }
  },
  leads: {
    [leadId]: {
      email: "user@agency.com",
      assessments: [sessionId],
      firstSeen: timestamp,
      lastActive: timestamp,
      tags: ["agency", "mid-tier", "qualified"]
    }
  }
}

```

---

## Styling & Theming

### Theme Configuration

```jsx
// core/styles/theme.js
export const theme = {
  colors: {
    primary: '#ffff66',      // Obsolete yellow
    background: '#141414',   // Obsolete black
    text: '#ffffff',
    textMuted: '#a0a0a0',
    accent: '#00ff88',
    error: '#ff4444'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '4rem'
  },
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px'
  }
};

```

### Component Styling Approach

```css
/* Using CSS Modules for component isolation */
/* core/styles/components.module.css */

.questionCard {
  background: var(--color-background-elevated);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: all 0.2s ease;
}

.questionCard:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

```

---

## Development Phases

### Phase 1: Core Foundation (Week 1)

**Goal**: Basic flow working end-to-end with dummy data

1. **Day 1-2**: Project setup
    - React app with routing
    - Firebase configuration
    - Basic component structure
2. **Day 3-4**: Core engine
    - AssessmentEngine base class
    - FlowController with stage management
    - Basic state management
3. **Day 5**: UI components
    - All stage components (skeleton)
    - Basic styling/theme
    - Mobile responsiveness

**Deliverable**: Can click through all stages with dummy data

### Phase 2: Data & Logic (Week 2)

**Goal**: Dynamic question flow and scoring

1. **Day 1-2**: Question filtering
    - Service-based filtering
    - Conditional questions
    - SME/Enterprise variants
2. **Day 3-4**: Scoring engine
    - Base scoring algorithm
    - Custom scoring integration
    - Context adjustments
3. **Day 5**: Data persistence
    - Firebase integration
    - Progress saving
    - Lead capture

**Deliverable**: Full assessment flow with real logic

### Phase 3: First Assessment (Week 3)

**Goal**: Agency assessment fully functional

1. **Day 1-2**: Content integration
    - Import all agency questions
    - Configure sectors/services
    - Set up recommendations
2. **Day 3-4**: Custom scoring
    - Agency-specific algorithm
    - Valuation calculations
    - Peer benchmarking
3. **Day 5**: Results dashboard
    - Custom agency ResultsView
    - PDF generation
    - Email delivery

**Deliverable**: Complete agency assessment

### Phase 4: Scale & Polish (Week 4)

**Goal**: Second assessment + production ready

1. **Day 1-2**: In-house marketing assessment
    - Import content
    - SME-specific logic
    - Custom results view
2. **Day 3**: Analytics & tracking
    - Event tracking
    - Conversion tracking
    - A/B test framework
3. **Day 4-5**: Optimization
    - Performance tuning
    - Error handling
    - Firebase deployment

**Deliverable**: Production-ready platform

---

## Key Technical Decisions

### Why This Architecture?

1. **Separation of Concerns**: Core engine knows nothing about specific assessments
2. **Scalability**: Adding assessment = adding folder, no core changes
3. **Maintainability**: Business logic in JSON, code only for algorithms
4. **Flexibility**: Each assessment can have custom scoring/results
5. **Performance**: Lazy load assessment modules

### Configuration Schema Standards

All JSON configs follow consistent patterns:

```jsx
{
  "version": "1.0",
  "id": "unique-identifier",
  "metadata": {
    "name": "Human readable name",
    "description": "What this contains"
  },
  "data": {
    // Actual content
  }
}

```

### Error Handling Strategy

```jsx
// Graceful degradation at every level
try {
  await loadAssessmentModule(type);
} catch (error) {
  console.error('Failed to load assessment:', error);
  // Show user-friendly error
  // Log to analytics
  // Offer alternative action
}

```

### Obsolete Patterns to Avoid

⚠️ The following patterns are obsolete and should NOT be used in new code or refactoring:

1. **Direct localStorage Manipulation** ❌
   ```javascript
   // OBSOLETE - Don't do this
   localStorage.setItem('assessment_data', JSON.stringify(data));
   const savedData = JSON.parse(localStorage.getItem('assessment_data'));
   ```
   
   ✅ CORRECT PATTERN:
   ```javascript
   // Use centralized data management via props
   saveResponse('key', data);
   const savedData = getResponse('key');
   ```

2. **Incorrect Import Paths** ❌
   ```javascript
   // OBSOLETE - Wrong path pattern
   import(`../../../${assessmentType}/config.json`)
   ```
   
   ✅ CORRECT PATTERN:
   ```javascript
   // Use correct relative path from component
   import(`../../assessments/${assessmentType}/service-questions.json`)
   ```

3. **Editing Duplicate Components** ❌
   - Do NOT edit components in `/src/react-app/src/core/components/`
   - ONLY edit components in `/src/core/components/` (primary path)

4. **Isolated Component State** ❌
   ```javascript
   // OBSOLETE - Component manages own state
   const [services, setServices] = useState([]);
   useEffect(() => {
     const savedServices = localStorage.getItem('services');
     if (savedServices) setServices(JSON.parse(savedServices));
   }, []);
   ```
   
   ✅ CORRECT PATTERN:
   ```javascript
   // Component receives props from parent
   function ServiceSelector({ assessmentType, getResponse, saveResponse, onComplete }) {
     const [services, setServices] = useState(getResponse('services') || []);
     
     const handleSave = () => {
       saveResponse('services', services);
       onComplete(services);
     };
   }
   ```

5. **Direct Route Manipulation** ❌
   ```javascript
   // OBSOLETE - Direct history manipulation
   import { useHistory } from 'react-router-dom';
   const history = useHistory();
   history.push('/next-step');
   ```
   
   ✅ CORRECT PATTERN:
   ```javascript
   // Use callback props for navigation
   <button onClick={() => onComplete(data)}>Continue</button>
   <button onClick={onBack}>Back</button>
   ```

6. **Inline or Component-Specific Styling** ❌
   ```javascript
   // OBSOLETE - Component-specific styles
   import './ServiceSelector.css';
   <div style={{ margin: '10px', padding: '20px' }}>
   ```
   
   ✅ CORRECT PATTERN:
   ```javascript
   // Use centralized CSS modules
   import styles from '../styles/components.module.css';
   <div className={styles.serviceContainer}>
   ```

Following the current patterns ensures consistency, maintainability, and proper data flow throughout the application.

### Performance Considerations

1. **Code Splitting**: Each assessment loaded on demand
2. **Progressive Loading**: Questions loaded as needed
3. **Optimistic Updates**: UI updates before server confirms
4. **Caching**: Results cached for sharing/return visits
5. **Image Optimization**: All assets compressed/lazy loaded

---

## Critical Project Structure Notes

### Path Resolution Issues

**IMPORTANT:** This project has a confusing nested structure that causes import and component resolution issues:

1. **Duplicate Component Locations:**
   - Active components are in: `/src/core/components/`
   - Duplicate components exist in: `/src/react-app/src/core/components/`
   - Always check browser console logs to verify which file is being used

2. **JSON Data Loading:**
   - Use static imports for JSON files, not dynamic imports
   - Correct relative paths from ServiceSelector are: `../../assessments/...`
   - Example: `import agencyServices from '../../assessments/agency-vulnerability/services.json';`

3. **ServiceSelector Component:**
   - Uses sliders for proportional service allocation (must sum to 100%)
   - Different services load based on assessment type:
     - Agency: services.json with "services" array
     - In-house: activities.json with "activities" array
   - Selected services determine which questions are shown later
   - Data is used in final scoring calculations

4. **Testing Component Changes:**
   - Add unique console.log markers to identify which component version is loading
   - Check browser console to confirm the right file is being used
   - Always edit the active `/src/core/components/ServiceSelector.jsx` file

This information is critical for future development to avoid the 12+ hours of debugging experienced in previous work.

## Testing Strategy

### Unit Tests

- Core engine logic
- Scoring algorithms
- Question filtering

### Integration Tests

- Full assessment flows
- Firebase operations
- Email delivery

### E2E Tests

- Complete user journeys
- Mobile workflows
- Error scenarios

### Performance Tests

- Load time targets
- Mobile performance
- Firebase quota usage

---

## Deployment Configuration

### Firebase Setup

```jsx
// firebase.json
{
  "hosting": {
    "public": "build",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}

```

### Environment Variables

```bash
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_MEASUREMENT_ID=
REACT_APP_SENDINBLUE_API_KEY=

```

---

## Success Metrics & Monitoring

### Technical KPIs

- Page load time < 3s
- Time to Interactive < 5s
- Assessment completion time < 10 min
- Error rate < 1%
- Mobile usage > 40%

### Business KPIs

- Completion rate > 60%
- Email capture > 80%
- Results shared > 20%
- Return visits > 25%
- Consultation bookings > 10%

### Monitoring Setup

- Google Analytics 4
- Firebase Performance
- Sentry for errors
- Custom funnel tracking
- A/B test framework

---

## Technical Implementation Guide: How It Actually Works

### Assessment Configuration System

1. **JSON-Driven Question Flow**
   - Each assessment type has dedicated JSON files in its directory:
   ```
   /assessments/agency-vulnerability/
     ├── services.json         # Available services to select
     ├── sectors.json          # Industry sectors
     ├── qualifying-questions.json  # Initial questions
     ├── service-questions.json     # Service-specific questions
   ```

2. **Question Loading Pattern**
   ```javascript
   // In DynamicQuestions.jsx
   const loadQuestions = async () => {
     try {
       // Direct import pattern compatible with webpack
       const serviceQuestionsData = await import 
         (`../../assessments/${assessmentType}/service-questions.json`);
       
       // Extract and format questions for selected services
       const relevantQuestions = selectedServices.flatMap(service => {
         const serviceQuestions = serviceQuestionsData[service] || [];
         return serviceQuestions.map(q => ({
           ...q,
           serviceId: service // Track which service this question belongs to
         }));
       });
       
       setQuestions(relevantQuestions);
     } catch (err) {
       console.error('Error loading questions:', err);
       setError('Failed to load questions');
     }
   };
   ```

3. **Response Persistence**
   ```javascript
   // In AssessmentFlow.jsx - Centralized data management
   const saveResponse = (key, value) => {
     const existingData = JSON.parse(localStorage.getItem(`assessment_${assessmentType}`)) || {};
     const updatedData = { ...existingData, [key]: value };
     localStorage.setItem(`assessment_${assessmentType}`, JSON.stringify(updatedData));
     console.log(`Saved ${key} data for ${assessmentType}`);
   };
   
   const getResponse = (key) => {
     const data = JSON.parse(localStorage.getItem(`assessment_${assessmentType}`)) || {};
     return data[key];
   };
   ```

### Scoring System Implementation

1. **Scoring Engine Structure**
   ```javascript
   // In scoring.js
   export const calculateScores = (responses, services) => {
     const serviceScores = {};
     const dimensionScores = {
       technology: 0,
       people: 0,
       process: 0,
       data: 0,
       strategy: 0
     };
     
     // Process qualifying questions first
     processQualifyingQuestions(responses.qualifying, dimensionScores);
     
     // Process service-specific questions
     services.forEach(service => {
       const serviceResponses = responses.services?.[service] || [];
       serviceScores[service] = calculateServiceScore(serviceResponses, service);
       
       // Roll up service scores into dimensions
       updateDimensionScores(serviceResponses, dimensionScores);
     });
     
     // Calculate overall score (weighted average of dimensions)
     const overall = calculateOverallScore(dimensionScores);
     
     return { overall, dimensionScores, serviceScores };
   };
   ```

2. **Recommendation Generation**
   ```javascript
   // In recommendations.js
   export const generateRecommendations = (scores, services) => {
     const recommendations = [];
     
     // Generate priority recommendations based on lowest scores
     const weakDimensions = getWeakDimensions(scores.dimensionScores);
     weakDimensions.forEach(dimension => {
       recommendations.push({
         area: `${dimension.name} Enhancement`,
         description: dimensionRecommendations[dimension.name],
         priority: dimension.priority,
         effort: dimension.score < 30 ? 'High' : 'Medium',
         impact: dimension.score < 30 ? 'Critical' : 'High'
       });
     });
     
     // Generate service-specific recommendations
     Object.entries(scores.serviceScores)
       .filter(([_, data]) => data.score < 50)
       .forEach(([service, data]) => {
         const recommendation = serviceRecommendations[service];
         if (recommendation) {
           recommendations.push({
             area: `${service.replace(/_/g, ' ')} Transformation`,
             description: recommendation.description,
             priority: 10 - Math.floor(data.score / 10), // Lower score = higher priority
             effort: recommendation.effort,
             impact: recommendation.impact
           });
         }
       });
     
     return recommendations;
   };
   ```

### React Component Integration

1. **Assessment Flow Orchestration**
   ```jsx
   // In AssessmentFlow.jsx
   function AssessmentFlow({ assessmentType }) {
     const [currentStep, setCurrentStep] = useState('email');
     const [progress, setProgress] = useState(0);
     
     // Callback for navigation
     const handleComplete = (step, data) => {
       // Save data from current step
       if (data) saveResponse(step, data);
       
       // Determine next step in flow
       const nextStep = getNextStep(step, assessmentType);
       setCurrentStep(nextStep);
       
       // Update progress indicator
       const progressValue = calculateProgress(nextStep, assessmentType);
       setProgress(progressValue);
     };
     
     // Render current component based on step
     return (
       <div className="assessment-container">
         <ProgressBar value={progress} />
         
         {currentStep === 'email' && (
           <EmailGate
             assessmentType={assessmentType}
             onComplete={(data) => handleComplete('email', data)}
             saveResponse={saveResponse}
             getResponse={getResponse}
             progress={progress}
           />
         )}
         
         {currentStep === 'services' && (
           <ServiceSelector
             assessmentType={assessmentType}
             onComplete={(data) => handleComplete('services', data)}
             onBack={() => handleComplete('back_to_email')}
             saveResponse={saveResponse}
             getResponse={getResponse}
             progress={progress}
           />
         )}
         
         {/* Similar patterns for other steps */}
       </div>
     );
   }
   ```

2. **Results Dashboard Implementation**
   ```jsx
   // In ResultsDashboard.jsx
   const generateResults = async () => {
     try {
       setIsLoading(true);
       
       // Step 1: Get all response data
       const email = getResponse('email');
       const services = getResponse('services');
       const qualifyingResponses = getResponse('qualifying');
       const serviceResponses = getResponse('serviceQuestions');
       
       // Step 2: Calculate scores using the scoring engine
       const scores = await calculateScores({
         qualifying: qualifyingResponses,
         services: serviceResponses
       }, services);
       
       // Step 3: Generate recommendations based on scores
       const recommendations = generateRecommendations(scores, services);
       
       // Step 4: Combine all calculation results
       const calculatedResults = {
         ...scores,
         recommendations,
         insights: generateInsights(scores, services),
         vulnerabilityMetrics: calculateVulnerabilityMetrics(scores)
       };
       
       // Step 5: Transform for UI consumption
       const adaptedResults = adaptResultsFormat(calculatedResults);
       setResults(adaptedResults);
     } catch (err) {
       console.error('Error generating results:', err);
       setError(`Failed to generate results: ${err.message}`);  
     } finally {
       setIsLoading(false);
     }
   };
   ```

### CSS Implementation Patterns

1. **Dynamic Class Application**
   ```jsx
   // In ResultsView.jsx - Applying risk level classes
   <div 
     className={`${styles.serviceCard} ${
       service.score < 40 ? styles.highRisk :
       service.score < 70 ? styles.mediumRisk :
       styles.lowRisk
     }`}
   >
     <h4 className={styles.serviceName}>{service.name}</h4>
     <div className={styles.scoreCircle}>{service.score}</div>
   </div>
   ```

2. **Grid Responsive Implementation**
   ```css
   /* In components.module.css */
   .serviceGrid {
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
     gap: 1.5rem;
     margin: 1.5rem 0;
   }
   
   /* Media query for smaller screens */
   @media (max-width: 768px) {
     .serviceGrid {
       grid-template-columns: 1fr; /* Single column on mobile */
     }
   }
   ```

3. **Score Circle Implementation**
   ```css
   .scoreCircle {
     width: 60px;
     height: 60px;
     border-radius: 50%;
     display: flex;
     align-items: center;
     justify-content: center;
     font-weight: bold;
     font-size: 1.25rem;
     background: linear-gradient(135deg, rgba(255,255,102,0.2) 0%, rgba(255,255,102,0.5) 100%);
     color: rgba(255, 255, 102, 0.9);
     border: 2px solid rgba(255, 255, 102, 0.6);
     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
     margin: 0.5rem 0;
   }
   ```

### Debug and Validation System

1. **Component Loading Verification**
   ```javascript
   // Add to component initialization to identify which version is loading
   useEffect(() => {
     console.log(`[DEBUG] Loading ${componentName} from path: ${__filename}`);
     console.log(`[DEBUG] Props received:`, props);
   }, []);
   ```

2. **Data Structure Validation**
   ```javascript
   // Validate result structure before rendering
   useEffect(() => {
     if (results) {
       console.log('Results structure validation:');
       console.log('- Executive section:', !!results.executive);
       console.log('- Readiness section:', !!results.readiness);
       console.log('- Opportunities section:', !!results.opportunities);
       console.log('- Roadmap section:', !!results.roadmap);
       
       // Deep validation of critical structures
       if (results.readiness && !results.readiness.dimensions) {
         console.error('Missing readiness.dimensions array!');
       }
       
       if (results.opportunities && !results.opportunities.immediate) {
         console.error('Missing opportunities.immediate object!');
       }
     }
   }, [results]);
   ```

## Current System Status & Future Extensibility

### Implemented Assessment Types

- **Agency Vulnerability Assessment** (Complete)
  - Full question flow with service selection
  - Scoring engine with multi-dimensional analysis
  - Enhanced results view with modular CSS styling
  - Complete recommendations and opportunity analysis

- **Inhouse Marketing Assessment** (Complete)
  - Specialized questions for internal marketing teams
  - Custom scoring model based on team size/capabilities
  - Results view with targeted recommendations

### Component Architecture Status

- **Core Architecture**
  - ✅ Centralized state management in AssessmentFlow
  - ✅ Consistent component patterns across assessments
  - ✅ Modular CSS with centralized styles
  - ✅ Data persistence via saveResponse/getResponse

- **Component Refactoring**
  - ✅ ServiceSelector - Refactored with proper props and error handling
  - ✅ QualifyingQuestions - Migrated to centralized state management
  - ✅ DynamicQuestions - Improved loading states and error handling
  - ✅ EmailGate - Updated to consistent pattern
  - ✅ ResultsDashboard - Enhanced with adaptResultsFormat

### Scoring & Data Processing

- **Data Flow**
  - ✅ Email capture and validation
  - ✅ Service selection with sector-specific options
  - ✅ Question flow with conditional logic
  - ✅ Score calculation with multi-dimensional weighting
  - ✅ Results adaptation for UI presentation

- **Recommendations Engine**
  - ✅ Priority-based immediate recommendations
  - ✅ Service-specific transformation suggestions
  - ✅ Strategic long-term opportunities
  - ✅ Valuation impact analysis

### Reporting Capabilities

- **Executive Summary**
  - ✅ Overall readiness score with interpretation
  - ✅ Key metrics with visual indicators
  - ✅ Competitive positioning

- **Detailed Analysis**
  - ✅ Dimension-by-dimension capability assessment
  - ✅ Service vulnerability analysis with risk levels
  - ✅ Transformation paths for vulnerable services
  - ✅ Roadmap with phased implementation approach

- **Visual Design**
  - ✅ Consistent card-based layouts
  - ✅ Responsive grid systems
  - ✅ Visual indicators for scores and risk levels
  - ✅ Semantic section organization

### Known Issues & Areas for Improvement

- **Technical Debt**
  - Directory structure has duplicated components in `/src/react-app`
  - Some React Router warnings related to outdated patterns
  - Limited test coverage for component rendering

- **Future Enhancements**
  - PDF export functionality for reports
  - Email sharing of results
  - Interactive comparison tools
  - Integration with calendaring for consultation booking

### Planned Future Assessments

- E-commerce readiness
- SaaS marketing maturity
- Professional services
- Retail transformation

### Feature Roadmap

- Multi-language support
- White-label capability
- API for partners
- Advanced analytics
- CRM integrations

### Technical Debt Prevention

- Documented conventions
- Automated testing
- Code review process
- Regular refactoring
- Performance budgets

#