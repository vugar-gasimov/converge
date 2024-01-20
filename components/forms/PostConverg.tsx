"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";

import { ConvergValidation } from "@/lib/validations/converg";
import { createConverg } from "@/lib/actions/converg.actions";

interface Props {
  userId: string;
}

function PostConverg({ userId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();

  const form = useForm<z.infer<typeof ConvergValidation>>({
    resolver: zodResolver(ConvergValidation),
    defaultValues: {
      converg: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof ConvergValidation>) => {
    console.log("ORG ID:", organization);

    await createConverg({
      text: values.converg,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
    });

    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="converg"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3 ">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          Post a Converg
        </Button>
      </form>
    </Form>
  );
}

export default PostConverg;
