import { z } from 'zod';
import { Data } from '../types';
import { editDataSchema } from '../validation';

type FormKey = keyof z.infer<typeof editDataSchema>;
export const getChangedValues = (initialValues: Data, formValues: z.infer<typeof editDataSchema>) => {
   const changedValues: Partial<Record<FormKey, unknown>> = {};

   (Object.keys(formValues) as FormKey[]).forEach(key => {
      const formValue = formValues[key];
      let initialValue: unknown;

      if (key === 'isOwnerHidden') {
         initialValue = initialValues.isOwnerHidden;
      } else if (key === 'password') {
         if (!initialValues.isPublic && formValue === '') {
            changedValues[key] = formValue;
            return;
         }
         initialValue = null;
      } else {
         initialValue = initialValues[key];
      }

      if (formValue !== initialValue) {
         changedValues[key] = formValue;
      }
   });

   return changedValues as Partial<z.infer<typeof editDataSchema>>;
};
