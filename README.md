# HeroUI Lexical Editor

A premium, modular rich-text editor integration built with [Lexical](https://lexical.dev/) and [HeroUI](https://heroui.com/).

Originally built to bridge the gap between **PayloadCMS** (which uses Lexical) and frontend applications requiring a consistent, beautiful UI. This is not a restrictive library, but a collection of modular components you can copy, paste, and customize.

## ✨ Features

- **PayloadCMS Ready**: Fully compatible with Lexical's state and JSON format.
- **HeroUI Native**: All UI elements (Toolbars, Sliders, Color Pickers, Dropdowns) are built using HeroUI primitives.
- **Highly Modular**: Pick and choose the plugins you need (Code, Links, Lists, Tables, etc.).
- **Accessible**: Leverages HeroUI and React Aria for a fully accessible editing experience.
- **Customizable**: Simple component-driven architecture—easily add your own custom nodes or toolbar actions.

## 🚀 Live Demo

Check out the interactive demo and documentation:
**[https://dan6erbond.github.io/heroui-lexical-editor/](https://dan6erbond.github.io/heroui-lexical-editor/)**

## 📦 Installation

This project is designed to be integrated into your own HeroUI/Tailwind project.

1. **Install Dependencies**:
```bash
pnpm add lexical @lexical/react @lexical/selection @lexical/utils @lexical/rich-text @lexical/list @lexical/link @lexical/table @lexical/code @lexical/markdown @lexical/text @lexical/file @lexical/hashtag @lexical/overflow lodash lucide-react
```

2. **Copy Components**:
Grab the `src/components/editor` and `src/components/ui` folders and move them into your project.
3. **Usage**:
```tsx
import { Editor } from '@/components/editor';

export default function App() {
  return (
    <Editor
      onSerializedChange={(json) => console.log("Lexical JSON:", json)}
    />
  );
}
```

## 🛠️ Configuration

### Frameworks (Next.js / SSR)

If you are using an SSR framework, remember to disable SSR for the typeahead/menu plugins within the `editor/plugins/` directory:

```tsx
const LexicalTypeaheadMenuPlugin = dynamic(
  () => import("@lexical/react/LexicalTypeaheadMenuPlugin"),
  { ssr: false }
);

```

### Tailwind CSS

Ensure your `tailwind.config.js` is watching the editor components:

```js
content: [
  // ...
  "./src/components/**/*.{js,ts,jsx,tsx}",
],

```

## 🤝 Contributing

Contributions are welcome! Whether it's a bug fix, a new plugin integration, or a styling improvement, feel free to open a PR.

## 📄 License

This project is licensed under the [MIT License](https://www.google.com/search?q=LICENSE).

---

Created with ❤️ by [dan6erbond](https://github.com/dan6erbond)
