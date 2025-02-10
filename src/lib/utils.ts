import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Helper function to remove empty fields from an object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export  const removeEmptyFields = (obj: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: any = {};
        Object.entries(obj).forEach(([key, value]) => {
          // Keep _id, createdAt, updatedAt, and __v even if empty
          if (['_id', 'createdAt', 'updatedAt', '__v'].includes(key)) {
            result[key] = value;
            return;
          }

          // Handle nested objects (like document collections)
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            const nestedObj = removeEmptyFields(value);
            if (Object.keys(nestedObj).length > 0) {
              result[key] = nestedObj;
            }
            return;
          }

          // Handle arrays
          if (Array.isArray(value)) {
            const filteredArray = value.filter(item => {
              if (typeof item === 'object') {
                const cleanItem = removeEmptyFields(item);
                return Object.keys(cleanItem).length > 0;
              }
              return item !== null && item !== undefined && item !== '';
            });
            if (filteredArray.length > 0) {
              result[key] = filteredArray;
            }
            return;
          }

          // Include non-empty primitive values
          if (value !== null && value !== undefined && value !== '') {
            result[key] = value;
          }
        });
        return result;
      };
