import React from "react";
import type { IconType } from "react-icons";
import { Expand } from "../../contracts";
import { ColorTheme } from "./themes";

export type ContextSettings = {
    theme: ColorTheme;
};

export type ProviderBase = Expand<
{
    colors: Record<string, string>;
    isLoading: boolean;
    routes: Record<string, { name: string; icon: IconType }>;
    footerInfo?: {
        authorName?: string;
        linkedInLink?: string;
        gitHubLink?: string;
        moreLinks?: JSX.Element[];
    };
} & ContextSettings
>;

export type ContextState = Expand<
ProviderBase & {
    setTheme: (theme: ColorTheme) => void;
}
>;

export const ToploContext = React.createContext<ContextState | undefined>(
    undefined,
);
