import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { AppNodeData } from "../../../../../types/appNode";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import NodeInputs, { NodeInput } from "./NodeInputs";
import NodeOutputs, { NodeOutput } from "./NodeOutputs";
import { Badge } from "@/components/ui/badge";

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

const NodeComponent = memo((node: NodeProps) => {
    const nodeData = node.data as AppNodeData;
    const task = TaskRegistry[nodeData.type];

    return <NodeCard nodeId={node.id} isSelected={!!node.selected}>
        {DEV_MODE && (<Badge>DEV: {node.id}</Badge>)}
        <NodeHeader taskType={nodeData.type} nodeId={node.id} />
        <NodeInputs>
            {task.inputs.map((input) => (
                <NodeInput input={input} key={input.name} nodeId={node.id} />
            ))}
        </NodeInputs>
        <NodeOutputs>
            {task.outputs.map((output) => (
                <NodeOutput output={output} key={output.name} nodeId={node.id} />
            ))}
        </NodeOutputs>
    </NodeCard>
});

export default NodeComponent;
NodeComponent.displayName = 'NodeComponent';