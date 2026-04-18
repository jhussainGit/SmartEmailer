import { openai } from "./openai";
import { emailStyles } from "../client/src/lib/emailStyles";

export interface EmailGenerationResult {
  email: string;
  systemPrompt: string;
  userPrompt: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

interface EmailGenerationParams {
  style: string;
  recipientName?: string;
  recipientLinkedIn?: string;
  senderName?: string;
  senderLinkedIn?: string;
  subject?: string;
  topic?: string;
  length?: 'short' | 'medium' | 'long';
  sampleEmail?: string;
  jobDescription?: string;
  additionalContext?: string;
  attachmentContent?: string;
  attachmentName?: string;
  agencyWebsite?: string;
  endUserHomepage?: string;
  recruiterOutreachType?: 'intro' | 'second-followup';
  recruiterOutreachStyle?: string;
  koreanHonorificLevel?: 'formal-highest' | 'polite-standard' | 'casual';
  dualLanguageOutput?: boolean;
  inputLanguage?: string;
  outputLanguage?: string;
  emailSignature?: string;
  // Advanced tone & voice (1-10)
  formalityLevel?: number;
  warmthLevel?: number;
  directnessLevel?: number;
  confidenceLevel?: number;
  urgencyLevel?: number;
  // Advanced style
  readingLevel?: 'elementary' | 'middle-school' | 'high-school' | 'college' | 'professional' | 'expert';
  pointOfView?: 'first-person' | 'second-person' | 'third-person';
  useContractions?: boolean;
  emojiPolicy?: 'none' | 'minimal' | 'moderate';
  sentenceStyle?: 'short-punchy' | 'balanced' | 'long-flowing';
  structureFormat?: 'paragraphs' | 'bullets' | 'hybrid';
  // Content shaping
  senderPersona?: string;
  readerSeniority?: 'auto' | 'individual-contributor' | 'manager' | 'director' | 'executive' | 'c-suite';
  ctaType?: 'auto' | 'schedule-meeting' | 'reply' | 'click-link' | 'review-document' | 'no-cta' | 'custom';
  customCta?: string;
  mustInclude?: string;
  mustAvoid?: string;
  customInstructions?: string;
  // API parameters
  model?: 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4-turbo';
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  maxOutputTokens?: number;
  seed?: string;
}

const ALLOWED_MODELS = new Set(['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo']);

const ADVANCED_BASELINE = {
  formalityLevel: 6,
  warmthLevel: 5,
  directnessLevel: 6,
  confidenceLevel: 6,
  urgencyLevel: 4,
  readingLevel: 'professional',
  pointOfView: 'first-person',
  useContractions: true,
  emojiPolicy: 'none',
  sentenceStyle: 'balanced',
  structureFormat: 'paragraphs',
  readerSeniority: 'auto',
  ctaType: 'auto',
};

function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n) || typeof n !== 'number') return min;
  return Math.max(min, Math.min(max, n));
}

function describeLevel(value: number, low: string, mid: string, high: string): string {
  if (value <= 3) return low;
  if (value <= 7) return mid;
  return high;
}

