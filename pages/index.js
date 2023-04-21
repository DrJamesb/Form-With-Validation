import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";

import { useState } from "react";
import { sendContactForm } from "../lib/app";

const initform = {
  name: "",
  email: "",
  age: "",
  subject: "",
  message: "",
  isLoading: false,
  submit: false,
};

const initialValidation = {
  name: false,
  email: false,
  age: false,
  subject: false,
  message: false,
  error: "",
};

export default function Home() {
  const toast = useToast();
  const [form, setForm] = useState(initform);
  const [validation, setValidation] = useState(initialValidation);

  const reset = () => {
    setForm(initform);
    setValidation(initialValidation);
  };

  const { isLoading, name, email, age, subject, message, submit } = form;
  const { error } = validation;

  const regex = new RegExp(
    /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm
  );

  const validateOnTab = ({ target }) => {
    if (target.value === "") {
      setValidation({
        ...validation,
        [target.name]: true,
        error: `${target.name
          .substring(0, 1)
          .toUpperCase()}${target.name.substring(
          1,
          target.name.length
        )} is invalid...`,
      });
    }
    if (target.name === "email" && !regex.test(target.value)) {
      setValidation({
        ...validation,
        email: true,
        error: "Email address is invalid",
      });
    }
    if (form.submit) {
      setValidation(initialValidation);
    }
  };

  const handleChange = ({ target }) => {
    if (
      form.name &&
      form.email &&
      regex.test(form.email) &&
      form.age &&
      form.subject &&
      form.message
    ) {
      setForm({
        ...form,
        [target.name]: target.value,
        submit: true,
      });
    } else {
      setForm({
        ...form,
        [target.name]: target.value,
        submit: false,
      });
    }
  };

  const onSubmit = async () => {
    setForm((prev) => ({
      ...prev,
      isLoading: true,
    }));

    try {
      delete form.isLoading;
      delete form.submit;
      await sendContactForm(form);
      setForm(initform);
      toast({
        title: "Message sent!",
        status: "success",
        duration: 2000,
        position: "top",
      });
    } catch (error) {
      setForm((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  };

  console.log(validation.email);

  return (
    <Container maxW="450px" mt={12}>
      <Heading mb={5}>Contact Form</Heading>
      {error && (
        <Text color="red.300" my={4} fontSize="xl">
          {error}
        </Text>
      )}

      <FormControl isRequired mb={5}>
        <formLabel>Name</formLabel>
        <Input
          type="text"
          name="name"
          errorBorderColor="red.300"
          value={form.name}
          onChange={handleChange}
          onBlur={validateOnTab}
          isRequired
          isInvalid={validation.name}
        />
        <FormErrorMessage>Required</FormErrorMessage>

        <formLabel>Email</formLabel>
        <Input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          onBlur={validateOnTab}
          isInvalid={validation.email}
        />
        <FormErrorMessage>Required</FormErrorMessage>

        <formLabel>Age</formLabel>
        <Input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          onBlur={validateOnTab}
          isInvalid={validation.age}
        />
        <FormErrorMessage>Required</FormErrorMessage>

        <formLabel>Subject</formLabel>
        <Input
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          onBlur={validateOnTab}
          isInvalid={validation.subject}
        />
        <FormErrorMessage>Required</FormErrorMessage>

        <formLabel>Message</formLabel>
        <Textarea
          type="text"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          onBlur={validateOnTab}
          isInvalid={validation.message}
        />
        <FormErrorMessage>Required</FormErrorMessage>
      </FormControl>
      <Button
        variet="outlined"
        colorScheme="blue"
        isLoading={isLoading}
        isDisabled={!form.submit}
        onClick={onSubmit}
      >
        Submit
      </Button>

      <Button
        isDisabled={!name && !email && !age && !subject && !message}
        onClick={reset}
        style={{ marginLeft: 10, background: "red" }}
      >
        Reset
      </Button>
    </Container>
  );
}
