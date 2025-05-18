"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import React from "react";
import { usePathname } from "next/navigation";

const CollapsibleSideBarItem = ({
  item,
  isActive,
}: {
  item: SideBarItem;
  isActive: boolean;
}) => (
  <Collapsible
    key={item.title}
    asChild
    defaultOpen={isActive}
    className="group/collapsible"
  >
    <SidebarMenuItem>
      <CollapsibleTrigger asChild>
        <SidebarMenuButton tooltip={item.title}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {item.items?.map((subItem) => (
            <SidebarMenuSubItem key={subItem.title}>
              <SidebarMenuSubButton asChild>
                <a href={subItem.url}>
                  <span>{subItem.title}</span>
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </SidebarMenuItem>
  </Collapsible>
);

const NormalSideBarItem = ({
  item,
  isActive,
}: {
  item: SideBarItem;
  isActive: boolean;
}) => (
  <SidebarMenuItem key={item.title}>
    <SidebarMenuButton isActive={isActive} url={item.url} tooltip={item.title}>
      {item.icon && <item.icon />}
      <span>{item.title}</span>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

export interface SideBarItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export function NavMain({ menuItems }: { menuItems: SideBarItem[] }) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {menuItems.map((item) => (
          <React.Fragment key={item.title}>
            {item?.items && item?.items?.length > 0 ? (
              <CollapsibleSideBarItem
                key={item.url}
                item={item}
                isActive={pathname === item.url}
              />
            ) : (
              <NormalSideBarItem item={item} isActive={pathname === item.url} />
            )}
          </React.Fragment>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
