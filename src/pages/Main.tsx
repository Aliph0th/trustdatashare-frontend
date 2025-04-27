import { FloatingLabelInput } from '@/components/ui/FloatingInput';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const main = () => {
   return (
      <form className="grid grid-cols-[3fr_1fr] grid-rows-[auto_1fr] gap-5 h-full">
         <FloatingLabelInput label="Title" />
         <Button type="submit">Submit</Button>
         <Textarea placeholder="Content" className="row-start-2 h-full resize-none" />
         <Textarea placeholder="Description" className="row-start-2 h-fit" />
      </form>
   );
};

export default main;
