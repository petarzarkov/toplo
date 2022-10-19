import React, { FC, ReactNode } from "react";
import {
    Flex,
    Link,
    useColorModeValue,
    Icon
} from "@chakra-ui/react";
import { Link as RLink, useMatch, useResolvedPath } from "react-router-dom";
import { IconType } from "react-icons";

export const NavLink: FC<{ children: ReactNode; icon: IconType; to?: string }> = ({ children, icon, to = "#" }) => {
    const resolved = useResolvedPath(to);
    const match = useMatch({ path: resolved.pathname, end: true });
    const linkBgColor = useColorModeValue("primary.300", "primary.500");
    return (
        <Link
            px={2}
            py={1}
            rounded={"md"}
            background={match ? linkBgColor : undefined}
            _hover={{
                textDecoration: "none",
                bg: useColorModeValue("primary.200", "primary.700"),
            }}
            as={RLink}
            to={to}
        >
            <Flex
                align="center"
                p="2"
                mx="2"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: "primary.400",
                    color: "white",
                }}>
                {icon && (
                    <Icon
                        mr="2"
                        fontSize="16"
                        _groupHover={{
                            color: "white",
                        }}
                        color={useColorModeValue("primary.700", "primary.200")}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};