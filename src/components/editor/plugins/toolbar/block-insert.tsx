'use client';

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/react';
import { Columns3Icon, ImageIcon, PlusIcon, ScissorsIcon, TableIcon } from 'lucide-react';

import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { InsertImageDialog } from '../images';
import { InsertLayoutDialog } from '../layout';
import { InsertTableDialog } from '../table';
import React from 'react';
import { useEditorModal } from '../../hooks/use-modal';
import { useToolbarContext } from '../../context/toolbar';

export function BlockInsertPlugin() {
  const { activeEditor, showModal } = useToolbarContext();
  const [modal] = useEditorModal();

  const handleAction = (key: React.Key) => {
    switch (key) {
      case 'horizontal-rule':
        activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
        break;
      case 'image':
        showModal('Insert Image', (onClose) => <InsertImageDialog activeEditor={activeEditor} onClose={onClose} />);
        break;
      case 'table':
        showModal('Insert Table', (onClose) => <InsertTableDialog activeEditor={activeEditor} onClose={onClose} />);
        break;
      case 'columns':
        showModal('Insert Columns Layout', (onClose) => (
          <InsertLayoutDialog activeEditor={activeEditor} onClose={onClose} />
        ));
        break;
      /* default:
        // Check if the key belongs to an EmbedConfig
        const embedConfig = EmbedConfigs.find((c) => c.type === key);
        if (embedConfig) {
          activeEditor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type);
        } */
    }
  };

  return (
    <>
      {modal}
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered" size="sm" className="h-8 w-min gap-1 border-default-200">
            <PlusIcon className="size-4 text-default-500" />
            <span className="text-default-700 font-medium">Insert</span>
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Insert block elements" className="min-w-64" onAction={handleAction}>
          <DropdownSection title="Standard">
            <DropdownItem
              key="horizontal-rule"
              description="Insert a visual separator"
              startContent={<ScissorsIcon className="size-4 text-default-500" />}
            >
              Horizontal Rule
            </DropdownItem>
            <DropdownItem
              key="image"
              description="Upload or link an image"
              startContent={<ImageIcon className="size-4 text-default-500" />}
            >
              Image
            </DropdownItem>
            <DropdownItem
              key="table"
              description="Insert a data table"
              startContent={<TableIcon className="size-4 text-default-500" />}
            >
              Table
            </DropdownItem>
            <DropdownItem
              key="columns"
              description="Insert a multi-column layout"
              startContent={<Columns3Icon className="size-4 text-default-500" />}
            >
              Columns Layout
            </DropdownItem>
          </DropdownSection>

          {/* <DropdownSection title="Embeds">
            {EmbedConfigs.map((embedConfig) => (
              <DropdownItem
                key={embedConfig.type}
                description={`Embed ${embedConfig.contentName} content`}
                startContent={
                  <div className="text-default-500 size-4">
                    {embedConfig.icon}
                  </div>
                }
              >
                {embedConfig.contentName}
              </DropdownItem>
            ))}
          </DropdownSection> */}
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
