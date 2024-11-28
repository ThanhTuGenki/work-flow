'use client';

import React from 'react'
import { TaskParam } from '../../../../../types/task';
import { Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { ColorForHandle } from './common';

function NodeOutputs({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex flex-col divide-y gap-2'>{children}</div>
    )
}

export function NodeOutput({ output, nodeId }: { output: TaskParam; nodeId: string }) {
    return (
        <div className='flex justify-end relative p-3 bg-secondary'>
            <p className="text-xs text-muted-foreground">
                {output.name}
            </p>
            <Handle
                id={output.name}
                type={'source'}
                position={Position.Right}
                className={cn('!bg-muted-foreground !border-background !-right-2 !w-4 !h-4', ColorForHandle[output.type])}
            />
        </div>
    )
}

export default NodeOutputs