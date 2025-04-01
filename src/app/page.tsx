import Header from "@/components/global/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <section className="h-[80vh]">
        <div className="flex flex-col gap-5 items-center justify-center h-full">
          <h1 className="font-bricolage text-7xl font-semibold text-center">
            Find{" "}
            <span className="text-primary font-bricolage font-black">
              Scholarships
            </span>{" "}
            that <br />
            truly belong to you
          </h1>
          <p className="text-center text-xl">
            Let AI help you find best scholarships within seconds.
          </p>
          <Button asChild size="lg" className="text-xl font-semibold">
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
