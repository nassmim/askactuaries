"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ProfileFormSchema } from "@lib/validations";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@actions/user.actions";

const Profile = ({ user }: { user: string }) => {
  const router = useRouter();
  const pathName = usePathname();
  const parsedUser = JSON.parse(user);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: parsedUser.name || "",
      username: parsedUser.username || "",
      portfolioURL: parsedUser.portfolioURL || "",
      location: parsedUser.location || "",
      bio: parsedUser.bio || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ProfileFormSchema>) => {
    setIsSubmitting(true);

    try {
      await updateUser({
        clerkId: parsedUser.clerkId,
        updateData: {
          name: values.name,
          username: values.username,
          bio: values.bio,
          location: values.location,
          portfolioURL: values.portfolioURL,
        },
        path: pathName,
      });
    } catch (error) {
      return;
    } finally {
      setIsSubmitting(false);
    }

    router.back();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-9 flex w-full flex-col gap-9"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Name<span className="text-primary-500"></span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Username<span className="text-primary-500"></span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your username"
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Location<span className="text-primary-500"></span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your Location"
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portfolioURL"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Portfolio<span className="text-primary-500"></span>
              </FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="Your portfolio url"
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Bio<span className="text-primary-500"></span>
              </FormLabel>
              <FormControl>
                <Textarea
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-7 flex justify-end">
          <Button type="submit" className="primary-gradient w-fit">
            {isSubmitting ? "Saving" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Profile;
