'use client';

import useFlowValidation from '@/hooks/useFlowValidation';
import { cn } from '@/lib/utils';
import { useReactFlow } from '@xyflow/react';
import React from 'react'

interface Props {
    children: React.ReactNode;
    isSelected: boolean;
    nodeId: string;
}

function NodeCard({ children, nodeId, isSelected }: Props) {
    const { getNode, setCenter } = useReactFlow();
    const {invalidInputs} = useFlowValidation();
    const hasInvalidInputs = invalidInputs.some((input) => input.nodeId === nodeId);

    return (
        <div className={
            cn(
                'rounded-md cursor-pointer bg-background border-2 border-separate w-[420px] gap-1 text-sm flex flex-col',
                isSelected && 'border-primary',
                hasInvalidInputs && 'border-destructive border-2'
            )}
            onDoubleClick={() => {
                const node = getNode(nodeId);
                if (!node) return;

                const { position, measured } = node;
                if (!position || !measured) return;

                const { width, height } = measured;
                const x = position.x + width! / 2;
                const y = position.y + height! / 2;

                if (x === undefined || y === undefined) return;

                setCenter(x, y, {
                    duration: 500,
                    zoom: 1,
                })
            }}
        >
            {children}
        </div>
    )
}

export default NodeCard