function buildAdvancedDirectives(params: EmailGenerationParams): string {
  const lines: string[] = [];

  // Tone & voice sliders — only emit if user moved them off baseline
  const toneLines: string[] = [];
  if (typeof params.formalityLevel === 'number' && params.formalityLevel !== ADVANCED_BASELINE.formalityLevel) {
    toneLines.push(`- FORMALITY (${params.formalityLevel}/10): ${describeLevel(params.formalityLevel,
      'Highly casual — write like a quick note to a friend. Use first names, contractions, and conversational phrasing. Skip honorifics.',
      'Professional but approachable — neutral register suitable for most workplace communication.',
      'Highly formal — use full titles, complete sentences, no contractions or colloquialisms. Maintain ceremonial register throughout.')}`);
  }
  if (typeof params.warmthLevel === 'number' && params.warmthLevel !== ADVANCED_BASELINE.warmthLevel) {
    toneLines.push(`- WARMTH (${params.warmthLevel}/10): ${describeLevel(params.warmthLevel,
      'Cool and detached — purely transactional. No personal touches, no warmth signals.',
      'Professionally cordial — polite acknowledgement of the human relationship without overdoing it.',
      'Warm and personal — express genuine care, use empathetic language, acknowledge the recipient as a whole person.')}`);
  }
  if (typeof params.directnessLevel === 'number' && params.directnessLevel !== ADVANCED_BASELINE.directnessLevel) {
    toneLines.push(`- DIRECTNESS (${params.directnessLevel}/10): ${describeLevel(params.directnessLevel,
      'Indirect and diplomatic — soften requests, use hedging, give the reader face-saving outs.',
      'Clear but considerate — state the point plainly while remaining polite.',
      'Direct and unambiguous — lead with the ask, no hedging, no preamble. Get to the point in the first sentence.')}`);
  }
  if (typeof params.confidenceLevel === 'number' && params.confidenceLevel !== ADVANCED_BASELINE.confidenceLevel) {
    toneLines.push(`- CONFIDENCE (${params.confidenceLevel}/10): ${describeLevel(params.confidenceLevel,
      'Humble and deferential — acknowledge the recipient\'s expertise, frame your input modestly, use phrases like "I might be wrong but…"',
      'Quietly confident — state positions clearly without bravado.',
      'Assertive and authoritative — state positions with conviction. No hedge words ("just," "maybe," "I think"). Speak from authority.')}`);
  }
  if (typeof params.urgencyLevel === 'number' && params.urgencyLevel !== ADVANCED_BASELINE.urgencyLevel) {
    toneLines.push(`- URGENCY (${params.urgencyLevel}/10): ${describeLevel(params.urgencyLevel,
      'Relaxed timing — make clear there is no time pressure. "Whenever convenient" framing.',
      'Standard business pacing — reasonable response timeframe expected.',
      'Time-critical — convey genuine urgency. Reference deadlines, time-sensitive consequences, and the need for prompt action — without being shrill.')}`);
  }
  if (toneLines.length) {
    lines.push('TONE & VOICE CALIBRATION — Apply these dimensions precisely:\n' + toneLines.join('\n'));
  }

  // Reading level
  if (params.readingLevel && params.readingLevel !== ADVANCED_BASELINE.readingLevel) {
    const readingMap: Record<string, string> = {
      'elementary': 'Use simple, common words (Flesch reading ease 80+). Short sentences. Avoid technical terms entirely.',
      'middle-school': 'Use everyday vocabulary. Sentences average 12-15 words. Explain any specialized terms.',
      'high-school': 'Standard general-audience prose. Clear, accessible, no jargon unless defined.',
      'college': 'Moderately sophisticated vocabulary. Industry terms acceptable. Sentences may be more complex.',
      'professional': 'Polished business prose with industry-appropriate terminology. Assume the reader is fluent in the domain.',
      'expert': 'Use precise technical/specialist vocabulary freely. Assume the reader has deep domain expertise — no need to define standard terms in the field.',
    };
    lines.push(`READING LEVEL — ${readingMap[params.readingLevel]}`);
  }

  // POV
  if (params.pointOfView && params.pointOfView !== ADVANCED_BASELINE.pointOfView) {
    const povMap: Record<string, string> = {
      'first-person': 'Write in first person ("I" / "we"). Center the sender\'s perspective and ownership.',
      'second-person': 'Write in second person ("you"-focused). Center the recipient\'s perspective, needs, and benefits. Minimize "I" statements.',
      'third-person': 'Write in third person where natural — objective and observational rather than personal. Useful for announcements and reports.',
    };
    lines.push(`POINT OF VIEW — ${povMap[params.pointOfView]}`);
  }

  // Contractions — only emit when user explicitly disables (baseline = enabled)
  if (params.useContractions === false) {
    lines.push('CONTRACTIONS — Do NOT use contractions. Write "I am" not "I\'m," "we will" not "we\'ll," "do not" not "don\'t."');
  }

  // Emoji
  if (params.emojiPolicy && params.emojiPolicy !== ADVANCED_BASELINE.emojiPolicy) {
    const emojiMap: Record<string, string> = {
      'none': 'EMOJI POLICY — Do NOT use any emoji whatsoever.',
      'minimal': 'EMOJI POLICY — At most ONE emoji in the entire email, and only if it adds genuine value.',
      'moderate': 'EMOJI POLICY — Use emoji sparingly where they enhance warmth or clarity. Never replace words with emoji; never use more than one per paragraph.',
    };
    lines.push(emojiMap[params.emojiPolicy]);
  }

  // Sentence style
  if (params.sentenceStyle && params.sentenceStyle !== ADVANCED_BASELINE.sentenceStyle) {
    const sentenceMap: Record<string, string> = {
      'short-punchy': 'SENTENCE STYLE — Write in short, punchy sentences. Average 8-12 words. Use sentence fragments for emphasis when appropriate. Aim for high impact density.',
      'balanced': 'SENTENCE STYLE — Vary sentence length deliberately. Mix short impactful statements with longer descriptive ones to create rhythm.',
      'long-flowing': 'SENTENCE STYLE — Use longer, more flowing sentences with subordinate clauses. Average 20-25 words. Maintain sophisticated prose rhythm.',
    };
    lines.push(sentenceMap[params.sentenceStyle]);
  }

  // Structure format
  if (params.structureFormat && params.structureFormat !== ADVANCED_BASELINE.structureFormat) {
    const structureMap: Record<string, string> = {
      'paragraphs': 'STRUCTURE — Use prose paragraphs only. Do NOT use bullet points or numbered lists.',
      'bullets': 'STRUCTURE — Use bullet points for the body content. Brief intro paragraph, then bulleted points, then a brief closing paragraph.',
      'hybrid': 'STRUCTURE — Mix paragraphs with bulleted lists where bullets aid scannability (e.g., for action items, options, or enumerated points).',
    };
    lines.push(structureMap[params.structureFormat]);
  }

  // Sender persona
  if (params.senderPersona?.trim()) {
    lines.push(`SENDER PERSONA — Write as if you are: "${params.senderPersona.trim()}". Let this identity shape vocabulary, references, and authority signals.`);
  }

  // Reader seniority
  if (params.readerSeniority && params.readerSeniority !== 'auto') {
    const seniorityMap: Record<string, string> = {
      'individual-contributor': 'Reader is an individual contributor — collegial peer-level register. Focus on practical specifics.',
      'manager': 'Reader is a manager — balance strategic context with execution detail. Respect their team-leadership perspective.',
      'director': 'Reader is a director or VP — emphasize cross-functional impact, business outcomes, and strategic implications. Skip operational minutiae.',
      'executive': 'Reader is an executive — front-load the recommendation, supporting data points minimal but precise. Total reading time under 60 seconds.',
      'c-suite': 'Reader is C-Suite (CEO/CFO/CTO/etc.) — the email must be readable in 30 seconds. Lead with the ask or insight. Every sentence earns its place. Use board-level language.',
    };
    lines.push(`READER SENIORITY — ${seniorityMap[params.readerSeniority]}`);
  }

  // CTA
  if (params.ctaType && params.ctaType !== 'auto') {
    const ctaMap: Record<string, string> = {
      'schedule-meeting': 'CALL-TO-ACTION — End with a clear, specific request to schedule a meeting. Offer 2-3 specific time windows or invite them to suggest a time.',
      'reply': 'CALL-TO-ACTION — End with a focused yes/no or short-answer question that makes replying effortless.',
      'click-link': 'CALL-TO-ACTION — End by directing the reader to click a specific link. Make the reason to click compelling.',
      'review-document': 'CALL-TO-ACTION — End by asking the reader to review the attached document and respond with feedback or approval.',
      'no-cta': 'CALL-TO-ACTION — Do NOT include a call-to-action. This email is purely informational.',
      'custom': params.customCta?.trim()
        ? `CALL-TO-ACTION — End with this specific call-to-action: "${params.customCta.trim()}". Phrase it naturally in the email's voice.`
        : 'CALL-TO-ACTION — End with a clear, single call-to-action.',
    };
    lines.push(ctaMap[params.ctaType]);
  }

  // Must include
  if (params.mustInclude?.trim()) {
    const phrases = params.mustInclude.split(',').map(s => s.trim()).filter(Boolean);
    if (phrases.length) {
      lines.push(`MUST INCLUDE — The following phrases MUST appear verbatim in the email, woven in naturally: ${phrases.map(p => `"${p}"`).join(', ')}.`);
    }
  }

  // Must avoid
  if (params.mustAvoid?.trim()) {
    const words = params.mustAvoid.split(',').map(s => s.trim()).filter(Boolean);
    if (words.length) {
      lines.push(`MUST AVOID — Do NOT use any of these words or phrases under any circumstances: ${words.map(w => `"${w}"`).join(', ')}. Find alternatives.`);
    }
  }

  if (lines.length === 0) return '';
  return '\n\nADVANCED USER CONTROLS — Apply these in addition to (not in place of) the formatting rules and language directive above:\n\n' + lines.join('\n\n');
}

const lengthGuidelines: Record<string, string> = {
  short: '150-250 words (2-3 paragraphs)',
  medium: '250-400 words (3-5 paragraphs)',
  long: '400-600 words (5-7 paragraphs)',
};

function truncateAttachment(content: string, maxChars: number = 10000): string {
  if (content.length <= maxChars) return content;
  return content.substring(0, maxChars) + '\n\n[Content truncated for length...]';
}

function getAttachmentType(styleId: string, fileName: string): string {
  if (styleId === 'follow-up') return 'Previous Email Thread';
  if (styleId === 'cover-letter') return 'Resume/CV Content';
  if (styleId === 'proposal') return 'Proposal/Presentation Content';
  if (styleId === 'invoice') return 'Invoice/Document Content';
  if (styleId === 'recruiter-outreach') return 'Candidate Resume or Job Description';
  if (styleId === 'korean-self-intro') return 'Resume/CV Content';
  return 'Attached Document Content';
}

