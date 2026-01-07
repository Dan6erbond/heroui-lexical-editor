import {
  Button,
  Navbar as HeroUINavbar,
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  link as linkStyles,
} from '@heroui/react';
import { GithubIcon, Logo } from '@/components/icons';

import { ThemeSwitch } from '@/components/theme-switch';

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky" className="border-b border-default-100">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link className="flex justify-start items-center gap-1" color="foreground" href="/">
            <Logo />
            <p className="font-bold text-inherit">Lexical HeroUI</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="flex gap-4 items-center">
          <a
            href="https://github.com/dan6erbond/heroui-lexical-editor"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className={linkStyles({
              className: 'text-default-500 hover:opacity-80 transition-opacity',
            })}
          >
            <GithubIcon />
          </a>
          <ThemeSwitch />
          <Button
            as="a"
            className="text-sm font-normal text-default-600 bg-default-100 hidden md:flex"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/dan6erbond/heroui-lexical-editor"
            variant="flat"
          >
            Use Template
          </Button>
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
