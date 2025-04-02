"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingFormSchema, type OnboardingFormValues } from "@/lib/schema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { allFields } from "@/static/onboarding-fields";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      dateOfBirth: "",
      gender: "",
      mobileNumber: "",
      address: "",
    },
  });

  const user = useUser();
  const router = useRouter();
  const supabase = createSupabaseClient();

  const onSubmit = async (data: OnboardingFormValues) => {
    if (currentStep === allFields.length - 1) {
      try {
        setIsSubmitting(true);

        if (!user) {
          throw new Error("No user found");
        }

        // update profile with name
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            full_name: `${data.firstName} ${data.lastName}`,
          })
          .eq("stack_id", user.id);

        if (profileError) {
          throw profileError;
        }

        // add data to supabase
        const { error: onboardingError } = await supabase
          .from("onboarding_data")
          .insert({
            user_id: user.id,
            education_level: data.course,
            field_of_study: data.course,
            phone_number: data.mobileNumber,
            address: data.address,
            caste: data.caste,
            religion: data.religion,
            annual_income: data.annualIncome,
            state: data.state,
            district: data.district,
            date_of_birth: data.dateOfBirth,
            gender: data.gender,
          });

        if (onboardingError) {
          throw onboardingError;
        }

        // update onboarding flag on stack
        await user.update({
          clientMetadata: {
            onboarded: true,
          },
        });

        toast.success("Profile completed successfully!");
        router.push("/");
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Failed to complete profile. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      await handleNext();
    }
  };

  const handleNext = async () => {
    const currentStepFields = allFields[currentStep].fields;
    const fieldNames = currentStepFields.map((field) => field.name);

    const isValid = await Promise.all(
      fieldNames.map((name) => form.trigger(name as keyof OnboardingFormValues))
    ).then((results) => results.every(Boolean));

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="text-center text-sm text-gray-500">
          Step {currentStep + 1} of {allFields.length}
        </div>
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute w-full"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {allFields[currentStep].stepLabel}
                </h2>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                {allFields[currentStep].fields.map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name as keyof OnboardingFormValues}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormControl>
                          {field.type === "select" ? (
                            <Select
                              onValueChange={formField.onChange}
                              defaultValue={formField.value}
                            >
                              <SelectTrigger className="w-full" size="default">
                                <SelectValue placeholder={field.placeholder} />
                              </SelectTrigger>
                              <SelectContent className="w-full">
                                {field.options?.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : field.type === "textarea" ? (
                            <Textarea
                              {...formField}
                              placeholder={field.placeholder}
                            />
                          ) : (
                            <Input
                              {...formField}
                              type={field.type}
                              placeholder={field.placeholder}
                            />
                          )}
                        </FormControl>
                        <FormMessage className="text-red-500 mt-2" />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0 || isSubmitting}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </Button>
          <Button
            type={currentStep === allFields.length - 1 ? "submit" : "button"}
            onClick={
              currentStep === allFields.length - 1 ? undefined : handleNext
            }
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : currentStep === allFields.length - 1 ? (
              <>Complete Profile</>
            ) : (
              <>
                Next
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
