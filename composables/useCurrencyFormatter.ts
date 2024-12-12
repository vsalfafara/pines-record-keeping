export function useCurrencyFormatter() {
  return useState("formatter", () => {
    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    });

    return formatter;
  });
}
