import { CodeIcon, LucideProps } from 'lucide-react';
import { TaskPramType, TaskType } from '../../../../types/task';
import { WorkflowTask } from '../../../../types/workflow';

export const PageToHtmlTask = {
    type: TaskType.PAGE_TO_HTML,
    label: 'Get html from page',
    icon: (props: LucideProps) => (
        <CodeIcon className='stroke-rose-400' {...props} />
    ),
    isEntryPoint: false,
    credits: 2,
    inputs: [
        {
            name: "Web page",
            type: TaskPramType.BROWSER_INSTANCE,
            required: true,
        },
    ] as const,
    outputs: [
        {name: "Html", type: TaskPramType.STRING},
        {name: "Web page", type: TaskPramType.BROWSER_INSTANCE},
    ] as const,
} satisfies WorkflowTask;