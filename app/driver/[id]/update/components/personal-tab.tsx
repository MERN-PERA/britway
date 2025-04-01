"use client";

import React, { FC, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

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
import { Button, buttonVariants } from "@/components/ui/button";
import { IDriverData } from "@/app/typings/interfaces/driverData";
import axios from "axios";
import FileUpload from "@/app/components/file-upload";
import Swal from "sweetalert2";
import ProfilePhoto from "@/app/components/profile-photo";

const formSchema = z.object({
  title: z.string().nullish(),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  dateOfBirth: z.string().nullish(),
  mobileNumber: z.string().nullish(),
  telephoneNumber: z.string().nullish(),
  emergencyNumber: z.string().nullish(),
  address: z.string().nullish(),
  city: z.string().nullish(),
  postCode: z.string().nullish(),
  county: z.string().nullish(),
  country: z.string().nullish(),
  companyName: z.string().nullish(),
  companyNumber: z.string().nullish(),
  companyVatNumber: z.string().nullish(),
  note: z.string().nullish(),
  photo: z.string().nullish().optional().nullable(),
});

type FormType = z.infer<typeof formSchema>;

export interface PersonalTabProps {
  onCreate: (data: IDriverData) => void;
  data: IDriverData | null;
}

const GeneralTab: FC<PersonalTabProps> = ({ onCreate, data }) => {
  const [loading, setLoading] = useState(false); // Loading state to manage button

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      mobileNumber: "",
      telephoneNumber: "",
      emergencyNumber: "",
      address: "",
      city: "",
      postCode: "",
      county: "",
      country: "",
      companyName: "",
      companyNumber: "",
      companyVatNumber: "",
      note: "",
      photo: "",
    },
  });

  async function onSubmit(values: FormType) {
    if (data?.generalData) {
      setLoading(true); // Set loading to true when submitting

      const sanitizedValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          value === null ? undefined : value,
        ])
      );

      const requestData = {
        personalData: {
          ...sanitizedValues,
          photo: values.photo || undefined,
        },
      };

      try {
        const response = await axios.put(`/api/driver/${data.id}`, requestData);
        onCreate({ ...data, ...requestData }); // Update parent state with new data
        Swal.fire({
          icon: "success",
          title: "Updated successfully",
          text: "The driver data has been updated.",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while updating the driver data.",
        });
      } finally {
        setLoading(false); // Set loading to false after operation completes
      }
    }
  }
  useEffect(() => {
    if (data) {
      form.reset(data.personalData);
    }
  }, [data]);

  return (
    <Form {...form}>
      <div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="photo"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Photo</FormLabel>
                <FileUpload
                  uploadedFiles={field.value ? [field.value] : undefined}
                  onUploadComplete={(files) => field.onChange(files[0])}
                />
                <FormDescription>
                  Upload a profile photo (max 4MB)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
            <FormField
              name="dateOfBirth"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="mobileNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Mobile Number" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
            <FormField
              name="telephoneNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telephone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Telephone Number"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="emergencyNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Emergency Number"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="address"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Address" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
            <FormField
              name="city"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="postCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PostCode</FormLabel>
                  <FormControl>
                    <Input placeholder="PostCode" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
            <FormField
              name="county"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>County</FormLabel>
                  <FormControl>
                    <Input placeholder="County" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="country"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Country" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="companyName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Company Name" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
            <FormField
              name="companyNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Company Number" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="companyVatNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company VAT Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Company VAT Number" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="note"
            control={form.control}
            render={({ field }) => (
              <FormDescription>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Input type="Description" placeholder="Note" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormDescription>
            )}
          />

          <div className="grid  grid-cols-2  gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Add"}
            </Button>
            <Button variant="outline" type="submit">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Form>
  );
};

export default GeneralTab;