function selectCommunicationFramework(styleId: string): string {
  const frameworkMap: Record<string, string> = {
    'sales-pitch': `COMMUNICATION FRAMEWORK — AIDA (Attention, Interest, Desire, Action):
- ATTENTION: Open with a bold, relevant hook that immediately captures the reader's focus — a surprising statistic, a provocative question, or a timely observation tied to their industry.
- INTEREST: Build engagement by connecting their specific pain points or goals to the solution you're presenting. Show you understand their world.
- DESIRE: Paint a vivid picture of the transformation — what their situation looks like after they adopt this solution. Use concrete outcomes and social proof.
- ACTION: Close with a single, clear, low-friction next step. Make saying "yes" easy.`,

    'marketing': `COMMUNICATION FRAMEWORK — PAS (Problem, Agitation, Solution):
- PROBLEM: Identify a specific, relatable challenge the reader faces. Be precise — vague problems don't resonate.
- AGITATION: Deepen the urgency by exploring consequences of inaction. What do they risk losing? What opportunities slip away?
- SOLUTION: Present your offering as the natural resolution. Connect features to outcomes, not just capabilities.`,

    'cover-letter': `COMMUNICATION FRAMEWORK — STAR (Situation, Task, Action, Result):
- Weave achievements into the narrative using the STAR method — each accomplishment should tell a micro-story.
- SITUATION: Set the context briefly so the reader understands the challenge.
- TASK: Clarify what was expected or what you set out to accomplish.
- ACTION: Detail the specific steps you took — this is where you demonstrate initiative and skill.
- RESULT: Quantify the outcome wherever possible. Numbers create credibility.`,

    'proposal': `COMMUNICATION FRAMEWORK — SPIN (Situation, Problem, Implication, Need-Payoff):
- SITUATION: Establish shared understanding of the current state. Show you've done your homework.
- PROBLEM: Identify the specific challenge or gap that needs addressing.
- IMPLICATION: Explore what happens if this problem persists — the cost of inaction.
- NEED-PAYOFF: Present your solution and let the recipient visualize the positive outcome.`,

    'networking': `COMMUNICATION FRAMEWORK — Reciprocity & Social Proof:
- Lead with genuine value — offer something useful before asking for anything.
- Reference shared connections, experiences, or interests to establish common ground.
- Keep the ask small and specific. Vague requests ("pick your brain") feel extractive.
- Signal credibility through your work, not your title.`,

    'recruiter-outreach': `COMMUNICATION FRAMEWORK — Value Proposition Canvas:
- Map the candidate's career trajectory and identify the "gain creators" this role offers.
- Address potential objections preemptively (relocation, role change, company size).
- Personalize deeply — generic outreach is immediately recognized and ignored.
- The email should feel like it was written for exactly one person, not adapted from a template.`,

    'complaint': `COMMUNICATION FRAMEWORK — Nonviolent Communication (NVC):
- OBSERVATION: State the facts without judgment or exaggeration. Be specific about dates, events, and details.
- FEELING: Express the impact using "I" statements rather than blame.
- NEED: Clearly articulate what was expected or what would resolve the situation.
- REQUEST: Make a concrete, actionable request — not a demand.`,

    'apology': `COMMUNICATION FRAMEWORK — Accountability & Restoration:
- ACKNOWLEDGE: Name exactly what happened and what went wrong. Vague apologies feel insincere.
- TAKE RESPONSIBILITY: Own the mistake without deflecting, minimizing, or explaining excessively.
- EMPATHIZE: Demonstrate you understand the real impact on the recipient.
- REPAIR: Describe specific steps you're taking to prevent recurrence.
- COMMIT: State what you'll do differently going forward.`,

    'resignation': `COMMUNICATION FRAMEWORK — Bridge-Burning Prevention:
- Express genuine gratitude for specific experiences, not generic pleasantries.
- Keep the tone warm but professional — never air grievances.
- Offer concrete transition support (knowledge transfer, training replacement).
- Leave the door open for future professional connection.`,

    'recommendation': `COMMUNICATION FRAMEWORK — Credibility Architecture:
- CONTEXT: Establish how you know the person and in what capacity.
- EVIDENCE: Provide 2-3 specific examples that demonstrate the claimed qualities.
- COMPARATIVE: Where appropriate, rank the person relative to others you've worked with.
- ENDORSEMENT: Close with an unequivocal, forward-looking recommendation.`,

    'executive': `COMMUNICATION FRAMEWORK — Executive Communication Protocol:
- Lead with the decision or recommendation. Executives read the first line first and sometimes only.
- Follow with 2-3 supporting data points. No padding, no preamble.
- Close with the specific ask or next step, including timeline.
- Every sentence must earn its place. Cut ruthlessly.`,

    'internal-announcement': `COMMUNICATION FRAMEWORK — Organizational Change Communication:
- WHAT: State the change clearly and concisely in the opening.
- WHY: Explain the rationale with enough context for people to understand the decision.
- HOW: Describe what this means for the audience practically — how does their day change?
- WHEN: Provide clear timelines and milestones.
- WHERE TO GO: Direct people to resources, FAQs, or points of contact for questions.`,

    'urgent-alert': `COMMUNICATION FRAMEWORK — Crisis Communication:
- IMMEDIATE ACTION: Lead with what people need to do right now.
- SITUATION: Provide just enough context to understand the urgency.
- IMPACT: Who is affected and how.
- NEXT STEPS: Clear timeline for updates and resolution.
- Keep it short. In a crisis, brevity is clarity.`,
  };

  return frameworkMap[styleId] || '';
}

function inferAudienceIntelligence(params: EmailGenerationParams): string {
  const signals: string[] = [];

  if (params.recipientLinkedIn) {
    signals.push(`LINKEDIN SIGNAL: A LinkedIn profile has been provided for the recipient. Analyze the URL for clues about their professional identity — company, role seniority, industry. Reference their professional context naturally in the email without explicitly mentioning you viewed their profile (unless the style calls for it, like recruiter outreach).`);
  }

  if (params.senderLinkedIn) {
    signals.push(`SENDER LINKEDIN SIGNAL: The sender's LinkedIn has been provided. Use this to establish credibility — reference relevant shared industry experience, mutual connections potential, or complementary professional backgrounds.`);
  }

  if (params.jobDescription) {
    signals.push(`JOB CONTEXT SIGNAL: A job description URL has been provided. Extract key requirements, company values, and role expectations to tailor the email. Mirror the language and priorities found in the job posting.`);
  }

  if (params.agencyWebsite) {
    signals.push(`AGENCY CONTEXT: A recruiting agency website has been provided. Reference the agency's reputation and specialization to build credibility.`);
  }

  if (params.endUserHomepage) {
    signals.push(`HIRING COMPANY CONTEXT: The hiring company's website has been provided. Demonstrate familiarity with their mission, recent news, products, or culture.`);
  }

  if (signals.length === 0) return '';

  return `\nAUDIENCE INTELLIGENCE — Use these contextual signals to personalize the email:\n${signals.join('\n')}`;
}

function buildRhetoricalStrategy(styleId: string, length: string): string {
  const isPersuasive = ['sales-pitch', 'marketing', 'proposal', 'cover-letter', 'recruiter-outreach', 'networking'].includes(styleId);
  const isInternal = ['internal-announcement', 'promotion-announcement', 'policy-update', 'team-update', 'internal-memo', 'employee-recognition', 'meeting-minutes', 'project-update', 'urgent-alert'].includes(styleId);
  const isRelational = ['thank-you', 'apology', 'friendly', 'enthusiastic', 'invitation', 'korean-seasonal', 'employee-recognition'].includes(styleId);
  const isFormal = ['executive', 'professional-formal', 'academic-formal', 'resignation', 'complaint', 'korean-business-formal', 'korean-academic'].includes(styleId);

  let strategy = '\nRHETORICAL STRATEGY:\n';

  if (isPersuasive) {
    strategy += `- Apply the principle of specificity: replace generic claims with concrete details, numbers, and examples.
- Use power words that create urgency without desperation: "opportunity," "momentum," "advantage," "exclusive."
- Structure sentences with the most compelling information at the beginning and end (serial position effect).
- Eliminate hedge words ("just," "maybe," "kind of," "I think") — they undermine authority.
- Include exactly one clear call-to-action. Multiple asks dilute impact.`;
  } else if (isInternal) {
    strategy += `- Prioritize clarity over eloquence. Internal communication succeeds when people understand it on first read.
- Front-load the key message — put the most important information in the first paragraph.
- Use bullet points or numbered lists for action items and deadlines.
- Anticipate questions and address the top 2-3 proactively.
- End with clear ownership — who is responsible for what, and by when.`;
  } else if (isRelational) {
    strategy += `- Prioritize authenticity over formality. The reader should feel genuine warmth, not a template.
- Reference specific shared experiences or details — generic warmth reads as insincere.
- Match emotional register to the situation — celebratory, grateful, or empathetic as appropriate.
- Keep the focus on the recipient, not the sender.`;
  } else if (isFormal) {
    strategy += `- Maintain consistent register throughout — no tonal shifts from formal to casual.
- Use precise vocabulary: favor the exact word over the approximate one.
- Structure with clear logical flow: premise, evidence, conclusion.
- Avoid colloquialisms, contractions, and informal punctuation.
- Every paragraph should have a clear purpose in advancing the email's objective.`;
  } else {
    strategy += `- Adapt tone to match the relationship implied by the context.
- Balance professionalism with approachability.
- Ensure the email's purpose is clear within the first two sentences.
- Close with a forward-looking statement or clear next step.`;
  }

  if (length === 'short') {
    strategy += `\n- LENGTH DISCIPLINE: This is a SHORT email. Every word must earn its place. Cut adjectives, eliminate throat-clearing openings ("I hope this email finds you well"), and get to the point within the first sentence. Short emails that are sharp and direct signal confidence and respect for the reader's time.`;
  } else if (length === 'long') {
    strategy += `\n- LENGTH ARCHITECTURE: This is a LONG-FORM email. Use structural elements (paragraph breaks, transitional phrases, optional headers) to maintain readability. Each paragraph should build on the previous one. Vary sentence length to create rhythm — short sentences for impact, longer ones for detail.`;
  }

  return strategy;
}

