import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <>
      <header className="max-w-7xl mx-auto py-5">
        <div className="flex items-center justify-between">
          <Link href="/">
            {/* <Image src="/logo.svg" alt="logo" width={100} height={100} /> */}
            <p className="font-bricolage text-xl">Logo</p>
          </Link>
          <nav>
            <ul className="flex items-center gap-4">
              <li>
                <Link href="/features">Features</Link>
              </li>
              <li>
                <Button>Get started</Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
