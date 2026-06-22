import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/app/providers";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex min-h-screen">
        <Navbar />
        <main className="flex-1 md:ml-64 pb-20 md:pb-0">
          {children}
        </main>
      </div>
    </Providers>
  );
}
