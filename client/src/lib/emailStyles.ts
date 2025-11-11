import { 
  Briefcase, GraduationCap, Heart, Users, TrendingUp, 
  FileText, Mail, Smile, Shield, Sparkles, Target,
  MessageSquare, Award, Coffee, Zap, ChevronRight,
  ClipboardCheck, Send, Bell, Building, UserPlus,
  Calendar, ThumbsUp, AlertCircle, CheckCircle, Info,
  Package, DollarSign, Handshake, Globe, UserSearch,
  Megaphone, Star, FileCheck, UsersRound, Scroll,
  Trophy, ClipboardList, BarChart, AlertTriangle
} from 'lucide-react';

export interface EmailStyle {
  id: string;
  name: string;
  icon: any;
  description: string;
  category: 'professional' | 'academic' | 'casual' | 'creative';
  attachmentConfig?: {
    label: string;
    accept: string;
    placeholder: string;
  };
}

export const emailStyles: EmailStyle[] = [
  { id: 'professional-formal', name: 'Professional Formal', icon: Briefcase, description: 'Polished business communication', category: 'professional' },
  { id: 'professional-casual', name: 'Professional Casual', icon: Coffee, description: 'Approachable yet professional', category: 'professional' },
  { id: 'recruiter-outreach', name: 'Recruiter Outreach to Candidate', icon: UserSearch, description: 'Professional recruitment communication', category: 'professional', attachmentConfig: { label: 'Resume or Job Description (Optional)', accept: '.pdf,.doc,.docx,.txt', placeholder: 'Upload candidate resume or detailed job description...' } },
  { id: 'executive', name: 'Executive', icon: Building, description: 'C-suite level communication', category: 'professional' },
  { id: 'sales-pitch', name: 'Sales Pitch', icon: TrendingUp, description: 'Persuasive and compelling', category: 'professional' },
  { id: 'networking', name: 'Networking', icon: Users, description: 'Build professional relationships', category: 'professional' },
  { id: 'follow-up', name: 'Follow-Up', icon: ChevronRight, description: 'Polite reminder emails', category: 'professional', attachmentConfig: { label: 'Previous Email Thread (Optional)', accept: '.txt,.eml,.msg,.html', placeholder: 'Upload the previous email conversation for context...' } },
  { id: 'thank-you', name: 'Thank You', icon: ThumbsUp, description: 'Express gratitude professionally', category: 'professional' },
  { id: 'introduction', name: 'Introduction', icon: UserPlus, description: 'Introduce yourself effectively', category: 'professional' },
  
  { id: 'cover-letter', name: 'Cover Letter', icon: FileText, description: 'Job application letters', category: 'professional', attachmentConfig: { label: 'Resume/CV (Optional)', accept: '.pdf,.doc,.docx,.txt', placeholder: 'Upload your resume to tailor the cover letter...' } },
  { id: 'resignation', name: 'Resignation', icon: Send, description: 'Professional departure notice', category: 'professional' },
  { id: 'recommendation', name: 'Recommendation', icon: Award, description: 'Reference letters', category: 'professional' },
  { id: 'complaint', name: 'Complaint', icon: AlertCircle, description: 'Address issues diplomatically', category: 'professional' },
  { id: 'apology', name: 'Apology', icon: Heart, description: 'Express regret professionally', category: 'professional' },
  { id: 'proposal', name: 'Business Proposal', icon: Handshake, description: 'Pitch ideas and partnerships', category: 'professional', attachmentConfig: { label: 'Proposal/Presentation (Optional)', accept: '.pdf,.ppt,.pptx,.doc,.docx', placeholder: 'Upload supporting documents for your proposal...' } },
  
  { id: 'internal-announcement', name: 'Internal Announcement', icon: Megaphone, description: 'Company-wide updates and news', category: 'professional' },
  { id: 'promotion-announcement', name: 'Promotion Announcement', icon: Star, description: 'Announce employee promotions or new hires', category: 'professional' },
  { id: 'policy-update', name: 'Policy Update', icon: FileCheck, description: 'Communicate new or updated policies', category: 'professional', attachmentConfig: { label: 'Policy Documents (Optional)', accept: '.pdf,.doc,.docx,.txt', placeholder: 'Upload policy documents for reference...' } },
  { id: 'team-update', name: 'Team Update', icon: UsersRound, description: 'Department or team-specific communications', category: 'professional' },
  { id: 'internal-memo', name: 'Internal Memo', icon: Scroll, description: 'Official company memorandums', category: 'professional' },
  { id: 'employee-recognition', name: 'Employee Recognition', icon: Trophy, description: 'Celebrate achievements and milestones', category: 'professional' },
  { id: 'meeting-minutes', name: 'Meeting Minutes', icon: ClipboardList, description: 'Summarize meetings and action items', category: 'professional' },
  { id: 'project-update', name: 'Project Update', icon: BarChart, description: 'Progress updates on ongoing projects', category: 'professional' },
  { id: 'urgent-alert', name: 'Urgent Internal Alert', icon: AlertTriangle, description: 'Time-sensitive company communications', category: 'professional' },
  
  { id: 'academic-formal', name: 'Academic Formal', icon: GraduationCap, description: 'Scholarly communication', category: 'academic' },
  { id: 'research-inquiry', name: 'Research Inquiry', icon: Sparkles, description: 'Academic research requests', category: 'academic' },
  { id: 'conference', name: 'Conference', icon: Globe, description: 'Academic event correspondence', category: 'academic' },
  { id: 'supervisor', name: 'To Supervisor', icon: CheckCircle, description: 'Academic advisor emails', category: 'academic' },
  { id: 'peer-review', name: 'Peer Review', icon: ClipboardCheck, description: 'Academic feedback', category: 'academic' },
  
  { id: 'friendly', name: 'Friendly', icon: Smile, description: 'Warm and approachable', category: 'casual' },
  { id: 'informal', name: 'Informal', icon: MessageSquare, description: 'Relaxed communication', category: 'casual' },
  { id: 'enthusiastic', name: 'Enthusiastic', icon: Zap, description: 'Energetic and upbeat', category: 'casual' },
  
  { id: 'creative', name: 'Creative', icon: Sparkles, description: 'Unique and memorable', category: 'creative' },
  { id: 'storytelling', name: 'Storytelling', icon: Info, description: 'Narrative-driven emails', category: 'creative' },
  { id: 'marketing', name: 'Marketing', icon: Target, description: 'Engaging promotional content', category: 'creative' },
  { id: 'announcement', name: 'Announcement', icon: Bell, description: 'Important updates', category: 'creative' },
  { id: 'invitation', name: 'Invitation', icon: Calendar, description: 'Event invitations', category: 'creative' },
  { id: 'newsletter', name: 'Newsletter', icon: Mail, description: 'Regular updates', category: 'creative' },
  { id: 'customer-service', name: 'Customer Service', icon: Shield, description: 'Support and assistance', category: 'professional' },
  { id: 'invoice', name: 'Invoice Request', icon: DollarSign, description: 'Payment requests', category: 'professional', attachmentConfig: { label: 'Invoice/Supporting Documents (Optional)', accept: '.pdf,.doc,.docx,.xlsx,.xls,.txt', placeholder: 'Upload invoice or supporting documents...' } },
  { id: 'order-confirmation', name: 'Order Confirmation', icon: Package, description: 'Transaction confirmations', category: 'professional' },
];

export const emailCategories = [
  { id: 'all', name: 'All Styles', count: emailStyles.length },
  { id: 'professional', name: 'Professional', count: emailStyles.filter(s => s.category === 'professional').length },
  { id: 'academic', name: 'Academic', count: emailStyles.filter(s => s.category === 'academic').length },
  { id: 'casual', name: 'Casual', count: emailStyles.filter(s => s.category === 'casual').length },
  { id: 'creative', name: 'Creative', count: emailStyles.filter(s => s.category === 'creative').length },
];
