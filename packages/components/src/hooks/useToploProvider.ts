import React from "react";
import { ToploContext } from "../providers/toplo";

export function useToploProvider() {
    const context = React.useContext(ToploContext);
    if (context === undefined) {
        throw new Error("useToploProvider must be used within a ToploProvider");
    }

    return context;
}
