"use client";

import React, { FC, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {toast} from "sonner";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IDriverData } from "@/app/typings/interfaces/driverData";
import axios from "axios";
import { CheckIcon } from '@heroicons/react/24/outline';
import { Label } from "@radix-ui/react-label";
import FileUpload from "@/app/components/file-upload";
import Swal from "sweetalert2";

const formSchema = z.object({
  nationalInsuranceNumber: z.string().nullable(),
  // .min(5, {
  //   message: "National Insurance Number must be at least 5 characters.",
  // }),
  bankAccountDetails: z.string().nullable(),
  // .min(5, {
  //   message: "Bank account details must be at least 5 characters.",
  // }),
  insurance: z.string().nullable(),
  // .min(2, {
  //   message: "Insurance details must be at least 2 characters.",
  // }),
  insuranceExpiryDate: z.string().nullable(),
  // .regex(/^\d{4}-\d{2}-\d{2}$/, {
  //   message: "Insurance expiry date must be in the format YYYY-MM-DD.",
  // }),
  drivingLicence: z.string().nullable(),
  // .min(5, {
  //   message: "Driving licence number must be at least 5 characters.",
  // }),
  drivingLicenceExpiryDate: z.string().nullable(),
  // .regex(/^\d{4}-\d{2}-\d{2}$/, {
  //   message: "Driving licence expiry date must be in the format YYYY-MM-DD.",
  // }),
  PCOLicence: z.string().nullable(),
  // .min(5, {
  //   message: "PCO licence number must be at least 5 characters.",
  // }),
  PCOLicenceExpiryDate: z.string().nullable(),
  // .regex(/^\d{4}-\d{2}-\d{2}$/, {
  //   message: "PCO licence expiry date must be in the format YYYY-MM-DD.",
  // }),
  MOTLicence: z.string().nullable().nullable(),
  // .min(5, {
  //   message: "PCO licence number must be at least 5 characters.",
  // }),
  MOTLicenceExpiryDate: z.string().nullable(),
  // .regex(/^\d{4}-\d{2}-\d{2}$/, {
  //   message: "PCO licence expiry date must be in the format YYYY-MM-DD.",
  // }),
  PHVLicence: z.string().nullable().nullable(),
  // .min(5, {
  //   message: "PHV licence number must be at least 5 characters.",
  // }),
  PHVLicenceExpiryDate: z.string().nullable(),
  // .regex(/^\d{4}-\d{2}-\d{2}$/, {
  //   message: "PHV licence expiry date must be in the format YYYY-MM-DD.",
  // }),

  driverActivityStatus: z.string(),

  // driverActivityStatus: z.enum(["Available", "Unavailable"]).nullable(),
  //    {
  //   message: "Driver activity status must be either 'active' or 'inactive'.",
  // }),
  driverAddressStatus: z.string(),

  // driverAddressStatus: z.enum(["Verified", "Not Verified"]).nullable(),
  //    {
  //   message: "Driver activity status must be either 'active' or 'inactive'.",
  // }),

  bgsStatus: z.string(),
  // bgsStatus: z.enum(["Checked", "Unchecked"]).default("Unchecked"),
  // bgsStatus: z.enum(["Checked", "Unchecked"]).nullable(),
  //    {
  //   message: "Driver activity status must be either 'active' or 'inactive'.",
  // }),
  lastCheckedDate: z.string().nullable(),
  // .min(5, {
  //   message: "PHV licence number must be at least 5 characters.",
  // }),
  additionalFiles: z.string().nullable(),
  // .min(2, {
  //   message: "Title details must be at least 2 characters.",
  // }),
  file: z.string().nullable(),
  // .min(2, {
  //   message: "file details must be at least 2 characters.",
  // }),

  //updated from new feaure
  insuranceFile: z.string().nullable(),
  insuranceVerifyStatus: z.string().nullable(),
  insuranceLastVerifyDate: z.string().nullable(),
  
  drivingLicenseFile: z.string().nullable(),
  drivingLicenseVerifyStatus: z.string().nullable(),
  drivingLicenseLastVerifyDate: z.string().nullable(),

  PCOLicenseFile: z.string().nullable(),
  PCOLicenseVerifyStatus: z.string().nullable(),
  PCOLicenseLastVerifyDate: z.string().nullable(),

  MOTLicenseFile: z.string().nullable(),
  MOTLicenseVerifyStatus: z.string().nullable(),
  MOTLicenseLastVerifyDate: z.string().nullable(),

  PHVLicenseFile: z.string().nullable(),
  PHVLicenseVerifyStatus: z.string().nullable(),
  PHVLicenseLastVerifyDate: z.string().nullable(),

 
});
type FormType = z.infer<typeof formSchema>;

