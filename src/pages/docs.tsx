'use client';

import { AlertTriangleIcon, FileCode2Icon, FolderTreeIcon, Settings2Icon } from 'lucide-react';
import { Card, CardBody, Code, Divider, Link, Snippet, Tab, Tabs, link } from '@heroui/react';
import { subtitle, title } from '@/components/primitives';

import DefaultLayout from '@/layouts/default';

export default function DocsPage() {
  const LEXICAL_DEPS = [
    'lexical',
    '@lexical/react',
    '@lexical/selection',
    '@lexical/utils',
    '@lexical/rich-text',
    '@lexical/list',
    '@lexical/link',
    '@lexical/table',
    '@lexical/code',
    '@lexical/markdown',
    '@lexical/text',
    '@lexical/file',
    '@lexical/hashtag',
    '@lexical/overflow',
    'lodash',
    'lucide-react',
  ].join(' ');

  const managers = {
    npm: `npm install ${LEXICAL_DEPS}`,
    pnpm: `pnpm add ${LEXICAL_DEPS}`,
    yarn: `yarn add ${LEXICAL_DEPS}`,
    bun: `bun add ${LEXICAL_DEPS}`,
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col gap-8 py-8 md:py-10 max-w-4xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className={title()}>Documentation</h1>
          <p className={subtitle({ class: 'text-default-500' })}>
            Follow these steps to integrate the HeroUI-styled Lexical editor into your project.
          </p>
        </div>

        <Divider />

        {/* Step 1: Dependencies */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Settings2Icon className="text-primary" />
            <h2 className="text-2xl font-bold">1. Install Dependencies</h2>
          </div>

          <p className="text-default-600">
            Before adding the editor, ensure you have a working <b>HeroUI</b> and <b>Tailwind CSS</b> setup. Follow the
            <a
              href="https://heroui.com/docs/guide/introduction"
              target="_blank"
              rel="noopener noreferrer"
              className={link({ color: 'primary', className: 'mx-1 font-medium' })}
            >
              HeroUI Guide
            </a>
            specifically for your framework.
          </p>

          <p className="text-default-600">Once your framework is ready, install the Lexical ecosystem and Lodash:</p>

          <Tabs aria-label="Package Managers" variant="underlined" color="primary">
            {Object.entries(managers).map(([id, command]) => (
              <Tab key={id} title={id.toUpperCase()}>
                <Snippet
                  symbol=""
                  variant="flat"
                  classNames={{
                    base: 'w-full items-start',
                    pre: 'whitespace-pre-wrap overflow-auto',
                  }}
                >
                  <span>{command}</span>
                </Snippet>
              </Tab>
            ))}
          </Tabs>
        </div>

        {/* Step 2: File Structure */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <FolderTreeIcon className="text-primary" />
            <h2 className="text-2xl font-bold">2. Copy Components</h2>
          </div>
          <p className="text-default-600">
            Copy the following directories and files from the
            <Link isExternal href="https://github.com/dan6erbond/heroui-lexical-editor" className="mx-1 font-mono">
              src
            </Link>
            folder into your project:
          </p>
          <Card className="bg-default-50">
            <CardBody className="font-mono text-sm gap-1">
              <div className="text-primary">src/components/</div>
              <div className="pl-4 text-default-600">├── ui/</div>
              <div className="pl-8 text-default-400">
                ├── color-picker/ <span className="text-default-300 italic"># Essential for toolbar</span>
              </div>
              <div className="pl-8 text-default-400">├── command.tsx</div>
              <div className="pl-8 text-default-400">└── toggle.tsx</div>
              <div className="pl-4 text-default-600">└── editor/</div>
              <div className="pl-8 text-default-400">
                ├── index.tsx <span className="text-default-300 italic"># Main entry point</span>
              </div>
              <div className="pl-8 text-default-400">├── context/</div>
              <div className="pl-8 text-default-400">├── hooks/</div>
              <div className="pl-8 text-default-400">├── nodes/</div>
              <div className="pl-8 text-default-400">├── plugins/</div>
              <div className="pl-8 text-default-400">├── shared/</div>
              <div className="pl-8 text-default-400">├── transformers/</div>
              <div className="pl-8 text-default-400">├── ui/</div>
              <div className="pl-8 text-default-400">├── utils/</div>
              <div className="pl-8 text-default-400">└── theme.ts</div>
            </CardBody>
          </Card>
        </div>

        {/* Step 3: Implementation */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <FileCode2Icon className="text-primary" />
            <h2 className="text-2xl font-bold">3. Usage</h2>
          </div>
          <p className="text-default-600">
            Import the <Code>Editor</Code> component. You can pass <Code>onChange</Code> or
            <Code>onSerializedChange</Code> to handle data persistence.
          </p>
          <Snippet
            symbol=""
            variant="bordered"
            classNames={{
              base: 'bg-background items-start p-4',
              pre: 'flex flex-col gap-0 whitespace-pre', // 'whitespace-pre' preserves your spaces
            }}
          >
            <span>{`import { Editor } from '@/components/editor';`}</span>
            <span className="h-4" />
            <span>{`export default function MyPage() {`}</span>
            <span>{`  return (`}</span>
            <span>{`    <Editor `}</span>
            <span>{`      onSerializedChange={(json) => console.log(json)} `}</span>
            <span>{`    />`}</span>
            <span>{`  );`}</span>
            <span>{`}`}</span>
          </Snippet>
        </div>

        {/* Step 4: SSR Notice */}
        <Card className="border-none bg-warning-50/50">
          <CardBody className="flex-row gap-4 items-start p-6">
            <AlertTriangleIcon className="text-warning mt-1" />
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-warning-700">SSR Frameworks (Next.js/Nuxt)</h3>
              <p className="text-sm text-warning-800 leading-relaxed">
                Lexical&apos;s typeahead and menu plugins rely on browser APIs. If you are using an SSR framework, you
                must disable SSR for specific plugins in <Code>editor/plugins/</Code> using dynamic imports:
              </p>
              <Code className="bg-warning-100 text-warning-900 p-2 rounded">
                {`const LexicalTypeaheadMenuPlugin = dynamic(() => import(...), { ssr: false });`}
              </Code>
              <p className="text-xs text-warning-600 mt-2">
                Check <Code size="sm">component-picker-menu.tsx</Code>, <Code size="sm">mentions.tsx</Code> and{' '}
                <Code size="sm">emojis.tsx</Code> for implementation examples.
              </p>
            </div>
          </CardBody>
        </Card>
      </section>
    </DefaultLayout>
  );
}
