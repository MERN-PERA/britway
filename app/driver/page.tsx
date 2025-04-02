"use client";

import { DriversTable } from "../components/driver-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Driver() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg">
        <h1 className="text-lg font-semibold md:text-2xl text-gray-900">Drivers</h1>
        <Link href="/driver/create" passHref>
          <Button className="bg-cyan-300 bg-opacity-40 text-gray-800 font-bold hover:bg-cyan-700 hover:bg-opacity-50 flex items-center gap-2">
            <img
              src="https://iconsax.io/icons/a/43.svg" 
              alt="Add Icon"
              className="w-5 h-5"
            />
            Add New
          </Button>
        </Link>

      </div>
      <div
        className="flex flex-1 p-4 rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <DriversTable />
      </div>
    </div>
  );
}
