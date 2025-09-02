import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useCreateService, useOriginalServices } from "@/hooks/use-services";
import { useCategories } from "@/hooks/use-categories";
import type { Category, OriginalService } from "@/types/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the schema using zod
const serviceSchema = z.object({
  serviceName: z.string().min(1, "Service name is required"),
  newServiceName: z.string().min(1, "New service name is required"),
  rate: z.number().min(0, "Rate is required"),
  category: z.string().min(1, "Category is required"),
  min: z
    .string()
    .min(1, "Minimum quantity is required")
    .regex(/^\d+$/, "Must be a valid number"),
  max: z
    .string()
    .min(1, "Maximum quantity is required")
    .regex(/^\d+$/, "Must be a valid number"),
  type: z.string().min(1, "Type is required"),
  dripfeed: z.boolean(),
  refill: z.boolean(),
  cancel: z.boolean(),
  isActive: z.boolean(),
  isFree: z.boolean(), // Added isFree to the schema
});

type ServiceFormData = z.infer<typeof serviceSchema>;

const AddService = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOriginal, setSelectedOriginal] =
    useState<OriginalService | null>(null);
  const createService = useCreateService();
  const { data: originalServices = [] } = useOriginalServices();
  const { data: categories = [] } = useCategories();

  useEffect(() => {
    console.log(JSON.stringify(selectedOriginal, null, 2));
  }, [selectedOriginal]);

  // Initialize react-hook-form
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceName: "",
      newServiceName: "",
      rate: 0,
      category: "",
      min: "",
      max: "",
      type: "default",
      dripfeed: false,
      refill: false,
      cancel: false,
      isActive: true,
      isFree: false,
    },
  });

  // Filtered options for autocomplete
  const filteredOptions = form.watch("serviceName")
    ? originalServices.filter((os) =>
        os.name.toLowerCase().includes(form.watch("serviceName").toLowerCase())
      )
    : originalServices;

  const handleSelectService = (os: OriginalService) => {
    form.setValue("serviceName", os.name);
    setSelectedOriginal(os);
    form.setValue("rate", Number(os.rate));
    form.setValue("min", os.min.toString());
    form.setValue("max", os.max.toString());
    form.setValue("type", os.type);
    form.setValue("dripfeed", os.dripfeed);
    form.setValue("refill", os.refill);
    form.setValue("cancel", os.cancel);
  };

  const handleCreateService = async (data: ServiceFormData) => {
    // Find the selected original service by name
    // const os = originalServices.find((s) => s.name === data.serviceName);
    if (!selectedOriginal) return;
    const serviceData = {
      type: data.type,
      service: Number(selectedOriginal.service),
      name: data.newServiceName,
      rate: data.rate,
      min: Number(data.min),
      max: Number(data.max),
      dripfeed: data.dripfeed,
      refill: data.refill,
      cancel: data.cancel,
      category: data.category,
      original: {
        name: selectedOriginal.name,
        rate: Number(selectedOriginal.rate),
        category: selectedOriginal.category,
      },
      isActive: data.isActive,
      isFree: data.isFree, // Added isFree to the serviceData
    };
    await createService.mutateAsync(serviceData);
    setIsCreateDialogOpen(false);
    setSelectedOriginal(null);
    form.reset();
  };

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Service</DialogTitle>
          <DialogDescription>
            Add a new service to the platform
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateService)}
            className="space-y-4"
          >
            {/* Service Name Autocomplete */}
            <FormField
              control={form.control}
              name="serviceName"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Original Service</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="off"
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedOriginal(null);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {field.value &&
                    filteredOptions.length > 0 &&
                    !selectedOriginal && (
                      <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-40 overflow-y-auto">
                        {filteredOptions.slice(0, 10).map((os) => (
                          <li
                            key={os.service}
                            className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                            onClick={() => handleSelectService(os)}
                          >
                            <span className="font-medium">{os.name}</span>
                            <span className="ml-2 text-xs text-gray-500">
                              ID: {os.service}
                            </span>
                            <span className="ml-2 text-xs text-blue-600">
                              ${os.rate}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                </FormItem>
              )}
            />
            {/* New Service Name Field */}
            <FormField
              control={form.control}
              name="newServiceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Service Name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step={0.01}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        onBlur={field.onBlur}
                        name={field.name}
                        disabled={form.watch("isFree")}
                        className={form.watch("isFree") ? "opacity-50" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                    {form.watch("isFree") && (
                      <p className="text-xs text-blue-600 mt-1">
                        Rate automatically set to 0 for free services
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat: Category, index) => (
                          <SelectItem key={index} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                    {selectedOriginal && (
                      <p className="text-xs text-gray-500 mt-1">
                        Original: {selectedOriginal.min}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                    {selectedOriginal && (
                      <p className="text-xs text-gray-500 mt-1">
                        Original: {selectedOriginal.max}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center space-x-4">
              <FormField
                control={form.control}
                name="isFree"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          // If service is set to free, automatically set rate to 0
                          if (checked) {
                            form.setValue("rate", 0);
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel>Free</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Active</FormLabel>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={createService.isPending}
            >
              Create Service
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddService;
