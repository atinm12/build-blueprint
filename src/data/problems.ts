import type { IndustryId, TrackId } from './taxonomy'

export type SourceType = 'study' | 'report' | 'news'

export interface Source {
  title: string
  publisher: string
  year: number
  url: string
  type: SourceType
}

export interface Stat {
  value: string
  label: string
  /** index into `sources` */
  source: number
}

export interface Solution {
  name: string
  what: string
}

export interface Problem {
  id: string
  title: string
  oneLiner: string
  industry: IndustryId
  tracks: TrackId[]
  summary: string
  stats: Stat[]
  sources: Source[]
  solutions: Solution[]
  buildIdeas: string[]
  /** query used for live research + news lookups */
  query: string
  keywords: string[]
}

export const PROBLEMS: Problem[] = [
  // ───────────────────────── Healthcare ─────────────────────────
  {
    id: 'medication-adherence',
    title: 'Patients with chronic illness often don’t take their medication as prescribed',
    oneLiner: 'About half of people on long-term treatment skip, forget, or stop their meds.',
    industry: 'healthcare',
    tracks: ['health', 'ai', 'hardware'],
    summary:
      'For conditions like diabetes, high blood pressure, and asthma, roughly half of patients don’t follow their medication plan. Reasons include forgetting, cost, side effects, and confusing schedules. Poor adherence leads to avoidable hospital visits and worse outcomes, so even small improvements matter.',
    stats: [
      { value: '~50%', label: 'average adherence to long-term therapies in developed countries', source: 0 },
      { value: '125,000', label: 'US deaths per year estimated to be linked to non-adherence (cited review)', source: 1 },
    ],
    sources: [
      { title: 'Adherence to Long-Term Therapies: Evidence for Action', publisher: 'World Health Organization', year: 2003, url: 'https://iris.who.int/handle/10665/42682', type: 'report' },
      { title: 'Medication Adherence: WHO Cares?', publisher: 'Mayo Clinic Proceedings', year: 2011, url: 'https://doi.org/10.4065/mcp.2010.0575', type: 'study' },
    ],
    solutions: [
      { name: 'Medisafe', what: 'Pill reminder app with refill tracking' },
      { name: 'Hero Health', what: 'Smart pill dispenser for the home' },
    ],
    buildIdeas: [
      'A reminder system that adapts to a patient’s actual daily routine instead of fixed times',
      'A tool that explains side effects in plain language so patients don’t quit early',
    ],
    query: 'medication adherence chronic disease',
    keywords: ['medication', 'adherence', 'pill', 'prescription', 'chronic', 'reminder', 'patient', 'drug'],
  },
  {
    id: 'diagnostic-errors',
    title: 'Diagnostic errors cause serious, preventable harm',
    oneLiner: 'Missed or delayed diagnoses seriously harm hundreds of thousands of people a year.',
    industry: 'healthcare',
    tracks: ['ai', 'health'],
    summary:
      'A diagnosis can be missed, wrong, or delayed. The National Academies concluded that most people will experience at least one diagnostic error in their lifetime. A large 2023 study estimated that diagnostic errors lead to death or permanent disability for roughly 795,000 Americans each year, concentrated in a small number of conditions like stroke, sepsis, and cancers.',
    stats: [
      { value: '~795,000', label: 'Americans estimated to die or be permanently disabled by diagnostic error each year', source: 0 },
      { value: 'Most people', label: 'will experience at least one diagnostic error in their lifetime', source: 1 },
    ],
    sources: [
      { title: 'Burden of serious harms from diagnostic error in the USA', publisher: 'BMJ Quality & Safety', year: 2023, url: 'https://doi.org/10.1136/bmjqs-2021-014130', type: 'study' },
      { title: 'Improving Diagnosis in Health Care', publisher: 'National Academies of Sciences, Engineering, and Medicine', year: 2015, url: 'https://doi.org/10.17226/21794', type: 'report' },
    ],
    solutions: [
      { name: 'Isabel DDx', what: 'Differential diagnosis checklist for clinicians' },
      { name: 'Glass Health', what: 'AI-assisted clinical reasoning notes' },
    ],
    buildIdeas: [
      'A symptom-history organizer patients fill out before a visit so key details aren’t missed',
      'A “red flag” checklist helper for commonly missed conditions like stroke or sepsis',
    ],
    query: 'diagnostic error harm',
    keywords: ['diagnosis', 'diagnostic', 'misdiagnosis', 'error', 'doctor', 'clinician', 'symptom', 'hospital'],
  },
  {
    id: 'ehr-burden',
    title: 'Doctors spend more time on paperwork than with patients',
    oneLiner: 'For every hour with patients, physicians spend about two on electronic records and desk work.',
    industry: 'healthcare',
    tracks: ['ai', 'health'],
    summary:
      'A time-and-motion study of ambulatory physicians found that for every hour spent with patients, nearly two more hours went to electronic health records and desk work, plus more at home after hours. Documentation load is a major driver of burnout, which pushes clinicians out of the workforce.',
    stats: [
      { value: '~2 hrs', label: 'of EHR and desk work for every 1 hour of direct patient time', source: 0 },
      { value: '27%', label: 'of physicians’ office day spent on direct face time with patients', source: 0 },
    ],
    sources: [
      { title: 'Allocation of Physician Time in Ambulatory Practice: A Time and Motion Study in 4 Specialties', publisher: 'Annals of Internal Medicine', year: 2016, url: 'https://doi.org/10.7326/M16-0961', type: 'study' },
    ],
    solutions: [
      { name: 'Abridge', what: 'Generates clinical notes from recorded visits' },
      { name: 'Nuance DAX Copilot', what: 'Ambient AI documentation for clinicians' },
    ],
    buildIdeas: [
      'A tool that turns a visit transcript into a structured draft note the doctor can approve',
      'Smart forms that pre-fill from what the patient already submitted',
    ],
    query: 'physician burnout electronic health record documentation',
    keywords: ['doctor', 'physician', 'ehr', 'documentation', 'notes', 'burnout', 'paperwork', 'clinician', 'records'],
  },
  {
    id: 'maternity-deserts',
    title: 'Millions of women live far from any maternity care',
    oneLiner: 'Over 2.2 million women of childbearing age live in US counties with no obstetric care.',
    industry: 'healthcare',
    tracks: ['health', 'social-impact'],
    summary:
      'A “maternity care desert” is a county with no hospital offering obstetric care, no birth center, and no obstetric providers. March of Dimes found that over a third of US counties fall into this category. Long travel distances are linked to missed prenatal visits and worse outcomes for parents and babies.',
    stats: [
      { value: '2.2M+', label: 'women of childbearing age live in maternity care deserts', source: 0 },
      { value: '~1 in 3', label: 'US counties are maternity care deserts', source: 0 },
    ],
    sources: [
      { title: 'Nowhere to Go: Maternity Care Deserts Across the U.S.', publisher: 'March of Dimes', year: 2022, url: 'https://www.marchofdimes.org/maternity-care-deserts-report', type: 'report' },
    ],
    solutions: [
      { name: 'Babyscripts', what: 'Remote prenatal monitoring platform' },
      { name: 'Maven Clinic', what: 'Virtual women’s and family health clinic' },
    ],
    buildIdeas: [
      'A map that shows expecting parents their nearest care and transport options',
      'A prenatal check-in tool for rural clinics to flag high-risk symptoms early',
    ],
    query: 'maternity care deserts rural obstetric access',
    keywords: ['maternity', 'pregnancy', 'prenatal', 'obstetric', 'rural', 'birth', 'mothers', 'access'],
  },
  {
    id: 'older-adult-falls',
    title: 'Falls are a leading cause of injury for older adults',
    oneLiner: 'About 1 in 4 adults aged 65+ reports a fall each year.',
    industry: 'healthcare',
    tracks: ['health', 'hardware', 'ai'],
    summary:
      'Falls are the leading cause of injury and injury-related death among adults 65 and older in the US. Many older adults live alone, so a fall can go unnoticed for hours. Prevention (home safety, strength, medication review) and fast detection both reduce harm.',
    stats: [
      { value: '~1 in 4', label: 'adults 65+ report falling each year', source: 0 },
      { value: '#1', label: 'cause of injury and injury death for adults 65+', source: 0 },
    ],
    sources: [
      { title: 'Older Adult Falls Data', publisher: 'U.S. Centers for Disease Control and Prevention', year: 2024, url: 'https://www.cdc.gov/falls/data-research/index.html', type: 'report' },
    ],
    solutions: [
      { name: 'Apple Watch Fall Detection', what: 'Wearable that calls for help after a hard fall' },
      { name: 'SafelyYou', what: 'Camera-based fall detection for senior living' },
    ],
    buildIdeas: [
      'A home-safety walkthrough app that spots fall risks from phone photos',
      'A low-cost sensor that alerts family when someone hasn’t moved in a while',
    ],
    query: 'falls older adults prevention detection',
    keywords: ['falls', 'elderly', 'older', 'seniors', 'aging', 'injury', 'fall detection', 'caregiver'],
  },

  // ───────────────────────── Education ─────────────────────────
  {
    id: 'pandemic-learning-loss',
    title: 'Students fell behind in math and reading after the pandemic',
    oneLiner: 'US 9-year-olds saw the first-ever drop in math scores in the 50-year history of the test.',
    industry: 'education',
    tracks: ['edtech', 'ai'],
    summary:
      'The National Assessment of Educational Progress found that between 2020 and 2022, 9-year-olds’ math scores fell for the first time in the history of the long-term trend assessment, and reading saw its largest drop since 1990. Lower-performing students lost the most ground, widening existing gaps.',
    stats: [
      { value: '−7 pts', label: 'drop in 9-year-olds’ math scores, 2020→2022 (first ever decline)', source: 0 },
      { value: '−5 pts', label: 'drop in reading, the largest since 1990', source: 0 },
    ],
    sources: [
      { title: 'NAEP Long-Term Trend Assessment Results: Reading and Mathematics (2022)', publisher: 'National Center for Education Statistics', year: 2022, url: 'https://www.nationsreportcard.gov/highlights/ltt/2022/', type: 'report' },
    ],
    solutions: [
      { name: 'Khanmigo', what: 'AI tutor from Khan Academy' },
      { name: 'Zearn', what: 'Self-paced elementary math curriculum' },
    ],
    buildIdeas: [
      'A quick diagnostic that finds which earlier skill a student is missing',
      'A tutoring-matching tool connecting college volunteers with schools',
    ],
    query: 'pandemic learning loss math achievement',
    keywords: ['learning loss', 'math', 'reading', 'students', 'school', 'tutoring', 'test scores', 'k-12', 'covid'],
  },
  {
    id: 'chronic-absenteeism',
    title: 'Chronic absenteeism nearly doubled after COVID',
    oneLiner: 'The share of students missing 10%+ of school days jumped from ~15% to ~28%.',
    industry: 'education',
    tracks: ['edtech', 'social-impact', 'ai'],
    summary:
      'A student is chronically absent when they miss at least 10% of the school year. Research published in PNAS found the US rate rose from about 15% before the pandemic to about 28% in 2021–22, and that the increase was widespread across states and student groups. Missing school is strongly tied to falling behind and dropping out.',
    stats: [
      { value: '15% → 28%', label: 'chronic absenteeism rate, 2018–19 vs 2021–22', source: 0 },
    ],
    sources: [
      { title: 'Higher chronic absenteeism threatens academic recovery from the COVID-19 pandemic', publisher: 'Proceedings of the National Academy of Sciences (PNAS)', year: 2024, url: 'https://doi.org/10.1073/pnas.2312249121', type: 'study' },
    ],
    solutions: [
      { name: 'EveryDay Labs', what: 'Personalized attendance nudges sent to families' },
      { name: 'TalkingPoints', what: 'Translated family–teacher messaging' },
    ],
    buildIdeas: [
      'An early-warning dashboard that flags students trending toward chronic absence',
      'A family messaging tool that explains why attendance matters, in their language',
    ],
    query: 'chronic absenteeism students school attendance',
    keywords: ['absenteeism', 'attendance', 'absent', 'school', 'students', 'truancy', 'engagement'],
  },
  {
    id: 'college-completion',
    title: 'About 4 in 10 college students don’t finish within six years',
    oneLiner: 'Six-year completion rates hover around 62%, leaving many with debt and no degree.',
    industry: 'education',
    tracks: ['edtech', 'social-impact', 'ai'],
    summary:
      'The National Student Clearinghouse tracks students who start college and finds that only about 62% earn a degree or certificate within six years. Students who leave often cite cost, work and family obligations, and feeling lost navigating college systems. Many still carry loans without the earnings boost of a credential.',
    stats: [
      { value: '~62%', label: 'six-year college completion rate (Fall 2017 starting cohort)', source: 0 },
    ],
    sources: [
      { title: 'Completing College: National and State Reports', publisher: 'National Student Clearinghouse Research Center', year: 2023, url: 'https://nscresearchcenter.org/completing-college/', type: 'report' },
    ],
    solutions: [
      { name: 'EAB Navigate', what: 'Student success platform used by advisors' },
      { name: 'Mainstay', what: 'Text-message nudges for college students' },
    ],
    buildIdeas: [
      'A “what do I do next” guide that walks first-gen students through deadlines and forms',
      'A peer-matching app that connects at-risk students with upperclassmen mentors',
    ],
    query: 'college dropout completion retention',
    keywords: ['college', 'dropout', 'retention', 'completion', 'university', 'first-generation', 'graduation', 'degree'],
  },
  {
    id: 'homework-gap',
    title: 'Some students can’t finish homework because they lack internet',
    oneLiner: 'Nearly 1 in 5 US teens say they sometimes can’t finish homework due to the digital divide.',
    industry: 'education',
    tracks: ['edtech', 'social-impact'],
    summary:
      'A Pew Research Center survey found that 17% of US teens are often or sometimes unable to complete homework because they lack a reliable computer or internet connection. The share rises sharply for teens in lower-income and Black households, where students may rely on phones or public Wi-Fi.',
    stats: [
      { value: '17%', label: 'of teens often/sometimes can’t finish homework due to lack of computer or internet', source: 0 },
      { value: '15%', label: 'of US households with school-age children lack high-speed home internet', source: 0 },
    ],
    sources: [
      { title: 'Nearly one-in-five teens can’t always finish their homework because of the digital divide', publisher: 'Pew Research Center', year: 2018, url: 'https://www.pewresearch.org/short-reads/2018/10/26/nearly-one-in-five-teens-cant-always-finish-their-homework-because-of-the-digital-divide/', type: 'report' },
    ],
    solutions: [
      { name: 'Kolibri', what: 'Offline-first learning platform' },
      { name: 'EveryoneOn', what: 'Finds low-cost internet and devices' },
    ],
    buildIdeas: [
      'An offline-first homework app that syncs when a connection is available',
      'A map of free Wi-Fi spots and study spaces near students’ homes',
    ],
    query: 'digital divide homework gap students internet access',
    keywords: ['digital divide', 'internet', 'broadband', 'homework', 'wifi', 'students', 'devices', 'connectivity'],
  },
  {
    id: 'reading-proficiency',
    title: 'Only about a third of US 4th graders read proficiently',
    oneLiner: 'Two-thirds of fourth graders score below “proficient” in reading.',
    industry: 'education',
    tracks: ['edtech', 'ai', 'accessibility'],
    summary:
      'On the 2022 NAEP reading assessment, about 33% of fourth graders performed at or above the proficient level. Reading skills by the end of third grade predict later school success, and struggling readers—including those with undiagnosed dyslexia—often fall further behind each year.',
    stats: [
      { value: '33%', label: 'of 4th graders at or above NAEP Proficient in reading (2022)', source: 0 },
    ],
    sources: [
      { title: 'NAEP Reading: National Achievement-Level Results (2022)', publisher: 'National Center for Education Statistics', year: 2022, url: 'https://www.nationsreportcard.gov/highlights/reading/2022/', type: 'report' },
    ],
    solutions: [
      { name: 'Amira Learning', what: 'AI reading tutor that listens to kids read aloud' },
      { name: 'Ello', what: 'Reading coach app for young children' },
    ],
    buildIdeas: [
      'A read-aloud app that tracks fluency and spots signs of dyslexia early',
      'A picture-book generator that matches a child’s reading level and interests',
    ],
    query: 'early reading literacy elementary students',
    keywords: ['reading', 'literacy', 'dyslexia', 'children', 'books', 'elementary', 'phonics'],
  },

  // ───────────────────────── Climate & Energy ─────────────────────────
  {
    id: 'building-energy',
    title: 'Buildings are a major source of energy use and emissions',
    oneLiner: 'Operating buildings uses about 30% of global final energy.',
    industry: 'climate',
    tracks: ['sustainability', 'hardware', 'ai'],
    summary:
      'Heating, cooling, lighting, and appliances in homes and offices account for roughly 30% of global final energy consumption and about a quarter of energy-related emissions, according to the International Energy Agency. Much of that energy is wasted through poor insulation, inefficient equipment, and running systems when nobody is there.',
    stats: [
      { value: '~30%', label: 'of global final energy consumption comes from building operations', source: 0 },
      { value: '~26%', label: 'of global energy-related emissions', source: 0 },
    ],
    sources: [
      { title: 'Buildings — Energy System', publisher: 'International Energy Agency', year: 2023, url: 'https://www.iea.org/energy-system/buildings', type: 'report' },
    ],
    solutions: [
      { name: 'Google Nest', what: 'Learning smart thermostat' },
      { name: 'Sense', what: 'Home energy monitor that identifies devices' },
    ],
    buildIdeas: [
      'A tool that estimates savings from upgrades using a photo of a utility bill',
      'An occupancy-aware controller for dorm or classroom heating and cooling',
    ],
    query: 'building energy efficiency consumption',
    keywords: ['energy', 'buildings', 'heating', 'cooling', 'electricity', 'efficiency', 'thermostat', 'emissions', 'hvac'],
  },
  {
    id: 'e-waste',
    title: 'Most electronic waste is never properly recycled',
    oneLiner: 'The world produced 62 million tonnes of e-waste in 2022; only ~22% was documented as recycled.',
    industry: 'climate',
    tracks: ['sustainability', 'hardware'],
    summary:
      'Old phones, laptops, and appliances contain valuable metals and toxic materials. The Global E-waste Monitor found e-waste is growing about five times faster than documented recycling. Most of it ends up in landfills, is burned, or is handled informally in ways that harm workers and the environment.',
    stats: [
      { value: '62M tonnes', label: 'of e-waste generated worldwide in 2022', source: 0 },
      { value: '22.3%', label: 'documented as properly collected and recycled', source: 0 },
    ],
    sources: [
      { title: 'The Global E-waste Monitor 2024', publisher: 'ITU & UNITAR', year: 2024, url: 'https://ewastemonitor.info/the-global-e-waste-monitor-2024/', type: 'report' },
    ],
    solutions: [
      { name: 'Back Market', what: 'Marketplace for refurbished electronics' },
      { name: 'iFixit', what: 'Repair guides and parts' },
    ],
    buildIdeas: [
      'A campus device drop-off locator with pickup scheduling',
      'An app that tells you whether a broken device is worth repairing and where',
    ],
    query: 'electronic waste recycling',
    keywords: ['e-waste', 'electronics', 'recycling', 'devices', 'phones', 'repair', 'landfill', 'waste'],
  },
  {
    id: 'extreme-heat',
    title: 'Extreme heat kills more people as temperatures rise',
    oneLiner: 'Roughly 489,000 heat-related deaths occurred each year between 2000 and 2019.',
    industry: 'climate',
    tracks: ['sustainability', 'health', 'hardware'],
    summary:
      'The World Health Organization estimates about 489,000 heat-related deaths per year from 2000 to 2019. Older adults, outdoor workers, and people without air conditioning are most at risk. Heat waves are becoming more frequent and intense, and many deaths are preventable with early warning and cooling access.',
    stats: [
      { value: '~489,000', label: 'heat-related deaths per year globally (2000–2019)', source: 0 },
    ],
    sources: [
      { title: 'Climate change and heat and health — fact sheet', publisher: 'World Health Organization', year: 2024, url: 'https://www.who.int/news-room/fact-sheets/detail/climate-change-heat-and-health', type: 'report' },
    ],
    solutions: [
      { name: 'HeatRisk (NWS/CDC)', what: 'Color-coded heat risk forecast' },
      { name: 'Local cooling center finders', what: 'City maps of public cooling sites' },
    ],
    buildIdeas: [
      'A check-in service that texts vulnerable neighbors during heat waves',
      'A street-level heat map built from cheap temperature sensors',
    ],
    query: 'extreme heat mortality heatwave',
    keywords: ['heat', 'heatwave', 'temperature', 'climate', 'cooling', 'air conditioning', 'heat stroke'],
  },
  {
    id: 'wildfire-smoke',
    title: 'Wildfire smoke is undoing decades of air-quality progress',
    oneLiner: 'Smoke has reversed improvements in fine particle pollution across much of the US.',
    industry: 'climate',
    tracks: ['sustainability', 'ai', 'hardware'],
    summary:
      'A 2023 study in Nature found that wildfire smoke has stalled or reversed gains in fine particulate (PM2.5) air quality in most US states since about 2016. Smoke travels hundreds of miles, so people far from any fire breathe it. Better local monitoring and alerts help people protect themselves.',
    stats: [
      { value: '~3 of 4', label: 'US states where smoke stalled or reversed PM2.5 improvements', source: 0 },
    ],
    sources: [
      { title: 'The contribution of wildfire to PM2.5 trends in the USA', publisher: 'Nature', year: 2023, url: 'https://doi.org/10.1038/s41586-023-06522-6', type: 'study' },
    ],
    solutions: [
      { name: 'Watch Duty', what: 'Real-time wildfire alerts app' },
      { name: 'PurpleAir', what: 'Low-cost community air-quality sensors' },
      { name: 'Pano AI', what: 'Camera-based wildfire detection' },
    ],
    buildIdeas: [
      'An app that tells you when to close windows or run a filter using nearby sensors',
      'A DIY air purifier build guide with a sensor that proves it works',
    ],
    query: 'wildfire smoke air quality PM2.5',
    keywords: ['wildfire', 'smoke', 'air quality', 'pm2.5', 'fire', 'pollution', 'sensor'],
  },
  {
    id: 'textile-waste',
    title: 'Clothing is rarely recycled into new clothing',
    oneLiner: 'Less than 1% of material used to make clothes is recycled into new clothes.',
    industry: 'climate',
    tracks: ['sustainability'],
    summary:
      'The Ellen MacArthur Foundation found the equivalent of one garbage truck of textiles is landfilled or burned every second, and less than 1% of clothing material is recycled into new clothing. Fast fashion has increased how much we buy while cutting how long we wear each item.',
    stats: [
      { value: '<1%', label: 'of clothing material is recycled into new clothing', source: 0 },
      { value: '1 truck/sec', label: 'of textiles landfilled or burned', source: 0 },
    ],
    sources: [
      { title: 'A New Textiles Economy: Redesigning Fashion’s Future', publisher: 'Ellen MacArthur Foundation', year: 2017, url: 'https://www.ellenmacarthurfoundation.org/a-new-textiles-economy', type: 'report' },
    ],
    solutions: [
      { name: 'ThredUp', what: 'Online secondhand clothing marketplace' },
      { name: 'Depop', what: 'Peer-to-peer resale app' },
    ],
    buildIdeas: [
      'A campus clothing-swap app with sizes and pickup spots',
      'A tool that estimates the cost-per-wear and footprint of a purchase before you buy',
    ],
    query: 'textile waste fast fashion recycling',
    keywords: ['clothing', 'fashion', 'textile', 'apparel', 'recycling', 'secondhand', 'waste', 'thrift'],
  },

  // ───────────────────────── Finance ─────────────────────────
  {
    id: 'financial-literacy',
    title: 'Most adults worldwide aren’t financially literate',
    oneLiner: 'Only about 1 in 3 adults globally understands basic financial concepts.',
    industry: 'finance',
    tracks: ['fintech', 'edtech'],
    summary:
      'The S&P Global FinLit Survey, covering 140+ countries, found that only about one-third of adults understand at least three of four basic concepts: interest, compound interest, inflation, and risk diversification. Low financial literacy is linked to more debt, less saving, and higher vulnerability to scams.',
    stats: [
      { value: '33%', label: 'of adults worldwide are financially literate', source: 0 },
      { value: '57%', label: 'of US adults are financially literate', source: 0 },
    ],
    sources: [
      { title: 'S&P Global FinLit Survey', publisher: 'Global Financial Literacy Excellence Center (GFLEC)', year: 2015, url: 'https://gflec.org/initiatives/sp-global-finlit-survey/', type: 'study' },
    ],
    solutions: [
      { name: 'Zogo', what: 'Gamified financial-literacy lessons' },
      { name: 'Next Gen Personal Finance', what: 'Free personal finance curriculum' },
    ],
    buildIdeas: [
      'A simulator showing how a credit card balance grows when paying the minimum',
      'Bite-sized money lessons tied to real moments (first paycheck, first lease)',
    ],
    query: 'financial literacy young adults',
    keywords: ['financial literacy', 'money', 'budget', 'credit', 'interest', 'savings', 'personal finance'],
  },
  {
    id: 'unbanked',
    title: 'Over a billion adults have no bank account',
    oneLiner: '1.4 billion adults worldwide and ~5.6 million US households are unbanked.',
    industry: 'finance',
    tracks: ['fintech', 'social-impact'],
    summary:
      'Without a bank account, people pay more for basic services like check cashing and money transfers, and have a harder time saving or building credit. The World Bank Global Findex found 1.4 billion adults worldwide are unbanked; the FDIC found about 4.2% of US households had no checking or savings account in 2023.',
    stats: [
      { value: '1.4B', label: 'adults worldwide without an account (2021)', source: 0 },
      { value: '4.2%', label: 'of US households unbanked (2023)', source: 1 },
    ],
    sources: [
      { title: 'The Global Findex Database 2021', publisher: 'World Bank', year: 2022, url: 'https://www.worldbank.org/en/publication/globalfindex', type: 'report' },
      { title: 'FDIC National Survey of Unbanked and Underbanked Households', publisher: 'Federal Deposit Insurance Corporation', year: 2024, url: 'https://www.fdic.gov/household-survey', type: 'report' },
    ],
    solutions: [
      { name: 'M-Pesa', what: 'Mobile money service in East Africa' },
      { name: 'Chime', what: 'Fee-free mobile banking in the US' },
    ],
    buildIdeas: [
      'A guide that finds the cheapest account a person qualifies for, including ID requirements',
      'A tool comparing the true cost of check cashing vs. a free account over a year',
    ],
    query: 'unbanked financial inclusion',
    keywords: ['unbanked', 'bank account', 'financial inclusion', 'mobile money', 'banking', 'check cashing'],
  },
  {
    id: 'emergency-savings',
    title: 'Many adults couldn’t cover a $400 emergency',
    oneLiner: 'About 37% of US adults couldn’t cover a $400 surprise expense with cash.',
    industry: 'finance',
    tracks: ['fintech'],
    summary:
      'The Federal Reserve’s annual survey found that 63% of adults would cover a hypothetical $400 emergency expense using cash or its equivalent; the rest would borrow, sell something, or couldn’t pay. Small shocks like a car repair can spiral into high-interest debt.',
    stats: [
      { value: '63%', label: 'of US adults would cover a $400 emergency with cash or equivalent (2023)', source: 0 },
    ],
    sources: [
      { title: 'Economic Well-Being of U.S. Households (SHED)', publisher: 'Board of Governors of the Federal Reserve System', year: 2024, url: 'https://www.federalreserve.gov/publications/report-economic-well-being-us-households.htm', type: 'report' },
    ],
    solutions: [
      { name: 'Digit / Oportun', what: 'Automatic savings based on spending' },
      { name: 'SaverLife', what: 'Rewards for building a savings habit' },
    ],
    buildIdeas: [
      'A round-up savings goal app built for irregular gig-work income',
      'A “bill shock” predictor that warns you a week before your balance runs low',
    ],
    query: 'emergency savings financial fragility households',
    keywords: ['savings', 'emergency', 'paycheck', 'expense', 'debt', 'financial stress', 'income'],
  },
  {
    id: 'fraud-scams',
    title: 'Consumers lose billions to scams every year',
    oneLiner: 'Americans reported losing more than $10 billion to fraud in 2023.',
    industry: 'finance',
    tracks: ['fintech', 'ai'],
    summary:
      'The Federal Trade Commission reported that consumers lost over $10 billion to fraud in 2023, the first time losses passed that mark. Investment scams and impostor scams caused the biggest losses, and scams increasingly start through text messages and social media.',
    stats: [
      { value: '$10B+', label: 'in reported US consumer fraud losses in 2023', source: 0 },
    ],
    sources: [
      { title: 'As Nationwide Fraud Losses Top $10 Billion in 2023, FTC Steps Up Efforts to Protect the Public', publisher: 'Federal Trade Commission', year: 2024, url: 'https://www.ftc.gov/news-events/news/press-releases/2024/02/nationwide-fraud-losses-top-10-billion-2023-ftc-steps-efforts-protect-public', type: 'news' },
    ],
    solutions: [
      { name: 'Truecaller', what: 'Spam and scam call identification' },
      { name: 'Norton Genie', what: 'AI scam checker for messages' },
    ],
    buildIdeas: [
      'A “is this a scam?” checker for texts and screenshots with a plain-language explanation',
      'A browser extension that warns grandparents before they send gift cards or crypto',
    ],
    query: 'consumer fraud scams online',
    keywords: ['scam', 'fraud', 'phishing', 'impostor', 'identity theft', 'security', 'elderly'],
  },
  {
    id: 'medical-debt',
    title: 'Medical bills are the most common debt on credit reports',
    oneLiner: 'About $88 billion in medical bills sit on Americans’ credit reports.',
    industry: 'finance',
    tracks: ['fintech', 'health'],
    summary:
      'The Consumer Financial Protection Bureau estimated $88 billion in medical debt on consumer credit reports, making it the most common collection item. Medical bills are often confusing, contain errors, and arrive after the fact, and many people don’t know about charity care or payment programs they qualify for.',
    stats: [
      { value: '$88B', label: 'in medical bills on US credit reports', source: 0 },
    ],
    sources: [
      { title: 'CFPB Estimates $88 Billion in Medical Bills on Credit Reports', publisher: 'Consumer Financial Protection Bureau', year: 2022, url: 'https://www.consumerfinance.gov/about-us/newsroom/cfpb-estimates-88-billion-in-medical-bills-on-credit-reports/', type: 'news' },
    ],
    solutions: [
      { name: 'Undue Medical Debt', what: 'Nonprofit that buys and forgives medical debt' },
      { name: 'Dollar For', what: 'Helps patients apply for hospital charity care' },
    ],
    buildIdeas: [
      'A bill decoder that flags duplicate or suspicious charges on an itemized bill',
      'A charity-care eligibility checker for a patient’s hospital',
    ],
    query: 'medical debt patients hospital bills',
    keywords: ['medical debt', 'hospital bills', 'healthcare costs', 'credit', 'insurance', 'billing'],
  },

  // ───────────────────────── Food & Agriculture ─────────────────────────
  {
    id: 'food-waste',
    title: 'Around a fifth of food is wasted while people go hungry',
    oneLiner: 'Over 1 billion tonnes of food were wasted in 2022, mostly in households.',
    industry: 'food',
    tracks: ['sustainability', 'ai'],
    summary:
      'UNEP’s Food Waste Index found that about 1.05 billion tonnes of food—roughly 19% of food available to consumers—was wasted in 2022, with households responsible for about 60% of it. Wasted food also wastes the water, land, and energy used to produce it.',
    stats: [
      { value: '1.05B tonnes', label: 'of food wasted globally in 2022', source: 0 },
      { value: '~60%', label: 'of food waste happens in households', source: 0 },
    ],
    sources: [
      { title: 'Food Waste Index Report 2024', publisher: 'UN Environment Programme', year: 2024, url: 'https://www.unep.org/resources/publication/food-waste-index-report-2024', type: 'report' },
    ],
    solutions: [
      { name: 'Too Good To Go', what: 'Discounted surplus food from restaurants' },
      { name: 'Olio', what: 'Neighbor-to-neighbor food sharing' },
    ],
    buildIdeas: [
      'A fridge tracker that suggests recipes for food about to expire',
      'A dining-hall leftovers alert that pings students before food is thrown out',
    ],
    query: 'food waste household reduction',
    keywords: ['food waste', 'leftovers', 'groceries', 'expiration', 'compost', 'restaurant', 'dining hall'],
  },
  {
    id: 'college-food-insecurity',
    title: 'College students go hungry while eligible for help they don’t use',
    oneLiner: 'Nearly 2 million at-risk students eligible for SNAP didn’t receive it.',
    industry: 'food',
    tracks: ['social-impact'],
    summary:
      'A US Government Accountability Office review found that many college students face food insecurity, and that nearly 2 million at-risk students who were potentially eligible for SNAP benefits did not report receiving them. Confusing eligibility rules and stigma keep students from getting help.',
    stats: [
      { value: '~2M', label: 'potentially SNAP-eligible at-risk students not receiving benefits (2016)', source: 0 },
    ],
    sources: [
      { title: 'Food Insecurity: Better Information Could Help Eligible College Students Access Federal Food Assistance Benefits (GAO-19-95)', publisher: 'U.S. Government Accountability Office', year: 2018, url: 'https://www.gao.gov/products/gao-19-95', type: 'report' },
    ],
    solutions: [
      { name: 'Swipe Out Hunger', what: 'Students donate unused meal swipes' },
      { name: 'Campus food pantries', what: 'On-campus free food programs' },
    ],
    buildIdeas: [
      'A 2-minute SNAP eligibility screener written for college students',
      'An anonymous meal-swipe sharing app for a campus',
    ],
    query: 'food insecurity college students',
    keywords: ['food insecurity', 'hunger', 'college', 'students', 'snap', 'food pantry', 'meal'],
  },
  {
    id: 'agriculture-water',
    title: 'Farming uses most of the world’s freshwater',
    oneLiner: 'Agriculture accounts for about 70% of global freshwater withdrawals.',
    industry: 'food',
    tracks: ['sustainability', 'hardware', 'ai'],
    summary:
      'According to FAO’s AQUASTAT, agriculture—mostly irrigation—accounts for roughly 70% of freshwater withdrawals worldwide. Much irrigation water is lost to evaporation and runoff, and droughts are making water scarcer. Watering based on actual soil moisture can cut use significantly.',
    stats: [
      { value: '~70%', label: 'of global freshwater withdrawals go to agriculture', source: 0 },
    ],
    sources: [
      { title: 'AQUASTAT — FAO’s Global Information System on Water and Agriculture', publisher: 'Food and Agriculture Organization of the UN', year: 2023, url: 'https://www.fao.org/aquastat/en/', type: 'report' },
    ],
    solutions: [
      { name: 'CropX', what: 'Soil sensors and irrigation analytics' },
      { name: 'Netafim', what: 'Drip irrigation systems' },
    ],
    buildIdeas: [
      'A low-cost soil moisture sensor that texts a farmer when to water',
      'A garden-watering scheduler that uses local weather forecasts',
    ],
    query: 'agricultural irrigation water use efficiency',
    keywords: ['water', 'irrigation', 'farming', 'agriculture', 'drought', 'soil', 'crops'],
  },
  {
    id: 'crop-pests',
    title: 'Pests and plant disease destroy a large share of crops',
    oneLiner: 'Up to 40% of global crop production is lost to pests each year.',
    industry: 'food',
    tracks: ['ai', 'sustainability', 'hardware'],
    summary:
      'The FAO estimates that up to 40% of global crop production is lost to plant pests and diseases every year. Smallholder farmers often can’t identify a disease until it has spread, and overusing pesticides harms soil and health. Early, accurate identification is key.',
    stats: [
      { value: 'Up to 40%', label: 'of global crop production lost to pests annually', source: 0 },
    ],
    sources: [
      { title: 'Climate change fans spread of pests and threatens plants and crops, new FAO study', publisher: 'Food and Agriculture Organization of the UN', year: 2021, url: 'https://www.fao.org/newsroom/detail/Climate-change-fans-spread-of-pests-and-threatens-plants-and-crops-new-FAO-study/en', type: 'news' },
    ],
    solutions: [
      { name: 'Plantix', what: 'Crop disease diagnosis from a photo' },
      { name: 'PlantVillage Nuru', what: 'Offline AI crop disease assistant' },
    ],
    buildIdeas: [
      'A photo-based plant disease identifier that works offline',
      'A community map that shows pest outbreaks reported by nearby farmers',
    ],
    query: 'crop loss plant pests disease detection',
    keywords: ['crops', 'pests', 'plant disease', 'farming', 'agriculture', 'pesticide', 'farmers'],
  },
  {
    id: 'household-food-insecurity',
    title: 'Millions of US households don’t always have enough food',
    oneLiner: '13.5% of US households were food insecure in 2023.',
    industry: 'food',
    tracks: ['social-impact'],
    summary:
      'The USDA reported that 13.5% of US households—about 18 million—were food insecure at some point in 2023, meaning they lacked reliable access to enough food. Rates are higher for households with children and in rural areas. Many eligible families don’t use programs like SNAP or WIC.',
    stats: [
      { value: '13.5%', label: 'of US households were food insecure in 2023', source: 0 },
    ],
    sources: [
      { title: 'Food Security in the U.S. — Key Statistics & Graphics', publisher: 'USDA Economic Research Service', year: 2024, url: 'https://www.ers.usda.gov/topics/food-nutrition-assistance/food-security-in-the-u-s/key-statistics-graphics', type: 'report' },
    ],
    solutions: [
      { name: 'Propel', what: 'App for managing SNAP/EBT benefits' },
      { name: 'Feeding America food bank locator', what: 'Find local food banks' },
    ],
    buildIdeas: [
      'A food-pantry finder with real-time hours and what’s in stock',
      'A meal planner that stretches a SNAP budget across the month',
    ],
    query: 'food insecurity household SNAP',
    keywords: ['food insecurity', 'hunger', 'snap', 'wic', 'food bank', 'families', 'groceries'],
  },

  // ───────────────────────── Mental Health ─────────────────────────
  {
    id: 'teen-sadness',
    title: 'Teen sadness and hopelessness are at record highs',
    oneLiner: '42% of US high schoolers felt persistently sad or hopeless in 2021.',
    industry: 'mental-health',
    tracks: ['health', 'social-impact'],
    summary:
      'The CDC’s Youth Risk Behavior Survey found that 42% of high school students felt persistently sad or hopeless in 2021, up from 28% in 2011, with 57% of teen girls reporting these feelings. Many teens don’t know where to turn or face long waits for care.',
    stats: [
      { value: '42%', label: 'of high schoolers felt persistently sad or hopeless (2021)', source: 0 },
      { value: '57%', label: 'of teen girls reported the same', source: 0 },
    ],
    sources: [
      { title: 'Youth Risk Behavior Survey: Data Summary & Trends Report 2011–2021', publisher: 'U.S. Centers for Disease Control and Prevention', year: 2023, url: 'https://www.cdc.gov/healthyyouth/data/yrbs/pdf/YRBS_Data-Summary-Trends_Report2023_508.pdf', type: 'report' },
    ],
    solutions: [
      { name: 'Crisis Text Line', what: 'Free 24/7 text support' },
      { name: 'Hazel Health', what: 'School-based virtual therapy' },
    ],
    buildIdeas: [
      'A peer-support check-in app for a school with escalation to a counselor',
      'A resource navigator that helps a teen find the right kind of help in under a minute',
    ],
    query: 'adolescent depression hopelessness youth mental health',
    keywords: ['teens', 'youth', 'depression', 'sadness', 'mental health', 'anxiety', 'students', 'adolescent'],
  },
  {
    id: 'mental-health-treatment-gap',
    title: 'Most adults with mental illness don’t get treatment',
    oneLiner: 'About 1 in 5 US adults has a mental illness; fewer than half received treatment.',
    industry: 'mental-health',
    tracks: ['health', 'ai'],
    summary:
      'The National Institute of Mental Health estimates that about 22.8% of US adults lived with a mental illness in 2021, and only about 47% of them received mental health services. Cost, provider shortages, long waitlists, and stigma all keep people from care.',
    stats: [
      { value: '22.8%', label: 'of US adults lived with any mental illness (2021)', source: 0 },
      { value: '47.2%', label: 'of them received mental health treatment', source: 0 },
    ],
    sources: [
      { title: 'Mental Illness — Statistics', publisher: 'National Institute of Mental Health', year: 2023, url: 'https://www.nimh.nih.gov/health/statistics/mental-illness', type: 'report' },
    ],
    solutions: [
      { name: 'Headspace / Calm', what: 'Self-guided meditation and wellbeing apps' },
      { name: 'Talkspace', what: 'Online therapy by text and video' },
    ],
    buildIdeas: [
      'A therapist finder that filters by insurance, price, and who has openings now',
      'A between-sessions journaling tool that summarizes your week for your therapist',
    ],
    query: 'mental health treatment gap access barriers',
    keywords: ['mental health', 'therapy', 'treatment', 'depression', 'anxiety', 'therapist', 'counseling', 'access'],
  },
  {
    id: 'loneliness',
    title: 'Loneliness is a public health epidemic',
    oneLiner: 'About half of US adults report loneliness, with health risks like smoking 15 cigarettes a day.',
    industry: 'mental-health',
    tracks: ['social-impact', 'health'],
    summary:
      'The US Surgeon General’s 2023 advisory reported that about half of US adults experience loneliness. Lacking social connection raises the risk of premature death comparably to smoking up to 15 cigarettes a day, and increases risk of heart disease, stroke, dementia, depression, and anxiety.',
    stats: [
      { value: '~50%', label: 'of US adults report experiencing loneliness', source: 0 },
      { value: '15 cigarettes', label: 'per day — the mortality impact of social disconnection', source: 0 },
    ],
    sources: [
      { title: 'Our Epidemic of Loneliness and Isolation: The U.S. Surgeon General’s Advisory', publisher: 'U.S. Department of Health and Human Services', year: 2023, url: 'https://www.hhs.gov/sites/default/files/surgeon-general-social-connection-advisory.pdf', type: 'report' },
    ],
    solutions: [
      { name: 'Meetup', what: 'Local interest-based groups' },
      { name: 'Papa', what: 'Companionship visits for older adults' },
    ],
    buildIdeas: [
      'An app that matches new students for low-pressure weekly activities',
      'A “call your people” nudge tool that helps you keep in touch with friends',
    ],
    query: 'loneliness social isolation health',
    keywords: ['loneliness', 'isolation', 'social connection', 'friends', 'community', 'elderly', 'lonely'],
  },
  {
    id: 'postpartum-depression',
    title: 'Postpartum depression often goes undiagnosed',
    oneLiner: 'About 1 in 8 women with a recent live birth have symptoms of postpartum depression.',
    industry: 'mental-health',
    tracks: ['health', 'ai'],
    summary:
      'The CDC reports that about 1 in 8 women with a recent live birth experience symptoms of postpartum depression. Many aren’t screened or don’t seek help because symptoms are mistaken for normal exhaustion, or because of stigma. Untreated, it affects both parent and child.',
    stats: [
      { value: '~1 in 8', label: 'women with a recent live birth report postpartum depressive symptoms', source: 0 },
    ],
    sources: [
      { title: 'Depression During and After Pregnancy', publisher: 'U.S. Centers for Disease Control and Prevention', year: 2024, url: 'https://www.cdc.gov/reproductive-health/depression/index.html', type: 'report' },
    ],
    solutions: [
      { name: 'Postpartum Support International', what: 'Helpline and support groups' },
      { name: 'Mahmee', what: 'Maternal care coordination platform' },
    ],
    buildIdeas: [
      'A gentle weekly mood check-in for new parents with a clear “talk to someone” path',
      'A partner-facing app that explains warning signs and how to help',
    ],
    query: 'postpartum depression screening',
    keywords: ['postpartum', 'pregnancy', 'new parents', 'mothers', 'depression', 'maternal', 'screening'],
  },
  {
    id: 'youth-social-media',
    title: 'Heavy social media use is linked to youth mental health risks',
    oneLiner: 'Teens using social media 3+ hours a day face double the risk of depression and anxiety symptoms.',
    industry: 'mental-health',
    tracks: ['social-impact', 'ai'],
    summary:
      'The US Surgeon General’s 2023 advisory notes that up to 95% of 13–17 year-olds use social media and over a third say they use it “almost constantly.” Adolescents spending more than three hours a day on social media face double the risk of depression and anxiety symptoms.',
    stats: [
      { value: 'Up to 95%', label: 'of 13–17 year-olds use social media', source: 0 },
      { value: '2×', label: 'risk of depression/anxiety symptoms at 3+ hours a day', source: 0 },
    ],
    sources: [
      { title: 'Social Media and Youth Mental Health: The U.S. Surgeon General’s Advisory', publisher: 'U.S. Department of Health and Human Services', year: 2023, url: 'https://www.hhs.gov/sites/default/files/sg-youth-mental-health-social-media-advisory.pdf', type: 'report' },
    ],
    solutions: [
      { name: 'Screen Time / Digital Wellbeing', what: 'Built-in phone usage limits' },
      { name: 'one sec', what: 'Adds a pause before opening distracting apps' },
    ],
    buildIdeas: [
      'A friend-group challenge app that rewards time offline together',
      'A feed “nutrition label” that shows how your scrolling time breaks down',
    ],
    query: 'social media use adolescent mental health',
    keywords: ['social media', 'screen time', 'teens', 'phone', 'instagram', 'tiktok', 'youth', 'mental health'],
  },

  // ───────────────────────── Accessibility ─────────────────────────
  {
    id: 'web-accessibility',
    title: 'Nearly every popular website has accessibility failures',
    oneLiner: '95.9% of the top million home pages had detectable WCAG failures.',
    industry: 'accessibility',
    tracks: ['accessibility', 'ai'],
    summary:
      'WebAIM’s annual scan of the top 1,000,000 home pages found detectable accessibility failures on 95.9% of them in 2024, averaging over 56 errors per page. The most common issues—low-contrast text, missing image alt text, and unlabeled buttons and form fields—block people using screen readers and other assistive tech.',
    stats: [
      { value: '95.9%', label: 'of top 1M home pages had detected WCAG 2 failures (2024)', source: 0 },
      { value: '56.8', label: 'average detected errors per home page', source: 0 },
    ],
    sources: [
      { title: 'The WebAIM Million', publisher: 'WebAIM, Utah State University', year: 2024, url: 'https://webaim.org/projects/million/', type: 'study' },
    ],
    solutions: [
      { name: 'axe DevTools', what: 'Automated accessibility testing' },
      { name: 'WAVE', what: 'Web accessibility evaluation tool' },
    ],
    buildIdeas: [
      'A tool that writes meaningful alt text suggestions and lets developers approve them',
      'A browser extension that simulates color-blindness and low vision on any page',
    ],
    query: 'web accessibility WCAG compliance',
    keywords: ['accessibility', 'websites', 'wcag', 'screen reader', 'alt text', 'a11y', 'disability', 'web'],
  },
  {
    id: 'vision-impairment',
    title: 'Billions of people have a vision impairment',
    oneLiner: 'At least 2.2 billion people globally have a near or distance vision impairment.',
    industry: 'accessibility',
    tracks: ['accessibility', 'ai', 'hardware'],
    summary:
      'The WHO estimates at least 2.2 billion people have a near or distance vision impairment, and at least 1 billion of these cases could have been prevented or have yet to be addressed. Everyday tasks like reading labels, navigating new places, and using apps remain hard for many.',
    stats: [
      { value: '2.2B+', label: 'people have a near or distance vision impairment', source: 0 },
      { value: '1B+', label: 'cases preventable or not yet addressed', source: 0 },
    ],
    sources: [
      { title: 'Blindness and vision impairment — fact sheet', publisher: 'World Health Organization', year: 2023, url: 'https://www.who.int/news-room/fact-sheets/detail/blindness-and-visual-impairment', type: 'report' },
    ],
    solutions: [
      { name: 'Be My Eyes', what: 'Connects blind users with sighted volunteers and AI' },
      { name: 'Seeing AI', what: 'Narrates the world through the phone camera' },
    ],
    buildIdeas: [
      'An indoor navigation helper for a campus building using phone camera cues',
      'A medication label reader that speaks dosage instructions aloud',
    ],
    query: 'visual impairment assistive technology',
    keywords: ['blind', 'vision', 'visually impaired', 'low vision', 'screen reader', 'eyes', 'navigation'],
  },
  {
    id: 'hearing-loss',
    title: 'Hearing loss is growing worldwide',
    oneLiner: 'Nearly 2.5 billion people are projected to have some hearing loss by 2050.',
    industry: 'accessibility',
    tracks: ['accessibility', 'hardware', 'ai'],
    summary:
      'The WHO projects that by 2050 nearly 2.5 billion people will have some degree of hearing loss, and over 1 billion young adults are at risk of permanent hearing loss from unsafe listening. Hearing aids are expensive and many people with hearing loss struggle in classrooms, meetings, and noisy places.',
    stats: [
      { value: '~2.5B', label: 'people projected to have some hearing loss by 2050', source: 0 },
      { value: '1B+', label: 'young adults at risk from unsafe listening practices', source: 0 },
    ],
    sources: [
      { title: 'Deafness and hearing loss — fact sheet', publisher: 'World Health Organization', year: 2024, url: 'https://www.who.int/news-room/fact-sheets/detail/deafness-and-hearing-loss', type: 'report' },
    ],
    solutions: [
      { name: 'Live Transcribe', what: 'Real-time captions on Android' },
      { name: 'Ava', what: 'Live captions for group conversations' },
    ],
    buildIdeas: [
      'A lecture captioning app that highlights key terms and builds a glossary',
      'A safe-listening tracker that warns when headphone volume is too high for too long',
    ],
    query: 'hearing loss assistive technology captioning',
    keywords: ['hearing', 'deaf', 'hard of hearing', 'captions', 'hearing aids', 'audio', 'sign language'],
  },
  {
    id: 'assistive-tech-access',
    title: 'Most people who need assistive products can’t get them',
    oneLiner: '2.5 billion people need assistive products; nearly 1 billion are denied access.',
    industry: 'accessibility',
    tracks: ['accessibility', 'hardware', 'social-impact'],
    summary:
      'The WHO and UNICEF Global Report on Assistive Technology found that more than 2.5 billion people need one or more assistive products—like wheelchairs, hearing aids, or communication apps—and almost 1 billion are denied access, especially in low- and middle-income countries where access can be as low as 3%.',
    stats: [
      { value: '2.5B+', label: 'people need one or more assistive products', source: 0 },
      { value: '~1B', label: 'are denied access to them', source: 0 },
    ],
    sources: [
      { title: 'Global Report on Assistive Technology', publisher: 'World Health Organization & UNICEF', year: 2022, url: 'https://www.who.int/publications/i/item/9789240049451', type: 'report' },
    ],
    solutions: [
      { name: 'e-NABLE', what: 'Volunteer network 3D-printing prosthetic hands' },
      { name: 'Proloquo2Go', what: 'Communication app for nonverbal users' },
    ],
    buildIdeas: [
      'A library of open-source, 3D-printable everyday aids with fit guides',
      'A low-cost communication board app that works on old phones',
    ],
    query: 'assistive technology access disability',
    keywords: ['assistive technology', 'disability', 'wheelchair', 'prosthetic', 'mobility', 'aac', 'devices'],
  },
  {
    id: 'disability-employment',
    title: 'People with disabilities are far less likely to be employed',
    oneLiner: 'Only 22.5% of people with a disability were employed in 2023 vs 65.8% without.',
    industry: 'accessibility',
    tracks: ['accessibility', 'social-impact', 'ai'],
    summary:
      'The Bureau of Labor Statistics reports a large employment gap: in 2023, 22.5% of people with a disability were employed compared with 65.8% of those without. Inaccessible job applications, interview processes, and workplaces are part of the barrier.',
    stats: [
      { value: '22.5%', label: 'employment-population ratio for people with a disability (2023)', source: 0 },
      { value: '65.8%', label: 'for people without a disability', source: 0 },
    ],
    sources: [
      { title: 'Persons with a Disability: Labor Force Characteristics — 2023', publisher: 'U.S. Bureau of Labor Statistics', year: 2024, url: 'https://www.bls.gov/news.release/disabl.nr0.htm', type: 'report' },
    ],
    solutions: [
      { name: 'Inclusively', what: 'Job platform matching candidates with accommodating employers' },
      { name: 'Job Accommodation Network', what: 'Free guidance on workplace accommodations' },
    ],
    buildIdeas: [
      'An accessibility checker for online job applications',
      'A tool that helps candidates draft accommodation requests confidently',
    ],
    query: 'disability employment gap barriers',
    keywords: ['disability', 'employment', 'jobs', 'hiring', 'workplace', 'accommodation', 'career'],
  },

  // ───────────────────────── Housing & Cities ─────────────────────────
  {
    id: 'rent-burden',
    title: 'Half of US renters spend too much of their income on housing',
    oneLiner: 'A record 22.4 million renter households are cost-burdened.',
    industry: 'cities',
    tracks: ['fintech', 'social-impact'],
    summary:
      'Harvard’s Joint Center for Housing Studies found that a record 22.4 million renter households—half of all renters—spent more than 30% of income on rent and utilities in 2022, and 12.1 million spent more than half. High rent leaves little for food, health care, and savings.',
    stats: [
      { value: '22.4M', label: 'cost-burdened renter households in 2022 (record high)', source: 0 },
      { value: '12.1M', label: 'spend more than half their income on housing', source: 0 },
    ],
    sources: [
      { title: 'The State of the Nation’s Housing 2024', publisher: 'Harvard Joint Center for Housing Studies', year: 2024, url: 'https://www.jchs.harvard.edu/state-nations-housing-2024', type: 'report' },
    ],
    solutions: [
      { name: 'Esusu', what: 'Reports rent payments to build credit' },
      { name: 'Affordable housing lotteries (e.g., NYC Housing Connect)', what: 'City housing application portals' },
    ],
    buildIdeas: [
      'A tool that finds rental assistance programs a tenant qualifies for',
      'A roommate-budget planner that shows the true monthly cost of a lease',
    ],
    query: 'rent burden housing affordability renters',
    keywords: ['rent', 'housing', 'affordability', 'renters', 'apartment', 'landlord', 'cost of living'],
  },
  {
    id: 'road-deaths',
    title: 'Road crashes kill over a million people a year',
    oneLiner: 'About 1.19 million people die in road traffic crashes worldwide each year.',
    industry: 'cities',
    tracks: ['ai', 'hardware', 'social-impact'],
    summary:
      'The WHO reports approximately 1.19 million road traffic deaths each year, and road crashes are the leading killer of children and young people aged 5–29. More than half of deaths are pedestrians, cyclists, and motorcyclists. Street design, speed, and visibility all play a role.',
    stats: [
      { value: '~1.19M', label: 'road traffic deaths per year worldwide', source: 0 },
      { value: '#1', label: 'cause of death for people aged 5–29', source: 0 },
    ],
    sources: [
      { title: 'Road traffic injuries — fact sheet', publisher: 'World Health Organization', year: 2023, url: 'https://www.who.int/news-room/fact-sheets/detail/road-traffic-injuries', type: 'report' },
    ],
    solutions: [
      { name: 'Vision Zero programs', what: 'City strategies to eliminate traffic deaths' },
      { name: 'Waze', what: 'Crowdsourced road hazard reporting' },
    ],
    buildIdeas: [
      'A near-miss reporting map for pedestrians and cyclists to show dangerous intersections',
      'A camera-based tool that counts speeding near schools',
    ],
    query: 'road traffic safety pedestrian deaths',
    keywords: ['traffic', 'road safety', 'pedestrians', 'cyclists', 'crashes', 'cars', 'transportation', 'streets'],
  },
  {
    id: 'homelessness',
    title: 'Homelessness in the US is rising',
    oneLiner: 'Over 650,000 people experienced homelessness on a single night in 2023, up 12%.',
    industry: 'cities',
    tracks: ['social-impact'],
    summary:
      'HUD’s 2023 Annual Homeless Assessment Report counted about 653,000 people experiencing homelessness on a single night in January—a 12% increase from the year before and the highest since reporting began in 2007. Rising rents and a shortage of affordable housing are major drivers.',
    stats: [
      { value: '~653,000', label: 'people experiencing homelessness on one night (Jan 2023)', source: 0 },
      { value: '+12%', label: 'increase from 2022', source: 0 },
    ],
    sources: [
      { title: 'The 2023 Annual Homeless Assessment Report (AHAR) to Congress, Part 1', publisher: 'U.S. Department of Housing and Urban Development', year: 2023, url: 'https://www.huduser.gov/portal/sites/default/files/pdf/2023-AHAR-Part-1.pdf', type: 'report' },
    ],
    solutions: [
      { name: '211', what: 'Hotline connecting people to local services' },
      { name: 'Samaritan', what: 'App to support people experiencing homelessness directly' },
    ],
    buildIdeas: [
      'A real-time shelter bed availability board for a city',
      'A tool that helps outreach workers track and follow up on services offered',
    ],
    query: 'homelessness housing services',
    keywords: ['homeless', 'homelessness', 'shelter', 'housing', 'unhoused', 'outreach', 'poverty'],
  },
  {
    id: 'urban-air-pollution',
    title: 'Almost everyone breathes polluted air',
    oneLiner: '99% of people live where air pollution exceeds WHO guideline levels.',
    industry: 'cities',
    tracks: ['sustainability', 'health', 'hardware'],
    summary:
      'The WHO reports that 99% of the world’s population lives in places where air quality exceeds WHO guideline limits, and outdoor air pollution was estimated to cause 4.2 million premature deaths in 2019. Pollution levels can vary block by block, but most people only see a single city-wide number.',
    stats: [
      { value: '99%', label: 'of people live where air exceeds WHO guidelines', source: 0 },
      { value: '4.2M', label: 'premature deaths from outdoor air pollution (2019)', source: 0 },
    ],
    sources: [
      { title: 'Ambient (outdoor) air pollution — fact sheet', publisher: 'World Health Organization', year: 2024, url: 'https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health', type: 'report' },
    ],
    solutions: [
      { name: 'IQAir AirVisual', what: 'Air-quality maps and forecasts' },
      { name: 'PurpleAir', what: 'Low-cost community sensors' },
    ],
    buildIdeas: [
      'A walking/biking route planner that avoids the most polluted streets',
      'A school air-quality dashboard built from cheap sensors',
    ],
    query: 'urban air pollution exposure health',
    keywords: ['air pollution', 'air quality', 'smog', 'emissions', 'pm2.5', 'asthma', 'city'],
  },
  {
    id: 'evictions',
    title: 'Millions of eviction cases are filed every year',
    oneLiner: 'Landlords filed ~3.6 million eviction cases a year before the pandemic.',
    industry: 'cities',
    tracks: ['social-impact', 'fintech', 'ai'],
    summary:
      'Princeton’s Eviction Lab estimates that landlords filed about 3.6 million eviction cases per year in the US before the pandemic. Most tenants face court without a lawyer and don’t know their rights or about emergency rental assistance. An eviction record can make it hard to rent again.',
    stats: [
      { value: '~3.6M', label: 'eviction cases filed per year in the US (pre-pandemic)', source: 0 },
    ],
    sources: [
      { title: 'National Estimates: Eviction in America', publisher: 'Eviction Lab, Princeton University', year: 2022, url: 'https://evictionlab.org/national-estimates/', type: 'study' },
    ],
    solutions: [
      { name: 'JustFix', what: 'Free tools for tenants to assert their rights' },
      { name: 'Local right-to-counsel programs', what: 'Free legal representation for tenants' },
    ],
    buildIdeas: [
      'A plain-language guide that explains an eviction notice and next steps by state',
      'A tool that matches tenants with emergency rental assistance and legal aid',
    ],
    query: 'eviction tenants housing instability',
    keywords: ['eviction', 'tenants', 'renters', 'landlord', 'housing', 'legal aid', 'rent'],
  },
]

export const problemById = (id: string) => PROBLEMS.find((p) => p.id === id)