export interface IOtherTabProps {
  onCreate: (data: IDriverData) => void;
  data: IDriverData | null;
}
const OtherTab: FC<IOtherTabProps> = ({ onCreate, data }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nationalInsuranceNumber: "",
      bankAccountDetails: "",
      insurance: "",
      insuranceExpiryDate: "",
      drivingLicence: "",
      drivingLicenceExpiryDate: "",
      PCOLicence: "",
      PCOLicenceExpiryDate: "",
      MOTLicence: "",
      MOTLicenceExpiryDate: "",
      PHVLicence: "",
      PHVLicenceExpiryDate: "",
      driverActivityStatus: "Unavailable",
      driverAddressStatus: "Not Verified",
      bgsStatus: "Unchecked",
      lastCheckedDate: "",
      additionalFiles: "",
      // file: "",
      insuranceFile: "",
      insuranceVerifyStatus: "",
      insuranceLastVerifyDate: "",

      drivingLicenseFile: "",
      drivingLicenseVerifyStatus: "",
      drivingLicenseLastVerifyDate: "",

      PCOLicenseFile: "",
      PCOLicenseVerifyStatus: "",
      PCOLicenseLastVerifyDate:"",
      
      MOTLicenseFile: "",
      MOTLicenseVerifyStatus: "",
      MOTLicenseLastVerifyDate: "",

      PHVLicenseFile: "",
      PHVLicenseVerifyStatus: "",
      PHVLicenseLastVerifyDate: "",

      file: "",
    },
  });

  // const [selectedFile, setSelectedFile] = useState<string | null>(null);

  function onSubmit(values: FormType) {
    console.log(values);
    setLoading(true); // Start loading state

    console.log(values)
    if (data?.generalData) {
      const requestData = {
        otherData: {
          ...values,
          nationalInsuranceNumber: values.nationalInsuranceNumber || '',
          bankAccountDetails: values.bankAccountDetails || '',
          insurance: values.insurance || '',
          insuranceExpiryDate: values.insuranceExpiryDate || '',
          drivingLicence: values.drivingLicence || '',
          drivingLicenceExpiryDate: values.drivingLicenceExpiryDate || '',
          PCOLicence: values.PCOLicence || '',
          PCOLicenceExpiryDate: values.PCOLicenceExpiryDate || '',
          MOTLicence: values.MOTLicence || '',
          MOTLicenceExpiryDate: values.MOTLicenceExpiryDate || '',
          PHVLicence: values.PHVLicence || '',
          PHVLicenceExpiryDate: values.PHVLicenceExpiryDate || '',
          driverActivityStatus: values.driverActivityStatus as "Available" | "Unavailable" | undefined,
          driverAddressStatus: values.driverAddressStatus as "Verified" | "Not Verified" | undefined,
          bgsStatus: values.bgsStatus as "Checked" | "Unchecked" | undefined,
          lastCheckedDate: values.lastCheckedDate || '',
          additionalFiles: values.additionalFiles || '',
          file: values.file || '',
        }
      };
      axios.put(`/api/driver/${data.id}`, requestData).then(
        (response) => {
          onCreate({...data, ...requestData});
          Swal.fire({
            icon: 'success',
            title: 'Updated successfully',
            text: 'The driver data has been updated.',
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while updating the driver data.',
          });
        }
      ).finally(() => {
        setLoading(false);
      });
      return;
    }
  }

  //   const fileInputRef = React.useRef(null);

  //   const handleClick = () => {
  //     fileInputRef.current.click();
  //   };

  //   const handleFileChange = (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //       console.log("Selected file:", file);
  //     }
  //   };

  useEffect(() => {
    if (data?.otherData) {
      form.reset(data.otherData);
    }
  }, [data]);

  // const handleFileClick = (fileUrl: string) => {
  //   setSelectedFile(fileUrl);
  //   window.open(fileUrl, '_blank');
  // };

  return (
    <Form {...form}>
      <div >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="nationalInsuranceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>National Insurance Number</FormLabel>
                  <FormControl>
                    <Input placeholder="National Insurance Number" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="bankAccountDetails"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Account Details</FormLabel>
                  <FormControl>
                    <Input placeholder="Bank Account Details" {...field}  value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="insurance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Insurance </FormLabel>
                  <FormControl>
                    <Input placeholder=" Insurance " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="insuranceExpiryDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insurance Expiry Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="Insurance Expiry Date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}
          <div className="border-t pt-2">
  <Label className="text-lg">Insurance</Label>
