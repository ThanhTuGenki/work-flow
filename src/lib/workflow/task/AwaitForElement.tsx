import { EyeIcon, MousePointerClick } from 'lucide-react';
import { TaskPramType, TaskType } from '../../../../types/task';
import { WorkflowTask } from '../../../../types/workflow';

export const AwaitForElementTask = {
    type: TaskType.AWAIT_FOR_ELEMENT,
    label: 'Await for element',
    icon: (props) => (
        <EyeIcon className='stroke-amber-400' {...props} />
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
        {
            name: "Visibility",
            type: TaskPramType.SELECT,
            required: true,
            hideHandle: true,
            options: [
                { value: "visible", label: "Visible" },
                { value: "hidden", label: "Hidden" },
            ],
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