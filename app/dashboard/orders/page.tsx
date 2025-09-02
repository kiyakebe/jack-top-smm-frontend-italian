"use client";

import { useState, useMemo } from "react";
import { useOrders, useRefillOrders } from "@/hooks/use-orders";
import { useServices } from "@/hooks/use-services";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingCart,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  RefreshCw,
  X,
  ExternalLink,
  Package,
  Filter,
} from "lucide-react";
import { format } from "@/lib/date-utils";

const statusConfig = {
  pending: {
    label: "In Attesa",
    variant: "secondary" as const,
    icon: Clock,
    color: "text-orange-600",
  },
  "in progress": {
    label: "In Corso",
    variant: "default" as const,
    icon: TrendingUp,
    color: "text-blue-600",
  },
  completed: {
    label: "Completato",
    variant: "default" as const,
    icon: CheckCircle,
    color: "text-green-600",
  },
  partial: {
    label: "Parziale",
    variant: "outline" as const,
    icon: AlertCircle,
    color: "text-yellow-600",
  },
  failed: {
    label: "Fallito",
    variant: "destructive" as const,
    icon: XCircle,
    color: "text-red-600",
  },
};

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useOrders();
  const { data: services = [] } = useServices();
  const refillOrders = useRefillOrders();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const servicesMap = useMemo(() => {
    return services.reduce((acc, service) => {
      acc[service.service] = service;
      return acc;
    }, {} as Record<number, (typeof services)[0]>);
  }, [services]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.topsmmOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.link.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const completedOrders = orders.filter(
      (order) => order.status === "completed"
    ).length;
    const inProgressOrders = orders.filter(
      (order) => order.status === "in progress"
    ).length;
    const pendingOrders = orders.filter(
      (order) => order.status === "pending"
    ).length;
    return {
      totalOrders,
      completedOrders,
      inProgressOrders,
      pendingOrders,
    };
  }, [orders]);

  const getServiceName = (serviceId: number) => {
    return servicesMap[serviceId]?.name || `Servizio #${serviceId}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ordini</h1>
        <p className="text-muted-foreground">
          Gestisci e monitora i tuoi ordini SMM
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale Ordini</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Ordini totali</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completati</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders}</div>
            <p className="text-xs text-muted-foreground">
              Completati con successo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Attesa</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Ordini in attesa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Corso</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgressOrders}</div>
            <p className="text-xs text-muted-foreground">
              Attualmente in elaborazione
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cerca per ID ordine o link..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtra per stato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli stati</SelectItem>
                <SelectItem value="pending">In Attesa</SelectItem>
                <SelectItem value="in progress">In Corso</SelectItem>
                <SelectItem value="completed">Completato</SelectItem>
                <SelectItem value="partial">Parziale</SelectItem>
                <SelectItem value="failed">Fallito</SelectItem>
              </SelectContent>
            </Select>
            {(searchTerm || statusFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Pulisci
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Storico Ordini</CardTitle>
          <CardDescription>
            {filteredOrders.length} di {orders.length} ordini
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Ordine</TableHead>
                  <TableHead>Servizio</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Quantità</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>Creato il</TableHead>
                  <TableHead>Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order, index) => {
                  const StatusIcon =
                    statusConfig[order.status]?.icon || AlertCircle;
                  const service = servicesMap[order.service];

                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <p className="font-medium">#{order.topsmmOrderId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {getServiceName(order.service)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {service && `$${service.rate}/1k`}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-48">
                          <a
                            href={order.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1 truncate"
                          >
                            <span className="truncate">{order.link}</span>
                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {order.quantity.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            statusConfig[order.status]?.variant || "outline"
                          }
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[order.status]?.label || order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>
                            {format(new Date(order.createdAt), "dd MMM, yyyy")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(order.createdAt), "HH:mm")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              refillOrders.mutate([Number(order.topsmmOrderId)])
                            }
                            disabled={refillOrders.isPending}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nessun ordine trovato
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Prova a modificare i criteri di ricerca o filtro"
                  : "Non hai ancora effettuato ordini"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
