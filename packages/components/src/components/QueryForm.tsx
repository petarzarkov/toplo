/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    useColorModeValue,
    FormErrorMessage
} from "@chakra-ui/react";
import { BaseModal, Title } from "../components";
import { Field, Form, Formik, FieldProps } from "formik";

export const QueryForm = <FormValues extends Record<string, unknown> = Record<string, unknown>, SubmitResponse extends React.ReactNode = React.ReactNode>(
    { title, initialValues, handleSubmit }:
    {
        title: string;
        initialValues: FormValues;
        handleSubmit: (values: FormValues) => SubmitResponse | Promise<SubmitResponse>;
    }) => {
    const [showModal, setShowModal] = useState<{ show: true; response: SubmitResponse } | { show: false }>({ show: false });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitForm = async (values: FormValues) => {
        setIsSubmitting(true);

        const response = await handleSubmit(values);
        setShowModal({
            show: true,
            response
        });

        setIsSubmitting(false);
    };

    return (
        <Box>
            <Title
                title={title}
            />
            {showModal.show
            &&
            <BaseModal
                title="Stocks evaluation"
                content={showModal.response}
                isOpen={showModal.show}
                onClose={() => setShowModal({ show: false })}
            />
            }

            <Box
                bg={useColorModeValue("primary.50", "primary.700")}
                borderRadius="lg"
                p={6}
                color={useColorModeValue("primary.700", "primary.50")}
                shadow="base">
                <Formik<FormValues>
                    initialValues={initialValues}
                    onSubmit={submitForm}
                >
                    {() => (
                        <Form>
                            {/* <Field name='balance'>
                                {({ field, form }: FieldProps<string | number | readonly string[] | undefined, FormValues>) => (
                                    <FormControl
                                        isRequired
                                        marginBottom={5}
                                        isInvalid={!!form.errors.balance && !!form.touched.balance}
                                    >
                                        <FormLabel htmlFor='balance'>{"Balance:"}</FormLabel>
                                        <InputGroup>
                                            <Input
                                                {...field}
                                                type="number"
                                                id="balance"
                                                min={1}
                                            />
                                        </InputGroup>
                                        <FormErrorMessage>{form.errors.balance}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name='from' validate={validate}>
                                {({ field, form }: FieldProps<string | number | readonly string[] | undefined, FormValues>) => (
                                    <FormControl
                                        isRequired
                                        marginBottom={5}
                                        isInvalid={!!form.errors.from && !!form.touched.from}
                                    >
                                        <FormLabel htmlFor='from'>{"From:"}</FormLabel>
                                        <InputGroup>
                                            <Input
                                                {...field}
                                                type="time"
                                                id="from"
                                                min={`${utcDates.from.hours}:${utcDates.from.minutes}:${utcDates.from.seconds}`}
                                                max={`${utcDates.to.hours}:${utcDates.to.minutes}:${utcDates.to.seconds}`}
                                            />
                                        </InputGroup>
                                        <FormErrorMessage>{form.errors.from}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name='to' validate={validate}>
                                {({ field, form }: FieldProps<string | number | readonly string[] | undefined, FormValues>) => (
                                    <FormControl
                                        isRequired
                                        marginBottom={5}
                                        isInvalid={!!form.errors.to && !!form.touched.to}
                                    >
                                        <FormLabel htmlFor='to'>{"To:"}</FormLabel>
                                        <InputGroup>
                                            <Input
                                                {...field}
                                                type="time"
                                                id="to"
                                                // defaultValue={`${utcDates.to.hours}:${utcDates.to.minutes}:${utcDates.to.seconds}`}
                                                min={`${utcDates.from.hours}:${utcDates.from.minutes}:${utcDates.from.seconds}`}
                                                max={`${utcDates.to.hours}:${utcDates.to.minutes}:${utcDates.to.seconds}`}
                                            />
                                        </InputGroup>
                                        <FormErrorMessage>{form.errors.to}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field> */}
                            <Button
                                isLoading={isSubmitting}
                                type='submit'
                                colorScheme="blue"
                                bg={useColorModeValue("primary.300", "primary.500")}
                                color="white"
                                _hover={{
                                    bg: useColorModeValue("primary.200", "primary.400"),
                                }}
                            >
                                {"Get Stocks"}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
};
