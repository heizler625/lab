export class TransactionForm {
    public static onLoad(executionContext: Xrm.Events.EventContext): void {
        const formContext = executionContext.getFormContext();
        const dateAttr = formContext.getAttribute("lab_transactiondate");
        if (dateAttr && !dateAttr.getValue()) dateAttr.setValue(new Date());
    }

    public static async onQuantityChange(executionContext: Xrm.Events.EventContext): Promise<void> {
        const formContext = executionContext.getFormContext();
        const quantity = formContext.getAttribute("lab_quantity")?.getValue();
        const itemValues = formContext.getAttribute("lab_itemid")?.getValue() as Xrm.LookupValue[] | null;
        if (quantity == null || !itemValues?.length) return;

        try {
            const item = await Xrm.WebApi.retrieveRecord(
                "lab_warehouseitem",
                itemValues[0].id.replace(/[{}]/g, ""),
                "?$select=lab_unitprice"
            );
            if (typeof item.lab_unitprice === "number") {
                formContext.getAttribute("lab_totalvalue")?.setValue(quantity * item.lab_unitprice);
            }
        } catch {
            return;
        }
    }
}

export class RibbonActions {
    public static async checkStockLevels(formContext: Xrm.FormContext): Promise<void> {
        const name = formContext.getAttribute("lab_name")?.getValue() ?? "Unknown";
        const quantity = formContext.getAttribute("lab_availablequantity")?.getValue() ?? 0;
        const reorderPoint = formContext.getAttribute("lab_reorderpoint")?.getValue() ?? 0;
        let message = `Stock level for ${name}: ${quantity} units.`;
        message += quantity <= reorderPoint
            ? `\n⚠ Below reorder point (${reorderPoint}). Consider restocking.`
            : `\n✓ Stock is above reorder point (${reorderPoint}).`;
        await Xrm.Navigation.openAlertDialog({ text: message, title: "Stock Check" });
    }
}

export { GridApi, LocationForm } from "./GridCustomizer";
