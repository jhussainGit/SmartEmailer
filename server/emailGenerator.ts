import { openai } from "./openai";
import { emailStyles } from "../client/src/lib/emailStyles";

interface EmailGenerationParams {
  style: string;
  emailType: string;
  recipientName: string;
  recipientLinkedIn?: string;
  senderName: string;
  senderLinkedIn?: string;
  subject: string;
  topic: string;
  length: 'short' | 'medium' | 'long';
  sampleEmail?: string;
  jobDescription?: string;
  additionalContext?: string;
}

const lengthGuidelines = {
  short: '150-250 words (2-3 paragraphs)',
  medium: '250-400 words (3-5 paragraphs)',
  long: '400-600 words (5-7 paragraphs)',
};

export async function generateEmail(params: EmailGenerationParams): Promise<string> {
  const selectedStyle = emailStyles.find(s => s.id === params.style);
  const styleName = selectedStyle?.name || 'Professional';
  const styleDescription = selectedStyle?.description || 'Professional tone';

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
  
  if (params.additionalContext) {
    context += `\nAdditional Context: ${params.additionalContext}`;
  }

  const systemPrompt = `You are an expert email writer specializing in ${styleName} style emails. 
Your task is to generate professional, well-structured emails that match the specified style perfectly.

Style: ${styleName}
Description: ${styleDescription}

Key guidelines:
1. Match the tone and formality level of the specified style
2. Use proper email structure (greeting, body, closing, signature)
3. Be concise yet complete
4. Use natural, conversational language appropriate to the style
5. Include proper punctuation and formatting
6. Make the email ready to send (no placeholders like [Your Name])`;

  let userPrompt = `Generate a ${params.length} ${params.emailType} email with the following details:

Recipient: ${params.recipientName}
Sender: ${params.senderName}
Subject/Purpose: ${params.subject}
Main Topic: ${params.topic}
Target Length: ${lengthGuidelines[params.length]}${context}`;

  if (params.sampleEmail) {
    userPrompt += `\n\nSample Email for Style Reference:\n${params.sampleEmail}\n\nPlease match the tone and style of the sample email above.`;
  }

  userPrompt += `\n\nGenerate a complete, professional email that:
1. Uses the ${styleName} writing style
2. Addresses the recipient by name
3. Clearly communicates the purpose
4. Maintains appropriate tone throughout
5. Includes a proper signature from ${params.senderName}
6. Is approximately ${lengthGuidelines[params.length]} in length

Return ONLY the email content, no additional commentary or explanations.`;

  try {
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_completion_tokens: 2000,
    });

    const generatedEmail = completion.choices[0]?.message?.content || '';
    
    if (!generatedEmail) {
      throw new Error('No email content generated');
    }

    return generatedEmail;
  } catch (error) {
    console.error('Error generating email:', error);
    throw new Error('Failed to generate email. Please try again.');
  }
}
