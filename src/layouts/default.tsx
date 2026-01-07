import { Divider, link, link as linkStyles } from '@heroui/react';

import { Navbar } from '@/components/navbar';

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow py-8">{children}</main>

      <footer className="w-full py-6 px-6">
        <Divider className="mb-6" />
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-sm text-default-500">
              © {currentYear} RaviAnand Mohabir (
              <a href="https://github.com/dan6erbond" className={link({})}>
                @dan6erbond
              </a>
              )
            </p>
            <p className="text-xs text-default-400">Released under the MIT License</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/dan6erbond/heroui-lexical-editor"
              target="_blank"
              rel="noopener noreferrer"
              className={linkStyles({
                className: 'text-default-600 text-sm',
              })}
            >
              GitHub
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://heroui.com"
              className={linkStyles({
                className: 'flex items-center gap-1 text-current text-sm no-underline',
              })}
            >
              <span className="text-default-600">Built with</span>
              <p className="text-primary font-semibold">HeroUI</p>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
