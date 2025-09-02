"use client";

import { useAuth } from "@/providers/auth-provider";
import { useServices } from "@/hooks/use-services";
import { useOrders } from "@/hooks/use-orders";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const { data: services = [] } = useServices();
  const { data: orders = [] } = useOrders();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Totale Servizi",
      value: services.length,
      description: "Servizi disponibili",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Totale Ordini",
      value: orders.length,
      description: "Ordini totali",
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      title: "Ordini Completati",
      value: orders.filter((order) => order.status === "completed").length,
      description: "Completati con successo",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Ordini in Attesa",
      value: orders.filter((order) => order.status === "pending").length,
      description: "In attesa di elaborazione",
      icon: Users,
      color: "text-orange-600",
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-8 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Bentornato, {user?.name}!</h2>
            <p className="max-w-[600px] text-white/80">
              Ecco cosa sta succedendo oggi sul tuo pannello SMM.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/new-order">
                <Button className="rounded-2xl bg-white text-indigo-700 hover:bg-white/90">
                  Crea Nuovo Ordine
                </Button>
              </Link>
              <Link href="/dashboard/orders">
                <Button
                  variant="outline"
                  className="rounded-2xl bg-transparent border-white text-white hover:bg-white/10"
                >
                  Ordini
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative h-40 w-40">
              <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md" />
              <div className="absolute inset-4 rounded-full bg-white/20" />
              <div className="absolute inset-8 rounded-full bg-white/30" />
              <div className="absolute inset-12 rounded-full bg-white/40" />
              <div className="absolute inset-16 rounded-full bg-white/50" />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Ordini Recenti</CardTitle>
            <CardDescription>Le tue ultime attività di ordine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Ordine #{order.topsmmOrderId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.quantity} unità • ${order.price}
                      </p>
                    </div>
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "default"
                          : order.status === "pending"
                          ? "secondary"
                          : order.status === "failed"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {order.status === "completed"
                        ? "Completato"
                        : order.status === "pending"
                        ? "In Attesa"
                        : order.status === "failed"
                        ? "Fallito"
                        : order.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nessun ordine ancora
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
