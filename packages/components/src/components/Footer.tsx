import React from "react";
import {
    Box,
    Container,
    Stack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { Socials } from "../components";
import { useToploProvider } from "../hooks";

export const Footer = () => {
    const { footerInfo } = useToploProvider();

    return (
        <Box
            style={{
                left: 0,
                bottom: 0,
                right: 0,
                position: "inherit"
            }}
            bg={useColorModeValue("primary.200", "primary.900")}
            color={useColorModeValue("primary.700", "primary.200")}>
            <Container
                as={Stack}
                maxW={"6xl"}
                py={4}
                direction={{ base: "column", md: "row" }}
                spacing={4}
                justify={{ base: "center", md: "space-between" }}
                align={{ base: "center", md: "center" }}>
                <Text>{`©️ ${footerInfo?.authorName || "Petar Zarkov"} ${new Date().getFullYear()}`}</Text>
                <Stack direction={"row"} spacing={6}>
                    <Socials.LinkedIn linkTo={footerInfo?.linkedInLink || "https://www.linkedin.com/in/%E2%98%95-petar-zarkov-7989a670/"} />
                    <Socials.GitHub linkTo={footerInfo?.gitHubLink || "https://github.com/petarzarkov/toplo"} />
                    {footerInfo?.moreLinks}
                </Stack>
            </Container>
        </Box>
    );
};
