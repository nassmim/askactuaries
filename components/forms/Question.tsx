"use client";
import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuestionFormSchema, questionFormFields } from "@lib/validations";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@components/ui/badge";
import Image from "next/image";

type FormType = z.infer<typeof QuestionFormSchema>;

const Question = () => {
  const editorRef = useRef(null);

  const form = useForm<FormType>({
    resolver: zodResolver(QuestionFormSchema),
    defaultValues: {
      title: "",
      explanation: "",
      tags: [],
    },
  });

  function onSubmit(values: FormType) {
    console.log(values);
  }

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any,
  ) => {
    console.log("dans handle");
    if (e.key === "Enter" && field.name === questionFormFields.tags) {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== "") {
        if (!field.value.includes(tagValue)) {
          form.setValue(questionFormFields.tags, [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors(questionFormFields.tags);
        }
      }
    }
  };

  const CustomFormField = ({
    children,
    name,
    label,
    description,
    formItemOtherClasses,
  }: {
    children: React.ReactElement;
    name: keyof FormType;
    label: string;
    description: string;
    formItemOtherClasses?: string;
  }) => {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className={`flex w-full flex-col ${formItemOtherClasses}`}>
            <FormLabel className="paragraph-semibold text-dark400_light800">
              {label}
              <span className="text-primary-500">*</span>
            </FormLabel>
            <FormControl className="mt-3.5">
              {React.cloneElement(children, { ...field })}
            </FormControl>
            <FormDescription className="body-regular mt-2.5 text-light-500">
              {description}
            </FormDescription>
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />
    );
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <CustomFormField
          name={questionFormFields.title}
          label="Question Title"
          description="Be specific and imagine you're asking a question to another person in person."
        >
          <Input className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border" />
        </CustomFormField>
        <CustomFormField
          name={questionFormFields.explanation}
          label="Detailed explanation of your problem"
          description="Introduce the problem and expand on what you put in the title"
          formItemOtherClasses="gap-3"
        >
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
            onInit={(_evt, editor) => (editorRef.current = editor)}
            initialValue=""
            init={{
              height: 350,
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "codesample",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
              ],
              toolbar:
                "undo redo | blocks | " +
                "codesample | bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | ",
              content_style: "body { font-family:Inter; font-size:16px }",
            }}
          />
        </CustomFormField>
        <CustomFormField
          name="tags"
          label="Tags"
          description="Add up to 3 tags to describe what your question is about. Press enter to add a tag."
        >
          <Controller
            name={questionFormFields.tags}
            render={({ field }) => (
              <>
                <Input
                  placeholder="Add tags..."
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  onKeyDown={(e) => handleInputKeyDown(e, field)}
                />
                {field.value.length > 0 && (
                  <div className="flex-start mt-2.5 gap-2.5">
                    {field.value.map((tag: any) => (
                      <Badge
                        key={tag}
                        className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 border-none px-4 py-2 capitalize"
                      >
                        {tag}
                        <Image
                          src="/assets/icons/close.svg"
                          alt="Close icon"
                          width={12}
                          height={12}
                          className="cursor-pointer object-contain invert-0 dark:invert"
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </>
            )}
          />
        </CustomFormField>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default Question;
