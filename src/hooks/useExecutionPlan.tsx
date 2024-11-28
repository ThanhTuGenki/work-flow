'use client';

import { FlowToExecutionPlan, WorkflowExecutionPlanValidationError } from "@/lib/workflow/executionPlan";
import { useReactFlow } from "@xyflow/react"
import { useCallback } from "react";
import { AppNode } from "../../types/appNode";
import useFlowValidation from "./useFlowValidation";
import { toast } from "sonner";

const useExecutionPlan = () => {
    const { toObject } = useReactFlow();
    const { setInvalidInputs, clearErrors } = useFlowValidation()

    const handleError = useCallback((error: any) => {
        switch (error.type) {
            case WorkflowExecutionPlanValidationError.NO_ENTRY_POINT:
                toast.error('No entry not found')
                break;
            case WorkflowExecutionPlanValidationError.INVALID_INPUTS:
                toast.error('Not all input value are set!!!')
                setInvalidInputs(error.invalidElements);
                break;
            default:
                toast.error('Something went wrong!!!')
                break;
        }
    }, [setInvalidInputs])

    const generateExecutionPlan = useCallback(() => {
        const { nodes, edges } = toObject();
        const { executionPlan, error } = FlowToExecutionPlan(nodes as AppNode[], edges);
        if (error) {
            handleError(error);
            return null
        }

        clearErrors();
        return executionPlan;
    }, [toObject, handleError, clearErrors])

    return generateExecutionPlan;
}

export default useExecutionPlan;