function buildCulturalIntelligence(outputLanguage: string, styleId: string): string {
  const culturalNorms: Record<string, string> = {
    'Japanese': `CULTURAL INTELLIGENCE — Japanese (日本語):
- Use appropriate keigo (敬語) levels based on the relationship context.
- Follow the Japanese email body structure: 宛名 (addressee), 挨拶 (greeting), 本文 (body), 結び (closing), 署名 (signature). Do NOT include a subject line — that is handled separately.
- Begin with seasonal greetings (時候の挨拶) for formal emails.
- Use indirect communication style — hint at requests rather than stating them bluntly.
- Close with standard business phrases like "何卒よろしくお願いいたします".
- Avoid overly direct language; Japanese business culture values harmony (和) and reading between the lines.`,

    'Chinese': `CULTURAL INTELLIGENCE — Chinese (中文):
- Use appropriate respectful address: 您 instead of 你 for formal contexts.
- Chinese business emails value relationship-building (关系) — include brief personal warmth before business matters.
- Use respectful closings: "此致敬礼" for formal emails, "祝好" for semi-formal.
- Avoid overly direct refusals or criticism — use diplomatic language.
- For formal business: follow the pattern of greeting, context, purpose, details, closing wish.`,

    'Arabic': `CULTURAL INTELLIGENCE — Arabic (العربية):
- Begin with appropriate Islamic or formal greetings based on context (بسم الله, السلام عليكم, تحية طيبة).
- Arabic business communication tends to be more elaborate and relationship-oriented than Western styles.
- Include honorific titles and show deference to seniority.
- Closing phrases should include well-wishes: "مع خالص التحيات" or "وتفضلوا بقبول فائق الاحترام".
- Right-to-left text conventions apply — ensure structural clarity.`,

    'Hindi': `CULTURAL INTELLIGENCE — Hindi (हिन्दी):
- Use respectful pronouns: "आप" for formal contexts, never "तुम" or "तू" in business.
- Hindi business emails blend formality with warmth — this is culturally expected.
- Use "नमस्ते" or "प्रिय" for greetings depending on formality level.
- Close with "धन्यवाद" or "सादर" for professional emails.
- Sentence structure may follow SOV pattern naturally — ensure this feels authentic.`,

    'Spanish': `CULTURAL INTELLIGENCE — Spanish (Español):
- Use "usted" form for formal business, "tú" only for established casual relationships.
- Spanish business emails tend toward slightly warmer openings than English — this is normal, not unprofessional.
- Use appropriate regional variations: "Estimado/a" for formal, "Querido/a" for familiar.
- Close with "Atentamente," "Cordialmente," or "Un cordial saludo."
- Be aware of regional differences (Spain vs. Latin America) in formality expectations.`,

    'French': `CULTURAL INTELLIGENCE — French (Français):
- French business emails have specific structural conventions: formule d'appel (opening), corps (body), formule de politesse (closing formula).
- Use "Monsieur," "Madame," or "Cher/Chère Monsieur/Madame" appropriately.
- The closing formula in French formal emails is elaborate by design: "Je vous prie d'agréer, Monsieur/Madame, l'expression de mes salutations distinguées."
- Maintain the vouvoiement (vous) form for all professional contexts unless explicitly casual.
- French values precision and elegance in written expression — avoid americanisms and anglicisms.`,

    'German': `CULTURAL INTELLIGENCE — German (Deutsch):
- Use "Sie" form for all business communication unless explicitly invited to use "du."
- German business emails value directness and precision — get to the point efficiently.
- Use "Sehr geehrte/r" for formal opening, "Liebe/r" for semi-formal.
- Close with "Mit freundlichen Grüßen" (formal) or "Beste Grüße" (semi-formal).
- Include proper titles (Dr., Prof.) — Germans take academic and professional titles seriously.`,

    'Urdu': `CULTURAL INTELLIGENCE — Urdu (اردو):
- Use respectful address forms: "جناب" (sir), "محترمہ" (madam) for formal contexts.
- Urdu business communication tends to be elaborate and courteous.
- Begin with "السلام علیکم" or appropriate formal greeting.
- Show deference to seniority and authority through language choice.
- Close with "والسلام" or "خدا حافظ" depending on context.`,

    'Farsi': `CULTURAL INTELLIGENCE — Farsi (فارسی):
- Farsi values ta'arof (تعارف) — elaborate courtesy and humility in communication.
- Use respectful forms: "شما" instead of "تو" for formal contexts.
- Begin with appropriate greetings: "با سلام و احترام" for formal emails.
- Farsi business culture values relationship and warmth alongside professionalism.
- Close with "با احترام" or "با سپاس" for professional contexts.`,
  };

  if (styleId.startsWith('korean-') || styleId.startsWith('japanese-')) return '';

  return culturalNorms[outputLanguage] || '';
}

