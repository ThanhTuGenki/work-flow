'use client';

import { cn } from '@/lib/utils';
import { Handle, Position, useEdges } from '@xyflow/react';
import React from 'react'
import { TaskParam } from '../../../../../types/task';
import NodeParamField from './NodeParamField';
import { ColorForHandle } from './common';
import useFlowValidation from '@/hooks/useFlowValidation';

interface Props {
    children: React.ReactNode
}

function NodeInputs({ children }: Props) {
    return (
        <div className='flex flex-col divide-y gap-2'>{children}</div>
    )
}

export function NodeInput({ input, nodeId }: { input: TaskParam; nodeId: string }) {
    const { invalidInputs } = useFlowValidation();
    const edges = useEdges();
    const isConnected = edges.some((edge) => edge.target === nodeId && edge.targetHandle === input.name);
    const hasError = invalidInputs.find((node) => node.nodeId === nodeId)
        ?.inputs.find((invalidInput) => invalidInput === input.name);

    return <div className={
        cn(
            'flex justify-start relative p-3 bg-secondary w-full',
            hasError && 'bg-destructive/30',
        )
    }
    >
        <NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
        {!input.hideHandle && (
            <Handle
                id={input.name}
                isConnectable={!isConnected}
                type={'target'}
                position={Position.Left}
                className={cn('!bg-muted-foreground !border-background !-left-2 !w-4 !h-4', ColorForHandle[input.type])}
            />
        )}
    </div>
}

export default NodeInputs