import EmailStyleCard from '../EmailStyleCard';
import { emailStyles } from '@/lib/emailStyles';
import { useState } from 'react';

export default function EmailStyleCardExample() {
  const [selected, setSelected] = useState(false);
  
  return (
    <div className="p-4">
      <EmailStyleCard
        style={emailStyles[0]}
        isSelected={selected}
        onClick={() => setSelected(!selected)}
      />
    </div>
  );
}