function buildStyleExpertise(styleId: string): string {
  const expertiseMap: Record<string, string> = {
    'professional-formal': `STYLE EXPERTISE — Professional Formal:
- Open with a purpose-driven greeting — skip "I hope this email finds you well" unless the context genuinely calls for it.
- Structure: Context → Purpose → Details → Next Steps → Professional Close.
- Use active voice predominantly. Passive voice is acceptable only when diplomacy requires deflecting agency.
- Vocabulary should be precise but not pretentious — "use" not "utilize," "help" not "facilitate."`,

    'professional-casual': `STYLE EXPERTISE — Professional Casual:
- The tone should feel like a smart colleague speaking naturally — professional but not stiff.
- Contractions are welcome: "I'd," "we're," "that's."
- One exclamation mark maximum in the entire email.
- Open with something relevant and warm but not formulaic.`,

    'executive': `STYLE EXPERTISE — Executive Communication:
- First sentence must state the purpose or recommendation. No preambles.
- Use the "inverted pyramid" structure — most important information first, supporting details after.
- Data points should be precise and minimal. Executives trust specificity over volume.
- The email should be skimmable in 30 seconds and comprehensible in 60.
- Avoid qualifiers and hedges. State positions with confidence.`,

    'sales-pitch': `STYLE EXPERTISE — Sales Pitch:
- Open with a hook that demonstrates understanding of their specific situation — not a generic pitch.
- Focus on outcomes and transformation, not features and capabilities.
- Use social proof strategically: "Companies like [relevant reference] have seen [specific result]."
- The CTA should feel like a natural next step, not a sales close.
- Avoid sales jargon: no "synergy," "leverage," "paradigm," "robust solution."`,

    'cover-letter': `STYLE EXPERTISE — Cover Letter:
- Opening paragraph must hook the reader — state the role, demonstrate fit, and hint at your unique angle.
- Middle paragraphs should each tell a mini-story of achievement using specific metrics.
- Research the company's mission, values, or recent news and weave a genuine connection into the letter.
- Close with confident enthusiasm without desperation: "I'd welcome the opportunity to discuss how my experience in [X] can contribute to [company's goal]."
- Avoid first-person overuse — vary sentence structures to prevent every sentence from starting with "I."`,

    'resignation': `STYLE EXPERTISE — Resignation:
- Lead with the resignation statement clearly. Don't bury it.
- Express genuine gratitude for 1-2 specific things (a project, mentorship, growth opportunity).
- Offer transition support with specific proposals (training, documentation, timeline).
- Keep it brief — 3-4 paragraphs maximum. This is not the place for a career retrospective.
- Never mention negative reasons for leaving, even obliquely.`,

    'thank-you': `STYLE EXPERTISE — Thank You:
- Be specific about what you're thanking them for — generic gratitude feels hollow.
- Describe the impact of their action: how did it help you specifically?
- Keep it genuine and proportionate — don't over-thank for small gestures.
- End with a forward-looking statement that reinforces the relationship.`,

    'follow-up': `STYLE EXPERTISE — Follow-Up:
- Reference the previous interaction specifically (date, topic, key point discussed).
- Add new value — don't just ask "checking in." Bring a relevant article, idea, or update.
- Make the response easy: ask a yes/no question or offer specific time slots.
- Keep tone confident but not pushy. Assume positive intent for the delay.`,

    'complaint': `STYLE EXPERTISE — Complaint:
- State facts chronologically without emotional language.
- Be specific: dates, order numbers, names of people spoken to, promised timelines.
- State the desired resolution clearly and specifically.
- Maintain professional composure — angry emails get forwarded to managers as examples of difficult customers, not as priorities.`,

    'academic-formal': `STYLE EXPERTISE — Academic Formal:
- Use discipline-appropriate terminology without being unnecessarily jargon-heavy.
- Reference relevant research or prior correspondence to establish scholarly context.
- Structure follows academic conventions: clear thesis/purpose, supporting rationale, specific ask.
- Close with appropriate academic courtesy.`,

    'research-inquiry': `STYLE EXPERTISE — Research Inquiry:
- Demonstrate you've done preliminary research on the recipient's work.
- Reference 1-2 specific papers or projects of theirs that relate to your inquiry.
- Make the ask clear and bounded — researchers are more likely to help with specific, well-defined questions.
- Show how their input would contribute to the broader research picture.`,

    'networking': `STYLE EXPERTISE — Networking:
- Lead with a genuine, specific reason for reaching out — how you discovered them or what impressed you.
- Offer something of value before asking: a relevant insight, article, or introduction.
- Keep the ask small and specific: a 15-minute call, a quick question, an introduction.
- Show that you've invested time learning about their work.`,

    'introduction': `STYLE EXPERTISE — Introduction:
- State who you are and why you're reaching out in the first 2 sentences.
- Establish relevance quickly: why should they care about this connection?
- Include a specific, low-commitment next step.
- Be confident but not presumptuous about their interest level.`,

    'creative': `STYLE EXPERTISE — Creative:
- Break conventions thoughtfully — creative doesn't mean unprofessional.
- Use vivid language and unexpected phrasing to make the email memorable.
- Ensure the creative approach serves the message, not the other way around.
- The email should delight the reader while still achieving its purpose.`,

    'storytelling': `STYLE EXPERTISE — Storytelling:
- Open with a compelling scene or moment that draws the reader in.
- Use the narrative arc: setup, tension/challenge, resolution/insight.
- Make the story serve the email's purpose — it should illuminate, not distract.
- End with a clear connection between the story and the call to action.`,

    'newsletter': `STYLE EXPERTISE — Newsletter:
- Use a compelling subject line angle — not just a date or edition number.
- Structure with clear sections using visual hierarchy (headers, spacing).
- Each section should be independently skimmable.
- Include exactly one primary CTA and optionally 1-2 secondary ones.
- Balance informative content with engaging voice.`,

    'customer-service': `STYLE EXPERTISE — Customer Service:
- Acknowledge the customer's situation immediately without being dismissive.
- Use their name and reference their specific issue to show personal attention.
- Explain the resolution or next steps in plain language, not corporate speak.
- Proactively address likely follow-up questions.
- Close with genuine helpfulness: "If you need anything else, I'm here to help."`,

    'meeting-minutes': `STYLE EXPERTISE — Meeting Minutes:
- Open with meeting metadata: date, attendees, purpose.
- Organize by topic or agenda item, not chronologically.
- For each item: what was discussed, what was decided, who owns the action, when it's due.
- Distinguish between decisions made and topics merely discussed.
- Close with clear next steps and the next meeting date if applicable.`,

    'project-update': `STYLE EXPERTISE — Project Update:
- Lead with status: on track, at risk, or blocked.
- Structure: Progress since last update → Current status → Risks/blockers → Next milestones.
- Use metrics where possible: percentage complete, items delivered, days ahead/behind schedule.
- Be candid about risks — surprises are worse than bad news delivered early.`,

    'employee-recognition': `STYLE EXPERTISE — Employee Recognition:
- Be specific about what they did and why it matters.
- Describe the impact of their contribution on the team, project, or company.
- Use concrete examples, not vague praise like "great job" or "strong effort."
- Make the recognition feel personal and proportionate to the achievement.`,

    'promotion-announcement': `STYLE EXPERTISE — Promotion Announcement:
- Lead with the news clearly and enthusiastically.
- Highlight 2-3 specific accomplishments that earned this recognition.
- Describe the new role's scope briefly.
- Encourage the team to congratulate and support the promoted individual.`,

    'policy-update': `STYLE EXPERTISE — Policy Update:
- State the change clearly in the opening paragraph.
- Explain the "why" behind the change — people accept changes better when they understand the reasoning.
- Detail what's changing, what's staying the same, and when it takes effect.
- Provide clear guidance on where to find the full policy and whom to contact with questions.`,

    'invitation': `STYLE EXPERTISE — Invitation:
- The key details (what, when, where, RSVP) must be immediately findable — use formatting.
- Create anticipation about the event — why should they want to attend?
- Make RSVPing effortless with clear instructions.
- Include practical details: parking, dress code, what to bring if applicable.`,

    'marketing': `STYLE EXPERTISE — Marketing:
- The subject line is 80% of the email's success. It must create genuine curiosity.
- Write for scanners: use short paragraphs, bold key phrases, and clear visual hierarchy.
- Focus on the transformation, not the product. What does their life look like after?
- One CTA per email. Make it prominent and action-oriented.`,

    'japanese-business-formal': `STYLE EXPERTISE — Japanese Business Formal (ビジネス敬語):
- Follow the standard Japanese business email structure: 宛名 (addressee with 様), 挨拶 (greeting), 名乗り (self-identification), 本文 (body), 結び (closing), 署名 (signature).
- Open with "お世話になっております" for existing relationships, or "初めてメールをお送りいたします" for first contact.
- Use sonkeigo (尊敬語) when referring to the recipient's actions and kenjougo (謙譲語) when referring to your own.
- Close with "何卒よろしくお願いいたします" or "ご確認のほど、よろしくお願いいたします."
- Use 様 (sama) after the recipient's name. Never use さん in formal business email.
- Keep paragraphs short and clearly structured — Japanese business emails value clarity and consideration.`,

    'japanese-business-request': `STYLE EXPERTISE — Japanese Business Request (依頼メール):
- Use cushioning phrases (クッション言葉) before making requests: "恐れ入りますが," "お手数ですが," "差し支えなければ."
- State the request indirectly first, then provide context, then make the specific ask.
- Use "お願い申し上げます" or "お願いいたします" for the request itself.
- Acknowledge the burden on the recipient: "ご多忙のところ恐縮ですが."
- Provide clear deadlines politely: "○月○日までにご対応いただけますと幸いです."
- Close with gratitude for their consideration: "ご検討のほど、何卒よろしくお願いいたします."`,

    'japanese-academic': `STYLE EXPERTISE — Japanese Academic (先生へ):
- Always address the professor as "先生" — never by first name or with 様.
- Open with "○○先生" on its own line, followed by a greeting.
- Identify yourself clearly: name, department, student ID, course if relevant.
- State your purpose early but politely: "○○についてご相談したくメールいたしました."
- Use humble forms consistently: いたします, 存じます, 伺いたく.
- Close with "お忙しいところ恐れ入りますが、ご指導のほどよろしくお願いいたします."
- Sign with full student information.`,

    'japanese-seasonal': `STYLE EXPERTISE — Japanese Seasonal Greeting (時候の挨拶):
- Open with 拝啓 (haikei) for formal seasonal letters.
- Include an appropriate 時候の挨拶 based on the season or month.
- Express gratitude for the ongoing business relationship: "平素は格別のご高配を賜り、厚く御礼申し上げます."
- Include warm wishes for the recipient's health and prosperity.
- Close with 敬具 (keigu) to match 拝啓.
- The tone should blend warmth with deep respect — Japanese seasonal greetings are an art form that demonstrates cultural refinement.`,
  };

  return expertiseMap[styleId] || '';
}