</div>

<FormField
            name="insuranceFile"
            control={form.control}
            render={({ field }) => (
              <FormItem>
          <FileUpload
            uploadedFiles={field.value ? [field.value] : undefined}
            onUploadComplete={(files) => field.onChange(files[0])}
          />
        </FormItem>
            )}
          />

<div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
  <FormField
    control={form.control}
    name="insurance"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Number</FormLabel>
        <FormControl>
          <Input placeholder="Insurance" {...field}  value={field.value ?? ''} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  <FormField
    name="insuranceExpiryDate"
    control={form.control}
    render={({ field }) => (
      <FormItem>
        <FormLabel>Insurance Expiry Date</FormLabel>
        <FormControl>
          <Input
            type="date"
            placeholder="Insurance Expiry Date"
            {...field}  value={field.value ?? ''} 
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div>

{/* <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
  <FormField
    control={form.control}
    name="insuranceVerifyStatus"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Verify Status</FormLabel>
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="Verified">Verified</SelectItem>
            <SelectItem value="Unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
  <FormField
    name="insuranceLastVerifyDate"
    control={form.control}
    render={({ field }) => (
      <FormItem>
        <FormLabel>Verify Date</FormLabel>
        <FormControl>
          <Input
            type="date"
            placeholder="Last Verify Date"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div> */}

          {/* <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="drivingLicence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driving Licence</FormLabel>
                  <FormControl>
                    <Input placeholder="Driving Licence" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="drivingLicenceExpiryDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driving Licence Expiry Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="Driving Licence Expiry Date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}
          <div className="border-t pt-2">
  <Label className="text-lg">Driving Licence</Label>
</div>

<FormField
  name="drivingLicenseFile"
  control={form.control}
  render={({ field }) => (
    <FormItem>
      <FileUpload
        uploadedFiles={field.value ? [field.value] : undefined}
        onUploadComplete={(files) => field.onChange(files[0])}
      />
    </FormItem>
  )}
/>

<div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
  <FormField
    control={form.control}
    name="drivingLicence"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Driving Licence Number</FormLabel>
        <FormControl>
          <Input placeholder="Driving Licence" {...field}  value={field.value ?? ''} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  <FormField
    name="drivingLicenceExpiryDate"
    control={form.control}
    render={({ field }) => (
      <FormItem>
        <FormLabel>Driving Licence Expiry Date</FormLabel>
        <FormControl>
          <Input
            type="date"
            placeholder="Driving Licence Expiry Date"
            {...field}  value={field.value ?? ''} 
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div>

{/* <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
  <FormField
    control={form.control}
    name="drivingLicenseVerifyStatus"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Verify Status</FormLabel>
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="Verified">Verified</SelectItem>
            <SelectItem value="Unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
  <FormField
    name="drivingLicenseLastVerifyDate"
    control={form.control}
    render={({ field }) => (
      <FormItem>
        <FormLabel>Last Verify Date</FormLabel>
        <FormControl>
          <Input
            type="date"
            placeholder="Last Verify Date"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div> */}



          {/* <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="PCOLicence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PCO Licence</FormLabel>
                  <FormControl>
                    <Input placeholder="PCO Licence " {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="PCOLicenceExpiryDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PCO Licence Expiry Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="PCO Licence Expiry Date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}

<div className="border-t pt-2">
  <Label className="text-lg">PCO Licence</Label>
</div>

<FormField
  name="PCOLicenseFile"
  control={form.control}
  render={({ field }) => (
    <FormItem>
      <FileUpload
        uploadedFiles={field.value ? [field.value] : undefined}
        onUploadComplete={(files) => field.onChange(files[0])}
      />
    </FormItem>
  )}
/>

<div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
  <FormField
    control={form.control}
    name="PCOLicence"
    render={({ field }) => (
      <FormItem>
        <FormLabel>PCO Licence Number</FormLabel>
        <FormControl>
          <Input placeholder="PCO Licence" {...field}  value={field.value ?? ''} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  <FormField
    name="PCOLicenceExpiryDate"
    control={form.control}
    render={({ field }) => (
      <FormItem>
        <FormLabel>PCO Licence Expiry Date</FormLabel>
        <FormControl>
          <Input
            type="date"
            placeholder="PCO Licence Expiry Date"
            {...field}  value={field.value ?? ''} 
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div>

{/* <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
  <FormField
    control={form.control}
    name="PCOLicenseVerifyStatus"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Verify Status</FormLabel>
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="Verified">Verified</SelectItem>
            <SelectItem value="Unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
  <FormField
    name="PCOLicenseLastVerifyDate"
    control={form.control}
    render={({ field }) => (
      <FormItem>
        <FormLabel>Last Verify Date</FormLabel>
        <FormControl>
          <Input
            type="date"
            placeholder="Last Verify Date"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div> */}


          {/* <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="MOTLicence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MOT</FormLabel>
                  <FormControl>
                    <Input placeholder="MOT " {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="MOTLicenceExpiryDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MOT Expiry Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="MOT Expiry Date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}
<div className="border-t pt-2">
  <Label className="text-lg">MOT</Label>
</div>

<FormField
  name="MOTLicenseFile"
  control={form.control}
  render={({ field }) => (
    <FormItem>
      <FileUpload
        uploadedFiles={field.value ? [field.value] : undefined}
        onUploadComplete={(files) => field.onChange(files[0])}
      />
    </FormItem>
  )}
/>

<div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
  <FormField
    control={form.control}
    name="MOTLicence"
    render={({ field }) => (
      <FormItem>
        <FormLabel>MOT</FormLabel>
        <FormControl>
          <Input placeholder="MOT " {...field}  value={field.value ?? ''} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  <FormField
    name="MOTLicenceExpiryDate"
    control={form.control}
    render={({ field }) => (
      <FormItem>
        <FormLabel>MOT Expiry Date</FormLabel>
        <FormControl>
          <Input
            type="date"
            placeholder="MOT Expiry Date"
            {...field}  value={field.value ?? ''} 
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div>

{/* <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
  <FormField
    control={form.control}
    name="MOTLicenseVerifyStatus"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Verify Status</FormLabel>
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="Verified">Verified</SelectItem>
            <SelectItem value="Unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
  <FormField
    name="MOTLicenseLastVerifyDate"
    control={form.control}
    render={({ field }) => (
      <FormItem>
        <FormLabel>Verify Date</FormLabel>
        <FormControl>
          <Input
            type="date"
            placeholder="Last Verify Date"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div> */}


          {/* <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="PHVLicence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PHV Licence</FormLabel>
                  <FormControl>
                    <Input placeholder="PHV Licence" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="PHVLicenceExpiryDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PHV Licence Expiry Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="PHV Licence Expiry Date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}

<div className="border-t pt-2">
  <Label className="text-lg">PHV Licence</Label>
</div>

<FormField
  name="PHVLicenseFile"
  control={form.control}
  render={({ field }) => (
    <FormItem>
      <FileUpload
        uploadedFiles={field.value ? [field.value] : undefined}
        onUploadComplete={(files) => field.onChange(files[0])}
      />
    </FormItem>
  )}
/>

<div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
  <FormField
    control={form.control}
    name="PHVLicence"
    render={({ field }) => (
      <FormItem>
        <FormLabel>PHV Licence Number</FormLabel>
        <FormControl>
          <Input placeholder="PHV Licence" {...field}  value={field.value ?? ''} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  <FormField
    name="PHVLicenceExpiryDate"
    control={form.control}
    render={({ field }) => (
      <FormItem>
        <FormLabel>PHV Licence Expiry Date</FormLabel>
        <FormControl>
          <Input
            type="date"
            placeholder="PHV Licence Expiry Date"
            {...field}  value={field.value ?? ''} 
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div>

{/* <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
  <FormField
    control={form.control}
    name="PHVLicenseVerifyStatus"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Verify Status</FormLabel>
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="Verified">Verified</SelectItem>
            <SelectItem value="Unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
  <FormField
    name="PHVLicenseLastVerifyDate"
    control={form.control}
    render={({ field }) => (
      <FormItem>
        <FormLabel>Verify Date</FormLabel>
        <FormControl>
          <Input
            type="date"
            placeholder="Last Verify Date"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div> */}


          {/*<div className="grid grid-cols-2 gap-4">*/}
          {/*    <FormField*/}
          {/*        control={form.control}*/}
          {/*        name="username"*/}
          {/*        render={({ field }) => (*/}
          {/*            <FormItem>*/}
          {/*                <FormLabel>Driver Income(%)</FormLabel>*/}
          {/*                <FormControl>*/}
          {/*                    <Input placeholder="Driver Income(%)" {...field} />*/}
          {/*                </FormControl>*/}

          {/*                <FormMessage />*/}
          {/*            </FormItem>*/}
          {/*        )}*/}
          {/*    />*/}
          {/*    <FormField*/}
          {/*        name="uniqueId"*/}
          {/*        control={form.control}*/}

          {/*        render={({ field }) => (*/}
          {/*            <FormItem>*/}
          {/*                <FormLabel>Bace Address</FormLabel>*/}
          {/*                <FormControl>*/}
          {/*                    <Input placeholder="Bace Address" {...field} />*/}
          {/*                </FormControl>*/}
          {/*                <FormMessage />*/}
          {/*            </FormItem>*/}
          {/*        )}*/}
          {/*    />*/}
          {/*</div>*/}
          <FormField
            name="driverActivityStatus"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Driver Activity Status</FormLabel>

                <Select
                defaultValue={field.value} // Use undefined instead of null
                onValueChange={field.onChange} // Handle value change and update the form state
                >
                  <FormControl>
                    <SelectTrigger>
                    <SelectValue>{field.value}</SelectValue>
                    {/* <SelectValue placeholder="Select a correct status" /> */}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>

                <FormControl></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="driverAddressStatus"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Driver Licence Address Status</FormLabel>
                {/* <div style={{ position: "relative" }}> */}
                <Select
                defaultValue={field.value}
                onValueChange={field.onChange}
                    
                  >
                    <FormControl>
                      <SelectTrigger>
                      {/* <SelectValue placeholder="Select a correct status" />         */}
                      <SelectValue>{field.value}</SelectValue>
                                  </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Verified">Verified</SelectItem>
                      <SelectItem value="Not Verified">Not Verified</SelectItem>
                    </SelectContent>
                  </Select>

                   {field.value === "Verified" && (
                    <CheckIcon
                      style={{
                        position: "relative",
                        top: "-4.2rem",
                        float: "inline-end",
                        color: "green",
                        width: "1.5rem",
                        height: "1.5rem",
                      }} 
                    />
                  )}
                {/* </div>  */}
                <FormControl></FormControl>
                <FormMessage />
              </FormItem>
            )}          />



          <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
          <FormField
            name="bgsStatus"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>DBS Check Status</FormLabel>

                <Select
  defaultValue={field.value} // Set value to what's stored in the database
  onValueChange={(value) => field.onChange(value)} // Update the value when user selects
