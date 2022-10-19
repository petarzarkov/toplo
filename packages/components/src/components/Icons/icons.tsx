import React, { FC } from "react";
import { BsGithub, BsLinkedin, BsTwitter } from "react-icons/bs";
import { SiSwagger } from "react-icons/si";
import { IconLink as IconLinkBase } from "../common";
import { Flex, useColorModeValue } from "@chakra-ui/react";

const FlexIcon: FC<{ children: React.ReactNode }> = ({ children }) => <Flex
    w={12}
    h={12}
    align={"center"}
    justify={"center"}
    rounded={"full"}
    bgColor={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
    mb={1}>
    {children}
</Flex>;
const IconLink: FC<Parameters<typeof IconLinkBase>[0]> = (props) => <FlexIcon>
    <IconLinkBase {...props} />
</FlexIcon>;

export type SocialsProps = { linkTo: string };

export const Socials = {
    SwaggerDocs: ({ linkTo }: SocialsProps) => <IconLink
        to={linkTo}
        icon={<SiSwagger size="28px" />}
        label={"Docs"}
    />,
    GitHub: ({ linkTo }: SocialsProps) => <IconLink
        to={linkTo}
        icon={<BsGithub />}
        label={"github"}
        btnProps={{
            fontSize: "3xl"
        }}
    />,
    LinkedIn: ({ linkTo }: SocialsProps) => <IconLink
        to={linkTo}
        icon={<BsLinkedin size="28px" />}
        label={"linkedin"}
    />,
    Twitter: ({ linkTo }: SocialsProps) => <IconLink
        to={linkTo}
        icon={<BsTwitter size="28px" />}
        label={"twitter"}
    />
};