function getKoreanStyleGuidance(styleId: string, honorificLevel?: string): string {
  const honorificGuidance: Record<string, string> = {
    'formal-highest': `Use 격식체 (formal highest register). Use formal verb endings like -습니다/-ㅂ니다 throughout. Use formal greetings such as "안녕하십니까". Maintain the highest level of Korean formality and respect. Use humble forms (저, 말씀드리다) when referring to yourself and honorific forms (님, -시-) when referring to the recipient.`,
    'polite-standard': `Use 해요체 (polite standard register). Use polite verb endings like -해요/-어요/-아요. This is appropriate for most professional situations. Use "안녕하세요" as greeting. Maintain politeness while being slightly less rigid than 격식체.`,
    'casual': `Use 반말 (casual register). Use informal verb endings like -해/-어/-아. This is appropriate only between close peers of similar age/rank. Use casual greetings. Do NOT use honorific markers.`,
  };

  const selectedHonorific = honorificLevel && honorificGuidance[honorificLevel]
    ? honorificGuidance[honorificLevel]
    : honorificGuidance['polite-standard'];

  const styleGuidanceMap: Record<string, string> = {
    'korean-business-formal': `KOREAN BUSINESS FORMAL EMAIL GUIDANCE:
- This is a formal business email to a superior or elder in the Korean workplace hierarchy.
- ${selectedHonorific}
- Use proper Korean business greetings: Start with "안녕하십니까" or appropriate formal greeting.
- Follow Korean hierarchical language conventions: show deference to the recipient's position.
- Use appropriate Korean business closing formulas such as "감사합니다" or "잘 부탁드립니다".
- Include proper Korean business email structure: formal greeting, context/purpose, detailed explanation, request/action items, formal closing.
- Use appropriate titles and honorifics (부장님, 팀장님, 대표님, etc.) when addressing the recipient.
- Keep sentences structured formally with proper Korean business expressions.`,

    'korean-business-peer': `KOREAN BUSINESS PEER EMAIL GUIDANCE:
- This is a professional email to a colleague or peer at a similar level.
- ${selectedHonorific}
- Use polite but less formal Korean compared to superior-level communication.
- Start with "안녕하세요" or similar polite greeting.
- Korean peer business communication should be warm yet professional.
- Use collaborative language: "같이", "함께", "우리".
- Appropriate closing: "수고하세요", "좋은 하루 되세요", or similar peer-appropriate phrases.
- Maintain professional Korean tone without excessive formality.`,

    'korean-academic': `KOREAN ACADEMIC EMAIL GUIDANCE:
- This is an email to a Korean professor (교수님) requiring strict academic Korean honorifics.
- ${selectedHonorific}
- ALWAYS address the professor as "교수님" — never by first name.
- Start with "교수님, 안녕하십니까" or "교수님께".
- Use the highest level of academic Korean respect: 저 (humble I), 말씀 (honorific for words), -시- (honorific infix).
- Follow proper Korean academic email structure: formal address, self-introduction (if first contact), clear purpose statement, detailed content, humble closing.
- Use expressions like "여쭤볼 것이 있어 메일 드립니다" (I am writing to ask you something).
- Close with "감사합니다" or "바쁘신 와중에 읽어주셔서 감사합니다".
- Sign off with student information: name, department, student ID if applicable.`,

    'korean-self-intro': `KOREAN SELF-INTRODUCTION LETTER (자기소개서) GUIDANCE:
- Follow the traditional Korean 자기소개서 structure used in job applications.
- ${selectedHonorific}
- Structure should include these key sections:
  1. 성장배경 (Background/Upbringing) — Brief personal background that shaped your character.
  2. 성격의 장단점 (Strengths and Weaknesses) — Self-aware personality assessment.
  3. 지원동기 (Motivation for Applying) — Why you want this specific position/company.
  4. 입사 후 포부 (Goals After Joining) — Your aspirations and what you'll contribute.
- Write in a sincere, humble yet confident Korean tone.
- Show genuine passion and cultural fit for the Korean workplace.
- Reference specific company values or recent achievements when possible.
- If a resume is provided, weave relevant experiences into the narrative naturally.
- Keep the tone earnest (진솔한) — a key Korean 자기소개서 quality.`,

    'korean-seasonal': `KOREAN SEASONAL GREETING EMAIL (인사메일) GUIDANCE:
- This is a Korean business seasonal/holiday greeting email.
- ${selectedHonorific}
- Include appropriate seasonal references based on context:
  - 설날 (Lunar New Year): "새해 복 많이 받으세요", wishes for prosperity.
  - 추석 (Korean Thanksgiving): "풍성한 추석 보내세요", gratitude and harvest themes.
  - 신년 (New Year): "새해에도 건강하시고 좋은 일만 가득하시길 바랍니다".
  - General seasonal: Reference the current season appropriately.
- Express gratitude for the business relationship: "올 한 해 함께해 주셔서 감사합니다".
- Include warm wishes for health and prosperity: "건강하시고 행복한 시간 보내시기 바랍니다".
- Maintain professional warmth — Korean seasonal greetings blend personal warmth with business respect.
- Close with hopes for continued cooperation: "앞으로도 좋은 관계 이어가길 바랍니다".`,
  };

  return styleGuidanceMap[styleId] || '';
}

function getJapaneseStyleGuidance(styleId: string): string {
  const styleGuidanceMap: Record<string, string> = {
    'japanese-business-formal': `JAPANESE BUSINESS FORMAL EMAIL (ビジネス敬語) GUIDANCE:
- This is a formal Japanese business email requiring proper keigo (敬語) usage.
- STRUCTURE: Follow the standard format strictly:
  1. 宛名 (Addressee): "[Company name] [Department] [Name]様" on its own line.
  2. 挨拶 (Greeting): "お世話になっております。" for existing contacts, or "突然のご連絡失礼いたします。" for first contact.
  3. 名乗り (Self-identification): "[Company] の [Name] でございます。"
  4. 本文 (Body): State purpose clearly, use keigo consistently.
  5. 結び (Closing): "何卒よろしくお願いいたします。" or "ご確認のほど、よろしくお願い申し上げます。"
  6. 署名 (Signature): Full name, company, department, contact information.
- Use 尊敬語 (sonkeigo) for the recipient's actions: いらっしゃる, おっしゃる, ご覧になる, ご存じ.
- Use 謙譲語 (kenjougo) for your own actions: 参る, 申す, 拝見する, 存じる.
- Use 丁寧語 (teineigo) as the base politeness level: です/ます form throughout.
- Address the recipient with 様 (sama). Never use さん in formal business email.
- Avoid overly direct language. Japanese business culture values 配慮 (consideration) and indirect expression.`,

    'japanese-business-request': `JAPANESE BUSINESS REQUEST EMAIL (依頼メール) GUIDANCE:
- This email makes a request of the recipient and requires extra politeness and indirectness.
- Use クッション言葉 (cushioning phrases) before every request:
  - "恐れ入りますが" (I'm sorry to trouble you, but...)
  - "お手数ですが" (I know it's troublesome, but...)
  - "差し支えなければ" (If it's not too much trouble...)
  - "ご多忙のところ恐縮ですが" (I know you are busy, and I apologize, but...)
  - "もしよろしければ" (If you wouldn't mind...)
- Structure the request: context first, then the indirect request, then the specific details.
- Express the request using: "お願い申し上げます," "お願いいたします," or "いただけますと幸いです."
- State deadlines politely: "○月○日までにご対応いただけますと大変助かります。"
- Acknowledge the imposition: "お忙しいところ大変恐縮ではございますが。"
- Close with deep gratitude: "ご検討のほど、何卒よろしくお願いいたします。"`,

    'japanese-academic': `JAPANESE ACADEMIC EMAIL (先生へ) GUIDANCE:
- This is an email to a Japanese professor or teacher requiring strict academic honorifics.
- ALWAYS address as "先生" — never by first name, never with 様.
- Open with "○○先生" on its own line, followed by an appropriate greeting.
- Immediately identify yourself: "○○学部○○学科の○○と申します。" (I am [Name] from [Department].)
- If it's a class-related inquiry, mention the specific course: "○○の授業を受講しております○○です。"
- State your purpose clearly but humbly: "○○についてお伺いしたく、メールをお送りいたしました。"
- Use humble verb forms consistently: いたします, 存じます, 伺いたく, お送りいたしました.
- Close with: "お忙しいところ恐れ入りますが、ご指導のほどよろしくお願いいたします。"
- Sign with: full name, department, student ID, and contact information.`,

    'japanese-seasonal': `JAPANESE SEASONAL GREETING EMAIL (時候の挨拶) GUIDANCE:
- This is a formal Japanese seasonal/holiday business greeting.
- STRUCTURE: Use the traditional 拝啓/敬具 format:
  1. 拝啓 (Dear Sir/Madam — formal letter opening)
  2. 時候の挨拶 — seasonal greeting appropriate to the current season:
     - Spring (3-5月): "春暖の候" "桜花の候" "新緑の候"
     - Summer (6-8月): "盛夏の候" "猛暑の候" "残暑の候"
     - Autumn (9-11月): "初秋の候" "紅葉の候" "晩秋の候"
     - Winter (12-2月): "師走の候" "厳寒の候" "立春の候"
     - New Year: "謹んで新年のお慶びを申し上げます"
  3. 安否の挨拶: "皆様におかれましては、ますますご健勝のこととお慶び申し上げます。"
  4. Business gratitude: "平素は格別のご高配を賜り、厚く御礼申し上げます。"
  5. Main message: seasonal well-wishes and relationship affirmation.
  6. Closing wish: "皆様のご健康とご多幸をお祈り申し上げます。"
  7. 敬具 (Respectfully — formal letter closing)
- The tone should convey deep respect and genuine warmth — seasonal greetings in Japanese business culture demonstrate 教養 (cultural refinement).`,
  };

  return styleGuidanceMap[styleId] || '';
}

