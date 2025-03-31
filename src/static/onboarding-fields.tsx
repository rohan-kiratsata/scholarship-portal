import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type FieldOption = {
  value: string;
  label: string;
};

type Field = {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  component: any;
  options?: FieldOption[];
};

type Step = {
  step: number;
  fields: Field[];
  stepLabel: string;
};

export const allFields: Step[] = [
  // Personal Information
  {
    step: 1,
    fields: [
      {
        name: "firstName",
        label: "First name",
        type: "text",
        placeholder: "Enter your first name",
        component: Input,
      },
      {
        name: "lastName",
        label: "Last name",
        type: "text",
        placeholder: "Enter your last name",
        component: Input,
      },
    ],
    stepLabel: "What's your name?",
  },
  {
    step: 2,
    fields: [
      {
        name: "dateOfBirth",
        label: "When were you born?",
        type: "date",
        placeholder: "Select your date of birth",
        component: Input,
      },
    ],
    stepLabel: "When were you born?",
  },
  {
    step: 3,
    fields: [
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
    ],
    stepLabel: "What's your gender?",
  },
  {
    step: 4,
    fields: [
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
    ],
    stepLabel: "What's your caste?",
  },
  {
    step: 5,
    fields: [
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
    ],
    stepLabel: "What's your religion?",
  },
  {
    step: 6,
    fields: [
      {
        name: "annualIncome",
        label: "What's your annual family income?",
        type: "number",
        placeholder: "Enter annual income",
        component: Input,
      },
    ],
    stepLabel: "What's your annual family income?",
  },
  // Education Information
  {
    step: 7,
    fields: [
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
    ],
    stepLabel: "What course are you pursuing?",
  },
  {
    step: 8,
    fields: [
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
    ],
    stepLabel: "Where are you from?",
  },

  // Contact Information
  {
    step: 10,
    fields: [
      {
        name: "mobileNumber",
        label: "What's your mobile number?",
        type: "tel",
        placeholder: "Enter your mobile number",
        component: Input,
      },
    ],
    stepLabel: "What's your mobile number?",
  },
  {
    step: 11,
    fields: [
      {
        name: "address",
        label: "What's your complete address?",
        type: "textarea",
        placeholder: "Enter your complete address",
        component: Textarea,
      },
    ],
    stepLabel: "What's your complete address?",
  },
];
