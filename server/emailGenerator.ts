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
  return 'Attached Document Content';
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
7. Write the entire email in ${outputLanguage}${attachmentGuidance}${recruiterGuidance}`;

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
