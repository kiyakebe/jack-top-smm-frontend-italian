export function format(date: Date, formatStr: string): string {
    switch (formatStr) {
      case "MMM dd, yyyy":
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      case "HH:mm":
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      case "PPpp":
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      default:
        return date.toLocaleDateString()
    }
  }
  