import EmailPreview from '../EmailPreview';

export default function EmailPreviewExample() {
  const sampleEmail = `Dear Dr. Smith,

I hope this email finds you well. I am writing to express my strong interest in the Senior Research Position at your laboratory.

With my extensive background in molecular biology and five years of experience in cancer research, I believe I would be a valuable addition to your team. My recent publication in Nature Medicine demonstrates my commitment to advancing scientific knowledge in this field.

I would welcome the opportunity to discuss how my skills and experience align with your research goals.

Thank you for your consideration.

Best regards,
John Doe`;

  return (
    <div className="p-4">
      <EmailPreview
        content={sampleEmail}
        onRefine={() => console.log('Refine email')}
      />
    </div>
  );
}
