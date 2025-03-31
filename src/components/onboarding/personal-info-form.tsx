import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type OnboardingFormValues } from "@/lib/schema";
import { motion } from "framer-motion";

interface PersonalInfoFormProps {
  control: Control<OnboardingFormValues>;
}

const fields = [
  {
    name: "firstName",
    label: "What's your first name?",
    type: "text",
    placeholder: "Enter your first name",
    component: Input,
  },
  {
    name: "lastName",
    label: "What's your last name?",
    type: "text",
    placeholder: "Enter your last name",
    component: Input,
  },
  {
    name: "dateOfBirth",
    label: "When were you born?",
    type: "date",
    placeholder: "Select your date of birth",
    component: Input,
  },
  {
    name: "gender",
    label: "What's your gender?",
    type: "select",
    placeholder: "Select your gender",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ],
    component: Select,
  },
  {
    name: "caste",
    label: "What's your caste?",
    type: "select",
    placeholder: "Select your caste",
    options: [
      { value: "general", label: "General" },
      { value: "obc", label: "OBC" },
      { value: "sc", label: "SC" },
      { value: "st", label: "ST" },
    ],
    component: Select,
  },
  {
    name: "religion",
    label: "What's your religion?",
    type: "select",
    placeholder: "Select your religion",
    options: [
      { value: "hindu", label: "Hindu" },
      { value: "muslim", label: "Muslim" },
      { value: "christian", label: "Christian" },
      { value: "sikh", label: "Sikh" },
      { value: "buddhist", label: "Buddhist" },
      { value: "jain", label: "Jain" },
      { value: "other", label: "Other" },
    ],
    component: Select,
  },
  {
    name: "annualIncome",
    label: "What's your annual family income?",
    type: "number",
    placeholder: "Enter annual income",
    component: Input,
  },
];

export function PersonalInfoForm({ control }: PersonalInfoFormProps) {
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
                  {field.type === "select" ? (
                    <Select
                      onValueChange={formField.onChange}
                      defaultValue={formField.value}
                    >
                      <SelectTrigger className="h-12 text-lg">
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
