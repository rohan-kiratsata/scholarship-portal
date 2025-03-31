import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type OnboardingFormValues } from "@/lib/schema";
import { motion } from "framer-motion";

interface EducationFormProps {
  control: Control<OnboardingFormValues>;
}

const fields = [
  {
    name: "course",
    label: "What course are you pursuing?",
    type: "select",
    placeholder: "Select your course",
    options: [
      { value: "btech", label: "B.Tech" },
      { value: "be", label: "B.E" },
      { value: "bsc", label: "B.Sc" },
      { value: "bca", label: "BCA" },
      { value: "mtech", label: "M.Tech" },
      { value: "mca", label: "MCA" },
      { value: "msc", label: "M.Sc" },
      { value: "other", label: "Other" },
    ],
    component: Select,
  },
  {
    name: "state",
    label: "Which state are you from?",
    type: "select",
    placeholder: "Select your state",
    options: [
      { value: "delhi", label: "Delhi" },
      { value: "maharashtra", label: "Maharashtra" },
      { value: "karnataka", label: "Karnataka" },
      { value: "tamil-nadu", label: "Tamil Nadu" },
      { value: "uttar-pradesh", label: "Uttar Pradesh" },
      { value: "gujarat", label: "Gujarat" },
    ],
    component: Select,
  },
  {
    name: "district",
    label: "Which district are you from?",
    type: "select",
    placeholder: "Select your district",
    options: [
      { value: "district1", label: "District 1" },
      { value: "district2", label: "District 2" },
      { value: "district3", label: "District 3" },
    ],
    component: Select,
  },
];

export function EducationForm({ control }: EducationFormProps) {
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
