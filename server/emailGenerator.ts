import { openai } from "./openai";
import { emailStyles } from "../client/src/lib/emailStyles";

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
}

const lengthGuidelines = {
  short: '150-250 words (2-3 paragraphs)',
  medium: '250-400 words (3-5 paragraphs)',
  long: '400-600 words (5-7 paragraphs)',
};

function getAttachmentType(styleId: string, fileName: string): string {
  if (styleId === 'follow-up') return 'Previous Email Thread';
  if (styleId === 'cover-letter') return 'Resume/CV Content';
  if (styleId === 'proposal') return 'Proposal/Presentation Content';
  if (styleId === 'invoice') return 'Invoice/Document Content';
  if (styleId === 'recruiter-outreach') return 'Candidate Resume or Job Description';
  if (styleId === 'korean-self-intro') return 'Resume/CV Content';
  return 'Attached Document Content';
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
- This is a formal business email to a superior or elder in the Korean workplace hierarchy
- ${selectedHonorific}
- Use proper Korean business greetings: Start with "안녕하십니까" or appropriate formal greeting
- Follow Korean hierarchical language conventions: show deference to the recipient's position
- Use appropriate Korean business closing formulas such as "감사합니다" or "잘 부탁드립니다"
- Include proper Korean business email structure: formal greeting, context/purpose, detailed explanation, request/action items, formal closing
- Use appropriate titles and honorifics (부장님, 팀장님, 대표님, etc.) when addressing the recipient
- Keep sentences structured formally with proper Korean business expressions`,

    'korean-business-peer': `KOREAN BUSINESS PEER EMAIL GUIDANCE:
- This is a professional email to a colleague or peer at a similar level
- ${selectedHonorific}
- Use polite but less formal Korean compared to superior-level communication
- Start with "안녕하세요" or similar polite greeting
- Korean peer business communication should be warm yet professional
- Use collaborative language: "같이", "함께", "우리"
- Appropriate closing: "수고하세요", "좋은 하루 되세요", or similar peer-appropriate phrases
- Maintain professional Korean tone without excessive formality`,

    'korean-academic': `KOREAN ACADEMIC EMAIL GUIDANCE:
- This is an email to a Korean professor (교수님) requiring strict academic Korean honorifics
- ${selectedHonorific}
- ALWAYS address the professor as "교수님" - never by first name
- Start with "교수님, 안녕하십니까" or "교수님께"
- Use the highest level of academic Korean respect: 저 (humble I), 말씀 (honorific for words), -시- (honorific infix)
- Follow proper Korean academic email structure: formal address, self-introduction (if first contact), clear purpose statement, detailed content, humble closing
- Use expressions like "여쭤볼 것이 있어 메일 드립니다" (I am writing to ask you something)
- Close with "감사합니다" or "바쁘신 와중에 읽어주셔서 감사합니다"
- Sign off with student information: name, department, student ID if applicable`,

    'korean-self-intro': `KOREAN SELF-INTRODUCTION LETTER (자기소개서) GUIDANCE:
- Follow the traditional Korean 자기소개서 structure used in job applications
- ${selectedHonorific}
- Structure should include these key sections:
  1. 성장배경 (Background/Upbringing) - Brief personal background that shaped your character
  2. 성격의 장단점 (Strengths and Weaknesses) - Self-aware personality assessment
  3. 지원동기 (Motivation for Applying) - Why you want this specific position/company
  4. 입사 후 포부 (Goals After Joining) - Your aspirations and what you'll contribute
- Write in a sincere, humble yet confident Korean tone
- Show genuine passion and cultural fit for the Korean workplace
- Reference specific company values or recent achievements when possible
- If a resume is provided, weave relevant experiences into the narrative naturally
- Keep the tone earnest (진솔한) - a key Korean 자기소개서 quality`,

    'korean-seasonal': `KOREAN SEASONAL GREETING EMAIL (인사메일) GUIDANCE:
- This is a Korean business seasonal/holiday greeting email
- ${selectedHonorific}
- Include appropriate seasonal references based on context:
  - 설날 (Lunar New Year): "새해 복 많이 받으세요", wishes for prosperity
  - 추석 (Korean Thanksgiving): "풍성한 추석 보내세요", gratitude and harvest themes
  - 신년 (New Year): "새해에도 건강하시고 좋은 일만 가득하시길 바랍니다"
  - General seasonal: Reference the current season appropriately
- Express gratitude for the business relationship: "올 한 해 함께해 주셔서 감사합니다"
- Include warm wishes for health and prosperity: "건강하시고 행복한 시간 보내시기 바랍니다"
- Maintain professional warmth - Korean seasonal greetings blend personal warmth with business respect
- Close with hopes for continued cooperation: "앞으로도 좋은 관계 이어가길 바랍니다"`,
  };

  return styleGuidanceMap[styleId] || '';
}

function truncateAttachment(content: string, maxChars: number = 10000): string {
  if (content.length <= maxChars) return content;
  return content.substring(0, maxChars) + '\n\n[Content truncated for length...]';
}

export async function generateEmail(params: any): Promise<string> {
  const selectedStyle = emailStyles.find(s => s.id === params.style);
  const styleName = selectedStyle?.name || 'Professional';
  const styleDescription = selectedStyle?.description || 'Professional tone';

  // Set defaults for optional fields
  const styleId = params.style || 'professional-formal';
  const recipientName = params.recipientName || 'Recipient';
  const senderName = params.senderName || 'Sender';
  const subject = params.subject || 'Message';
  const topic = params.topic || params.subject || 'General message';
  const length: 'short' | 'medium' | 'long' = params.length || 'medium';
  const outputLanguage = params.outputLanguage || 'English';

  // Build context from optional fields
  let context = '';
  
  if (params.recipientLinkedIn) {
    context += `\nRecipient LinkedIn: ${params.recipientLinkedIn}`;
  }
  
  if (params.senderLinkedIn) {
    context += `\nSender LinkedIn: ${params.senderLinkedIn}`;
  }
  
  if (params.jobDescription) {
    context += `\nJob Description URL: ${params.jobDescription}`;
  }
  
  if (params.agencyWebsite) {
    context += `\nRecruiting Agency Website: ${params.agencyWebsite}`;
  }
  
  if (params.endUserHomepage) {
    context += `\nHiring Company Website: ${params.endUserHomepage}`;
  }
  
  if (params.attachmentContent && params.attachmentName) {
    const attachmentType = getAttachmentType(styleId, params.attachmentName);
    context += `\n\n${attachmentType} (${params.attachmentName}):\n${truncateAttachment(params.attachmentContent)}`;
  }
  
  if (params.additionalContext) {
    context += `\nAdditional Context: ${params.additionalContext}`;
  }

  let attachmentGuidance = '';
  if (params.attachmentContent && params.attachmentName) {
    if (styleId === 'follow-up') {
      attachmentGuidance = '\n\nATTACHMENT GUIDANCE: A previous email thread has been provided. Reference key points from the conversation naturally, acknowledge previous messages, and build upon the existing discussion thread.';
    } else if (styleId === 'cover-letter') {
      attachmentGuidance = '\n\nATTACHMENT GUIDANCE: A resume/CV has been provided. Use relevant skills, experiences, and qualifications from the resume to strengthen your cover letter. Highlight achievements that align with the position.';
    } else if (styleId === 'proposal') {
      attachmentGuidance = '\n\nATTACHMENT GUIDANCE: Supporting documents (proposal/presentation) have been provided. Reference key points, data, or highlights from the attached materials to strengthen your message.';
    } else if (styleId === 'invoice') {
      attachmentGuidance = '\n\nATTACHMENT GUIDANCE: Invoice or supporting documents have been provided. Reference key details, amounts, or relevant information from the attached materials in your message.';
    } else if (styleId === 'recruiter-outreach') {
      attachmentGuidance = '\n\nATTACHMENT GUIDANCE: A candidate resume or job description has been provided. Use this to personalize the outreach - reference specific skills, experiences, or job requirements that make this opportunity a strong match. Show you\'ve done your homework.';
    } else if (styleId === 'korean-self-intro') {
      attachmentGuidance = '\n\nATTACHMENT GUIDANCE: A resume/CV has been provided. Weave relevant experiences, skills, and achievements from the resume into the 자기소개서 narrative naturally. Reference specific accomplishments that demonstrate your qualifications for the position.';
    }
  }
  
  // Special handling for recruiter outreach
  let recruiterGuidance = '';
  if (styleId === 'recruiter-outreach') {
    const outreachType = params.recruiterOutreachType || 'intro';
    const outreachStyle = params.recruiterOutreachStyle || 'professional-direct';
    
    const styleGuidanceMap: Record<string, string> = {
      'professional-direct': 'Be clear, concise, and respectful of the candidate\'s time. Get straight to the point about the opportunity.',
      'warm-friendly': 'Use a personable, conversational tone. Build rapport while maintaining professionalism.',
      'executive-brief': 'Use executive-level language. Be succinct and focus on high-level opportunity highlights.',
      'consultative': 'Position yourself as a career advisor. Focus on how this opportunity aligns with their career goals.',
      'opportunity-focused': 'Lead with the exciting aspects of the role - growth potential, innovation, impact.',
      'industry-insider': 'Demonstrate deep industry knowledge. Show you understand their field and career trajectory.',
      'relationship-building': 'Focus on starting a long-term professional relationship. This isn\'t just about one role.',
      'urgent-confidential': 'Convey urgency and exclusivity. This is a time-sensitive, high-priority opportunity.',
    };
    
    const styleGuidance = styleGuidanceMap[outreachStyle] || styleGuidanceMap['professional-direct'];
    
    if (outreachType === 'intro') {
      recruiterGuidance = `\n\nRECRUITER OUTREACH GUIDANCE (INITIAL MESSAGE):
- This is the FIRST contact with this candidate
- ${styleGuidance}
- Clearly state why you're reaching out and how you found them (LinkedIn profile mentioned above)
- Highlight 2-3 key aspects of the role that match their background
- Make it easy to respond - include a clear call-to-action (brief call, quick conversation)
- Show genuine interest in their career, not just filling a position
- Keep it compelling but not pushy`;
    } else {
      recruiterGuidance = `\n\nRECRUITER OUTREACH GUIDANCE (2ND FOLLOW-UP):
- This is a FOLLOW-UP to a previous initial outreach (assume they haven't responded yet)
- ${styleGuidance}
- Acknowledge your previous message politely without being pushy
- Add new information or a different angle (company growth, team insights, timing update)
- Reemphasize the value proposition - why this is worth their consideration
- Provide an easy out - respect their decision if not interested
- Keep tone professional and understanding - recognize they're busy
- Include a clear, low-pressure call-to-action`;
    }
  }

  const koreanGuidance = styleId.startsWith('korean-') ? getKoreanStyleGuidance(styleId, params.koreanHonorificLevel) : '';

  const inputLanguage = params.inputLanguage || 'English';
  const secondLanguage = inputLanguage !== outputLanguage ? inputLanguage : 'English';
  const dualLanguageGuidance = params.dualLanguageOutput
    ? `\n\nDUAL LANGUAGE OUTPUT: After writing the complete email in ${outputLanguage}, add a clear separator line "---" followed by a full translation of the email in ${secondLanguage}. Both versions should be complete, professional emails - not word-for-word translations. Adapt greetings and closings to be natural in each language.`
    : '';

  const systemPrompt = `You are an expert email writer specializing in ${styleName} style emails. 
Your task is to generate professional, well-structured emails that match the specified style perfectly.

Style: ${styleName}
Description: ${styleDescription}

IMPORTANT: The email MUST be written entirely in ${outputLanguage}. All content, including greeting, body, and signature, should be in ${outputLanguage}.

Key guidelines:
1. Match the tone and formality level of the specified style
2. Use proper email structure (greeting, body, closing, signature)
3. Be concise yet complete
4. Use natural, conversational language appropriate to the style
5. Include proper punctuation and formatting
6. Make the email ready to send (no placeholders like [Your Name])
7. Write the entire email in ${outputLanguage}${koreanGuidance ? '\n\n' + koreanGuidance : ''}${attachmentGuidance}${recruiterGuidance}${dualLanguageGuidance}`;

  let userPrompt = `Generate a ${length} ${styleName} style email with the following details:

Recipient: ${recipientName}
Sender: ${senderName}
Subject/Purpose: ${subject}
Main Topic: ${topic}
Target Length: ${lengthGuidelines[length]}${context}`;

  if (params.sampleEmail) {
    userPrompt += `\n\nSample Email for Style Reference:\n${params.sampleEmail}\n\nPlease match the tone and style of the sample email above.`;
  }

  userPrompt += `\n\nGenerate a complete, professional email that:
1. Uses the ${styleName} writing style
2. Addresses the recipient by name
3. Clearly communicates the purpose
4. Maintains appropriate tone throughout
5. Includes a proper signature from ${senderName}
6. Is approximately ${lengthGuidelines[length]} in length
7. Is written ENTIRELY in ${outputLanguage}

Return ONLY the email content in ${outputLanguage}, no additional commentary or explanations.`;

  try {
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    // GPT-5 uses reasoning tokens + output tokens, so we need a higher limit to accommodate both
    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_completion_tokens: 5000,
    });

    const generatedEmail = completion.choices[0]?.message?.content || '';
    
    if (!generatedEmail) {
      console.error('Email generation failed: No content in OpenAI response');
      throw new Error('No email content generated');
    }

    return generatedEmail;
  } catch (error: any) {
    console.error('Email generation error:', error.message);
    throw new Error(`Failed to generate email: ${error.message}`);
  }
}
