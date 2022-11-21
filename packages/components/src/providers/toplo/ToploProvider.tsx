import React from "react";
import { storeData, getData } from "../../store";
import { ProviderBase, ToploContext, ContextSettings } from "./ToploContext";
import { themes, ColorTheme } from "./themes";
import { ChakraProvider } from "@chakra-ui/react";

export class ToploProvider extends React.Component<{
    children: React.ReactNode;
    routes: ProviderBase["routes"];
    footer?: ProviderBase["footerInfo"];
}> {
    isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    state: ProviderBase = {
        theme: "gray",
        colors: themes.gray,
        isLoading: false,
        routes: this.props.routes,
        footerInfo: this.props.footer
    };

    componentDidMount() {
        this.setState({ isLoading: true });
        const settings = getData<ContextSettings>("latest_settings");
        if (settings && themes[settings.theme]) {
            this.setState({
                ...(settings.theme && {
                    theme: settings.theme,
                    colors: themes[settings.theme],
                }),
            });
        }

        this.setState({ isLoading: false });
    }

    setTheme = (t: ColorTheme) => {
        this.setState({ theme: t, colors: themes[t] });
        void storeData("latest_settings", {
            theme: t,
        });
    };

    render() {
        return (
            <ToploContext.Provider
                value={{
                    ...this.state,
                    setTheme: this.setTheme,
                }}
            >
                <ChakraProvider theme={this.state.colors}>
                    {this.props.children}
                </ChakraProvider>
            </ToploContext.Provider>
        );
    }
}
