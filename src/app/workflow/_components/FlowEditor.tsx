'use client';

import { CreateFlowNode } from '@/lib/workflow/createFlowNode';
import { Workflow } from '@prisma/client';
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, getOutgoers, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useCallback, useEffect } from 'react';
import { AppNode } from '../../../../types/appNode';
import { TaskType } from '../../../../types/task';
import NodeComponent from './nodes/NodeComponent';
import DeletableEdge from './edges/DeletableEdge';
import { TaskRegistry } from '@/lib/workflow/task/registry';


const nodeTypes = {
    FlowWorkNode: NodeComponent,
}

const edgeTypes = {
    default: DeletableEdge
}

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 1 }

function FlowEditor({ workflow }: { workflow: Workflow }) {
    const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

    useEffect(() => {
        try {
            const flow = JSON.parse(workflow.definition);
            if (!flow) return;

            setNodes(flow.nodes || []);
            setEdges(flow.edges || [])

            if (!flow.viewport) return;

            const { x = 0, y = 0, zoom = 1 } = flow.viewport;
            setViewport({ x, y, zoom })

        } catch (error) {

        }
    }, [workflow.definition, setEdges, setNodes, setViewport])

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const taskType = e.dataTransfer.getData('application/reactflow');
        if (typeof taskType === 'undefined' || !taskType) return;

        const position = screenToFlowPosition({
            x: e.clientX,
            y: e.clientY,
        })
        const newNode = CreateFlowNode(taskType as TaskType, position)
        setNodes((nds) => nds.concat(newNode));
    }, [setNodes, screenToFlowPosition]);

    const onConnect = useCallback((connection: Connection) => {
        setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
        // !Remove input value if present on connect
        if (!connection.targetHandle) return;

        const node = nodes.find((n) => n.id === connection.target);
        if (!node) return;

        const nodeInputs = node.data.inputs;
        updateNodeData(node.id, {
            inputs: {
                ...nodeInputs,
                [connection.targetHandle]: '',
            }
        })
    }, [setEdges, updateNodeData, nodes]);

    const isValidConnection = useCallback((connection: Connection | Edge) => {
        // no self connections allowed
        if (connection.source === connection.target) return false;

        // Same taskParam type connection
        const source = nodes.find((n) => n.id === connection.source);
        const target = nodes.find((n) => n.id === connection.target);
        if (!source || !target) return false;

        const sourceTask = TaskRegistry[source.data.type];
        const targetTask = TaskRegistry[target.data.type];
        const output = sourceTask.outputs.find((o) => o.name === connection.sourceHandle);
        const input = targetTask.inputs.find((i) => i.name === connection.targetHandle);
        if (output?.type !== input?.type) return false;

        const hasCycle = (node: AppNode, visited = new Set()) => {
            if (visited.has(node.id)) return false;
            visited.add(node.id);

            for (const outgoer of getOutgoers(node, nodes, edges)) {
                if (outgoer.id === connection.source) return true;
                if (hasCycle(outgoer, visited)) return true;
            }
        }

        const detectedCycle = hasCycle(target);

        return !detectedCycle;
    }, [nodes, edges]);

    return (
        <main className="h-full w-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                snapGrid={snapGrid}
                snapToGrid
                fitView
                fitViewOptions={fitViewOptions}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onConnect={onConnect}
                edgeTypes={edgeTypes}
                isValidConnection={isValidConnection}
            >
                <Controls position={'top-left'} fitViewOptions={fitViewOptions} />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </main>
    )
}

export default FlowEditor