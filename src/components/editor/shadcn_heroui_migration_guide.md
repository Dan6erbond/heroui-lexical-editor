## 🛠️ ShadCN to HeroUI Migration Guide

### 1. Button Variant Mapping

ShadCN buttons use `variant`, and while HeroUI uses the same prop name, the values differ slightly to match the React Aria design system.

| ShadCN Variant | HeroUI Variant              | Notes                                       |
| -------------- | --------------------------- | ------------------------------------------- |
| `default`      | `solid`                     | HeroUI's default is `solid`.                |
| `outline`      | `bordered`                  | HeroUI uses `bordered`.                     |
| `ghost`        | `light`                     | Both remove background/border until hover.  |
| `secondary`    | `flat`                      | HeroUI's `flat` uses a subtle background.   |
| `destructive`  | `solid` + `color="danger"`  | HeroUI handles intent via the `color` prop. |
| `link`         | `light` + `color="primary"` | Or use the HeroUI `Link` component.         |

### 2. Interaction & Sizing

HeroUI simplifies the common "Icon Button" pattern and uses a more robust event system.

- **Events**: Replace `onClick` with **`onPress`**. `onPress` is part of React Aria; it handles touch, mouse, and keyboard interactions more consistently and prevents ghost clicks.
- **Icon Buttons**: Instead of manually setting `size="icon"` or specific `p-2` classes, use the **`isIconOnly`** prop. This ensures the button remains perfectly square regardless of the size (`sm`, `md`, `lg`).
- **State**: Use the **`isDisabled`** prop instead of the native `disabled` attribute to ensure proper ARIA state management.

### 3. Structural Patterns (The "Flattening")

ShadCN often uses "Compound Components" (Trigger, Content, Item). HeroUI often provides "Simplified Slots" or "Collection APIs."

#### **Tooltips**

- **ShadCN**: Requires `Tooltip`, `TooltipTrigger`, and `TooltipContent`.
- **HeroUI**: Wrap the element directly in `<Tooltip content="...">`. It handles the trigger logic internally.

#### **Dropdowns & Selects**

- **Selection Mode**: In HeroUI, use `selectionMode="single"` on the `DropdownMenu` to get the visual "check" mark UI for free.
- **Action Handling**: Use the **`onAction`** prop on the `DropdownMenu` or `onSelectionChange` on `Select` to centralize logic. This is more performant than attaching `onPress` to every single `DropdownItem`.
- **Inlining**: For complex plugins (like our Lexical formats), avoid passing sub-components as `children` if they need Context. Inline the `DropdownItem` logic directly into the parent to ensure they share the same React lifecycle and Context access.

### 4. Key Property Differences

| Feature             | ShadCN / Radix               | HeroUI / React Aria                  |
| ------------------- | ---------------------------- | ------------------------------------ |
| **Selection State** | `active`, `checked`          | `selectedKeys` (usually a `Set`)     |
| **Icons**           | Manual placement in children | `startContent` or `endContent` props |
| **Grouping**        | `div` with classes           | `ButtonGroup` or `DropdownSection`   |
| **Open State**      | `open`, `onOpenChange`       | `isOpen`, `onOpenChange`             |

---

### 5. Best Practices Learned

- **Trust the Props**: Avoid manual `h-8`, `w-8`, or `border-default-200` classes. If you set `size="sm"` and `variant="bordered"`, HeroUI handles the dimensions and borders correctly.
- **Centralized Commands**: In complex editors, using `onAction={(key) => handle(key)}` in a Dropdown is cleaner than individual components. It prevents "Context Gap" issues where children might render before the Context Provider is ready.
- **Sectioning**: Use `DropdownSection` with a `title` to group related actions (e.g., "Standard Formats" vs "Insertables"). It provides a much better UX than a long, unorganized list.

---

**Would you like me to add a specific section on handling Modals and Dialogs, since we touched on the `showModal` logic for the Insert plugin?**
