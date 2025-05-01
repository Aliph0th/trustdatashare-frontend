import { Check, ClipboardCopy } from 'lucide-react';
import { Button } from './ui/button';
import { FC, useEffect, useState } from 'react';

interface CopyToClipboardProps {
   text: string;
}

const CopyToClipboard: FC<CopyToClipboardProps> = ({ text }) => {
   const [isCopied, setIsCopied] = useState(false);
   const clickHandle = () => {
      setIsCopied(true);
      navigator.clipboard.writeText(text);
   };

   useEffect(() => {
      if (isCopied) {
         const timeout = setTimeout(() => {
            setIsCopied(false);
         }, 3000);

         return () => {
            clearTimeout(timeout);
         };
      }
   }, [isCopied]);

   return (
      <Button variant="outline" size="sm" className="text-black" onClick={clickHandle}>
         {isCopied ? <Check /> : <ClipboardCopy />}
      </Button>
   );
};

export default CopyToClipboard;
