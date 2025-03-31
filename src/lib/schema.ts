import * as z from "zod";

export const onboardingFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  caste: z.string().min(1, "Please select your caste"),
  religion: z.string().min(1, "Please select your religion"),
  annualIncome: z.string().min(1, "Please enter your annual income"),
  course: z.string().min(1, "Please select your course"),
  state: z.string().min(1, "Please select your state"),
  district: z.string().min(1, "Please select your district"),
  dateOfBirth: z.string().min(1, "Please enter your date of birth"),
  gender: z.string().min(1, "Please select your gender"),
  mobileNumber: z.string().min(10, "Please enter a valid mobile number"),
  address: z.string().min(10, "Please enter your complete address"),
});

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;
