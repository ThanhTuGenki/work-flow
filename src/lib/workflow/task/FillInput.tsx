import { Edit3Icon, LucideProps } from 'lucide-react';
import { TaskPramType, TaskType } from '../../../../types/task';
import { WorkflowTask } from '../../../../types/workflow';

export const FillInputTask = {
    type: TaskType.FILL_INPUT,
    label: 'Fill input',
    icon: (props) => (
        <Edit3Icon className='stroke-orange-400' {...props} />
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
            name: "Value",
            type: TaskPramType.STRING,
            required: true,
        },
    ] as const,
    outputs: [
        { name: "Web page", type: TaskPramType.BROWSER_INSTANCE },
    ] as const,
} satisfies WorkflowTask;