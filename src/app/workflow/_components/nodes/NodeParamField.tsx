'use client';

import React, { useCallback } from 'react'
import { TaskParam, TaskPramType } from '../../../../../types/task';
import StringParam from './param/StringParam';
import { useReactFlow } from '@xyflow/react';
import { AppNode } from '../../../../../types/appNode';
import BrowserInstanceParam from './param/BrowserInstanceParam';

interface Props {
    nodeId: string;
    param: TaskParam
    disabled: boolean
}

function NodeParamField({ param, nodeId, disabled }: Props) {
    const { updateNodeData, getNode } = useReactFlow();
    const node = getNode(nodeId) as AppNode;
    const value = node?.data?.inputs?.[param.name] || '';

    const updateNodeParamValue = useCallback((newValue: string) => {
        updateNodeData(nodeId, {
            inputs: {
                ...node?.data.inputs,
                [param.name]: newValue,
            }
        })
    }, [nodeId, updateNodeData, param.name, node?.data.inputs])

    switch (param.type) {
        case TaskPramType.STRING:
            return <StringParam
                param={param}
                value={value}
                updateNodeParamValue={updateNodeParamValue}
                disabled={disabled}
            />
            case TaskPramType.BROWSER_INSTANCE:
                return <BrowserInstanceParam
                    param={param}
                    value={''}
                    updateNodeParamValue={updateNodeParamValue}
                />
        default:
            return (
                <div className="w-full">
                    <p className="text-sm text-muted-foreground">No Implemented</p>
                </div>
            )
    }
}

export default NodeParamField