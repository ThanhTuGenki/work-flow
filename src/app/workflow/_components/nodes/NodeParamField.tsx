'use client';

import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';
import { AppNode } from '../../../../../types/appNode';
import { TaskParam, TaskPramType } from '../../../../../types/task';
import BrowserInstanceParam from './param/BrowserInstanceParam';
import SelectParam from './param/SelectParam';
import StringParam from './param/StringParam';

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
            case TaskPramType.SELECT:
                return <SelectParam
                    param={param}
                    value={value}
                    updateNodeParamValue={updateNodeParamValue}
                    disabled={disabled}
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