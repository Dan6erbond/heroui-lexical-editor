## 🏗️ Project Goal

Port the Lexical editor's UI layer from ShadCN-like components to **HeroUI**. The focus is on maintaining Lexical’s node-editing logic while modernizing the interface using HeroUI’s accessible, themeable components.

### 🎨 Theming & Visual Language

- **Colors**: Use the default semantic scale (e.g., `text-default-500` for icons, `text-default-700` for labels).
- **Sizing**: Toolbar elements should generally be `h-8` (`size="sm"`).
- **Variants**: Use `variant="bordered"` for inputs and triggers to maintain a clean, professional editor look.

---

## 📖 Component Migration Patterns

### 1. Toolbar Selects vs. Dropdowns

- **Dropdown (Preferred)**: Use `Dropdown` for "Action" menus (like **Insert Block**, **Code Language**, or **Block Format**). These menus perform a command but don't necessarily need to "be" a form field.
- _Trigger_: Usually a HeroUI `Button`.
- _Event_: Use `onAction={(key) => ...}` on the `DropdownMenu`.

- **Select (Specific)**: Use `Select` only when a formal selection state is required (e.g., **Font Family**).
- _State_: Must use `selectedKeys={new Set([value])}` and `onSelectionChange`.

### 2. Dialogs & Modals

- **Structure**: Lexical plugins often use a `showModal` helper. The body should use:
- `ModalBody` for content.
- `ModalFooter` for actions (buttons inside should often be `fullWidth` and `color="primary"`).

- **Inputs**: Use HeroUI's `Input`.
- _Simplification_: Remove separate `Label` components. Use the `label` prop and `labelPlacement="outside"`.

- **Tabs**: Use `Tabs` and `Tab`. Use the `title` prop on `Tab` instead of separate `TabsTrigger` and `TabsContent`.

### 3. Event Handlers

- **Interaction**: Replace `onClick` or `onPointerDown` with `onPress` where possible (HeroUI/React Aria standard).

---

## 🛠️ Implementation Guidelines

### Lexical Selection Logic

Always ensure selection checks are robust. When using `$findMatchingParent`, explicitly type the argument to avoid "Implicit Any" errors:

```tsx
// Correct
const container = $findMatchingParent(anchorNode, (e: any) => $isLayoutContainerNode(e));
```

### Import Strategy

- **Clean Suffixes**: Remove `-plugin`, `-node`, etc., from internal imports if the directory structure already clarifies the type.
- _Example_: `import { InsertImageDialog } from "../../images";` (instead of `../../images-plugin`).

- **Relative Paths**:
- Context: `../../../context/toolbar`
- Hooks: `../../hooks/use-update-toolbar`

---

## 📝 Example Comparison

| Feature          | ShadCN/Radix Pattern                         | HeroUI Pattern                                   |
| ---------------- | -------------------------------------------- | ------------------------------------------------ |
| **Input**        | `<Label/><Input/>`                           | `<Input label="..." labelPlacement="outside" />` |
| **Menu Item**    | `<SelectItem value="x">`                     | `<DropdownItem key="x">`                         |
| **Tab Trigger**  | `<TabsTrigger value="x">Label</TabsTrigger>` | `<Tab key="x" title="Label">`                    |
| **Button Event** | `onClick={...}`                              | `onPress={...}`                                  |

---

**Next Step**: Should we begin porting the **Floating Link Editor** or do you have another plugin in mind?
