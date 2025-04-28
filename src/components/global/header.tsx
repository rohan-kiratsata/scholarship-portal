import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <>
      <header className="fixed top-5 backdrop-blur-lg rounded-full border border-neutral-50/20 bg-neutral-50/5 py-2 px-2 left-1/2 -translate-x-1/2">
        <div className="flex items-center justify-between gap-32">
          <Link href="/">
            <p className="font-bricolage text-xl">Logo</p>
          </Link>
          <nav>
            <ul className="flex items-center gap-4">
              <li>
                <Button className="rounded-full">Get started</Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