>
  <FormControl>
    <SelectTrigger>
    <SelectValue>{field.value}</SelectValue>
    {/* <SelectValue placeholder="Select a correct status" /> */}
        </SelectTrigger>
  </FormControl>
  <SelectContent>
    <SelectItem value="Checked">Checked</SelectItem>
    <SelectItem value="Unchecked">Unchecked</SelectItem>
  </SelectContent>
</Select>


                <FormControl></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            <FormField
              name="lastCheckedDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Checked Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="Last Checked Date"
                      {...field}  value={field.value ?? ''} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* <div className="grid lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-1 gap-4"> */}

          <div>
            <Label>Additional Files</Label>
          </div>
          <FormField
  name="file"
  control={form.control}
  render={({ field }) => (
    <FormItem>
      {/* <FormLabel>Additional Files</FormLabel> */}
      <FileUpload
        uploadedFiles={field.value ? [field.value] : undefined}
        onUploadComplete={(files) => field.onChange(files[0])}
      />
    </FormItem>
  )}
/>

            {/* <FormField
              name="file"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="mt-[33px]"
                      placeholder="File"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          {/* </div> */}

          {/* <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
            <Button variant="secondary" type="submit">
              + New File
            </Button>
          </div> */}
          <div className="grid grid-cols-2 gap-4">
          <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Add"} {/* Show Loading text */}
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
export default OtherTab;
