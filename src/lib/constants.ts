export type CasteOption = {
  value: string;
  label: string;
};

export type ReligionOption = {
  value: string;
  label: string;
};

export const CASTE_OPTIONS: CasteOption[] = [
  { value: "general", label: "General (GEN)" },
  { value: "sc", label: "Scheduled Caste (SC)" },
  { value: "st", label: "Scheduled Tribe (ST)" },
  { value: "obc", label: "Other Backward Classes (OBC)" },
  { value: "ews", label: "Economically Weaker Section (EWS)" },
  { value: "nt", label: "Nomadic Tribes (NT)" },
  { value: "dnt", label: "Denotified Tribes (DNT)" },
  { value: "sbc", label: "Special Backward Classes (SBC)" },
  { value: "vj", label: "Vimukta Jati (VJ)" },
  {
    value: "minority",
    label: "Minority Community (Muslim, Christian, Sikh, etc.)",
  },
];

export const RELIGION_OPTIONS: ReligionOption[] = [
  { value: "hindu", label: "Hindu" },
  { value: "muslim", label: "Muslim" },
  { value: "christian", label: "Christian" },
  { value: "sikh", label: "Sikh" },
  { value: "buddhist", label: "Buddhist" },
  { value: "jain", label: "Jain" },
  { value: "other", label: "Other" },
];

export type Gender = "male" | "female" | "other";

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];
