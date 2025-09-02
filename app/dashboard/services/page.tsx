"use client";

import { useState } from "react";
import { useServices, useDeleteService } from "@/hooks/use-services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Search,
  Trash2,
  ShoppingCart,
  Grid,
  List,
  Package,
} from "lucide-react";
import type { Service } from "@/types/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/use-categories";
import AddNewOrderForm from "@/components/order/AddNewOrder";

export default function ServicesPage() {
  const { data: services = [], isLoading } = useServices();
  const deleteService = useDeleteService();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      (service.category &&
        String(service.category._id) === String(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  const { data: categories, isLoading: isCategoryLoading } = useCategories();

  const handleOrderService = (service: Service) => {
    setSelectedService(service);
    setIsOrderDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">Browse and order SMM services</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {isCategoryLoading ? (
                  <p className="p-2 text-sm">Loading...</p>
                ) : !categories || categories?.length == 0 ? (
                  <p className="p-2 text-sm">No Category Available</p>
                ) : (
                  categories.map((category, index) => (
                    <SelectItem key={index} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredServices.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No services found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No services are currently available"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Services Display */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    {/* <Badge variant="outline">{service.category}</Badge> */}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      ${service.rate}
                    </p>
                    <p className="text-xs text-muted-foreground">per 1000</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Min/Max:</span>
                    <span>
                      {service.min} - {service.max}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {service.dripfeed && (
                      <Badge variant="secondary" className="text-xs">
                        Dripfeed
                      </Badge>
                    )}
                    {service.refill && (
                      <Badge variant="secondary" className="text-xs">
                        Refill
                      </Badge>
                    )}
                    {service.cancel && (
                      <Badge variant="secondary" className="text-xs">
                        Cancel
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleOrderService(service)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Order Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Services</CardTitle>
            <CardDescription>
              Complete list of available services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Min/Max</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.service}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {service.service}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {service.category
                          ? service.category.name
                          : "No Category"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-blue-600">
                      ${service.rate}
                    </TableCell>
                    <TableCell>
                      {service.min} - {service.max}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {service.dripfeed && (
                          <Badge variant="secondary" className="text-xs">
                            Dripfeed
                          </Badge>
                        )}
                        {service.refill && (
                          <Badge variant="secondary" className="text-xs">
                            Refill
                          </Badge>
                        )}
                        {service.cancel && (
                          <Badge variant="secondary" className="text-xs">
                            Cancel
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleOrderService(service)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Order
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteService.mutate(service.service)}
                          disabled={deleteService.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Order Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Order</DialogTitle>
            <DialogDescription>
              {selectedService &&
                `Order ${selectedService.name} - $${selectedService.rate} per 1000`}
            </DialogDescription>
          </DialogHeader>
          {selectedService && (
            <AddNewOrderForm
              serviceId={selectedService._id}
              min={selectedService.min}
              max={selectedService.max}
              isFree={selectedService.isFree}
              onSuccess={() => {
                setIsOrderDialogOpen(false);
                setSelectedService(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
