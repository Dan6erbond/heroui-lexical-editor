'use client';

import { Button, Card, CardBody, Link, button as buttonStyles } from '@heroui/react';
import { MousePointer2Icon, PaletteIcon, ShieldCheckIcon, ZapIcon } from 'lucide-react';
import { subtitle, title } from '@/components/primitives';

import DefaultLayout from '@/layouts/default';
import { Editor } from '@/components/editor';
import { GithubIcon } from '@/components/icons';

export default function IndexPage() {
  return (
    <DefaultLayout>
      {/* Background Decor */}
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-[10%] left-[15%] w-[300px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-purple-500/10 blur-[150px] rounded-full" />
      </div>

      <section className="flex flex-col items-center justify-center gap-12 py-12 md:py-20">
        {/* Hero Header */}
        <div className="inline-block max-w-4xl text-center justify-center px-4">
          <h1 className={title({ size: 'lg' })}>
            Build&nbsp;
            <span className={title({ color: 'blue', size: 'lg' })}>powerful</span>
            <br />
            rich-text editors with ease.
          </h1>
          <p className={subtitle({ class: 'mt-6 max-w-2xl mx-auto text-default-600' })}>
            A premium integration between <b>Lexical</b> and <b>HeroUI</b>. Fully accessible, modular components that
            feel native to your design system.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Link
              className={buttonStyles({
                color: 'primary',
                radius: 'full',
                size: 'lg',
                variant: 'shadow',
                className: 'px-8',
              })}
              href="/docs"
            >
              Get Started
            </Link>
            <Button
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              variant="bordered"
              radius="full"
              size="lg"
              className="px-8"
              href="https://github.com/dan6erbond/heroui-lexical-editor"
            >
              <GithubIcon size={20} />
              GitHub
            </Button>
          </div>
        </div>

        {/* Live Demo */}
        <div className="w-full max-w-5xl px-2">
          <div className="relative group">
            {/* Glow effect behind the editor */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-background rounded-lg shadow-2xl overflow-hidden">
              <Editor />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mt-12">
          {[
            {
              title: 'HeroUI Themed',
              desc: "Native look and feel using HeroUI's design tokens and components.",
              icon: <PaletteIcon className="text-blue-500" />,
            },
            {
              title: 'Fully Modular',
              desc: 'Pick and choose the plugins you need. No bloated bundles.',
              icon: <ZapIcon className="text-yellow-500" />,
            },
            {
              title: 'Accessible',
              desc: 'WAI-ARIA compliant components for a truly inclusive experience.',
              icon: <ShieldCheckIcon className="text-green-500" />,
            },
            {
              title: 'Interactive UI',
              desc: 'Refined interactions for color picking, toolbars, and popovers.',
              icon: <MousePointer2Icon className="text-purple-500" />,
            },
          ].map((feature, i) => (
            <Card key={i} shadow="sm" className="bg-default-50/50 border-none">
              <CardBody className="gap-3 p-6">
                <div className="p-2 w-fit rounded-lg bg-background shadow-sm border border-default-100">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg">{feature.title}</h3>
                <p className="text-default-500 text-sm">{feature.desc}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </DefaultLayout>
  );
}
