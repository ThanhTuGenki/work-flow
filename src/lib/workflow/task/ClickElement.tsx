import { MousePointerClick } from 'lucide-react';
import { TaskPramType, TaskType } from '../../../../types/task';
import { WorkflowTask } from '../../../../types/workflow';

export const ClickElementTask = {
    type: TaskType.CLICK_ELEMENT,
    label: 'Click element',
    icon: (props) => (
        <MousePointerClick className='stroke-rose-400' {...props} />
    ),
    isEntryPoint: false,
    credits: 1,
    inputs: [
        {
            name: "Web page",
            type: TaskPramType.BROWSER_INSTANCE,
            required: true,
        },
        {
            name: "Selector",
            type: TaskPramType.STRING,
            required: true,
        },
    ] as const,
    outputs: [
        {
            name: "Web page",
            type: TaskPramType.BROWSER_INSTANCE,
            required: true,
        },
    ] as const,
} satisfies WorkflowTask;