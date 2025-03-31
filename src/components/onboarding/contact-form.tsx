import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type OnboardingFormValues } from "@/lib/schema";
import { motion } from "framer-motion";

interface ContactFormProps {
  control: Control<OnboardingFormValues>;
}

const fields = [
  {
    name: "mobileNumber",
    label: "What's your mobile number?",
    type: "tel",
    placeholder: "Enter your mobile number",
    component: Input,
  },
  {
    name: "address",
    label: "What's your complete address?",
    type: "textarea",
    placeholder: "Enter your complete address",
    component: Textarea,
  },
];

export function ContactForm({ control }: ContactFormProps) {
  return (
    <div className="space-y-8">
      {fields.map((field, index) => (
        <motion.div
          key={field.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <FormField
            control={control}
            name={field.name as keyof OnboardingFormValues}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-gray-900 dark:text-white">
                  {field.label}
                </FormLabel>
                <FormControl>
                  {field.type === "textarea" ? (
                    <Textarea
                      {...formField}
                      placeholder={field.placeholder}
                      className="h-32 text-lg"
                    />
                  ) : (
                    <Input
                      {...formField}
                      type={field.type}
                      placeholder={field.placeholder}
                      className="h-12 text-lg"
                    />
                  )}
                </FormControl>
                <FormMessage className="text-red-500 mt-2" />
              </FormItem>
            )}
          />
        </motion.div>
      ))}
    </div>
  );
}