function buildQualityDirectives(): string {
  return `
QUALITY STANDARDS — Apply these checks before outputting:
1. OPENING TEST: Does the first sentence immediately establish relevance? If it's generic filler, rewrite it.
2. SPECIFICITY TEST: Replace any vague phrase ("great opportunity," "significant experience," "valuable skills") with a concrete, specific alternative.
3. TONE CONSISTENCY: Ensure the register doesn't shift between paragraphs. Formal stays formal. Casual stays casual.
4. READABILITY: Vary sentence length. Follow a long sentence with a short one. Monotonous rhythm puts readers to sleep.
5. CTA CLARITY: The reader should know exactly what to do after reading this email. If the next step is ambiguous, sharpen it.
6. AUTHENTICITY CHECK: Would a real human write this? Eliminate any phrasing that sounds AI-generated, robotic, or templated.
7. TRIM TEST: Read every sentence. If removing it doesn't change the email's effectiveness, remove it.`;
}

function buildAttachmentGuidance(styleId: string, hasAttachment: boolean): string {
  if (!hasAttachment) return '';

  const guidanceMap: Record<string, string> = {
    'follow-up': 'ATTACHMENT INTELLIGENCE: A previous email thread has been provided. Analyze the conversation for tone, key decisions, open questions, and emotional undertones. Your follow-up should feel like a natural continuation — reference specific points, build on prior agreements, and address any unresolved concerns.',
    'cover-letter': 'ATTACHMENT INTELLIGENCE: A resume/CV has been provided. Mine it for quantifiable achievements, unique skills, and career narrative. Don\'t just list qualifications — tell the story of how specific experiences prepared you for THIS role. Prioritize achievements that align with the job requirements.',
    'proposal': 'ATTACHMENT INTELLIGENCE: Supporting documents have been provided. Extract key data points, metrics, and evidence to strengthen your proposal. Reference specific findings or capabilities that address the recipient\'s needs.',
    'invoice': 'ATTACHMENT INTELLIGENCE: Financial documents have been provided. Reference specific amounts, line items, dates, and terms from the attached materials. Ensure accuracy — financial communication demands precision.',
    'recruiter-outreach': 'ATTACHMENT INTELLIGENCE: A candidate resume or job description has been provided. Cross-reference the candidate\'s experience with the role requirements to identify 2-3 compelling alignment points. Reference specific skills and achievements that make this candidate uniquely qualified. Show genuine engagement with their career trajectory.',
    'korean-self-intro': 'ATTACHMENT INTELLIGENCE: A resume/CV has been provided. Weave relevant experiences, skills, and achievements from the resume into the 자기소개서 narrative organically. Each section should draw from real career data to create a compelling, authentic self-introduction.',
    'policy-update': 'ATTACHMENT INTELLIGENCE: Policy documents have been provided. Summarize the key changes clearly and reference the full attached document for detailed review.',
  };

  return '\n\n' + (guidanceMap[styleId] || 'ATTACHMENT INTELLIGENCE: Reference materials have been provided. Analyze the content and incorporate relevant details naturally into the email to strengthen its message and demonstrate thorough preparation.');
}

function buildRecruiterGuidance(params: EmailGenerationParams): string {
  if (params.style !== 'recruiter-outreach') return '';

  const outreachType = params.recruiterOutreachType || 'intro';
  const outreachStyle = params.recruiterOutreachStyle || 'professional-direct';

  const styleGuidanceMap: Record<string, string> = {
    'professional-direct': 'APPROACH: Be clear, concise, and respectful of the candidate\'s time. Get straight to the opportunity with confidence. No fluff — let the role speak for itself.',
    'warm-friendly': 'APPROACH: Use a personable, conversational tone. Build human connection early — reference something genuine about their profile or career journey. Professional warmth, not corporate friendliness.',
    'executive-brief': 'APPROACH: Write as a senior talent advisor, not a recruiter filling a req. Use executive-level language. Be succinct — every sentence should communicate importance and exclusivity.',
    'consultative': 'APPROACH: Position yourself as a career strategist. Frame the conversation around their career trajectory and where this opportunity fits in their growth arc. You\'re offering insight, not just a job.',
    'opportunity-focused': 'APPROACH: Lead with what makes this role genuinely exciting — impact, innovation, growth trajectory, team caliber. Make the opportunity the protagonist, not the company.',
    'industry-insider': 'APPROACH: Demonstrate deep domain expertise. Reference industry trends, company positioning, or market dynamics that make this opportunity timely. Show you understand their world.',
    'relationship-building': 'APPROACH: This isn\'t about one role — it\'s about starting a professional relationship. Express interest in their career broadly, mention the current opportunity as one of several possibilities.',
    'urgent-confidential': 'APPROACH: Convey genuine urgency and selectivity. This is a retained or high-priority search. Use language that signals exclusivity without being salesy.',
  };

  const styleGuidance = styleGuidanceMap[outreachStyle] || styleGuidanceMap['professional-direct'];

  if (outreachType === 'intro') {
    return `\n\nRECRUITER OUTREACH — INITIAL CONTACT:
${styleGuidance}
- This is first contact. The candidate doesn't know you. You have 8 seconds of their attention.
- Open with WHY them specifically — not why the role is great.
- Show you've reviewed their background by referencing 1-2 specific things from their profile.
- The role description should be compelling, not comprehensive. Highlight 2-3 unique selling points.
- CTA must be low-commitment: a 15-minute call, a brief chat, "would you be open to learning more?"
- Avoid: "I came across your profile," "exciting opportunity," "perfect fit." These signal mass outreach.`;
  } else {
    return `\n\nRECRUITER OUTREACH — FOLLOW-UP:
${styleGuidance}
- Acknowledge the previous outreach naturally — don't guilt-trip about non-response.
- ADD NEW VALUE: Share a new detail about the role, team, or company not mentioned before.
- Keep it shorter than the initial outreach. Respect their inbox.
- Offer an easy exit: "If the timing isn't right, I completely understand."
- Restate the CTA with even lower friction than before.
- Avoid: "Just following up," "Bumping this to the top," "Did you see my previous email?"`;
  }
}

