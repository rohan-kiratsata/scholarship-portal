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
import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { allFields } from "@/static/onboarding-fields";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { saveUserProfile } from "@/services/user-service";
import { City } from "country-state-city";

export function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(false);
  const [splashTextIndex, setSplashTextIndex] = useState(0);
  const [cityOptions, setCityOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const { user } = useAuthStore();
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
      city: "",
      dateOfBirth: "",
      gender: "",
      mobileNumber: "",
      address: "",
    },
  });

  const router = useRouter();
  const selectedState = form.watch("state");

  const splashScreenTexts = [
    "Finding the best scholarships for you...",
    "Setting up your profile...",
    "Analyzing your eligibility...",
    "Preparing your dashboard...",
  ];

  useEffect(() => {
    if (selectedState) {
      const cities = City.getCitiesOfState("IN", selectedState).map((city) => ({
        value: city.name,
        label: city.name,
      }));
      setCityOptions(cities);

      form.setValue("city", "");
    }
  }, [selectedState, form]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (showSplashScreen) {
      timer = setInterval(() => {
        setSplashTextIndex((prev) => {
          const nextIndex = prev + 1;
          if (nextIndex >= splashScreenTexts.length) {
            clearInterval(timer);

            // Redirect after showing all messages
            setTimeout(() => {
              localStorage.setItem("onboardingCompleted", "true");
              router.push("/dashboard");
            }, 1000);

            return prev;
          }
          return nextIndex;
        });
      }, 1500);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showSplashScreen, splashScreenTexts.length, router]);

  const onSubmit = async (data: OnboardingFormValues) => {
    if (currentStep === allFields.length) {
      setIsSubmitting(true);

      // Save user profile data to Firebase
      if (user) {
        try {
          await saveUserProfile(user.uid, data);
          // Show splash screen after successfully saving data
          setIsSubmitting(false);
          setShowSplashScreen(true);
        } catch (error) {
          console.error("Error saving profile:", error);
          toast.error("Failed to save profile. Please try again.");
          setIsSubmitting(false);
        }
      } else {
        toast.error("User not authenticated. Please sign in again.");
        setIsSubmitting(false);
        router.push("/sign-in");
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleNext = async () => {
    // Skip validation for welcome screen
    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }

    const currentStepFields = allFields[currentStep - 1].fields;
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

  // Render splash screen
  if (showSplashScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center  z-50">
        <div className="max-w-md w-full mx-auto text-center space-y-10 p-8 rounded-xl bg-primary/5 backdrop-blur-sm">
          <div className="relative h-24 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.h2
                key={splashTextIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold text-primary absolute"
              >
                {splashScreenTexts[splashTextIndex]}
              </motion.h2>
            </AnimatePresence>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              >
                <div className="w-2 h-2 bg-white rounded-full m-1"></div>
              </motion.div>
            </div>
          </div>

          <div className="flex justify-center space-x-2">
            {splashScreenTexts.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === splashTextIndex ? "bg-primary" : "bg-primary/20"
                }`}
                animate={{ scale: index === splashTextIndex ? [1, 1.3, 1] : 1 }}
                transition={{
                  repeat: index === splashTextIndex ? Infinity : 0,
                  duration: 1,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render welcome screen for step 0
  if (currentStep === 0) {
    return (
      <div className="max-w-md mx-auto text-center space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome!
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          To start using the app, please complete the onboarding process.
        </p>
        <Button onClick={() => setCurrentStep(1)} className="w-full">
          Get Started
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="text-center text-sm text-gray-500">
          Step {currentStep} of {allFields.length}
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
                  {allFields[currentStep - 1].stepLabel}
                </h2>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                {allFields[currentStep - 1].fields.map((field) => (
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
                              value={formField.value}
                            >
                              <SelectTrigger className="w-full" size="default">
                                <SelectValue placeholder={field.placeholder} />
                              </SelectTrigger>
                              <SelectContent className="w-full">
                                {field.name === "city"
                                  ? cityOptions.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))
                                  : field.options?.map((option) => (
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
            disabled={currentStep === 1 || isSubmitting}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </Button>
          <Button
            type={currentStep === allFields.length ? "submit" : "button"}
            onClick={currentStep === allFields.length ? undefined : handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : currentStep === allFields.length ? (
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
