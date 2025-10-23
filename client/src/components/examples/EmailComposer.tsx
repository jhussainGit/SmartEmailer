import EmailComposer from '../EmailComposer';

export default function EmailComposerExample() {
  return (
    <div className="p-4 max-w-2xl">
      <EmailComposer
        selectedStyle="professional-formal"
        onGenerate={(data) => console.log('Generate email:', data)}
        isGenerating={false}
      />
    </div>
  );
}