export async function generateEmail(params: any): Promise<any> {
  const selectedStyle = emailStyles.find(s => s.id === params.style);
  const styleName = selectedStyle?.name || 'Professional';
  const styleDescription = selectedStyle?.description || 'Professional tone';

  const styleId = params.style || 'professional-formal';
  const recipientName = params.recipientName || 'Recipient';
  const senderName = params.senderName || 'Sender';
  const subject = params.subject || 'Message';
  const topic = params.topic || params.subject || 'General message';
  const length: 'short' | 'medium' | 'long' = params.length || 'medium';
  const outputLanguage = params.outputLanguage || 'English';
  const inputLanguage = params.inputLanguage || 'English';

  let contextSignals = '';

  if (params.recipientLinkedIn) {
    contextSignals += `\nRecipient LinkedIn: ${params.recipientLinkedIn}`;
  }
  if (params.senderLinkedIn) {
    contextSignals += `\nSender LinkedIn: ${params.senderLinkedIn}`;
  }
  if (params.jobDescription) {
    contextSignals += `\nJob Description URL: ${params.jobDescription}`;
  }
  if (params.agencyWebsite) {
    contextSignals += `\nRecruiting Agency Website: ${params.agencyWebsite}`;
  }
  if (params.endUserHomepage) {
    contextSignals += `\nHiring Company Website: ${params.endUserHomepage}`;
  }
  if (params.attachmentContent && params.attachmentName) {
    const attachmentType = getAttachmentType(styleId, params.attachmentName);
    contextSignals += `\n\n${attachmentType} (${params.attachmentName}):\n${truncateAttachment(params.attachmentContent)}`;
  }
  if (params.additionalContext) {
    contextSignals += `\nAdditional Context: ${params.additionalContext}`;
  }

  const communicationFramework = selectCommunicationFramework(styleId);
  const audienceIntelligence = inferAudienceIntelligence(params);
  const rhetoricalStrategy = buildRhetoricalStrategy(styleId, length);
  const culturalIntelligence = buildCulturalIntelligence(outputLanguage, styleId);
  const styleExpertise = buildStyleExpertise(styleId);
  const koreanGuidance = styleId.startsWith('korean-') ? getKoreanStyleGuidance(styleId, params.koreanHonorificLevel) : '';
  const japaneseGuidance = styleId.startsWith('japanese-') ? getJapaneseStyleGuidance(styleId) : '';
  const attachmentGuidance = buildAttachmentGuidance(styleId, !!(params.attachmentContent && params.attachmentName));
  const recruiterGuidance = buildRecruiterGuidance(params);
  const qualityDirectives = buildQualityDirectives();
  const advancedDirectives = buildAdvancedDirectives(params);

  const secondLanguage = inputLanguage !== outputLanguage ? inputLanguage : 'English';
  const dualLanguageGuidance = params.dualLanguageOutput
    ? `\n\nDUAL LANGUAGE OUTPUT: After writing the complete email in ${outputLanguage}, add a clear separator line "---" followed by a culturally-adapted version of the email in ${secondLanguage}. This is NOT a word-for-word translation — it is a culturally re-written version that feels native to a ${secondLanguage} speaker. Adapt greetings, closings, formality levels, and cultural conventions to match ${secondLanguage} norms. Both versions should be independently excellent.`
    : '';

  const systemPrompt = `You are an elite email communication specialist with deep expertise in professional writing, cross-cultural communication, and persuasion psychology. You craft emails that are strategically structured, psychologically attuned, and linguistically precise.

STYLE: ${styleName}
DESCRIPTION: ${styleDescription}
OUTPUT LANGUAGE: ${outputLanguage}

LANGUAGE DIRECTIVE: The email MUST be written entirely in ${outputLanguage}. All content — greeting, body, closing, signature — must be in natural, fluent ${outputLanguage}. Do not mix languages unless the context specifically calls for a term that has no equivalent.

${communicationFramework ? communicationFramework + '\n' : ''}${styleExpertise ? styleExpertise + '\n' : ''}${rhetoricalStrategy}
${audienceIntelligence}${culturalIntelligence ? '\n' + culturalIntelligence : ''}${koreanGuidance ? '\n\n' + koreanGuidance : ''}${japaneseGuidance ? '\n\n' + japaneseGuidance : ''}${attachmentGuidance}${recruiterGuidance}${dualLanguageGuidance}${advancedDirectives}
${qualityDirectives}

FORMATTING RULES:
- Use proper email structure: greeting, body paragraphs, closing, signature.
- Make the email ready to send as-is. No placeholders like [Your Name], [Company], or [Date].
- If specific details are unknown, infer reasonable specifics from context rather than leaving blanks.
- Do not include a subject line in the output — the user provides that separately.${params.emailSignature ? `\n- SIGNATURE: End the email with EXACTLY this signature block, preserving its exact formatting and line breaks:\n\n${params.emailSignature}` : ''}`;

  let userPrompt = `COMPOSE a ${lengthGuidelines[length]} ${styleName} email with the following parameters:

RECIPIENT: ${recipientName}
SENDER: ${senderName}
PURPOSE: ${subject}
KEY POINTS TO ADDRESS: ${topic}${contextSignals}`;

  if (params.sampleEmail) {
    userPrompt += `\n\nSTYLE REFERENCE — The following sample email demonstrates the tone and voice the user wants to match. Analyze its sentence structure, vocabulary level, formality, and personality, then replicate these qualities:\n\n${params.sampleEmail}`;
  }

  if (params.customInstructions?.trim()) {
    userPrompt += `\n\nADDITIONAL USER INSTRUCTIONS (honor these where they don't conflict with the language directive or formatting rules in the system prompt):\n${params.customInstructions.trim()}`;
  }

  userPrompt += `\n\nGenerate the email now. Output ONLY the email content in ${outputLanguage} — no commentary, no meta-discussion, no explanations before or after the email.`;

  // Cost-abuse mitigation: only authenticated users can override model, push high token caps, or pin a seed.
  const isAuthenticated = !!(params as any).__isAuthenticated;
  const requestedModel = isAuthenticated && params.model && ALLOWED_MODELS.has(params.model)
    ? params.model
    : 'gpt-4o';
  const model = requestedModel;

  const temperature = typeof params.temperature === 'number' ? clamp(params.temperature, 0, 2) : 0.7;
  const topP = typeof params.topP === 'number' ? clamp(params.topP, 0, 1) : 1;
  const frequencyPenalty = typeof params.frequencyPenalty === 'number' ? clamp(params.frequencyPenalty, -2, 2) : 0;
  const presencePenalty = typeof params.presencePenalty === 'number' ? clamp(params.presencePenalty, -2, 2) : 0;
  const maxTokenCeiling = isAuthenticated ? 16000 : 5000;
  const maxTokens = typeof params.maxOutputTokens === 'number'
    ? clamp(params.maxOutputTokens, 100, maxTokenCeiling)
    : 5000;
  const seedValue = isAuthenticated && params.seed && /^-?\d+$/.test(String(params.seed).trim())
    ? parseInt(String(params.seed).trim(), 10)
    : undefined;

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      ...(seedValue !== undefined ? { seed: seedValue } : {}),
    });

    const generatedEmail = completion.choices[0]?.message?.content || '';

    if (!generatedEmail) {
      console.error('Email generation failed: No content in OpenAI response');
      throw new Error('No email content generated');
    }

    return {
      email: generatedEmail,
      systemPrompt,
      userPrompt,
      model,
      promptTokens: completion.usage?.prompt_tokens || 0,
      completionTokens: completion.usage?.completion_tokens || 0,
      totalTokens: completion.usage?.total_tokens || 0,
    };
  } catch (error: any) {
    console.error('Email generation error:', error.message);
    throw new Error(`Failed to generate email: ${error.message}`);
  }
}
