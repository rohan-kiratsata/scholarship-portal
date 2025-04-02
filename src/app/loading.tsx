import Header from "@/components/global/header";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <>
      <Header />
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    </>
  );
}
