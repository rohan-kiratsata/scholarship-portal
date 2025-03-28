"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingFormSchema, type OnboardingFormValues } from "@/lib/schema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PersonalInfoForm } from "./personal-info-form";
import { EducationForm } from "./education-info-form";
import { ContactForm } from "./contact-form";
import { motion } from "framer-motion";

export function OnboardingForm() {
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      caste: "",
      religion: "",
      annualIncome: "",
      course: "",
      state: "",
      district: "",
      gender: "",
      mobileNumber: "",
      address: "",
    },
  });

  function onSubmit(data: OnboardingFormValues) {
    console.log(data);
  }

  const formSections = [
    { id: "personal", component: <PersonalInfoForm control={form.control} /> },
    { id: "education", component: <EducationForm control={form.control} /> },
    { id: "contact", component: <ContactForm control={form.control} /> },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-10">
          {formSections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 h-full w-0.5 bg-gradient-to-b from-blue-500/20 to-transparent" />
              {section.component}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="pt-4"
        >
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 rounded-lg text-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Complete Profile
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}
