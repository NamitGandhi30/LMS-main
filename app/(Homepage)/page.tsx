// pages/index.tsx
import { Navbar } from './_components/Navbar';
import { Footer } from './_components/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function Homepage({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to EduPlatform
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Start your learning journey today with our cutting-edge online courses.
                </p>
                <Link href="/courses">
                  <Button>
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}