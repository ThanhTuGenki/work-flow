import { FlowValidationContext } from "@/context/FlowValidationContext";
import { useContext } from "react";

export default function useFlowValidation() {
    const context = useContext(FlowValidationContext);
    if (!context) throw new Error('FlowValidationContext not found')

    return context
}